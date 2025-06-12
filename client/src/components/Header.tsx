import React from 'react';
import { ShoppingBasket } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { totalItems } = useCart();

  return (
    <header className="bg-amber-900/90 text-amber-50 py-3 px-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-serif font-bold">Sabores de Minas</h1>
        </div>
        <button 
          onClick={onCartClick}
          className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-md transition-colors relative"
        >
          <ShoppingBasket size={18} />
          <span className="hidden md:inline">Carrinho</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;