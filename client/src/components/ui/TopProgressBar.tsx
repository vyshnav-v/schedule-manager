'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useNavStore } from '../../store/navStore';

export default function TopProgressBar() {
  const { navigating, setNavigating } = useNavStore();
  const pathname  = usePathname();
  const prevPath  = useRef(pathname);

  // width: 0 → 85 (during navigation) → 100 (on arrival) → fade out
  const [width,   setWidth]   = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Route changed → finish bar
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      setNavigating(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Animate bar
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (navigating) {
      setVisible(true);
      setWidth(0);
      // Ramp quickly to 30%, then slow-crawl toward 85%
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWidth(30);
          timerRef.current = setTimeout(() => setWidth(60), 400);
          timerRef.current = setTimeout(() => setWidth(85), 1200);
        });
      });
    } else {
      // Complete the bar
      setWidth(100);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 400);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [navigating]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-9999 h-[3px] pointer-events-none">
      <div
        className="h-full bg-linear-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full shadow-sm"
        style={{
          width:      `${width}%`,
          transition: width === 100
            ? 'width 200ms ease-in'
            : width === 0
              ? 'none'
              : 'width 600ms cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 10px rgba(14,165,233,0.7), 0 0 4px rgba(14,165,233,0.5)',
        }}
      />
    </div>
  );
}
