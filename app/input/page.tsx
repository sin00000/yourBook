'use client';

import { useState, FormEvent, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { UserInput } from '@/utils/saju';

// 子시는 전반(23:00-24:00)과 후반(00:00-01:00)으로 분리.
// 23시 생 → 다음 날 일주 적용 (대부분 만세력 표준).
// 00시 생 → 해당 날 일주 유지.
const HOURS = [
  { value: '-1', label: '모름' },
  { value: '23', label: '子시 전반 (23:00–24:00) — 일주는 다음 날 기준' },
  { value: '0',  label: '子시 후반 (00:00–01:00)' },
  { value: '1',  label: '丑시 (01:00–03:00)' },
  { value: '3',  label: '寅시 (03:00–05:00)' },
  { value: '5',  label: '卯시 (05:00–07:00)' },
  { value: '7',  label: '辰시 (07:00–09:00)' },
  { value: '9',  label: '巳시 (09:00–11:00)' },
  { value: '11', label: '午시 (11:00–13:00)' },
  { value: '13', label: '未시 (13:00–15:00)' },
  { value: '15', label: '申시 (15:00–17:00)' },
  { value: '17', label: '酉시 (17:00–19:00)' },
  { value: '19', label: '戌시 (19:00–21:00)' },
  { value: '21', label: '亥시 (21:00–23:00)' },
];

const LOCATIONS = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '해외',
];

const fieldStyle = {
  background: '#0e0e18',
  border: '1px solid #1e1e2c',
  color: '#f0ead8',
  borderRadius: '2px',
  width: '100%',
  padding: '10px 14px',
  fontSize: '14px',
  fontFamily: 'var(--font-noto-serif), serif',
  fontWeight: 300,
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontSize: '10px',
  letterSpacing: '0.2em',
  color: '#4a4468',
  marginBottom: '8px',
};

export default function InputPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    calendarType: 'solar' as 'solar' | 'lunar',
    isLeapMonth: false,
    birthHour: '-1',
    gender: 'female' as 'male' | 'female',
    birthLocation: '서울',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const getFocusStyle = (name: string) =>
    focusedField === name
      ? { ...fieldStyle, borderColor: '#3a3058', boxShadow: '0 0 0 1px #3a305820' }
      : fieldStyle;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const hour = parseInt(form.birthHour, 10);
    const input: UserInput = {
      name: form.name || '익명',
      birthYear: parseInt(form.birthYear, 10),
      birthMonth: parseInt(form.birthMonth, 10),
      birthDay: parseInt(form.birthDay, 10),
      calendarType: form.calendarType,
      isLeapMonth: form.isLeapMonth,
      birthHour: hour === -1 ? null : hour,
      birthMinute: hour === -1 ? null : 0,
      gender: form.gender,
      birthLocation: form.birthLocation,
    };
    if (!input.birthYear || !input.birthMonth || !input.birthDay) return;
    localStorage.setItem('saju_input', JSON.stringify(input));
    router.push('/result');
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: '#09090f' }}
    >
      {/* Back link */}
      <div className="w-full max-w-lg mb-8">
        <Link
          href="/"
          className="text-[10px] tracking-[0.2em]"
          style={{ color: '#3a3450' }}
        >
          ← 문학사주
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <div
            className="text-[9px] tracking-[0.35em] mb-4"
            style={{ color: '#3a3458' }}
          >
            四柱 入力
          </div>
          <h1
            className="text-xl mb-3"
            style={{
              color: '#f0ead8',
              fontFamily: 'var(--font-noto-serif), serif',
              fontWeight: 300,
              letterSpacing: '-0.01em',
            }}
          >
            당신의 사주를 입력하세요
          </h1>
          <p
            className="text-xs leading-relaxed"
            style={{ color: '#4a4468' }}
          >
            생년월일시를 바탕으로 오행을 분석하고
            <br />
            지금 당신에게 필요한 문학을 찾아드립니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label style={labelStyle}>이름 (선택)</label>
            <input
              type="text"
              placeholder="홍길동"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              style={getFocusStyle('name')}
            />
          </div>

          {/* Calendar type */}
          <div>
            <label style={labelStyle}>양력 / 음력</label>
            <div className="flex gap-2">
              {(['solar', 'lunar'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, calendarType: type })}
                  className="flex-1 py-2.5 text-sm transition-all duration-200"
                  style={{
                    background: form.calendarType === type ? '#161624' : '#0e0e18',
                    border: `1px solid ${form.calendarType === type ? '#3a3058' : '#1e1e2c'}`,
                    color: form.calendarType === type ? '#c4a878' : '#4a4468',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-noto-serif), serif',
                    fontWeight: 300,
                    cursor: 'pointer',
                  }}
                >
                  {type === 'solar' ? '양력 (陽曆)' : '음력 (陰曆)'}
                </button>
              ))}
            </div>
            {form.calendarType === 'lunar' && (
              <label
                className="flex items-center gap-2 mt-2 cursor-pointer"
                style={{ color: '#6a6282' }}
              >
                <input
                  type="checkbox"
                  checked={form.isLeapMonth}
                  onChange={(e) => setForm({ ...form, isLeapMonth: e.target.checked })}
                  style={{ accentColor: '#c4a878' }}
                />
                <span className="text-xs">윤달 (閏月)</span>
              </label>
            )}
          </div>

          {/* Birth date */}
          <div>
            <label style={labelStyle}>생년월일</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="연도 (예: 1990)"
                value={form.birthYear}
                onChange={(e) => setForm({ ...form, birthYear: e.target.value })}
                onFocus={() => setFocusedField('year')}
                onBlur={() => setFocusedField(null)}
                style={{ ...getFocusStyle('year'), flex: 2 }}
                min={1900}
                max={2024}
                required
              />
              <input
                type="number"
                placeholder="월"
                value={form.birthMonth}
                onChange={(e) => setForm({ ...form, birthMonth: e.target.value })}
                onFocus={() => setFocusedField('month')}
                onBlur={() => setFocusedField(null)}
                style={{ ...getFocusStyle('month'), flex: 1 }}
                min={1}
                max={12}
                required
              />
              <input
                type="number"
                placeholder="일"
                value={form.birthDay}
                onChange={(e) => setForm({ ...form, birthDay: e.target.value })}
                onFocus={() => setFocusedField('day')}
                onBlur={() => setFocusedField(null)}
                style={{ ...getFocusStyle('day'), flex: 1 }}
                min={1}
                max={31}
                required
              />
            </div>
          </div>

          {/* Birth hour */}
          <div>
            <label style={labelStyle}>태어난 시간 (時)</label>
            <select
              value={form.birthHour}
              onChange={(e) => setForm({ ...form, birthHour: e.target.value })}
              onFocus={() => setFocusedField('hour')}
              onBlur={() => setFocusedField(null)}
              style={getFocusStyle('hour') as CSSProperties}
            >
              {HOURS.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label style={labelStyle}>성별</label>
            <div className="flex gap-2">
              {(['female', 'male'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm({ ...form, gender: g })}
                  className="flex-1 py-2.5 text-sm transition-all duration-200"
                  style={{
                    background: form.gender === g ? '#161624' : '#0e0e18',
                    border: `1px solid ${form.gender === g ? '#3a3058' : '#1e1e2c'}`,
                    color: form.gender === g ? '#c4a878' : '#4a4468',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-noto-serif), serif',
                    fontWeight: 300,
                    cursor: 'pointer',
                  }}
                >
                  {g === 'female' ? '여성 (女)' : '남성 (男)'}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>출생 지역</label>
            <select
              value={form.birthLocation}
              onChange={(e) => setForm({ ...form, birthLocation: e.target.value })}
              onFocus={() => setFocusedField('location')}
              onBlur={() => setFocusedField(null)}
              style={getFocusStyle('location') as CSSProperties}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <p className="text-[10px] mt-1.5" style={{ color: '#2e2c3a' }}>
              진태양시 보정에 사용됩니다
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#141420', margin: '8px 0' }} />

          {/* Submit */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 text-sm tracking-[0.15em] transition-all duration-300"
            style={{
              background: '#0e0e1a',
              border: '1px solid #2a2438',
              color: '#c4a878',
              fontFamily: 'var(--font-noto-serif), serif',
              fontWeight: 300,
              cursor: 'pointer',
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#4a3870';
              (e.currentTarget as HTMLElement).style.background = '#12121e';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#2a2438';
              (e.currentTarget as HTMLElement).style.background = '#0e0e1a';
            }}
          >
            사주를 문학으로 번역하기
          </motion.button>

          <p
            className="text-center text-[10px] leading-relaxed"
            style={{ color: '#28263a' }}
          >
            입력된 정보는 저장되지 않으며, 문학 추천에만 사용됩니다.
          </p>
        </form>
      </motion.div>
    </main>
  );
}
