import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Noto_Serif_KR, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-noto-serif',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '문학사주 — 당신이 읽어야 할 문장',
  description:
    '사주를 분석해 지금 당신의 삶에 어울리는 문학 작품을 큐레이션합니다. 운명이 아닌, 당신에게 필요한 문장을 찾아드립니다.',
  openGraph: {
    title: '문학사주',
    description: '사주로 읽는 나의 문학',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${notoSerifKR.variable} ${cormorant.variable}`}
    >
      <body style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif KR', serif" }}>
        {children}
      </body>
    </html>
  );
}
