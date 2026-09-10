import React from 'react';

/**
 * Lightweight, robust Markdown renderer for blog posts.
 * Correctly renders:
 * - H1, H2, H3 with custom styling and accent colors (matching Photo 2 design)
 * - Blockquotes
 * - Unordered lists
 * - Paragraphs with bold (**text**), italics (*text*)
 * - Preserves spacing, clean typography, and reading flow
 */
export function MarkdownRenderer({ content }: { content: string }) {
  // Strip out duplicate document-level H1 if it repeats the title at the very start
  const cleanContent = content.trim().replace(/^#\s+[^\n]+\n+/, '');

  // Split into paragraphs / blocks by double newlines or headers
  const blocks = cleanContent.split(/\n\s*\n/);

  return (
    <div className="space-y-6 text-base text-[color:var(--tv-text-secondary)] leading-[1.8] sm:text-lg sm:leading-[1.85]">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Blockquote: > text
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '').trim();
          return (
            <blockquote
              key={idx}
              className="my-6 border-l-4 border-[color:var(--tv-primary)] bg-[rgba(57,217,138,0.06)] px-5 py-4 text-base italic text-[color:var(--tv-text-primary)] rounded-r-xl"
            >
              {parseInline(quoteText)}
            </blockquote>
          );
        }

        // H1 header: # Heading
        if (trimmed.startsWith('# ')) {
          return (
            <h1
              key={idx}
              className="tv-heading text-3xl sm:text-4xl font-bold tracking-tight text-[color:var(--tv-text-primary)] pt-4 pb-1"
            >
              {trimmed.slice(2)}
            </h1>
          );
        }

        // H2 header: ## Heading
        // Styled with the distinct cyan/blue accent seen in Photo 2
        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={idx}
              className="tv-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[color:var(--tv-cyan)] pt-8 pb-1 border-b border-white/[0.06]"
            >
              {trimmed.slice(3)}
            </h2>
          );
        }

        // H3 header: ### Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={idx}
              className="tv-heading text-xl sm:text-2xl font-semibold tracking-tight text-[color:var(--tv-primary-light)] pt-4"
            >
              {trimmed.slice(4)}
            </h3>
          );
        }

        // Unordered list: lines starting with - or *
        if (trimmed.split('\n').every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
          const items = trimmed.split('\n').map((line) => line.trim().replace(/^[-*]\s+/, ''));
          return (
            <ul key={idx} className="my-4 list-disc pl-6 space-y-2 marker:text-[color:var(--tv-primary)]">
              {items.map((item, itemIdx) => (
                <li key={itemIdx}>{parseInline(item)}</li>
              ))}
            </ul>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="text-[color:var(--tv-text-secondary)]">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Parses bold (**text**), italics (*text*), and inline code (`code`)
 */
function parseInline(text: string): React.ReactNode {
  // Regex to match **bold**, *italics*, `code`
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-[color:var(--tv-text-primary)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="italic text-[color:var(--tv-text-primary)]">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-[color:var(--tv-primary-light)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
