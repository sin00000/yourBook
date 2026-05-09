// ─── Heavenly Stems (천간) ────────────────────────────────────────────────────

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const STEMS_KR = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const STEMS_ELEMENT: ElementType[] = [
  'wood', 'wood', 'fire', 'fire', 'earth',
  'earth', 'metal', 'metal', 'water', 'water',
];

// ─── Earthly Branches (지지) ──────────────────────────────────────────────────

const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const BRANCHES_KR = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const BRANCHES_ELEMENT: ElementType[] = [
  'water', 'earth', 'wood', 'wood', 'earth', 'fire',
  'fire', 'earth', 'metal', 'metal', 'earth', 'water',
];

// ─── 지지 장간 (주기/정기) lookup table ──────────────────────────────────────
// 子→壬(8) 丑→己(5) 寅→甲(0) 卯→乙(1) 辰→戊(4) 巳→丙(2)
// 午→丁(3) 未→己(5) 申→庚(6) 酉→辛(7) 戌→戊(4) 亥→壬(8)
// Note: 巳(5)=丙(yang fire), 午(6)=丁(yin fire), 亥(11)=壬(yang water)
// These do NOT follow the simple odd/even yin-yang rule.
const BRANCH_MAIN_HIDDEN_STEM: number[] = [
  8, 5, 0, 1, 4, 2, 3, 5, 6, 7, 4, 8,
];

// ─── Solar Terms (절기) for month branch determination ──────────────────────
// Approximate day of the month when each 절기 begins (varies ±1–2 days by year)
// Jan=소한, Feb=입춘, Mar=경칩, Apr=청명, May=입하, Jun=망종
// Jul=소서, Aug=입추, Sep=백로, Oct=한로, Nov=입동, Dec=대설
const SOLAR_TERM_DAYS = [6, 4, 6, 5, 6, 6, 7, 7, 8, 8, 7, 7];

// ─── Month stem base (for 寅月) per year stem group ──────────────────────────
// 甲/己년→丙(2), 乙/庚년→戊(4), 丙/辛년→庚(6), 丁/壬년→壬(8), 戊/癸년→甲(0)
const MONTH_STEM_BASE = [2, 4, 6, 8, 0];

// ─── Korean Lunar New Year (설날) lookup ─────────────────────────────────────
// Format: [solar month, solar day] for each year's 설날
// Coverage: 1930–2030
const SEOLLAL: Record<number, [number, number]> = {
  1930: [1, 30], 1931: [2, 17], 1932: [2, 6],  1933: [1, 26], 1934: [2, 14],
  1935: [2, 4],  1936: [1, 24], 1937: [2, 11], 1938: [1, 31], 1939: [2, 19],
  1940: [2, 8],  1941: [1, 27], 1942: [2, 15], 1943: [2, 5],  1944: [1, 25],
  1945: [2, 13], 1946: [2, 2],  1947: [1, 22], 1948: [2, 10], 1949: [1, 29],
  1950: [2, 17], 1951: [2, 6],  1952: [1, 27], 1953: [2, 14], 1954: [2, 3],
  1955: [1, 24], 1956: [2, 12], 1957: [1, 31], 1958: [2, 18], 1959: [2, 8],
  1960: [1, 28], 1961: [2, 15], 1962: [2, 5],  1963: [1, 25], 1964: [2, 13],
  1965: [2, 2],  1966: [1, 21], 1967: [2, 9],  1968: [1, 30], 1969: [2, 17],
  1970: [2, 6],  1971: [1, 27], 1972: [2, 15], 1973: [2, 3],  1974: [1, 23],
  1975: [2, 11], 1976: [1, 31], 1977: [2, 18], 1978: [2, 7],  1979: [1, 28],
  1980: [2, 16], 1981: [2, 5],  1982: [1, 25], 1983: [2, 13], 1984: [2, 2],
  1985: [2, 20], 1986: [2, 9],  1987: [1, 29], 1988: [2, 17], 1989: [2, 6],
  1990: [1, 27], 1991: [2, 15], 1992: [2, 4],  1993: [1, 23], 1994: [2, 10],
  1995: [1, 31], 1996: [2, 19], 1997: [2, 7],  1998: [1, 28], 1999: [2, 16],
  2000: [2, 5],  2001: [1, 24], 2002: [2, 12], 2003: [2, 1],  2004: [1, 22],
  2005: [2, 9],  2006: [1, 29], 2007: [2, 18], 2008: [2, 7],  2009: [1, 26],
  2010: [2, 14], 2011: [2, 3],  2012: [1, 23], 2013: [2, 10], 2014: [1, 31],
  2015: [2, 19], 2016: [2, 8],  2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
  2020: [1, 25], 2021: [2, 12], 2022: [2, 1],  2023: [1, 22], 2024: [2, 10],
  2025: [1, 29], 2026: [2, 17], 2027: [2, 6],  2028: [1, 26], 2029: [2, 13],
  2030: [2, 3],
};

// ─── Location longitude table ─────────────────────────────────────────────────
const LONGITUDE_MAP: Record<string, number> = {
  서울: 126.97, 부산: 129.04, 대구: 128.60, 인천: 126.71,
  광주: 126.85, 대전: 127.38, 울산: 129.32, 세종: 127.29,
  경기: 127.11, 강원: 128.15, 충북: 127.73, 충남: 126.65,
  전북: 127.10, 전남: 126.99, 경북: 128.89, 경남: 128.25,
  제주: 126.52, 해외: 135.0,
};

// ─── Types ───────────────────────────────────────────────────────────────────

export type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export type TenGodType =
  | '비견' | '겁재'
  | '식신' | '상관'
  | '편재' | '정재'
  | '편관' | '정관'
  | '편인' | '정인';

export interface Pillar {
  stem: string;
  branch: string;
  stemKr: string;
  branchKr: string;
  stemElement: ElementType;
  branchElement: ElementType;
  stemYinYang: 'yang' | 'yin';
  branchYinYang: 'yang' | 'yin';
}

export interface ElementCount {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface TenGod {
  pillar: 'year' | 'month' | 'hour';
  position: 'stem' | 'branch';
  god: TenGodType;
  element: ElementType;
}

export interface SajuResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null;
  dayMaster: string;
  dayMasterKr: string;
  dayMasterElement: ElementType;
  dayMasterYinYang: 'yang' | 'yin';
  elements: ElementCount;
  dominantElements: ElementType[];
  weakElements: ElementType[];
  tenGods: TenGod[];
  dominantTenGods: TenGodType[];
  keywords: string[];
  personalityDescription: string;
  literaryNeed: string[];
}

export interface UserInput {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  calendarType: 'solar' | 'lunar';
  isLeapMonth: boolean;
  birthHour: number | null;
  birthMinute: number | null;
  gender: 'male' | 'female';
  birthLocation: string;
}

// ─── Lunar → Solar Conversion ─────────────────────────────────────────────────

function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth: boolean
): { year: number; month: number; day: number } {
  const seollal = SEOLLAL[lunarYear];

  if (!seollal) {
    // Fallback for years outside the table: start from ~Feb 1 of that year
    const base = new Date(lunarYear, 1, 1);
    const offset = Math.round((lunarMonth - 1) * 29.5306) + (lunarDay - 1) + (isLeapMonth ? 29 : 0);
    base.setDate(base.getDate() + offset);
    return { year: base.getFullYear(), month: base.getMonth() + 1, day: base.getDate() };
  }

  // Days from 설날: each lunar month averages 29.5306 days
  const monthOffset = Math.round((lunarMonth - 1) * 29.5306);
  // Add one extra month if it's a leap (intercalary) month
  const leapOffset = isLeapMonth ? 29 : 0;
  const totalOffset = monthOffset + leapOffset + (lunarDay - 1);

  const base = new Date(lunarYear, seollal[0] - 1, seollal[1]);
  base.setDate(base.getDate() + totalOffset);

  return { year: base.getFullYear(), month: base.getMonth() + 1, day: base.getDate() };
}

// ─── Julian Day Number ────────────────────────────────────────────────────────

function dateToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

// ─── Pillar Construction ──────────────────────────────────────────────────────

function makePillar(stemIdx: number, branchIdx: number): Pillar {
  const si = ((stemIdx % 10) + 10) % 10;
  const bi = ((branchIdx % 12) + 12) % 12;
  return {
    stem: STEMS[si],
    branch: BRANCHES[bi],
    stemKr: STEMS_KR[si],
    branchKr: BRANCHES_KR[bi],
    stemElement: STEMS_ELEMENT[si],
    branchElement: BRANCHES_ELEMENT[bi],
    stemYinYang: si % 2 === 0 ? 'yang' : 'yin',
    branchYinYang: bi % 2 === 0 ? 'yang' : 'yin',
  };
}

// ─── 입춘(立春) Precise Date Lookup ──────────────────────────────────────────
// Default: Feb 4. Exceptions where 입춘 falls on Feb 3 (KST = UTC+9).
// Affects anyone born on Feb 3 of these years — previous saju year applies.
const IPCHUN_FEB3_YEARS = new Set([
  1924, 1928,                           // pre-WWII exceptions
  2017, 2021, 2025, 2029,              // recent / near-future
]);

// ─── Saju Year (입춘 correction) ──────────────────────────────────────────────
// The year pillar changes at 입춘(立春), not on January 1.
// 입춘 is mostly Feb 4 (KST), but Feb 3 in some years — use precise lookup.
function getIpchunDay(year: number): number {
  return IPCHUN_FEB3_YEARS.has(year) ? 3 : 4;
}

function getSajuYear(year: number, month: number, day: number): number {
  const ipchunDay = getIpchunDay(year);
  if (month === 1 || (month === 2 && day < ipchunDay)) {
    return year - 1;
  }
  return year;
}

// ─── Year Pillar ──────────────────────────────────────────────────────────────

function calcYearPillar(year: number, month: number, day: number): Pillar {
  // BUG FIX: use saju year (입춘 corrected), not calendar year
  const sajuYear = getSajuYear(year, month, day);
  // Reference: 1984 = 甲子년 (stem 0, branch 0)
  const si = (sajuYear - 1984 + 6000) % 10;
  const bi = (sajuYear - 1984 + 6000) % 12;
  return makePillar(si, bi);
}

// ─── Month Pillar ─────────────────────────────────────────────────────────────

function getMonthBranch(month: number, day: number): number {
  // Before the month's 절기 → still in the previous month
  const termDay = SOLAR_TERM_DAYS[month - 1];
  const offset = day >= termDay ? 0 : -1;

  // Feb→寅(2), Mar→卯(3), ..., Jan→丑(1), Dec(after 대설)→子(0)
  const baseMap: Record<number, number> = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6,
    7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 0,
  };
  let bi = baseMap[month] + offset;
  if (bi < 0) bi = 11;
  if (bi > 11) bi = 0;
  return bi;
}

function calcMonthPillar(year: number, month: number, day: number): Pillar {
  // BUG FIX: use saju year (입춘 corrected) for year stem determination
  const sajuYear = getSajuYear(year, month, day);
  const yearStemIdx = (sajuYear - 1984 + 6000) % 10;
  const branchIdx = getMonthBranch(month, day);

  // 寅月(branch 2) stem base determined by year stem group
  const stemBase = MONTH_STEM_BASE[yearStemIdx % 5];
  // Offset from 寅月 (branch index 2)
  const offset = (branchIdx - 2 + 12) % 12;
  const stemIdx = (stemBase + offset) % 10;
  return makePillar(stemIdx, branchIdx);
}

// ─── Day Pillar ───────────────────────────────────────────────────────────────
// Reference: 2000-01-01 (JDN 2451545) = 甲戌日 (stem 0, branch 10)
// Verification: (2451545+5)%10=0(甲), (2451545+5)%12=10(戌) ✓

function calcDayPillar(year: number, month: number, day: number): Pillar {
  const jdn = dateToJDN(year, month, day);
  const stemIdx = (jdn + 5) % 10;
  const branchIdx = (jdn + 5) % 12;
  return makePillar(stemIdx, branchIdx);
}

// ─── Hour Pillar ──────────────────────────────────────────────────────────────
// 子시: 23:00–01:00, 丑시: 01:00–03:00, ..., 亥시: 21:00–23:00

function getHourBranch(hour: number): number {
  if (hour === 23) return 0; // 子
  return Math.floor((hour + 1) / 2) % 12;
}

function calcHourPillar(dayStemIdx: number, hour: number): Pillar {
  const branchIdx = getHourBranch(hour);
  // Hour stem base depends on day stem group (甲己→甲子, 乙庚→丙子, etc.)
  const stemBase = [0, 2, 4, 6, 8][dayStemIdx % 5];
  const stemIdx = (stemBase + branchIdx) % 10;
  return makePillar(stemIdx, branchIdx);
}

// ─── 진태양시 (True Solar Time) Correction ────────────────────────────────────
// Korean standard time = UTC+9 (meridian 135°E)
// Correction per location: (longitude - 135) × 4 minutes

function applyLongitudeCorrection(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  location: string
): { year: number; month: number; day: number; hour: number; minute: number } {
  const longitude = LONGITUDE_MAP[location] ?? 127.0;
  const correctionMinutes = Math.round((longitude - 135) * 4);

  let total = hour * 60 + minute + correctionMinutes;

  // Handle date boundary crossing (e.g. born just after midnight in Seoul:
  // -32 min correction may push to the previous calendar day)
  let dayOffset = 0;
  while (total < 0) { total += 1440; dayOffset--; }
  while (total >= 1440) { total -= 1440; dayOffset++; }

  let correctedDate = new Date(year, month - 1, day + dayOffset);

  return {
    year: correctedDate.getFullYear(),
    month: correctedDate.getMonth() + 1,
    day: correctedDate.getDate(),
    hour: Math.floor(total / 60),
    minute: total % 60,
  };
}

// ─── Element Counting ─────────────────────────────────────────────────────────

function countElements(pillars: (Pillar | null)[]): ElementCount {
  const counts: ElementCount = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const p of pillars) {
    if (!p) continue;
    counts[p.stemElement]++;
    counts[p.branchElement]++;
  }
  return counts;
}

// ─── Ten Gods (십성) ──────────────────────────────────────────────────────────
// Element order: wood(0)→fire(1)→earth(2)→metal(3)→water(4)→wood
// Generation: +1, Control: +2
const ELEMENT_ORDER: ElementType[] = ['wood', 'fire', 'earth', 'metal', 'water'];

function elIdx(el: ElementType): number {
  return ELEMENT_ORDER.indexOf(el);
}

function calcTenGod(dayMasterStemIdx: number, otherStemIdx: number): TenGodType {
  const dmEl = elIdx(STEMS_ELEMENT[dayMasterStemIdx]);
  const otherEl = elIdx(STEMS_ELEMENT[otherStemIdx]);
  // same yin/yang = even indices match, odd match
  const same = dayMasterStemIdx % 2 === otherStemIdx % 2;

  if (otherEl === dmEl)              return same ? '비견' : '겁재';
  if (otherEl === (dmEl + 1) % 5)   return same ? '식신' : '상관'; // I generate
  if (otherEl === (dmEl + 2) % 5)   return same ? '편재' : '정재'; // I control
  if (otherEl === (dmEl + 3) % 5)   return same ? '편관' : '정관'; // controls me
  /* (dmEl + 4) % 5 → generates me */return same ? '편인' : '정인';
}

function calcTenGods(
  dayPillar: Pillar,
  yearPillar: Pillar,
  monthPillar: Pillar,
  hourPillar: Pillar | null
): TenGod[] {
  const dmIdx = STEMS.indexOf(dayPillar.stem);
  const gods: TenGod[] = [];

  const targets: Array<{ pillar: TenGod['pillar']; p: Pillar }> = [
    { pillar: 'year', p: yearPillar },
    { pillar: 'month', p: monthPillar },
    ...(hourPillar ? [{ pillar: 'hour' as const, p: hourPillar }] : []),
  ];

  for (const { pillar, p } of targets) {
    // Stem ten god
    const stemIdx = STEMS.indexOf(p.stem);
    gods.push({
      pillar, position: 'stem',
      god: calcTenGod(dmIdx, stemIdx),
      element: STEMS_ELEMENT[stemIdx],
    });

    // Branch ten god — use correct 주기(主氣) lookup table
    // BUG FIX: Previously used branch odd/even yin-yang which is wrong for 巳,午,亥
    const branchIdx = BRANCHES.indexOf(p.branch);
    const hiddenStemIdx = BRANCH_MAIN_HIDDEN_STEM[branchIdx];
    gods.push({
      pillar, position: 'branch',
      god: calcTenGod(dmIdx, hiddenStemIdx),
      element: BRANCHES_ELEMENT[branchIdx],
    });
  }

  return gods;
}

// ─── Keyword & Description ───────────────────────────────────────────────────

const ELEMENT_KEYWORDS: Record<ElementType, string[]> = {
  wood:  ['성장', '유연함', '창의성', '새로운 시작', '인내'],
  fire:  ['열정', '표현', '직관', '생동감', '카리스마'],
  earth: ['안정', '신뢰', '실용성', '중재', '깊이'],
  metal: ['명확함', '원칙', '완벽주의', '예리함', '결단'],
  water: ['지혜', '깊이', '감수성', '성찰', '유연한 사고'],
};

const TEN_GOD_KEYWORDS: Record<TenGodType, string> = {
  비견: '독립적 정신', 겁재: '강한 의지',
  식신: '창조적 감수성', 상관: '비판적 통찰',
  편재: '모험적 기질', 정재: '현실적 감각',
  편관: '강렬한 내면', 정관: '원칙과 질서',
  편인: '독창적 사유', 정인: '지적 탐구심',
};

const ELEMENT_LITERARY_NEED: Record<ElementType, string[]> = {
  wood:  ['새로운 시작을 꿈꾸는 문장', '성장의 고통을 담은 서사', '자연과 생명을 노래하는 시'],
  fire:  ['열정과 욕망의 드라마', '삶의 온도를 높이는 이야기', '감각적이고 생동감 있는 산문'],
  earth: ['삶의 무게를 견디는 이야기', '일상의 깊이를 발견하는 문학', '공동체와 연대의 서사'],
  metal: ['예리한 사유의 문학', '구조와 형식의 아름다움', '명징한 언어로 쓴 사유'],
  water: ['감정과 기억의 내면 서사', '존재의 깊이를 탐구하는 철학소설', '고독을 견디는 시'],
};

const PERSONALITY_TEMPLATES: Partial<Record<ElementType, string[]>> = {
  wood:  [
    '목(木)의 기운이 강한 당신은 창의적이고 유연하며, 변화를 두려워하지 않는 성품을 가지고 있습니다.',
    '당신의 사주에는 성장을 향한 강한 의지가 흐릅니다. 뿌리를 내리면서도 하늘을 향해 뻗는 나무처럼 살아갑니다.',
  ],
  fire:  [
    '화(火)의 기운이 충만한 당신은 표현력이 뛰어나고 직관적입니다. 삶의 모든 순간을 빛으로 밝히려는 열망이 있습니다.',
    '당신의 사주에서는 강렬한 생명력이 느껴집니다. 감정을 숨기지 못하고, 그것이 오히려 당신의 매력이 됩니다.',
  ],
  earth: [
    '토(土)의 기운이 중심을 잡고 있는 당신은 안정과 신뢰를 중시하며, 주변 사람들에게 든든한 존재입니다.',
    '당신은 삶의 깊이를 아는 사람입니다. 빠르게 움직이지 않지만, 한번 내린 뿌리는 오래도록 흔들리지 않습니다.',
  ],
  metal: [
    '금(金)의 기운이 강한 당신은 명확하고 원칙적입니다. 본질을 꿰뚫어 보는 예리한 시선을 가지고 있습니다.',
    '당신의 사주는 정밀함과 완벽을 추구하는 성향을 보여줍니다. 때로는 그 날카로움이 스스로를 향하기도 합니다.',
  ],
  water: [
    '수(水)의 기운이 깊은 당신은 감수성이 풍부하고 사유가 깊습니다. 표면보다 본질을 바라보는 눈을 가졌습니다.',
    '당신은 고요한 물처럼 깊은 내면을 품고 있습니다. 많은 것을 느끼고, 많은 것을 혼자 소화하는 사람입니다.',
  ],
};

function generateKeywords(elements: ElementCount, dominantTenGods: TenGodType[]): string[] {
  const sorted = Object.entries(elements)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([el]) => el as ElementType);

  const elKws = sorted.flatMap((el) => ELEMENT_KEYWORDS[el].slice(0, 2));
  const tgKws = dominantTenGods.slice(0, 1).map((tg) => TEN_GOD_KEYWORDS[tg]);
  return [...new Set([...tgKws, ...elKws])].slice(0, 3);
}

function generateLiteraryNeed(weakElements: ElementType[]): string[] {
  const needs: string[] = [];
  for (const el of weakElements.slice(0, 3)) {
    needs.push(...ELEMENT_LITERARY_NEED[el]);
  }
  return [...new Set(needs)].slice(0, 4);
}

function generatePersonalityDescription(dominantEl: ElementType, dmElement: ElementType): string {
  const templates = PERSONALITY_TEMPLATES[dominantEl] ?? PERSONALITY_TEMPLATES[dmElement] ?? [];
  if (templates.length === 0)
    return '당신의 사주는 복합적인 기운을 품고 있습니다. 여러 요소가 조화를 이루며 삶의 다양한 면을 경험하게 합니다.';
  return templates[Math.floor(Math.random() * templates.length)];
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export function calculateSaju(input: UserInput): SajuResult {
  // Step 1: Resolve solar date
  let { birthYear, birthMonth, birthDay } = input;

  if (input.calendarType === 'lunar') {
    // BUG FIX: Use 설날 lookup table instead of broken formula
    const solar = lunarToSolar(birthYear, birthMonth, birthDay, input.isLeapMonth);
    birthYear = solar.year;
    birthMonth = solar.month;
    birthDay = solar.day;
  }

  // Step 2: Hour — use standard Korean time (KST) without longitude correction.
  // 진태양시(true solar time) correction changes the 시주 by ~30 min for Seoul,
  // causing disagreement with most Korean saju apps which use clock time directly.
  const solarHour   = input.birthHour;
  const solarYear   = birthYear;
  const solarMonth  = birthMonth;
  const solarDay    = birthDay;

  // Step 3: Calculate four pillars
  // 자시(子時) 일주 처리: 23:00-24:00에 태어난 경우 대부분의 만세력은
  // 다음 날의 일주(日柱)를 사용합니다. 年柱·月柱는 절기 기준이므로 그대로.
  let dayCalcYear = solarYear, dayCalcMonth = solarMonth, dayCalcDay = solarDay;
  if (solarHour === 23) {
    const next = new Date(solarYear, solarMonth - 1, solarDay + 1);
    dayCalcYear  = next.getFullYear();
    dayCalcMonth = next.getMonth() + 1;
    dayCalcDay   = next.getDate();
  }

  const yearPillar  = calcYearPillar(solarYear, solarMonth, solarDay);
  const monthPillar = calcMonthPillar(solarYear, solarMonth, solarDay);
  const dayPillar   = calcDayPillar(dayCalcYear, dayCalcMonth, dayCalcDay);

  const dayStemIdx = STEMS.indexOf(dayPillar.stem);
  const hourPillar = solarHour !== null
    ? calcHourPillar(dayStemIdx, solarHour)   // uses KST clock hour directly
    : null;

  // Step 4: Element counting
  const elements = countElements([yearPillar, monthPillar, dayPillar, hourPillar]);

  const sorted = Object.entries(elements).sort(([, a], [, b]) => b - a);
  const dominantElements = sorted
    .filter(([, v]) => v >= 2)
    .map(([k]) => k as ElementType)
    .slice(0, 2);
  const weakElements = [
    ...sorted.filter(([, v]) => v === 0).map(([k]) => k as ElementType),
    ...sorted.filter(([, v]) => v === 1).map(([k]) => k as ElementType),
  ].slice(0, 2);

  // Step 5: Ten gods
  // BUG FIX: uses correct 장간 主氣 lookup (fixes 巳·午·亥)
  const tenGods = calcTenGods(dayPillar, yearPillar, monthPillar, hourPillar);

  const godCounts = tenGods.reduce<Record<string, number>>((acc, tg) => {
    acc[tg.god] = (acc[tg.god] ?? 0) + 1;
    return acc;
  }, {});
  const dominantTenGods = Object.entries(godCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([k]) => k as TenGodType);

  // Step 6: Derived fields
  const keywords = generateKeywords(elements, dominantTenGods);
  const dominantEl = dominantElements[0] ?? STEMS_ELEMENT[dayStemIdx];
  const personalityDescription = generatePersonalityDescription(dominantEl, STEMS_ELEMENT[dayStemIdx]);
  const literaryNeed = generateLiteraryNeed(
    weakElements.length > 0 ? weakElements : [dominantElements[1] ?? 'water']
  );

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster: dayPillar.stem,
    dayMasterKr: dayPillar.stemKr,
    dayMasterElement: STEMS_ELEMENT[dayStemIdx],
    dayMasterYinYang: dayStemIdx % 2 === 0 ? 'yang' : 'yin',
    elements,
    dominantElements,
    weakElements,
    tenGods,
    dominantTenGods,
    keywords,
    personalityDescription,
    literaryNeed,
  };
}
