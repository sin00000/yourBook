'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { RecommendedBook } from '@/lib/recommendBooks';

const DIFFICULTY_COLOR: Record<string, string> = {
  '쉬움': '#4a7042', '중간': '#7a6035', '어려움': '#8b3a3a', '매우어려움': '#6a3a6a',
};
const RANK_LABEL: Record<number, string> = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五' };

function pctBarGradient(pct: number) {
  if (pct >= 80) return 'linear-gradient(90deg, #3a2a1a, #c4a878)';
  if (pct >= 68) return 'linear-gradient(90deg, #2a2010, #9a8050)';
  return               'linear-gradient(90deg, #201a10, #6a5838)';
}
function pctColor(pct: number) {
  if (pct >= 80) return '#c4a878';
  if (pct >= 68) return '#9a8050';
  return               '#6a5838';
}

// ─── Store Link ───────────────────────────────────────────────────────────────

function StoreLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      className="flex-1 text-center text-[10px] py-2.5 rounded-[2px] transition-all duration-200"
      style={{ color: '#4a4468', border: '1px solid #1e1e2c', background: '#0d0d1a' }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor='#3a3060'; el.style.color='#c4a878'; el.style.background='#12121e'; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor='#1e1e2c'; el.style.color='#4a4468'; el.style.background='#0d0d1a'; }}
    >
      {label}
    </a>
  );
}

// ─── Book Card ────────────────────────────────────────────────────────────────

export default function BookCard({ book, index }: { book: RecommendedBook; index: number }) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(true);
  const [hasCover, setHasCover] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCoverLoading(true);
    setHasCover(false);
    setCoverUrl(null);

    const timer = setTimeout(async () => {
      let url: string | null = null;

      // 1. Aladin API (서버 배포 + API 키 있을 때)
      try {
        const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
        const res = await fetch(
          `${base}/api/aladin?${new URLSearchParams({ title: book.title, author: book.author })}`,
          { signal: AbortSignal.timeout(4000) }
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.cover) url = data.cover;
        }
      } catch { /* 폴백 */ }

      // 2. Google Books API (CORS 지원, 키 불필요 — 어디서나 작동)
      if (!url) {
        try {
          const q = encodeURIComponent(`${book.title} ${book.author.split(' ')[0]}`);
          const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=5&printType=books`,
            { signal: AbortSignal.timeout(5000) }
          );
          if (res.ok) {
            const data = await res.json();
            for (const item of (data.items ?? [])) {
              const links = item.volumeInfo?.imageLinks;
              const thumb: string | undefined = links?.thumbnail ?? links?.smallThumbnail;
              if (thumb) {
                url = thumb.replace('http://', 'https://').replace('zoom=1', 'zoom=3');
                break;
              }
            }
          }
        } catch { /* 이미지 없음 */ }
      }

      if (!cancelled) {
        if (url) { setCoverUrl(url); setHasCover(true); }
        setCoverLoading(false);
      }
    }, index * 350);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [book.title, book.author, index]);

  const pct        = book.matchPercentage;
  const diffColor  = DIFFICULTY_COLOR[book.difficulty] ?? '#7a7a90';
  const kyoboUrl   = `https://search.kyobobook.co.kr/search?keyword=${encodeURIComponent(book.title)}`;
  const aladinUrl  = `https://www.aladin.co.kr/search/wsearchresult.aspx?KeyWord=${encodeURIComponent(book.title)}&SearchTarget=Book`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-sm overflow-hidden"
      style={{ background: '#0d0d18', border: '1px solid #1c1c28' }}
    >
      {/* ── Rank + Percentage ── */}
      <div className="px-5 pt-4 pb-3" style={{ borderBottom: '1px solid #151520' }}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span style={{ color: '#c4a87840', fontFamily: 'var(--font-cormorant),serif', fontSize: 18, lineHeight: 1 }}>
              {RANK_LABEL[book.rank]}
            </span>
            <span style={{ color: '#24223a', fontSize: 9, letterSpacing: '0.12em' }}>위</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
              style={{ color: pctColor(pct), fontSize: 22, fontFamily: 'var(--font-cormorant),serif', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              {pct}
            </motion.span>
            <span style={{ color: '#32304a', fontSize: 9, letterSpacing: '0.08em' }}>% 일치</span>
          </div>
        </div>
        {/* Bar */}
        <div className="rounded-full overflow-hidden" style={{ height: 2, background: '#14141c' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.1, delay: index * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', background: pctBarGradient(pct), borderRadius: 999 }}
          />
        </div>
      </div>

      {/* ── Content: two layouts depending on cover availability ── */}
      {hasCover && coverUrl ? (
        /* ── WITH COVER: side-by-side ── */
        <div className="flex gap-5 p-5">
          <div className="shrink-0 relative overflow-hidden rounded-[2px]" style={{ width: 88, height: 120 }}>
            <Image
              src={coverUrl} alt={`${book.title} 표지`} fill className="object-cover"
              onError={() => { setHasCover(false); setCoverUrl(null); }}
              sizes="88px"
            />
          </div>
          <BookInfo book={book} diffColor={diffColor} />
        </div>
      ) : coverLoading ? (
        /* ── LOADING: skeleton ── */
        <div className="flex gap-5 p-5">
          <div className="shrink-0 rounded-[2px] animate-pulse" style={{ width: 88, height: 120, background: '#12121e' }} />
          <BookInfo book={book} diffColor={diffColor} />
        </div>
      ) : (
        /* ── NO COVER: full-width with large title ── */
        <div className="px-6 pt-6 pb-2">
          {/* Large title display */}
          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid #181824' }}>
            <h3
              className="leading-tight mb-2"
              style={{
                color: '#ece6f8',
                fontFamily: 'var(--font-noto-serif),serif',
                fontWeight: 300,
                fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                letterSpacing: '-0.01em',
              }}
            >
              {book.title}
            </h3>
            {book.originalTitle && (
              <p className="text-xs italic mb-2" style={{ color: '#3a3454', fontFamily: 'var(--font-cormorant),serif' }}>
                {book.originalTitle}
              </p>
            )}
            <p className="text-xs" style={{ color: '#5a5478' }}>
              {book.author}
              <span style={{ color: '#28263a', margin: '0 6px' }}>·</span>
              {book.country}
              <span style={{ color: '#28263a', margin: '0 6px' }}>·</span>
              {book.era}
              {book.year && <><span style={{ color: '#28263a', margin: '0 6px' }}>·</span>{book.year}</>}
            </p>
          </div>
          <TagRow book={book} diffColor={diffColor} />
        </div>
      )}

      {/* ── Always show tags if cover loaded (side-by-side already has BookInfo) ── */}
      {/* Tags row handled inside BookInfo, nothing extra needed */}

      {/* ── Personalized description ── */}
      <div className="mx-5 mb-4 p-4 rounded-[2px]" style={{ background: '#0a0a14', border: '1px solid #181828' }}>
        <p className="text-[9px] tracking-widest mb-2" style={{ color: '#2e2c42' }}>당신의 사주와의 연결</p>
        <p className="text-xs leading-[1.95]" style={{ color: '#9a90b0', fontWeight: 300 }}>
          {book.personalizedDescription}
        </p>
      </div>

      {/* ── Store links ── */}
      <div className="flex gap-2 px-5 pb-5">
        <StoreLink href={kyoboUrl} label="교보문고에서 보기" />
        <StoreLink href={aladinUrl} label="알라딘에서 보기" />
      </div>
    </motion.article>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BookInfo({ book, diffColor }: { book: RecommendedBook; diffColor: string }) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-base mb-0.5 leading-snug" style={{ color: '#ece6f8', fontFamily: 'var(--font-noto-serif),serif', fontWeight: 300 }}>
        {book.title}
      </h3>
      {book.originalTitle && (
        <p className="text-[10px] mb-1 italic" style={{ color: '#38344e', fontFamily: 'var(--font-cormorant),serif' }}>
          {book.originalTitle}
        </p>
      )}
      <p className="text-xs mb-3" style={{ color: '#5a5470' }}>
        {book.author}
        <span style={{ color: '#2a2840', margin: '0 5px' }}>·</span>
        {book.country}
        <span style={{ color: '#2a2840', margin: '0 5px' }}>·</span>
        {book.era}
        {book.year && <><span style={{ color: '#2a2840', margin: '0 5px' }}>·</span>{book.year}</>}
      </p>
      <TagRow book={book} diffColor={diffColor} />
    </div>
  );
}

function TagRow({ book, diffColor }: { book: RecommendedBook; diffColor: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {book.tags.mood.slice(0, 3).map(tag => (
        <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full" style={{ color: '#4a4468', border: '1px solid #20203a', background: '#0e0e1c' }}>
          {tag}
        </span>
      ))}
      <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ color: diffColor, border: `1px solid ${diffColor}35`, background: `${diffColor}0a` }}>
        {book.difficulty}
      </span>
      <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ color: '#3a3455', border: '1px solid #1e1e30', background: '#0e0e1c' }}>
        {book.category}
      </span>
    </div>
  );
}
