'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { calculateSaju, type UserInput, type SajuResult, type ElementType } from '@/utils/saju';
import { generateNarrative, type LiteraryNarrative } from '@/lib/sajuToLiterature';
import { recommendBooks, type RecommendedBook, type Book } from '@/lib/recommendBooks';
import OhangWheel from '@/components/OhangWheel';
import OhangBar from '@/components/OhangBar';
import BookCard from '@/components/BookCard';
import SajuAnalysisNarrative from '@/components/SajuAnalysisNarrative';
import LiteratureKeywords from '@/components/LiteratureKeywords';
import { LOADING_QUOTES } from '@/data/quotes';
import booksData from '@/data/books.json';

// ─── Constants ────────────────────────────────────────────────────────────────

const ELEMENT_CHAR: Record<ElementType, string> = {
  wood: '木', fire: '火', earth: '土', metal: '金', water: '水',
};
const ELEMENT_KR: Record<ElementType, string> = {
  wood: '목', fire: '화', earth: '토', metal: '금', water: '수',
};
const ELEMENT_COLOR: Record<ElementType, string> = {
  wood: '#4a7042', fire: '#8b3a3a', earth: '#7a6035', metal: '#6a7a82', water: '#2d4a68',
};

// ─── Pillar Card ─────────────────────────────────────────────────────────────

function PillarCard({
  label,
  pillar,
  isDayMaster,
}: {
  label: string;
  pillar: SajuResult['yearPillar'];
  isDayMaster?: boolean;
}) {
  if (!pillar) return null;
  const stemColor = ELEMENT_COLOR[pillar.stemElement];
  const branchColor = ELEMENT_COLOR[pillar.branchElement];

  return (
    <div
      className="flex-1 text-center py-4 px-2 rounded-sm relative"
      style={{
        background: isDayMaster ? '#101020' : '#0c0c16',
        border: `1px solid ${isDayMaster ? '#2a2445' : '#181824'}`,
      }}
    >
      {isDayMaster && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] px-2 py-0.5 rounded-full"
          style={{ background: '#1a1630', color: '#5a5070', border: '1px solid #2a2445', whiteSpace: 'nowrap' }}
        >
          일간
        </div>
      )}
      <div className="text-[9px] tracking-widest mb-3" style={{ color: '#38364a' }}>
        {label}
      </div>
      <div className="text-2xl mb-0.5" style={{ color: stemColor, fontFamily: 'serif', fontWeight: 300 }}>
        {pillar.stem}
      </div>
      <div className="text-[9px] mb-3" style={{ color: `${stemColor}70` }}>
        {pillar.stemKr}
      </div>
      <div style={{ height: 1, background: '#181828', margin: '0 18%' }} />
      <div className="text-2xl mt-3 mb-0.5" style={{ color: branchColor, fontFamily: 'serif', fontWeight: 300 }}>
        {pillar.branch}
      </div>
      <div className="text-[9px]" style={{ color: `${branchColor}70` }}>
        {pillar.branchKr}
      </div>
    </div>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen({ quote }: { quote: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: '#09090f', zIndex: 50 }}
    >
      <OhangWheel size={200} />
      <motion.p
        key={quote}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-10 text-sm text-center px-8 max-w-xs italic leading-relaxed"
        style={{ color: '#4a4468', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }}
      >
        &ldquo;{quote}&rdquo;
      </motion.p>
      <p
        className="mt-5 text-[10px] tracking-[0.22em]"
        style={{ color: '#28263a' }}
      >
        당신의 기운을 문학의 언어로 해석하는 중…
      </p>
    </motion.div>
  );
}

// ─── Section Divider ──────────────────────────────────────────────────────────

function SectionDivider({ label }: { label?: string }) {
  if (!label) return <div style={{ height: 1, background: '#14141e' }} />;
  return (
    <div className="flex items-center gap-4">
      <div style={{ flex: 1, height: 1, background: '#14141e' }} />
      <span className="text-[9px] tracking-[0.3em] shrink-0" style={{ color: '#3a3458' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: '#14141e' }} />
    </div>
  );
}

// ─── Result Page ──────────────────────────────────────────────────────────────

export default function ResultPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [saju, setSaju] = useState<SajuResult | null>(null);
  const [input, setInput] = useState<UserInput | null>(null);
  const [narrative, setNarrative] = useState<LiteraryNarrative | null>(null);
  const [books, setBooks] = useState<RecommendedBook[]>([]);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const cycleQuotes = useCallback(() => {
    const id = setInterval(() => setQuoteIdx((i) => (i + 1) % LOADING_QUOTES.length), 1800);
    return id;
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem('saju_input');
    if (!raw) { setIsLoading(false); return; }

    try {
      const parsed: UserInput = JSON.parse(raw);
      setInput(parsed);
      const result = calculateSaju(parsed);
      setSaju(result);
      const narr = generateNarrative(result);
      setNarrative(narr);
      const recs = recommendBooks(result, booksData as unknown as Book[]);
      setBooks(recs);
    } catch (e) {
      console.error(e);
    }

    const qi = cycleQuotes();
    const timer = setTimeout(() => {
      clearInterval(qi);
      setIsLoading(false);
    }, 3200);

    return () => { clearTimeout(timer); clearInterval(qi); };
  }, [cycleQuotes]);

  const handleShare = async () => {
    if (!saju || !input) return;
    const text = [
      `【문학사주】 ${input.name}님의 문학 사주`,
      '',
      `오행: ${Object.entries(saju.elements).map(([k, v]) => `${ELEMENT_KR[k as ElementType]}${v}`).join(' · ')}`,
      `키워드: ${saju.keywords.join(', ')}`,
      '',
      '📚 추천 도서',
      ...books.map((b) => `${b.rank}위 (${b.matchPercentage}% 일치) 『${b.title}』— ${b.author}`),
    ].join('\n');

    try {
      if (navigator.share) {
        await navigator.share({ title: '문학사주', text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {}
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <AnimatePresence>
        <LoadingScreen quote={LOADING_QUOTES[quoteIdx]} />
      </AnimatePresence>
    );
  }

  // ── Error state ──
  if (!saju || !input) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#09090f' }}>
        <p className="text-sm" style={{ color: '#4a4468' }}>입력 정보를 찾을 수 없습니다.</p>
        <Link href="/input" className="text-xs tracking-widest" style={{ color: '#c4a878' }}>
          다시 입력하기 →
        </Link>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen"
      style={{ background: '#09090f' }}
    >
      {/* ── Top nav ── */}
      <nav
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
        style={{ background: '#09090f', borderBottom: '1px solid #12121c' }}
      >
        <Link href="/" className="text-[10px] tracking-[0.2em]" style={{ color: '#3a3450' }}>
          ← 문학사주
        </Link>
        <Link href="/input" className="text-[10px] tracking-[0.2em]" style={{ color: '#3a3450' }}>
          다시 분석하기
        </Link>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-14 space-y-14">

        {/* ══════════════════════════════════════════
            SECTION 1 : 기본 정보 요약
        ══════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Name + birth */}
          <div className="text-center">
            <p className="text-[9px] tracking-[0.35em] mb-4" style={{ color: '#2e2c42' }}>
              四柱 命理 分析
            </p>
            <h1
              className="text-2xl mb-2"
              style={{ color: '#f0ead8', fontFamily: 'var(--font-noto-serif), serif', fontWeight: 300 }}
            >
              {input.name}
            </h1>
            <p className="text-xs" style={{ color: '#3a3858' }}>
              {input.birthYear}년 {input.birthMonth}월 {input.birthDay}일
              &nbsp;·&nbsp;{input.calendarType === 'lunar' ? '음력' : '양력'}
              &nbsp;·&nbsp;{input.birthLocation}
            </p>
          </div>

          {/* Four pillars */}
          <div className="flex gap-2">
            <PillarCard label="년주" pillar={saju.yearPillar} />
            <PillarCard label="월주" pillar={saju.monthPillar} />
            <PillarCard label="일주" pillar={saju.dayPillar} isDayMaster />
            {saju.hourPillar ? (
              <PillarCard label="시주" pillar={saju.hourPillar} />
            ) : (
              <div
                className="flex-1 flex items-center justify-center rounded-sm"
                style={{ background: '#0c0c16', border: '1px solid #181824' }}
              >
                <span className="text-[9px]" style={{ color: '#22203a' }}>시간<br />미입력</span>
              </div>
            )}
          </div>

          {/* Day master label */}
          <p className="text-center text-xs" style={{ color: '#38344e' }}>
            일간&nbsp;
            <span style={{ color: ELEMENT_COLOR[saju.dayMasterElement] }}>
              {saju.dayMaster}({saju.dayMasterKr}) — {ELEMENT_KR[saju.dayMasterElement]}({ELEMENT_CHAR[saju.dayMasterElement]})
            </span>
          </p>

          {/* Keywords */}
          <div className="flex justify-center gap-2 flex-wrap">
            {saju.keywords.map((kw) => (
              <span
                key={kw}
                className="text-xs px-4 py-2"
                style={{
                  color: '#b0a8c0',
                  border: '1px solid #24223a',
                  background: '#0e0e1a',
                  fontFamily: 'var(--font-noto-serif), serif',
                  fontWeight: 300,
                }}
              >
                {kw}
              </span>
            ))}
          </div>

          {/* Ohang bar */}
          <div
            className="rounded-sm p-5"
            style={{ background: '#0c0c16', border: '1px solid #181824' }}
          >
            <p className="text-[9px] tracking-[0.2em] mb-4" style={{ color: '#2e2c42' }}>
              오행 분포
            </p>
            <OhangBar
              elements={saju.elements}
              dominant={saju.dominantElements}
              weak={saju.weakElements}
            />
            {(saju.dominantElements.length > 0 || saju.weakElements.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[10px]" style={{ color: '#38364a' }}>
                {saju.dominantElements.length > 0 && (
                  <span>
                    강한 기운:&nbsp;
                    {saju.dominantElements.map((e) => (
                      <span key={e} style={{ color: ELEMENT_COLOR[e] }}>
                        {ELEMENT_KR[e]}({ELEMENT_CHAR[e]})&nbsp;
                      </span>
                    ))}
                  </span>
                )}
                {saju.weakElements.length > 0 && (
                  <span>
                    보완할 기운:&nbsp;
                    {saju.weakElements.map((e) => (
                      <span key={e} style={{ color: '#6a6282' }}>
                        {ELEMENT_KR[e]}({ELEMENT_CHAR[e]})&nbsp;
                      </span>
                    ))}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════
            SECTION 2 : 사주 분석 텍스트
        ══════════════════════════════════════════ */}
        {narrative && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <SajuAnalysisNarrative narrative={narrative} />
          </motion.div>
        )}

        {/* ══════════════════════════════════════════
            SECTION 3 : 문학적 해석 (키워드)
        ══════════════════════════════════════════ */}
        {narrative && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <LiteratureKeywords keywords={narrative.keywords} />
          </motion.div>
        )}

        {/* ══════════════════════════════════════════
            SECTION 4 : 추천 책 TOP 5
        ══════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <div style={{ flex: 1, height: 1, background: '#14141e' }} />
            <span className="text-[9px] tracking-[0.3em] shrink-0" style={{ color: '#3a3458' }}>
              推薦 文學 TOP 5
            </span>
            <div style={{ flex: 1, height: 1, background: '#14141e' }} />
          </div>

          {/* Book cards */}
          <div className="space-y-5">
            {books.map((book, i) => (
              <BookCard
                key={book.id}
                book={book}
                index={i}
              />
            ))}
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════
            SECTION 5 : 공유 / 저장 영역
        ══════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-5"
        >
          <SectionDivider />

          {/* Share button */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleShare}
              className="text-[11px] px-6 py-3 tracking-[0.12em] transition-all duration-200 rounded-[2px]"
              style={{
                background: copied ? '#141e14' : '#0e0e1a',
                border: `1px solid ${copied ? '#2a4a2a' : '#24223a'}`,
                color: copied ? '#4a7042' : '#8a8098',
                cursor: 'pointer',
              }}
            >
              {copied ? '클립보드에 복사되었습니다 ✓' : '추천 결과 공유하기'}
            </button>
          </div>

          {/* Caption */}
          <p
            className="text-center text-[10px] italic leading-relaxed"
            style={{ color: '#28263a', fontFamily: 'var(--font-cormorant), serif' }}
          >
            &ldquo;어떤 문장은 운명처럼 찾아온다.&rdquo;
          </p>

          {/* Footer links */}
          <div className="flex justify-center gap-6 pt-2">
            <Link href="/input" className="text-[10px] tracking-[0.2em]" style={{ color: '#2e2c42' }}>
              다시 분석하기
            </Link>
            <Link href="/" className="text-[10px] tracking-[0.2em]" style={{ color: '#2e2c42' }}>
              처음으로
            </Link>
          </div>

          <p className="text-center text-[9px] tracking-widest pt-2" style={{ color: '#1e1c2e' }}>
            文學四柱
          </p>
        </motion.section>

      </div>
    </motion.main>
  );
}
