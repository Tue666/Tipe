import { useEffect, useState } from 'react';

const useTimer = (targetTime: number) => {
  const [countDown, setCountDown] = useState(0);
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      setCountDown(targetTime - currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return [days, hours, minutes, seconds];
};

export default useTimer;
