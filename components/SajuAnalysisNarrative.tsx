'use client';

import { motion } from 'framer-motion';
import type { LiteraryNarrative } from '@/lib/sajuToLiterature';

export default function SajuAnalysisNarrative({
  narrative,
}: {
  narrative: LiteraryNarrative;
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
          四柱 解析
        </span>
        <div style={{ flex: 1, height: 1, background: '#14141e' }} />
      </div>

      {/* Narrative paragraphs */}
      <div className="space-y-6">
        {narrative.paragraphs.map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
            className="text-sm leading-[2.1]"
            style={{
              color: i === 0
                ? '#c0b0d8'
                : i <= 2
                ? '#a89ab8'
                : '#8a8098',
              fontFamily: 'var(--font-noto-serif), serif',
              fontWeight: 300,
            }}
          >
            {para}
          </motion.p>
        ))}
      </div>

      {/* Closing direction */}
      {narrative.bookingDirection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-8 pt-6 text-center"
          style={{ borderTop: '1px solid #14141e' }}
        >
          <p
            className="text-xs italic"
            style={{
              color: '#5a5070',
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: '0.95rem',
              lineHeight: 1.9,
            }}
          >
            지금 당신에게 필요한 것은&nbsp;
            <span style={{ color: '#8a7898' }}>{narrative.bookingDirection}</span>
            입니다.
          </p>
        </motion.div>
      )}
    </section>
  );
}
