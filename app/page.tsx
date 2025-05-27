import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matt Szein | README.md",
  description: "Personal website of Matias Szeinfeld",
};

export default function Home() {
  return (
    <div className="text-lg">
      <p className="text-white">{`Hey, I'm Matt and welcome to my digital universe!`}</p>
      <p className="text-white pt-4">
        {`You're about to browse my life through my day-to-day workstation interface (well, not every day, but you get it). Think of it as navigating through the files and folders of my world, from quick terminal commands to deeper dives into my thoughts and projects. Here you'll stumble across random bits of everything: intentionally selected pieces about who I am, articles about whatever nerdy obsessions I'm currently hyperfixated on, the occasional joke that may or may not land, and probably some thoughts that seemed brilliant at 2am.`}
      </p>

      <p className="text-white pt-4">
        {`
 Whether you're here to explore my work or discover shared interests, I'm excited to connect. Let's learn from each other and ¿why not? build something meaningful together.`}
      </p>

    </div>
  );
}
