import { NextRequest, NextResponse } from 'next/server';


export interface AladinBookData {
  cover: string | null;
  link: string | null;
  isbn13: string | null;
  publisher: string | null;
}

// Simple string similarity (Jaccard-like, character bigrams)
function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const normalize = (s: string) => s.replace(/[^\w가-힣]/g, '').toLowerCase();
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.8;
  const setA = new Set(na.split(''));
  const setB = new Set(nb.split(''));
  const intersection = [...setA].filter((c) => setB.has(c)).length;
  return intersection / Math.max(setA.size, setB.size);
}

export async function GET(request: NextRequest): Promise<NextResponse<AladinBookData>> {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title');
  const author = searchParams.get('author');

  if (!title) {
    return NextResponse.json({ cover: null, link: null, isbn13: null, publisher: null });
  }

  const ttbKey = process.env.ALADIN_TTB_KEY;
  if (!ttbKey) {
    // Return empty so the client shows placeholder
    return NextResponse.json({ cover: null, link: null, isbn13: null, publisher: null });
  }

  try {
    const query = encodeURIComponent(title);
    const apiUrl =
      `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx` +
      `?ttbkey=${ttbKey}` +
      `&Query=${query}` +
      `&QueryType=Title` +
      `&MaxResults=10` +
      `&start=1` +
      `&SearchTarget=Book` +
      `&output=js` +
      `&Version=20131101` +
      `&Cover=Big`;

    const res = await fetch(apiUrl, {
      next: { revalidate: 86400 }, // Cache for 24 hours
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!res.ok) {
      return NextResponse.json({ cover: null, link: null, isbn13: null, publisher: null });
    }

    const text = await res.text();
    // Aladin returns JS-like format, parse as JSON
    const data = JSON.parse(text);

    if (!data?.item?.length) {
      return NextResponse.json({ cover: null, link: null, isbn13: null, publisher: null });
    }

    // Find best match by title similarity
    const items = data.item as Array<{
      title: string;
      author: string;
      cover: string;
      link: string;
      isbn13: string;
      publisher: string;
    }>;

    items.sort((a, b) => {
      const scoreA = similarity(a.title, title) + (author ? similarity(a.author, author) * 0.3 : 0);
      const scoreB = similarity(b.title, title) + (author ? similarity(b.author, author) * 0.3 : 0);
      return scoreB - scoreA;
    });

    const best = items[0];

    // Upgrade cover to big size if possible
    const cover = best.cover?.replace(/cover\d*\.jpg/, 'cover500.jpg') ?? best.cover ?? null;

    return NextResponse.json({
      cover,
      link: best.link ?? null,
      isbn13: best.isbn13 ?? null,
      publisher: best.publisher ?? null,
    });
  } catch {
    return NextResponse.json({ cover: null, link: null, isbn13: null, publisher: null });
  }
}
