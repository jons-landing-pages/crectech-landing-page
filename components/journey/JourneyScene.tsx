"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { JourneyContext, type JourneyFrame } from "@/components/journey/JourneyContext";
import Landscape from "@/components/journey/world/Landscape";
import MoleculeStage from "@/components/journey/world/MoleculeStage";
import Plant from "@/components/journey/world/Plant";
import ReactorInterior from "@/components/journey/world/ReactorInterior";
import SceneCanvas, { useReducedMotion } from "@/components/three/SceneCanvas";
import StudioLights from "@/components/three/StudioLights";
import { sceneLabels, type LabelElements } from "@/lib/journey/labels";
import { journeyCameraKeys, journeyStates, TIMELINE_LENGTH } from "@/lib/journey/states";
import { applyLensShift, cameraAt } from "@/lib/three/camera";
import { palette } from "@/lib/three/palette";
import { smoothstep } from "@/lib/three/random";

/** How quickly the camera catches up with the scroll position (higher is snappier). */
const SCROLL_DAMPING = 4.5;
/** Camera distances (m) between which the world turns from paper to carbon. */
const DARK_FROM = 26;
const DARK_TO = 10;
/** Portrait screens see less width; widen the lens so each subject still fits. */
const PORTRAIT_FOV_FACTOR = 1.5;

/** The camera pose at the centre of the nearest state's hold, for reduced motion. */
function nearestHold(at: number) {
  const state = journeyStates.reduce((best, s) => {
    const centre = (s.hold[0] + s.hold[1]) / 2;
    const bestCentre = (best.hold[0] + best.hold[1]) / 2;
    return Math.abs(centre - at) < Math.abs(bestCentre - at) ? s : best;
  });
  return (state.hold[0] + state.hold[1]) / 2;
}

function CameraRig({ progress, frame }: { progress: { current: number }; frame: { current: JourneyFrame } }) {
  const { camera, scene, size } = useThree();
  const reducedMotion = useReducedMotion();
  const smoothed = useRef(progress.current * TIMELINE_LENGTH);
  const background = useMemo(() => new THREE.Color(palette.paper), []);
  const fog = useMemo(() => new THREE.Fog(palette.paper.clone(), 100, 500), []);

  useEffect(() => {
    scene.background = background;
    scene.fog = fog;
  }, [scene, background, fog]);

  useFrame(({ clock }, delta) => {
    const goal = progress.current * TIMELINE_LENGTH;
    smoothed.current = reducedMotion
      ? nearestHold(goal)
      : THREE.MathUtils.damp(smoothed.current, goal, SCROLL_DAMPING, Math.min(delta, 0.1));

    const pose = cameraAt(journeyCameraKeys, smoothed.current);
    const perspective = camera as THREE.PerspectiveCamera;
    const portrait = size.width / size.height < 0.9;
    perspective.fov = portrait ? pose.fov * PORTRAIT_FOV_FACTOR : pose.fov;
    perspective.position.copy(pose.position);
    perspective.lookAt(pose.target);
    // Desktop: the subject sits right of the text column. Portrait: centred and lifted above the text band.
    if (portrait) applyLensShift(perspective, 0, -0.16, size.width, size.height);
    else applyLensShift(perspective, pose.shiftX, pose.shiftY, size.width, size.height);
    // Scale the depth range with the distance, so millimetre close-ups and the wide shot both work.
    // The far plane also hides pen lines (which ignore fog) of objects far behind a close-up.
    perspective.near = pose.distance * 0.02;
    perspective.far = pose.distance * 120;
    perspective.updateProjectionMatrix();

    const logDistance = Math.log(pose.distance);
    const dark = smoothstep(Math.log(DARK_FROM), Math.log(DARK_TO), logDistance);
    background.copy(palette.paper).lerp(palette.carbon, dark);
    fog.color.copy(background);
    fog.near = pose.distance * 0.9;
    fog.far = pose.distance * 4.5;

    frame.current.at = smoothed.current;
    frame.current.distance = pose.distance;
    frame.current.dark = dark;
    frame.current.time = reducedMotion ? 3 : clock.elapsedTime;
  }, -1);

  return null;
}

const LABEL_FADE = 18;
const projected = new THREE.Vector3();

/** Moves the DOM callouts to their anchors' screen positions and fades them by timeline window. */
function LabelProjector({ labels, frame }: { labels: LabelElements; frame: { current: JourneyFrame } }) {
  const { camera, size } = useThree();
  useFrame(() => {
    const { at } = frame.current;
    for (const spec of sceneLabels) {
      const element = labels.get(spec.id);
      if (!element) continue;
      const [from, to] = spec.window;
      const opacity = smoothstep(from, from + LABEL_FADE, at) * (1 - smoothstep(to - LABEL_FADE, to, at));
      projected.set(...spec.anchor).project(camera);
      const behind = projected.z > 1;
      element.style.opacity = behind ? "0" : String(opacity);
      element.style.visibility = opacity < 0.01 || behind ? "hidden" : "visible";
      // Keep the whole label on screen: clamp its centre by half its width plus a margin.
      const halfWidth = element.offsetWidth / 2 + 12;
      const x = THREE.MathUtils.clamp(((projected.x + 1) / 2) * size.width, halfWidth, size.width - halfWidth);
      const y = ((1 - projected.y) / 2) * size.height;
      element.style.transform = `translate(-50%, -100%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }
  });
  return null;
}

function SceneContents({ progress, labels }: { progress: { current: number }; labels: LabelElements }) {
  const frame = useRef<JourneyFrame>({ at: 0, distance: 100, dark: 0, time: 0 });
  const { size } = useThree();
  const mobile = size.width < 768;

  return (
    <JourneyContext.Provider value={frame}>
      <CameraRig progress={progress} frame={frame} />
      <hemisphereLight args={["#ffffff", "#e3ddcf", 1.5]} />
      <directionalLight position={[-60, 90, 70]} intensity={1.3} color="#fff8ee" />
      <StudioLights />
      <Landscape mobile={mobile} />
      <Plant />
      <ReactorInterior />
      <MoleculeStage />
      <LabelProjector labels={labels} frame={frame} />

    </JourneyContext.Provider>
  );
}

/** The pinned 3D world behind the journey text. `progress` is the section's scroll progress (0…1). */
export default function JourneyScene({ progress, labels }: { progress: { current: number }; labels: LabelElements }) {
  return (
    <SceneCanvas
      className="h-full w-full"
      flat
      dpr={[1, 1.5]}
      camera={{ position: [0, 40, 100], fov: 30, near: 1, far: 2000 }}
    >
      <SceneContents progress={progress} labels={labels} />
    </SceneCanvas>
  );
}
