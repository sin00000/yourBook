'use client';

import { motion } from 'framer-motion';

const ELEMENTS = [
  { label: '木', kr: '목', color: '#4a7042', angle: -90 },
  { label: '火', kr: '화', color: '#8b3a3a', angle: -90 + 72 },
  { label: '土', kr: '토', color: '#7a6035', angle: -90 + 144 },
  { label: '金', kr: '금', color: '#6a7a82', angle: -90 + 216 },
  { label: '水', kr: '수', color: '#2d4a68', angle: -90 + 288 },
];

const toRad = (deg: number) => (deg * Math.PI) / 180;
const R = 80;
const CR = 100;

export default function OhangWheel({ size = 240 }: { size?: number }) {
  const scale = size / 240;

  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ width: size, height: size, position: 'absolute' }}
      >
        <svg width={size} height={size} viewBox="-120 -120 240 240">
          {/* Pentagon lines */}
          {ELEMENTS.map((el, i) => {
            const next = ELEMENTS[(i + 1) % 5];
            const x1 = R * Math.cos(toRad(el.angle));
            const y1 = R * Math.sin(toRad(el.angle));
            const x2 = R * Math.cos(toRad(next.angle));
            const y2 = R * Math.sin(toRad(next.angle));
            return (
              <line
                key={`line-${i}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#24242f"
                strokeWidth="1"
              />
            );
          })}
          {/* Inner star lines */}
          {ELEMENTS.map((el, i) => {
            const skip = ELEMENTS[(i + 2) % 5];
            const x1 = R * Math.cos(toRad(el.angle));
            const y1 = R * Math.sin(toRad(el.angle));
            const x2 = R * Math.cos(toRad(skip.angle));
            const y2 = R * Math.sin(toRad(skip.angle));
            return (
              <line
                key={`star-${i}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#1e1e28"
                strokeWidth="0.5"
                opacity={0.5}
              />
            );
          })}
          {/* Outer ring */}
          <circle cx={0} cy={0} r={CR * 0.88} fill="none" stroke="#24242f" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* Element nodes — counter-rotate so they stay upright */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ width: size, height: size, position: 'absolute' }}
      >
        <svg width={size} height={size} viewBox="-120 -120 240 240">
          {ELEMENTS.map((el) => {
            const cx = R * Math.cos(toRad(el.angle));
            const cy = R * Math.sin(toRad(el.angle));
            return (
              <g key={el.label}>
                <circle cx={cx} cy={cy} r={16} fill="#09090f" stroke={el.color} strokeWidth="1.5" />
                <text
                  x={cx} y={cy - 3}
                  textAnchor="middle"
                  fill={el.color}
                  fontSize="12"
                  fontWeight="300"
                  style={{ fontFamily: 'serif' }}
                >
                  {el.label}
                </text>
                <text
                  x={cx} y={cy + 9}
                  textAnchor="middle"
                  fill={el.color}
                  fontSize="7"
                  opacity={0.7}
                  style={{ fontFamily: 'serif' }}
                >
                  {el.kr}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Center dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          background: '#c4a878',
          opacity: 0.6,
          boxShadow: '0 0 12px #c4a878',
        }}
      />
    </div>
  );
}
