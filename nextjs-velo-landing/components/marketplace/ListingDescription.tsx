'use client';

import { useEffect, useRef, useState } from 'react';

export default function ListingDescription({ text }: { text: string }) {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const [measured, setMeasured] = useState(false);
  const showToggle = expanded || (measured ? canExpand : text.trim().length > 160);

  useEffect(() => {
    const description = descriptionRef.current;
    if (!description || expanded) return;
    setCanExpand(description.scrollHeight > description.clientHeight + 1);
    setMeasured(true);
  }, [text, expanded]);

  return (
    <div>
      <p
        ref={descriptionRef}
        className={`text-[1.3rem] leading-8 text-[#687076] ${expanded ? '' : 'line-clamp-3'}`}
      >
        {text}
      </p>
      {showToggle ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
          className="mt-2 text-[1.3rem] leading-8 font-semibold text-[#11181C] underline decoration-[#11181C]/30 underline-offset-4 hover:text-[#FFAC1C] hover:decoration-[#FFAC1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      ) : null}
    </div>
  );
}
