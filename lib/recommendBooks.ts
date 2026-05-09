import type { SajuResult, ElementType } from '@/utils/saju';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  author: string;
  country: string;
  era: string;
  category: string;
  year?: number;
  tags: {
    elements: string[];
    ten_gods: string[];
    mood: string[];
  };
  difficulty: string;
  energy: string;
  atmosphere: string[];
  description: string;
  literaryInterpretation: string;
}

export interface RecommendedBook extends Book {
  rank: number;
  score: number;
  matchPercentage: number;
  personalizedDescription: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EL_KR: Record<ElementType, string>   = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
const EL_CHAR: Record<ElementType, string> = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };

// ─── Scoring ─────────────────────────────────────────────────────────────────
// Scoring breakdown:
//   Weak element match     : 40 pts × up to 2  = max  80
//   Dominant element match : 20 pts × up to 2  = max  40
//   Ten-god match          : 25 pts × up to 2  = max  50
//   Day-master element     : 15 pts             = max  15
//   Per-pillar element     :  5 pts × up to 8  = max  40
//   ─────────────────────────────────────────────────  225

function scoreBook(book: Book, saju: SajuResult): number {
  const bookEls = new Set(book.tags.elements);
  const bookTgs = new Set(book.tags.ten_gods);
  let score = 0;

  // 1. Weak element — highest priority (supplements what's missing)
  for (const el of saju.weakElements) {
    if (bookEls.has(el)) score += 40;
  }

  // 2. Dominant element — natural resonance
  for (const el of saju.dominantElements) {
    if (bookEls.has(el)) score += 20;
  }

  // 3. Ten-god — narrative/character preference
  for (const tg of saju.dominantTenGods) {
    if (bookTgs.has(tg)) score += 25;
  }

  // 4. Day master element
  if (bookEls.has(saju.dayMasterElement)) score += 15;

  // 5. Per-pillar element (fine-grained: differentiates when weak/dominant overlap many books)
  const pillarEls: ElementType[] = [
    saju.yearPillar.stemElement,  saju.yearPillar.branchElement,
    saju.monthPillar.stemElement, saju.monthPillar.branchElement,
    saju.dayPillar.stemElement,   saju.dayPillar.branchElement,
    ...(saju.hourPillar
      ? [saju.hourPillar.stemElement, saju.hourPillar.branchElement]
      : []),
  ];
  for (const el of pillarEls) {
    if (bookEls.has(el)) score += 5;
  }

  return score;
}

// ─── Relative Percentage Scaling ─────────────────────────────────────────────
// Ensures the 5 books always show different, meaningful percentages.
// Rank 1 → 90-94%, Rank 5 → 60-66%. Spread reflects actual score distance.

function computeMatchPercentages(cleanScores: number[]): number[] {
  const max = Math.max(...cleanScores);
  const min = Math.min(...cleanScores);
  const range = max - min;

  // Fixed percentages when all scores are identical (avoids misleading uniformity)
  if (range === 0) return [92, 84, 77, 70, 63];

  // Scale: highest score → 94%, lowest → 62% (spread = 32 pp, adjusts with range)
  const TOP = 94;
  const BOT = 62;
  return cleanScores.map(s => Math.round(BOT + ((s - min) / range) * (TOP - BOT)));
}

// ─── Personalized Description ─────────────────────────────────────────────────

function generatePersonalizedDescription(book: Book, saju: SajuResult): string {
  const weakEl = saju.weakElements[0];
  const domEl  = saju.dominantElements[0];

  const WEAK: Record<ElementType, { period: string; provides: string }> = {
    wood:  { period: '새로운 시작과 성장의 감각이 필요한 시기', provides: '성장과 자기 확장의 감각을 다시 열어주는' },
    fire:  { period: '삶의 온기와 의지를 회복해야 하는 시기', provides: '삶의 생명력과 온기를 되살려주는' },
    earth: { period: '삶의 중심과 안정감이 필요한 시기', provides: '일상의 안정감과 연결감을 회복하게 해주는' },
    metal: { period: '자신만의 기준과 방향이 흐릿한 시기', provides: '명확한 기준과 언어를 돌려주는' },
    water: { period: '감정을 부드럽게 흘려보내는 능력이 필요한 시기', provides: '감정의 층위를 천천히 따라가게 만드는' },
  };
  const DOM: Record<ElementType, string> = {
    wood:  '성장과 가능성을 향한 당신의 에너지와',
    fire:  '열정적이고 표현적인 당신의 기질과',
    earth: '안정과 신뢰를 중시하는 당신의 성향과',
    metal: '예리하고 구조적인 당신의 사고방식과',
    water: '깊고 감수성 풍부한 당신의 내면과',
  };

  if (weakEl && book.tags.elements.includes(weakEl)) {
    const ctx   = WEAK[weakEl];
    const moods = book.tags.mood.slice(0, 2).join(', ');
    return `당신은 ${EL_KR[weakEl]}(${EL_CHAR[weakEl]})의 기운이 부족하여 ${ctx.period}입니다. 『${book.title}』은 ${ctx.provides} 작품으로, 이 작품이 다루는 ${moods}의 주제는 지금 당신의 내면 상태와 깊이 공명하는 경향이 있습니다. 사건이나 결말보다, 읽는 동안 당신 안에서 조용히 일어나는 변화에 주목해 보시기 바랍니다.`;
  }
  if (domEl && book.tags.elements.includes(domEl)) {
    const moods = book.tags.mood.slice(0, 2).join(', ');
    return `${DOM[domEl]} 깊이 공명하는 작품입니다. 『${book.title}』이 탐구하는 ${moods}의 세계는 당신이 이미 가진 감수성을 더욱 풍요롭게 만들어줄 것입니다. 이 작품을 통해 자신의 기질을 더 깊이 이해하는 시간이 될 수 있습니다.`;
  }

  const moods = book.tags.mood.slice(0, 2).join(', ');
  return `당신의 사주 기운과 연결되는 작품입니다. 『${book.title}』이 다루는 ${moods}의 주제가 지금 이 시기의 당신에게 예상치 못한 울림을 줄 수 있습니다. 때로는 이유를 알기 전에 먼저 닿아오는 책이 있습니다.`;
}

// ─── Main Function ────────────────────────────────────────────────────────────

export function recommendBooks(saju: SajuResult, books: Book[]): RecommendedBook[] {
  type Scored = Book & { cleanScore: number; rankScore: number };

  const scored: Scored[] = books
    .map(book => {
      const cleanScore = scoreBook(book, saju);
      return { ...book, cleanScore, rankScore: cleanScore + (parseInt(book.id, 10) % 7) };
    })
    .sort((a, b) => b.rankScore - a.rankScore);

  // Greedy author-dedup: prefer variety in top 5
  const seenAuthors = new Set<string>();
  const selected: Scored[] = [];
  for (const book of scored) {
    if (selected.length >= 5) break;
    if (!seenAuthors.has(book.author)) {
      seenAuthors.add(book.author);
      selected.push(book);
    }
  }
  // Fill remaining if author pool is small
  for (const book of scored) {
    if (selected.length >= 5) break;
    if (!selected.find(s => s.id === book.id)) selected.push(book);
  }
  const top5 = selected.slice(0, 5);

  // Compute relative match percentages across the 5 books
  const pcts = computeMatchPercentages(top5.map(b => b.cleanScore));

  return top5.map((book, i) => ({
    ...book,
    rank:                    i + 1,
    score:                   book.rankScore,
    matchPercentage:         pcts[i],
    personalizedDescription: generatePersonalizedDescription(book, saju),
  }));
}
