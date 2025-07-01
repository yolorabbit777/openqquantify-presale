import { useState, useEffect } from 'react';

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateDifference = () => {
      setCurrentTime(new Date());
      setTimeout(updateDifference, 1000);
    };

    const timerId = setTimeout(updateDifference, 0);

    return () => clearTimeout(timerId);
  }, []); // Empty dependency array to run effect only once

  return currentTime;
};
