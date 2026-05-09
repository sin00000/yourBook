import type { NextConfig } from 'next';

// GitHub Pages 정적 빌드 시에만 output: export 적용.
// 로컬 dev · Vercel 배포에서는 서버 모드로 동작하며 /api/aladin 이 정상 작동.
// GitHub Actions 에서는 NEXT_EXPORT=true 를 환경변수로 설정하세요.
const isStaticExport = process.env.NEXT_EXPORT === 'true';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? { output: 'export', trailingSlash: true }
    : {}),
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    // 정적 export 시 최적화 서버 불필요 → unoptimized
    unoptimized: isStaticExport,
    remotePatterns: [
      { protocol: 'https', hostname: 'image.aladin.co.kr',    pathname: '/**' },
      { protocol: 'http',  hostname: 'image.aladin.co.kr',    pathname: '/**' },
      { protocol: 'https', hostname: 'books.google.com',      pathname: '/**' },
      { protocol: 'https', hostname: '*.googleusercontent.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
