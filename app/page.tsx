import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matt Szein | README.md",
  description: "Personal website of Matias Szeinfeld",
};

export default function Home() {
  return (
    <div className="text-lg text-white">
      <p>{`Hey, I'm Matt and welcome to my digital universe!`}</p>
      <br />
      <p>{``}</p>
      <p>
        {`You're about to browse my life through my day-to-day workstation interface (well, not every day). Think of it as navigating through the files and folders of my world, from quick terminal commands to deeper dives into my thoughts and projects. Here you'll stumble across random bits of everything: intentionally selected pieces about who I am, articles about whatever nerdy obsessions I'm currently hyperfixated on, some joke that may or may not land, and probably some thoughts that seemed brilliant at 2am.`}
      </p>
      <br />
      <p>
        {`
 Whether you're here to explore my work or discover shared interests, I'm excited to connect. Hope you enjoy this journey!`}
      </p>

      <p className="pt-4 italic">
        {`⚠️ Best viewed on desktop: This site works best on a computer or laptop. If you're on a phone or tablet, the experience might be limited.`}
      </p>
      <p className="pt-4">
        {`💡 For the full experience: Press F11 on your keyboard to make your browser fill the entire screen (press F11 again to go back to normal).`}
      </p>
      <p className="pt-4">
        {`🎮 Navigate like a developer`}
      </p>
      <p className="pt-4 ">
        {`This site works differently - instead of clicking with your mouse, you use keyboard keys to move around. It's inspired by how some programmers navigate code efficiently. Look for the cursor (that blinking line) on the first letter 'H' - that shows where you are.`}
      </p>
      <p className="pt-4 font-bold">
        {`Movement Keys (like arrow keys, but faster):`}
      </p>
      <p>{`h → Move left (same as left arrow)`}</p>
      <p>{`j → Move down (same as down arrow)`}</p>
      <p>{`k → Move up (same as up arrow)`}</p>
      <p>{`l → Move right (same as right arrow)`}</p>

      <p className="pt-4 font-bold">
        {`Action Keys:`}
      </p>
      <p className="pt-4">
        {`Space + e → Open menu`}
      </p>
      <p>{`Enter → Open/Select (like clicking)`}</p>
    </div>
  );
}
