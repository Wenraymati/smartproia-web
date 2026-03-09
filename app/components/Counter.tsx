'use client';

import { useState, useEffect } from 'react';

export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = to / 40;
    let cur = 0;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(cur));
    }, 30);
    return () => clearInterval(timer);
  }, [to]);
  return <>{count}{suffix}</>;
}
