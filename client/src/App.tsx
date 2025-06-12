import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductDetails from './components/ProductDetails';
import Products from './components/Products';
import Reviews from './components/Reviews';
import Benefits from './components/Benefits';
import Footer from './components/Footer';
import Checkout from './components/Checkout';
import CheckoutPix from './components/CheckoutPix';
import Cart from './components/Cart';
import { useCart } from './context/CartContext';

// Componente interno para acessar o contexto do carrinho
const AppContent: React.FC = () => {
  const [showFixedButton, setShowFixedButton] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { totalPrice, totalOriginalPrice } = useCart();

  const handleCheckout = () => {
    setShowCheckout(true);
    setShowCart(false);
  };

  const handleBackToProduct = () => {
    setShowCheckout(false);
  };

  const handleCartClick = () => {
    setShowCart(true);
  };

  const handleCartClose = () => {
    setShowCart(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowFixedButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans bg-[#F7F3EF]">
      <Header onCartClick={handleCartClick} />
      
      {showCheckout ? (
        <Checkout onBack={handleBackToProduct} />
      ) : (
        <Switch>
          <Route path="/">
            <main>
              <Hero onCheckout={handleCheckout} />
              <ProductDetails onCheckout={handleCheckout} />
              <Products onCheckout={handleCheckout} />
              <Reviews />
              <Benefits />
            </main>
          </Route>
          <Route path="/checkout-pix">
            <CheckoutPix />
          </Route>
        </Switch>
      )}
      
      <Footer />
      
      <Cart 
        isOpen={showCart} 
        onClose={handleCartClose} 
        onCheckout={handleCheckout}
      />
      
      {showFixedButton && !showCheckout && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-sm text-gray-500 line-through">De R${totalOriginalPrice.toFixed(2)}</p>
                <p className="text-2xl font-bold text-[#9B6647]">Por R${totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              className="bg-[#9B6647] hover:bg-[#825539] text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              COMPRAR AGORA
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;