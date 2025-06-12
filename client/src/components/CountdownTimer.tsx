import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 31,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              // Timer completed
              clearInterval(timer);
              return { hours: 0, minutes: 0, seconds: 0 };
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className="bg-amber-100 p-4 rounded-lg shadow-inner">
      <p className="text-amber-800 mb-2">
        Oferta especial de hoje (domingo, 25 de maio de 2025): adquira 3 manteigas de 500g pelo preço de 1
      </p>
      <div className="flex justify-center gap-1 md:gap-3 mb-2">
        <div className="flex flex-col items-center">
          <div className="bg-amber-800 text-white text-xl md:text-2xl font-bold rounded-md w-12 md:w-16 py-2 flex items-center justify-center">
            {formatTime(timeLeft.hours)}
          </div>
          <span className="text-xs text-amber-700 mt-1">HORAS</span>
        </div>
        <div className="text-amber-800 text-xl md:text-2xl font-bold flex items-center">:</div>
        <div className="flex flex-col items-center">
          <div className="bg-amber-800 text-white text-xl md:text-2xl font-bold rounded-md w-12 md:w-16 py-2 flex items-center justify-center">
            {formatTime(timeLeft.minutes)}
          </div>
          <span className="text-xs text-amber-700 mt-1">MINUTOS</span>
        </div>
        <div className="text-amber-800 text-xl md:text-2xl font-bold flex items-center">:</div>
        <div className="flex flex-col items-center">
          <div className="bg-amber-800 text-white text-xl md:text-2xl font-bold rounded-md w-12 md:w-16 py-2 flex items-center justify-center">
            {formatTime(timeLeft.seconds)}
          </div>
          <span className="text-xs text-amber-700 mt-1">SEGUNDOS</span>
        </div>
      </div>
      <p className="text-amber-800 text-sm">
        <span className="font-bold">Oferta limitada</span> para sua região.
        <span className="ml-2 text-red-600">
          Mais de 24 pessoas estão visualizando esta oferta agora.
        </span>
      </p>
    </div>
  );
};

export default CountdownTimer;