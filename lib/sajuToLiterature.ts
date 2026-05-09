import type { SajuResult, ElementType } from '@/utils/saju';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LiteraryKeyword {
  title: string;
  description: string;
  relatedElement: ElementType;
}

export interface LiteraryNarrative {
  paragraphs: string[];
  keywords: LiteraryKeyword[];
  bookingDirection: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EL_KR: Record<ElementType, string> = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
const EL_CHAR: Record<ElementType, string> = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };
const EL_COLOR: Record<ElementType, string> = {
  wood: '#4a7042', fire: '#8b3a3a', earth: '#7a6035', metal: '#6a7a82', water: '#2d4a68',
};

export { EL_KR, EL_CHAR, EL_COLOR };

// ─── Day Master Descriptions ──────────────────────────────────────────────────

const DAY_MASTER: Record<string, { base: string; literary: string }> = {
  '甲': {
    base: '당신의 일간은 갑목(甲木)입니다. 하늘을 향해 곧게 자라는 큰 나무처럼, 자신만의 방향성과 뚜렷한 기준을 중시하는 기질을 가지고 있습니다. 한번 뿌리를 내린 곳에서는 쉽게 흔들리지 않으며, 외부의 시선보다 내면의 확신을 따르는 경향이 있습니다.',
    literary: '이상을 향해 나아가는 서사, 혹은 내면의 확신과 외부의 압력이 충돌하는 이야기에서 특히 강한 공명을 느끼는 경향이 있습니다.',
  },
  '乙': {
    base: '당신의 일간은 을목(乙木)입니다. 바람에도 꺾이지 않는 유연한 덩굴처럼, 상황에 따라 몸을 구부리면서도 자신의 본질을 잃지 않는 섬세한 적응력을 가지고 있습니다. 관계 안에서 타인의 감정을 정교하게 읽어내는 능력이 뛰어납니다.',
    literary: '인물 간의 심리적 미묘함, 혹은 관계의 균형이 흔들리는 순간을 섬세하게 포착한 문학에서 깊은 울림을 느끼는 경향이 있습니다.',
  },
  '丙': {
    base: '당신의 일간은 병화(丙火)입니다. 태양처럼 주변을 밝히는 직접적인 에너지를 가진 사람입니다. 표현이 분명하고 영향력이 있으며, 어둠보다 빛을 향해 먼저 움직이는 성향이 있습니다.',
    literary: '강렬한 인물이 세계와 맞부딪히는 이야기, 혹은 빛과 어둠의 대비 속에서 자신을 표현하는 주인공의 서사에 자연스럽게 이끌리는 경향이 있습니다.',
  },
  '丁': {
    base: '당신의 일간은 정화(丁火)입니다. 태양보다 작지만 어둠 속에서 더 또렷한 등불처럼, 내향적이지만 깊고 오래가는 열정을 품고 있습니다. 자신이 사랑하는 것을 위해 묵묵히, 그러나 끝까지 타오르는 헌신이 있습니다.',
    literary: '드러나지 않는 내면의 헌신, 조용하게 타오르는 감정, 혹은 관계 안에서의 섬세한 사랑을 다룬 문학에서 깊은 공명을 느끼는 경향이 있습니다.',
  },
  '戊': {
    base: '당신의 일간은 무토(戊土)입니다. 높은 산처럼 안정적이고 묵직한 존재감을 지닌 사람입니다. 주변에 기대는 사람들을 자연스럽게 받아들이는 포용력이 있으며, 한번 신뢰를 형성하면 그 깊이가 오래 지속됩니다.',
    literary: '공동체와 관계를 중심으로 한 이야기, 혹은 세대와 시간을 가로지르는 넓은 서사에서 깊은 울림을 느끼는 경향이 있습니다.',
  },
  '己': {
    base: '당신의 일간은 기토(己土)입니다. 낮고 평평한 대지처럼 어디서든 무언가를 자라게 하는 섬세한 포용력이 있습니다. 실용적이고 세심하며, 사람들의 필요를 먼저 알아채는 감각이 있습니다.',
    literary: '일상의 작은 디테일에서 삶의 의미를 발견하는 문학, 혹은 평범한 사람들의 삶을 세밀하게 그려낸 이야기에 자연스럽게 끌리는 경향이 있습니다.',
  },
  '庚': {
    base: '당신의 일간은 경금(庚金)입니다. 단호하고 직접적이며 불필요한 것을 잘라내는 결단력이 있습니다. 원칙과 기준이 명확하고, 자신이 옳다고 판단하는 것에 대해서는 강한 일관성을 유지합니다.',
    literary: '강한 신념과 도덕적 선택의 무게를 다루는 문학, 혹은 원칙과 현실이 충돌하는 서사에서 강한 감응을 느끼는 경향이 있습니다.',
  },
  '辛': {
    base: '당신의 일간은 신금(辛金)입니다. 잘 연마된 보석처럼 예리하고 섬세한 감각을 가지고 있습니다. 표면 아래를 꿰뚫어 보는 관찰력이 있으며, 자신만의 미의식과 기준이 분명합니다.',
    literary: '언어 자체의 아름다움과 정밀함이 있는 문학, 혹은 인물의 심리를 세밀하게 해부하는 작품에서 강한 공명을 느끼는 경향이 있습니다.',
  },
  '壬': {
    base: '당신의 일간은 임수(壬水)입니다. 깊고 넓은 강처럼 다양한 관점을 수용하는 유연한 지성이 있습니다. 표면적으로는 조용해 보이지만 그 안에 많은 것을 담고 있으며, 깊이 있는 사유를 즐깁니다.',
    literary: '철학적 깊이가 있는 문학, 혹은 다층적인 서사 구조를 가진 작품에서 자연스럽게 편안함을 느끼는 경향이 있습니다.',
  },
  '癸': {
    base: '당신의 일간은 계수(癸水)입니다. 이슬비처럼 조용하지만 대지를 촉촉하게 적시는 섬세한 감수성이 있습니다. 말하지 않지만 깊이 느끼며, 자신만의 내면 언어로 세계를 해석합니다.',
    literary: '행간에 감정이 스며 있는 문학, 혹은 시처럼 압축된 언어로 쓰인 작품에서 강한 울림을 느끼는 경향이 있습니다.',
  },
};

const DEFAULT_DAY_MASTER = {
  base: '당신의 사주에는 복합적인 기운이 흐르고 있습니다. 여러 오행이 다양하게 얽혀 있어, 단순하게 정의되지 않는 풍부한 내면을 가지고 있습니다.',
  literary: '다양한 장르와 형식의 문학에서 공명을 느낄 수 있는 넓은 감수성을 가지고 있습니다.',
};

// ─── Dominant Element Descriptions ───────────────────────────────────────────

const DOM_EL: Record<ElementType, [string, string]> = {
  wood: [
    '사주 전반에서 목(木)의 기운이 두드러집니다. 성장과 확장에 대한 자연스러운 욕구를 가지고 있으며, 새로운 것을 시작하는 데 두려움이 적고 가능성을 먼저 보는 낙관적인 시각이 있습니다. 창의적으로 문제를 풀어나가는 능력과 방향을 향해 나아가는 추진력이 있습니다.',
    '그러나 목기가 과도할 때는 방향이 너무 많아 에너지가 분산되거나, 현실적 제약보다 이상을 먼저 쫓는 경향이 나타날 수 있습니다. 뿌리보다 가지를 먼저 뻗으려는 조급함이 생기기도 하며, 이것이 때로 삶의 기반을 흔들 수 있습니다.',
  ],
  fire: [
    '사주 전반에서 화(火)의 기운이 두드러집니다. 표현력과 열정이 풍부하고, 감정을 억누르지 않고 직접적으로 드러내는 경향이 있습니다. 인간관계에서도 먼저 다가가는 에너지가 있고, 주변을 밝히는 존재감이 자연스럽게 형성됩니다.',
    '그러나 화기가 과도할 때는 감정의 기복이 심해지거나, 끊임없는 에너지 소모로 번아웃에 취약해질 수 있습니다. 타오르는 만큼 빠르게 식는 경향도 있어, 지속적인 동기를 유지하는 것이 과제가 되기도 합니다.',
  ],
  earth: [
    '사주 전반에서 토(土)의 기운이 두드러집니다. 안정감과 신뢰를 중심에 두는 사람으로, 쉽게 흔들리지 않으며 주변 사람들에게 든든한 존재가 되려 합니다. 실용적이고 현실적인 판단력이 있으며, 지속적인 관계를 소중히 여깁니다.',
    '그러나 토기가 과도할 때는 변화에 저항하거나, 익숙한 것에 지나치게 머무르려는 경향이 나타날 수 있습니다. 안정이 지나쳐 정체되는 느낌이 생기기도 하며, 새로운 가능성을 스스로 닫아버리는 경우가 있습니다.',
  ],
  metal: [
    '사주 전반에서 금(金)의 기운이 두드러집니다. 명확한 기준과 원칙을 가진 사람으로, 논리적이고 구조적으로 사고합니다. 불필요한 것을 걸러내는 날카로운 판단력이 있으며, 언어의 정밀함과 비판적 사고가 발달해 있습니다.',
    '하지만 금기가 과도할 때는 타인과의 관계에서 차갑게 보이거나, 감정적 유연성이 부족해지는 경향이 나타날 수 있습니다. 옳고 그름의 기준이 너무 단단해져 스스로도 그 안에 갇히는 경우가 있으며, 그 예리함이 때로 자신을 향하기도 합니다.',
  ],
  water: [
    '사주 전반에서 수(水)의 기운이 두드러집니다. 깊은 감수성과 풍부한 내면세계를 가지고 있으며, 많은 것을 느끼고 혼자 오래 생각합니다. 표면적인 것보다 본질에 관심을 기울이며, 직관이 발달해 있습니다.',
    '하지만 수기가 과도할 때는 과도한 자기 성찰로 행동력이 약해지거나, 감정의 흐름에 지나치게 빠져드는 경향이 나타날 수 있습니다. 생각이 행동보다 앞서서 멈추는 순간이 많아지기도 합니다.',
  ],
};

// ─── Weak Element Descriptions ───────────────────────────────────────────────

const WEAK_EL: Record<ElementType, [string, string]> = {
  wood: [
    '반면 목(木)의 기운이 부족합니다. 새로운 시작에 대한 의욕이나 자기 확장의 감각이 낮아진 상태일 수 있습니다. 변화를 원하지만 첫 발을 떼는 것이 어렵게 느껴지거나, 가능성을 볼 때 기대보다 두려움이 먼저 오는 경향이 있을 수 있습니다.',
    '이런 상태에서는 성장의 서사, 새로운 방향을 찾아가는 인물의 이야기, 혹은 막혀 있던 삶이 다시 움직이기 시작하는 문학이 내면에 깊이 닿을 수 있습니다. 그런 이야기들이 당신 안에서 잠들어 있는 가능성의 감각을 깨울 수 있습니다.',
  ],
  fire: [
    '반면 화(火)의 기운이 부족합니다. 삶의 온기와 열정이 낮아진 상태일 수 있습니다. 모든 것이 의무처럼 느껴지거나, 예전에 느꼈던 기쁨과 흥미가 무뎌진 시기일 수 있습니다. 감각이 전반적으로 수그러든 상태일 수 있습니다.',
    '이런 상태의 당신에게는 삶의 의지와 생명력을 자극하는 문학, 감각적으로 풍부한 서사, 혹은 인물의 열정이 페이지를 달구는 이야기가 내면을 다시 깨울 수 있습니다. 이야기 속 온기가 독자에게 전해지는 작품들이 지금 필요합니다.',
  ],
  earth: [
    '반면 토(土)의 기운이 부족합니다. 삶의 중심을 잡는 일이 어렵게 느껴지는 시기일 수 있습니다. 일상이 낯설거나, 발붙일 곳이 없다는 막연한 불안이 찾아오기도 합니다. 작은 것들이 의미를 잃은 것처럼 느껴질 수 있습니다.',
    '이런 상태의 당신에게는 일상의 리듬과 공동체의 온기를 담은 문학, 혹은 사람들이 어떻게 뿌리를 내리고 살아가는지를 보여주는 서사가 안정감을 회복하는 데 도움이 될 수 있습니다.',
  ],
  metal: [
    '반면 금(金)의 기운이 부족합니다. 자신만의 기준이나 방향이 흐릿하게 느껴지는 시기일 수 있습니다. 결단을 내리기 어렵거나, 무엇이 옳고 그른지에 대한 감각이 무뎌진 상태일 수 있습니다. 판단이 자꾸 흔들리는 느낌이 들기도 합니다.',
    '이런 상태의 당신에게는 명확한 언어로 쓰인 문학, 원칙과 가치에 대한 고민을 진지하게 다루는 서사, 혹은 주인공이 자신만의 기준을 세워가는 이야기가 내면의 중심을 다잡는 데 도움이 될 수 있습니다.',
  ],
  water: [
    '반면 수(水)의 기운이 부족합니다. 자신의 내면을 들여다보거나 감정을 부드럽게 흘려보내는 일이 어려울 수 있습니다. 강하고 날카롭게 판단하지만, 그 예리함이 때로 스스로를 향해 돌아오기도 합니다. 감정을 소화하기보다 쌓아두는 경향이 있을 수 있습니다.',
    '이런 상태의 당신에게는 감정의 층위를 천천히 따라가게 만드는 문학, 기억과 내면의 흐름을 탐구하는 서사, 혹은 인물의 내면이 깊이 파고드는 이야기가 필요합니다. 사건이 많은 소설보다, 존재의 밀도가 높은 작품이 지금 당신에게 더 깊이 닿을 것입니다.',
  ],
};

// ─── Element Combination Descriptions ────────────────────────────────────────

const COMBINATION: Partial<Record<string, string>> = {
  'metal-water': '이 두 기운의 불균형은 예리한 이성과 깊은 감수성이 서로를 막는 형태로 나타납니다. 생각은 많지만 그것이 감정을 통해 자연스럽게 흐르지 않아, 내면에 막힘이 생기기 쉽습니다. 분석과 느낌 사이 어딘가에서 자주 멈추게 됩니다.',
  'metal-fire': '이 조합은 차가운 판단력과 따뜻한 열정 사이의 긴장감으로 특징지어집니다. 원칙을 따르면서도 그 안에서 감각을 잃지 않으려는 내면의 갈등이 있을 수 있으며, 이 둘이 균형을 이룰 때 가장 풍요로운 내면이 만들어집니다.',
  'metal-wood': '이 조합은 구조를 사랑하면서도 새로운 가능성에 이끌리는 내면의 모순을 가지고 있습니다. 정리하고 싶지만 동시에 뻗어나가고 싶은 욕구가 공존하며, 이 긴장 속에서 창의성이 피어나는 경향이 있습니다.',
  'water-fire': '이 조합은 깊은 내면과 외향적 표현 사이의 불균형입니다. 느끼는 것이 많지만 그것을 바깥으로 내보내는 에너지가 부족하거나, 반대로 너무 많이 소진되어 내면이 고갈된 상태가 번갈아 나타날 수 있습니다.',
  'water-wood': '이 조합은 사유와 행동 사이의 거리감으로 나타납니다. 많이 생각하지만 그 생각을 실제 삶에서 움직임으로 이어가는 것이 어려울 수 있습니다. 내면의 세계가 풍부한 만큼, 그것을 바깥으로 꺼내는 용기가 필요한 시기입니다.',
  'fire-water': '이 조합은 열정과 감수성이 모두 약해진 상태입니다. 삶의 온기도, 내면의 깊이도 함께 필요한 시기로, 두 가지를 동시에 채울 수 있는 문학이 지금 가장 필요합니다.',
  'fire-metal': '이 조합은 따뜻한 열정이 날카로운 기준에 의해 억제되는 상태입니다. 느끼는 것과 판단하는 것 사이에서 스스로를 검열하는 경향이 있을 수 있으며, 감정을 있는 그대로 허용하는 연습이 필요한 시기입니다.',
  'wood-water': '이 조합은 성장하고 싶지만 내면의 흐름도 막혀 있는 복잡한 상태입니다. 앞으로 나아가고 싶은 마음과 자신을 돌아보고 싶은 마음이 동시에 있어, 두 가지 모두를 담은 문학이 지금 도움이 됩니다.',
  'wood-metal': '이 조합은 가능성을 향해 뻗으면서도 기준과 원칙이 그것을 제한하는 긴장감이 있습니다. 이상과 현실적 판단 사이에서 스스로를 제한하는 경향이 나타날 수 있습니다.',
  'earth-wood': '이 조합은 안정을 원하면서도 새로운 시작에 대한 열망이 있는 상태입니다. 머물고 싶지만 동시에 뻗어나가고 싶은 내면의 긴장이 있을 수 있으며, 이 둘의 균형을 찾는 것이 지금의 과제입니다.',
  'earth-fire': '이 조합은 일상에 갇힌 느낌과 그것을 벗어나고 싶은 욕구 사이의 긴장입니다. 안정 속에서도 생동감을 잃지 않는 방법을 탐색하는 문학이 지금 당신에게 필요할 수 있습니다.',
};

// ─── Literary Tendency ────────────────────────────────────────────────────────

const LITERARY_TENDENCY: Record<ElementType, string> = {
  wood: '성장 소설, 자아 발견의 서사, 혹은 새로운 세계를 탐험하는 주인공의 이야기에 자연스럽게 끌리는 경향이 있습니다. 막혀 있던 무언가가 열리는 순간, 혹은 인물이 자신만의 방향을 찾아가는 과정에서 특히 강한 감동을 느끼는 경향이 있습니다.',
  fire: '강렬한 감정이 살아 있는 이야기, 열정적인 인물이 세계와 맞부딪히는 서사, 혹은 삶의 의지와 욕망이 생생하게 구현된 문학에 이끌리는 경향이 있습니다. 차갑고 냉담한 서사보다는 온기와 생동감이 느껴지는 작품에서 더 깊은 공감을 느낍니다.',
  earth: '공동체와 관계를 중심으로 한 이야기, 시간의 흐름 속에서 삶이 쌓여가는 서사, 혹은 일상의 소소한 디테일에서 의미를 발견하는 문학에 깊은 공감을 느끼는 경향이 있습니다.',
  metal: '논리적 구조가 탄탄한 서사, 도덕적 딜레마를 진지하게 탐구하는 문학, 혹은 언어의 정밀함이 돋보이는 작품에 이끌리는 경향이 있습니다. 가벼운 이야기보다 사유의 밀도가 높은 작품을 선호하는 경향이 있습니다.',
  water: '심리적 깊이가 있는 소설, 기억과 감각을 탐구하는 서사, 혹은 인물의 내면이 복잡하게 펼쳐지는 작품에서 자연스럽게 편안함을 느끼는 경향이 있습니다. 사건보다 감정의 질감을 따라가는 문학에서 더 큰 울림을 느낍니다.',
};

// ─── Literary Need Statements ─────────────────────────────────────────────────

const LITERARY_NEED: Record<ElementType, string> = {
  wood: '지금의 당신에게는 성장의 감각을 다시 열어줄 문학이 필요합니다. 막힌 곳에서 뚫고 나오는 이야기, 혹은 다시 시작할 수 있다는 가능성을 보여주는 서사가 지금 가장 깊이 울릴 것입니다. 결말이 완벽하지 않더라도, 계속 나아가는 인물의 이야기가 지금 당신 안의 무언가를 움직일 수 있습니다.',
  fire: '지금의 당신에게는 삶의 온기와 의지를 되살려줄 문학이 필요합니다. 사건이 많은 소설보다, 인물의 생동감과 감각이 살아 있는 작품이 지금 당신의 내면을 깨울 수 있습니다. 읽는 동안 삶이 아직 뜨겁다는 것을 다시 느낄 수 있는 이야기가 필요합니다.',
  earth: '지금의 당신에게는 일상의 안정감과 연결감을 회복하게 해줄 문학이 필요합니다. 뿌리 있는 삶, 공동체, 그리고 관계의 온기를 담은 서사가 지금 당신에게 닿을 것입니다. 화려하지 않아도 지속되는 삶의 아름다움을 보여주는 이야기가 지금 가장 필요합니다.',
  metal: '지금의 당신에게는 명확한 언어와 자신만의 기준을 다시 세울 수 있도록 도와주는 문학이 필요합니다. 가치와 원칙을 진지하게 탐구하는 서사, 혹은 주인공이 자신만의 방향을 찾아가는 이야기가 내면의 중심을 다잡는 데 도움이 될 것입니다.',
  water: '지금의 당신에게는 감정을 천천히 흘려보내도록 도와주는 문학이 필요합니다. 사건이 많은 소설보다, 감정의 층위를 따라가게 만드는 작품, 내면의 소리에 귀를 기울이게 하는 이야기가 지금 당신에게 필요한 처방입니다. 그 안에서 당신이 오래 혼자 품어온 것들이 자연스럽게 흘러갈 수 있을 것입니다.',
};

// ─── Narrative Generation ─────────────────────────────────────────────────────

export function generateNarrative(saju: SajuResult): LiteraryNarrative {
  const dayMasterDesc = DAY_MASTER[saju.dayMaster] ?? DEFAULT_DAY_MASTER;
  const dominantEl = saju.dominantElements[0];
  const weakEl = saju.weakElements[0];

  const paragraphs: string[] = [];

  // P1: Day master description
  paragraphs.push(dayMasterDesc.base);

  // P2-3: Dominant element
  if (dominantEl && DOM_EL[dominantEl]) {
    paragraphs.push(DOM_EL[dominantEl][0]);
    paragraphs.push(DOM_EL[dominantEl][1]);
  } else {
    paragraphs.push(
      '사주 전체에 걸쳐 여러 오행이 비교적 고르게 분포되어 있습니다. 이는 어느 한쪽으로 치우치지 않는 균형 잡힌 내면을 의미하지만, 동시에 뚜렷한 중심을 잡기가 어렵게 느껴질 수도 있습니다.'
    );
  }

  // P4-5: Weak element
  if (weakEl && WEAK_EL[weakEl]) {
    paragraphs.push(WEAK_EL[weakEl][0]);
    paragraphs.push(WEAK_EL[weakEl][1]);
  } else if (saju.weakElements.length === 0) {
    paragraphs.push(
      '오행이 비교적 고르게 분포되어 있어 어느 한 기운이 극단적으로 부족하지는 않습니다. 다만, 균형을 유지하는 것 자체가 에너지를 요구하는 일임을 인식하는 것이 중요합니다. 지금 당신에게는 이미 가진 균형을 더 깊이 탐구하는 문학이 필요합니다.'
    );
  }

  // P6: Combination description
  if (dominantEl && weakEl) {
    const key = `${dominantEl}-${weakEl}`;
    const combo = COMBINATION[key];
    if (combo) paragraphs.push(combo);
  }

  // P7: Literary tendency
  if (dominantEl) {
    paragraphs.push(`자연스럽게 당신은 ${LITERARY_TENDENCY[dominantEl]}`);
  }

  // P8: Day master literary tendency
  paragraphs.push(dayMasterDesc.literary);

  // P9: Literary need (closing statement)
  if (weakEl) {
    paragraphs.push(LITERARY_NEED[weakEl]);
  } else if (dominantEl) {
    const elName = `${EL_KR[dominantEl]}(${EL_CHAR[dominantEl]})`;
    paragraphs.push(
      `지금의 당신에게는 강한 ${elName}의 기운과 조화를 이루는 문학이 필요합니다. 이미 가진 감각을 더욱 깊이 탐구하는 동시에, 그 안에서 새로운 균형을 찾아가는 작품을 만날 때입니다.`
    );
  }

  // Generate keywords
  const keywords = generateKeywords(saju, weakEl, dominantEl);

  // Booking direction
  const bookingDirection = weakEl
    ? `${EL_KR[weakEl]}(${EL_CHAR[weakEl]})의 기운을 보완하면서도 당신의 감수성과 공명하는 문학`
    : dominantEl
    ? `${EL_KR[dominantEl]}(${EL_CHAR[dominantEl]})의 기운이 가진 깊이를 탐구하는 문학`
    : '균형 있는 내면을 더욱 풍요롭게 만드는 문학';

  return { paragraphs, keywords, bookingDirection };
}

// ─── Keyword Generation ───────────────────────────────────────────────────────

function generateKeywords(
  saju: SajuResult,
  weakEl: ElementType | undefined,
  dominantEl: ElementType | undefined
): LiteraryKeyword[] {
  const keywords: LiteraryKeyword[] = [];

  // Keyword 1: From weak element
  if (weakEl) {
    const map: Record<ElementType, LiteraryKeyword> = {
      wood: { title: '다시 움직이기 시작하는 감각을 회복하는 문장', description: '성장의 의욕이 낮아진 지금, 막힌 곳을 뚫고 나아가는 인물의 이야기가 당신 안의 움직임을 다시 깨울 수 있습니다.', relatedElement: 'wood' },
      fire: { title: '삶의 온도를 다시 올리는 이야기', description: '열정과 생동감이 필요한 시기에는, 강렬하게 살아가는 인물의 감각이 독자의 내면에도 불씨를 남깁니다.', relatedElement: 'fire' },
      earth: { title: '뿌리 내리는 감각을 되찾는 서사', description: '흔들리는 지금, 일상의 리듬과 인간관계의 온기를 담은 문학이 땅에 다시 발을 딛게 해줍니다.', relatedElement: 'earth' },
      metal: { title: '명확한 언어로 나를 다시 세우는 문학', description: '방향이 흐릿할 때는 자신의 기준을 진지하게 탐구한 작품이 내면의 중심을 다잡는 데 도움이 됩니다.', relatedElement: 'metal' },
      water: { title: '감정을 천천히 흘려보내는 문장', description: '막혀 있는 감정을 억누르지 않고, 감수성이 풍부한 서사가 내면의 흐름을 부드럽게 열어줄 수 있습니다.', relatedElement: 'water' },
    };
    keywords.push(map[weakEl]);
  }

  // Keyword 2: From second weak element or dominant counter
  const secondWeak = saju.weakElements[1];
  if (secondWeak) {
    const map: Record<ElementType, LiteraryKeyword> = {
      wood: { title: '새로운 가능성을 향해 뻗어나가는 이야기', description: '뻗어나가고 싶은 욕구가 막혀 있을 때, 성장의 여정을 담은 서사가 자기 확장의 감각을 일깨웁니다.', relatedElement: 'wood' },
      fire: { title: '생동감과 감각을 되살리는 서사', description: '무뎌진 감각을 깨우기 위해, 인물의 열정과 생명력이 살아 있는 이야기가 필요합니다.', relatedElement: 'fire' },
      earth: { title: '일상의 깊이를 발견하는 문학', description: '평범한 것들 안에 숨어 있는 의미를 포착하는 문학이 지금 당신의 일상을 다르게 보이게 합니다.', relatedElement: 'earth' },
      metal: { title: '예리한 사유로 삶을 다시 보는 작품', description: '방향이 없을 때, 명징한 언어와 논리적 구조가 있는 문학이 균형을 잡아줍니다.', relatedElement: 'metal' },
      water: { title: '내면의 깊이를 탐구하는 서사', description: '자신의 내면을 들여다볼 공간이 필요할 때, 기억과 감정을 따라가는 문학이 그 여정을 안내합니다.', relatedElement: 'water' },
    };
    keywords.push(map[secondWeak]);
  } else if (dominantEl) {
    const map: Record<ElementType, LiteraryKeyword> = {
      wood: { title: '성장의 에너지를 더 깊게 만드는 문학', description: '이미 가진 성장의 에너지에 깊이를 더해줄 서사가 당신의 방향에 풍요로움을 더합니다.', relatedElement: 'wood' },
      fire: { title: '열정을 오래가게 하는 이야기', description: '타오르는 에너지를 지속하기 위해, 내면의 지속성을 담은 서사가 도움이 됩니다.', relatedElement: 'fire' },
      earth: { title: '안정 속에서 변화를 허용하는 서사', description: '안정을 중심으로 삼되, 새로운 가능성을 받아들이는 이야기가 당신의 세계를 넓혀줄 수 있습니다.', relatedElement: 'earth' },
      metal: { title: '날카로운 사고를 부드럽게 하는 서사', description: '지나치게 예리한 판단이 스스로를 향할 때, 감성적 유연함을 담은 문학이 균형을 이루어줍니다.', relatedElement: 'metal' },
      water: { title: '깊은 사유를 행동으로 이어주는 문학', description: '생각이 깊어질수록 행동이 어려울 때, 사유와 실천이 균형을 이루는 서사가 내면의 흐름을 이어줍니다.', relatedElement: 'water' },
    };
    keywords.push(map[dominantEl]);
  }

  // Keyword 3: From ten god
  const tgKeyword = getTenGodKeyword(saju.dominantTenGods[0]);
  if (tgKeyword) keywords.push(tgKeyword);

  return keywords.slice(0, 3);
}

function getTenGodKeyword(tg?: string): LiteraryKeyword | null {
  const map: Partial<Record<string, LiteraryKeyword>> = {
    '비견': { title: '독립적인 정신을 담은 이야기', description: '자신의 길을 혼자서 걸어가는 인물의 서사가 당신 안의 독립적 정신과 깊이 공명합니다.', relatedElement: 'wood' },
    '겁재': { title: '강한 의지와 경쟁의 서사', description: '어려움을 통해 단련되는 인물의 이야기에서, 당신은 자신의 의지를 확인하고 다시 일어서는 힘을 얻습니다.', relatedElement: 'fire' },
    '식신': { title: '창조와 표현의 기쁨을 담은 문학', description: '삶을 즐기고 자신을 표현하는 것에서 의미를 찾는 인물의 이야기가 당신의 감수성을 풍요롭게 합니다.', relatedElement: 'fire' },
    '상관': { title: '기존의 질서에 도전하는 서사', description: '관습을 벗어나 자신만의 언어를 찾는 인물의 이야기가, 당신의 비판적 통찰과 공명합니다.', relatedElement: 'metal' },
    '편재': { title: '세계를 향해 뻗어나가는 모험의 서사', description: '다양한 세계와 경험을 탐험하는 이야기에서, 당신의 모험적 기질이 살아납니다.', relatedElement: 'wood' },
    '정재': { title: '일상의 가치를 발견하는 이야기', description: '현실 안에서 의미를 찾고 책임을 다하는 인물의 서사가 당신의 실용적 감각과 공명합니다.', relatedElement: 'earth' },
    '편관': { title: '권력과 내면의 갈등을 담은 서사', description: '강한 압력 속에서 자신을 지키거나 무너지는 인물의 이야기에서, 당신은 강렬한 감응을 느낍니다.', relatedElement: 'metal' },
    '정관': { title: '원칙과 질서 안에서의 서사', description: '도덕적 책임과 사회적 역할을 진지하게 탐구하는 이야기에서 당신은 깊은 공명을 느낍니다.', relatedElement: 'metal' },
    '편인': { title: '독창적인 사유와 신비를 담은 문학', description: '일반적인 논리를 벗어난 독특한 세계관을 가진 작품에서 당신은 특별한 울림을 느낍니다.', relatedElement: 'water' },
    '정인': { title: '지혜와 배움의 여정을 담은 서사', description: '지적 탐구와 성찰의 과정을 담은 문학이 당신의 지식에 대한 열망과 깊이 연결됩니다.', relatedElement: 'water' },
  };
  return tg ? map[tg] ?? null : null;
}
