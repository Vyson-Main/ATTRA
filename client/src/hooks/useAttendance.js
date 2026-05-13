import { useState, useEffect, useCallback } from 'react';
import { attendanceAPI } from '../services/api';

export function useAttendance(date) {
  const [rows, setRows]       = useState([]);
  const [stats, setStats]     = useState({ total: 0, present: 0, absent: 0, rate: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [listRes, statsRes] = await Promise.all([
        attendanceAPI.getToday(date),
        attendanceAPI.getStats(date),
      ]);
      setRows(listRes.data.rows || []);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchData();
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { rows, stats, loading, error, refresh: fetchData };
}
