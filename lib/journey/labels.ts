import { CONTAINER, COVERED_LAGOON, OPEN_LAGOON, REACTOR_1, REACTOR_2 } from "@/lib/journey/layout";

/**
 * Callouts pinned to points in the journey scene, like notes on an engineering drawing.
 * The DOM draws them; the scene projects their anchor to the screen every frame.
 */
export interface SceneLabelSpec {
  id: string;
  text: string;
  anchor: [number, number, number];
  /** Timeline window (`at` units) in which the label shows. */
  window: [number, number];
  tone: "light" | "dark";
}

export const sceneLabels: SceneLabelSpec[] = [
  { id: "site", text: "Pilot site · Sei Mangkei, North Sumatra", anchor: [CONTAINER.centre.x, 6, CONTAINER.centre.z], window: [0, 95], tone: "light" },
  { id: "open-lagoon", text: "Open POME lagoon", anchor: [OPEN_LAGOON.centre.x, 6, OPEN_LAGOON.centre.z], window: [140, 245], tone: "light" },
  { id: "covered-lagoon", text: "Covered lagoon · biogas", anchor: [COVERED_LAGOON.centre.x, 5.5, COVERED_LAGOON.centre.z], window: [262, 372], tone: "light" },
  { id: "pretreatment", text: "Pre-treatment", anchor: [6, 6.6, 6], window: [262, 372], tone: "light" },
  { id: "reactor-unit", text: "Reactor unit", anchor: [CONTAINER.centre.x, 5.6, CONTAINER.centre.z], window: [262, 372], tone: "light" },
  { id: "storage", text: "Methanol storage", anchor: [35.5, 4.8, 6], window: [262, 372], tone: "light" },
  { id: "reactor-1", text: "Reactor 1 · CRecREF™ reforming", anchor: [REACTOR_1.centre.x, 2.75, REACTOR_1.centre.z], window: [395, 492], tone: "dark" },
  { id: "reactor-2", text: "Reactor 2 · methanol synthesis", anchor: [REACTOR_2.centre.x, 2.6, REACTOR_2.centre.z], window: [395, 492], tone: "dark" },
  { id: "product", text: "Bio-methanol storage", anchor: [35.5, 4.8, 6], window: [925, 1001], tone: "light" },
];

/** DOM elements of the labels, keyed by id, shared between the DOM overlay and the scene. */
export type LabelElements = Map<string, HTMLElement>;
