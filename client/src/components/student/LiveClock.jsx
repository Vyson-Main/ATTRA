import React, { useState, useEffect } from 'react';

export default function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <p className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums">
        {time}
      </p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1.5">{date}</p>
    </div>
  );
}
