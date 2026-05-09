import type { SajuResult, ElementType, TenGodType } from './saju';

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
  score: number;
  matchReason: string;
  sectionLabel: string;
}

const ELEMENT_KR: Record<ElementType, string> = {
  wood: '목', fire: '화', earth: '토', metal: '금', water: '수',
};

const SECTION_LABELS: Record<ElementType, string[]> = {
  wood: ['새로운 시작을 위한 문장', '성장의 고통을 담은 서사'],
  fire: ['삶의 온도를 높이는 이야기', '열정과 욕망의 드라마'],
  earth: ['삶의 무게를 견디는 이야기', '일상 속 깊이를 발견하는 문학'],
  metal: ['예리한 사유를 위한 문학', '명징한 언어로 쓴 사유'],
  water: ['고독을 견디는 문장', '감정과 기억의 내면 서사'],
};

function getSectionLabel(weakEl: ElementType | null, index: number): string {
  if (weakEl && SECTION_LABELS[weakEl]) {
    return SECTION_LABELS[weakEl][index % 2] ?? SECTION_LABELS[weakEl][0];
  }
  return '지금 당신에게 필요한 문학';
}

function scoreBook(book: Book, saju: SajuResult): number {
  let score = 0;

  const weakElEn = saju.weakElements.map((e) => e);
  const dominantElEn = saju.dominantElements.map((e) => e);

  // Weak element match → highest priority (what you need)
  for (const el of weakElEn) {
    if (book.tags.elements.includes(el)) score += 35;
  }

  // Dominant element match → natural resonance
  for (const el of dominantElEn) {
    if (book.tags.elements.includes(el)) score += 18;
  }

  // Ten god match
  for (const tg of saju.dominantTenGods) {
    if (book.tags.ten_gods.includes(tg)) score += 20;
  }

  // Day master element
  if (book.tags.elements.includes(saju.dayMasterElement)) score += 10;

  // Small deterministic offset based on book id to ensure variety
  score += parseInt(book.id, 10) % 7;

  return score;
}

function getMatchReason(book: Book, saju: SajuResult): string {
  const weakEl = saju.weakElements[0];
  const domEl = saju.dominantElements[0];

  if (weakEl && book.tags.elements.includes(weakEl)) {
    const elName = ELEMENT_KR[weakEl];
    const reasons: Record<ElementType, string> = {
      wood: `${elName}(木)의 기운이 부족한 당신에게, 성장과 유연함을 일깨우는 이야기를 건넵니다.`,
      fire: `${elName}(火)의 기운이 필요한 지금, 삶의 온기와 열정을 되살려줄 문학입니다.`,
      earth: `${elName}(土)의 안정이 필요한 당신에게, 일상의 깊이를 다시 발견하게 해줍니다.`,
      metal: `${elName}(金)의 예리함이 필요한 지금, 명확한 사유로 당신을 이끌 작품입니다.`,
      water: `${elName}(水)의 감수성이 필요한 당신에게, 내면의 깊이를 탐구하는 이야기를 건넵니다.`,
    };
    return reasons[weakEl];
  }

  if (domEl && book.tags.elements.includes(domEl)) {
    return `${ELEMENT_KR[domEl]}(${domEl === 'wood' ? '木' : domEl === 'fire' ? '火' : domEl === 'earth' ? '土' : domEl === 'metal' ? '金' : '水'})의 기운이 강한 당신의 감수성에 공명하는 문학입니다.`;
  }

  return `당신의 사주가 지금 이 문학과 만나기를 권합니다.`;
}

export function recommend(
  saju: SajuResult,
  books: Book[],
  count = 5,
  filter?: 'world' | 'korean',
  shuffled = false
): RecommendedBook[] {
  let pool = books;
  if (filter === 'world') pool = books.filter((b) => b.category === '세계문학');
  if (filter === 'korean') pool = books.filter((b) => b.category === '한국문학');

  const scored = pool.map((book) => ({
    ...book,
    score: scoreBook(book, saju) + (shuffled ? Math.random() * 15 : 0),
    matchReason: getMatchReason(book, saju),
    sectionLabel: '',
  }));

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, count);

  // Assign section labels
  const primaryWeak = saju.weakElements[0] ?? null;
  top.forEach((book, i) => {
    book.sectionLabel = getSectionLabel(primaryWeak, i);
  });

  return top;
}

export function getElementDescription(saju: SajuResult): {
  dominant: { element: ElementType; label: string; description: string }[];
  weak: { element: ElementType; label: string; description: string }[];
} {
  const EL_LABEL: Record<ElementType, string> = {
    wood: '木 (목)', fire: '火 (화)', earth: '土 (토)', metal: '金 (금)', water: '水 (수)',
  };
  const EL_DESC: Record<ElementType, string> = {
    wood: '창의·성장·유연함',
    fire: '열정·표현·직관',
    earth: '안정·신뢰·실용',
    metal: '명확·원칙·예리함',
    water: '지혜·감수성·깊이',
  };

  return {
    dominant: saju.dominantElements.map((el) => ({
      element: el,
      label: EL_LABEL[el],
      description: EL_DESC[el],
    })),
    weak: saju.weakElements.map((el) => ({
      element: el,
      label: EL_LABEL[el],
      description: EL_DESC[el],
    })),
  };
}
