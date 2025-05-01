import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Matt Szein | .gitignore',
};

export default function Gitignore() {
  return (
    <div>
      <p className="text-gray-400"># See https://help.github.com/articles/ignoring-files/ for more about ignoring files.</p>
      <p className="text-gray-400">.impostor_syndrome</p>
    </div>
  );
}
