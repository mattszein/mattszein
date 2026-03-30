'use client'
import { useState, useEffect } from 'react';
/**
 * Custom hook that returns the current Date object and updates every second.
 * This can be used to display synchronized time in different parts of the application.
 */
export const useDateTime = () => {
  const [dateTime, setDateTime] = useState<Date | null>(null);

  useEffect(() => {
    setDateTime(new Date());
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return dateTime;
};
