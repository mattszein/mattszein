'use client'
import { useState } from 'react';

const ExplorerSearch = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="relative px-1 font-mono text-sm w-full max-w-2xl flex">
      <fieldset className="border border-gruvbox-fg rounded-md flex-1 flex items-center px-3">
        <legend className="px-2 text-gruvbox-fg mx-auto text-base">
          Explorer
        </legend>
        <div className="flex items-center w-full gap-3 pb-2">
          <span className="text-[#fb4934] font-bold text-lg">
            {'>'}
          </span>
          <div className="flex-1 flex items-center relative h-6">
          </div>

          <span className="text-[#928374] ml-auto">
            13/13
          </span>

        </div>
      </fieldset>
    </div>
  );
};

export default ExplorerSearch;
