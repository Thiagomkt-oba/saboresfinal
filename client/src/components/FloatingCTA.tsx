import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const FloatingCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg z-40 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      <div className="relative p-4">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
            OFERTA
          </div>
          <div>
            <h3 className="font-bold text-amber-900">Último dia de promoção!</h3>
            <p className="text-sm text-amber-800 mb-2">Leve 3, Pague 1 - Válido até hoje</p>
          </div>
        </div>
        
        <a 
          href="https://pagamento.turvodeminas.shop/checkout?product=72d09e8a-43de-11f0-b801-46da4690ad53"
          className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md mt-2 transition-colors text-center"
        >
          COMPRAR AGORA
        </a>
      </div>
    </div>
  );
};

export default FloatingCTA;