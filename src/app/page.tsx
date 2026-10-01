import { ClassSection } from "@/components/classes/ClassSection";
import { CraftSection } from "@/components/crafts/CraftSection";
import { Hero } from "@/components/Hero";
import { StudioTabs } from "@/components/StudioTabs";

export default function Home() {
  return (
    <>
      <Hero />
      <StudioTabs
        craftPanel={<CraftSection />}
        classPanel={<ClassSection />}
      />
    </>
  );
}
