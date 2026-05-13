import React from 'react';
import { initials } from '../../utils/helpers';

export default function Avatar({ name = '', size = 'md' }) {
  const sz = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  }[size];
  return (
    <div className={`${sz} rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0 select-none`}>
      {initials(name)}
    </div>
  );
}
