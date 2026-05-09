'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import StarField from '@/components/StarField';
import { DAILY_SENTENCES } from '@/data/quotes';

export default function HomePage() {
  const [daily, setDaily] = useState(DAILY_SENTENCES[0]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const idx = Math.floor(Math.random() * DAILY_SENTENCES.length);
    setDaily(DAILY_SENTENCES[idx]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        const idx = Math.floor(Math.random() * DAILY_SENTENCES.length);
        setDaily(DAILY_SENTENCES[idx]);
        setVisible(true);
      }, 600);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ background: '#09090f' }}
    >
      <StarField count={100} />

      {/* Ink blot ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, #1a1028 0%, transparent 70%)',
          opacity: 0.6,
        }}
      />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="mb-12 flex items-center justify-center gap-3"
        >
          <div style={{ width: 32, height: 1, background: '#2a2a38' }} />
          <span
            className="text-[10px] tracking-[0.35em]"
            style={{ color: '#4a4460' }}
          >
            文學四柱
          </span>
          <div style={{ width: 32, height: 1, background: '#2a2a38' }} />
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 leading-tight"
          style={{
            fontFamily: 'var(--font-noto-serif), serif',
            fontWeight: 300,
            fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
            color: '#f0ead8',
            letterSpacing: '-0.01em',
          }}
        >
          사주는 당신의 운명을
          <br />
          말하지 않습니다.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 leading-relaxed"
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
            color: '#8a8098',
            fontStyle: 'italic',
          }}
        >
          당신이 읽어야 할 문장을 말해줍니다.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/input"
            className="group inline-block"
          >
            <div
              className="relative px-10 py-4 text-sm tracking-[0.15em] transition-all duration-500"
              style={{
                color: '#c4a878',
                border: '1px solid #2a2438',
                background: '#0c0c18',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#c4a87840';
                (e.currentTarget as HTMLElement).style.background = '#101018';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#2a2438';
                (e.currentTarget as HTMLElement).style.background = '#0c0c18';
              }}
            >
              나의 문학 사주 보기
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Daily sentence */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-12 left-0 right-0 text-center px-6"
      >
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={daily.text}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5 }}
            >
              <p
                className="text-xs italic mb-1"
                style={{
                  color: '#4a4460',
                  fontFamily: 'var(--font-cormorant), serif',
                }}
              >
                &ldquo;{daily.text}&rdquo;
              </p>
              <p className="text-[10px] tracking-widest" style={{ color: '#32303a' }}>
                — {daily.author}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Corner ornaments */}
      {[
        'top-8 left-8',
        'top-8 right-8',
        'bottom-8 left-8',
        'bottom-8 right-8',
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} opacity-20`}
          style={{ color: '#4a4060', fontSize: 10, fontFamily: 'serif' }}
        >
          ◆
        </div>
      ))}
    </main>
  );
}
