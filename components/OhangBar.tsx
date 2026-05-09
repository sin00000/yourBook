'use client';

import { motion } from 'framer-motion';
import type { ElementCount, ElementType } from '@/utils/saju';

const ELEMENT_CONFIG: Record<
  ElementType,
  { label: string; char: string; color: string; bg: string }
> = {
  wood:  { label: '목 木', char: '木', color: '#4a7042', bg: '#1a2618' },
  fire:  { label: '화 火', char: '火', color: '#8b3a3a', bg: '#261414' },
  earth: { label: '토 土', char: '土', color: '#7a6035', bg: '#231c10' },
  metal: { label: '금 金', char: '金', color: '#6a7a82', bg: '#171e20' },
  water: { label: '수 水', char: '水', color: '#2d4a68', bg: '#0e1720' },
};

const ORDER: ElementType[] = ['wood', 'fire', 'earth', 'metal', 'water'];

export default function OhangBar({
  elements,
  dominant,
  weak,
}: {
  elements: ElementCount;
  dominant: ElementType[];
  weak: ElementType[];
}) {
  const total = Object.values(elements).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-3">
      {ORDER.map((el) => {
        const cfg = ELEMENT_CONFIG[el];
        const count = elements[el];
        const pct = (count / total) * 100;
        const isDominant = dominant.includes(el);
        const isWeak = weak.includes(el);

        return (
          <div key={el} className="flex items-center gap-3">
            {/* Label */}
            <div
              className="text-xs w-12 text-right shrink-0"
              style={{ color: cfg.color, fontFamily: 'serif', letterSpacing: '0.05em' }}
            >
              {cfg.label}
            </div>

            {/* Bar */}
            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1a1a24' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                style={{ background: cfg.color, opacity: count === 0 ? 0.2 : 1 }}
              />
            </div>

            {/* Count + badge */}
            <div className="flex items-center gap-1.5 w-16">
              <span className="text-xs" style={{ color: count === 0 ? '#3a3a48' : cfg.color }}>
                {count}
              </span>
              {isDominant && (
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }}
                >
                  강
                </span>
              )}
              {isWeak && count === 0 && (
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{ background: '#1a1520', color: '#8a7a90', border: '1px solid #3a2a4040' }}
                >
                  부족
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
