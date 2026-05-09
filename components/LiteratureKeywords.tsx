'use client';

import { motion } from 'framer-motion';
import type { LiteraryKeyword } from '@/lib/sajuToLiterature';
import { EL_COLOR } from '@/lib/sajuToLiterature';

export default function LiteratureKeywords({
  keywords,
}: {
  keywords: LiteraryKeyword[];
}) {
  return (
    <section>
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <div style={{ flex: 1, height: 1, background: '#14141e' }} />
        <span
          className="text-[9px] tracking-[0.3em] shrink-0"
          style={{ color: '#3a3458' }}
        >
          당신에게 지금 필요한 문학
        </span>
        <div style={{ flex: 1, height: 1, background: '#14141e' }} />
      </div>

      <div className="space-y-3">
        {keywords.map((kw, i) => {
          const color = EL_COLOR[kw.relatedElement] ?? '#6a6282';
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.55,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="p-5 rounded-sm"
              style={{
                background: '#0c0c17',
                borderLeft: `2px solid ${color}`,
                border: `1px solid ${color}20`,
                borderLeftWidth: '2px',
                borderLeftColor: color,
              }}
            >
              {/* Index + title */}
              <div className="flex items-start gap-3 mb-2">
                <span
                  className="text-[10px] shrink-0 mt-0.5"
                  style={{
                    color: `${color}90`,
                    fontFamily: 'var(--font-cormorant), serif',
                    minWidth: '1rem',
                  }}
                >
                  {i + 1}.
                </span>
                <h3
                  className="text-sm leading-snug"
                  style={{
                    color: '#d4cce4',
                    fontFamily: 'var(--font-noto-serif), serif',
                    fontWeight: 300,
                  }}
                >
                  {kw.title}
                </h3>
              </div>

              {/* Description */}
              <p
                className="text-xs leading-relaxed pl-5"
                style={{ color: '#6a6280' }}
              >
                {kw.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
