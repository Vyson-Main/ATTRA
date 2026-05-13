import { format, parseISO } from 'date-fns';

/** Today as YYYY-MM-DD */
export const todayISO = () => new Date().toISOString().split('T')[0];

/** Format a YYYY-MM-DD date string to a readable form */
export const fmtDate = (iso) => {
  try { return format(parseISO(iso), 'MMM d, yyyy'); }
  catch { return iso || '—'; }
};

/** Current time as HH:MM:SS AM/PM */
export const fmtTime = (d = new Date()) =>
  d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/** Initials from a full name */
export const initials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

/** Trigger a file download from a blob response */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Extract error message from axios error */
export const errMsg = (err) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  'Something went wrong';
