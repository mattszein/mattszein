import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Matt Szein | .gitignore',
};

export default function Gitignore() {
  return (
    <>
      <p className="text-gray-400"># See https://help.github.com/articles/ignoring-files/ for more about ignoring files.</p>
      <p>.impostor_syndrome</p>
    </>
  );
}
