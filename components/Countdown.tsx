import { useEffect, useState } from 'react';

const LAUNCH_DATE = new Date('2025-07-04T00:00:00');

export default function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = LAUNCH_DATE.getTime() - Date.now();
      if (diff <= 0) { setLaunched(true); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, []);

  if (launched) return null;

  return (
    <div className="bg-[#b8860b]/10 border-y border-[#b8860b]/20 py-4 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        <p className="text-[#b8860b] text-xs tracking-widest uppercase font-medium">🚀 Official Launch In</p>
        <div className="flex gap-3">
          {[
            { label: 'Days', val: time.days },
            { label: 'Hours', val: time.hours },
            { label: 'Mins', val: time.minutes },
            { label: 'Secs', val: time.seconds },
          ].map(({ label, val }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-white font-bold text-xl w-10 text-center">
                {String(val).padStart(2, '0')}
              </span>
              <span className="text-gray-600 text-xs uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
