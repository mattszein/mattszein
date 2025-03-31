import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matt Szein | README.md",
  description: "Personal website of Matias Szeinfeld",
};

export default function Home() {
  return (
    <div className="text-lg">
      <p className="text-white">Hey, welcome!</p>
    </div>
  );
}
