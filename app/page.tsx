import PhotoHero from "@/components/home/PhotoHero";
import PartnersBar from "@/components/home/PartnersBar";
import JourneySection from "@/components/journey/JourneySection";
import ProblemSection from "@/components/home/ProblemSection";
import BreakthroughSection from "@/components/home/BreakthroughSection";
import RoadmapSection from "@/components/home/RoadmapSection";
import ModelsSection from "@/components/home/ModelsSection";
import ProofSection from "@/components/home/ProofSection";
import TeamTeaser from "@/components/home/TeamTeaser";

export default function HomePage() {
  return (
    <main>
      <PhotoHero />
      <PartnersBar />
      <JourneySection />
      <ProblemSection />
      <BreakthroughSection />
      <RoadmapSection />
      <ModelsSection />
      <ProofSection />
      <TeamTeaser />
    </main>
  );
}
