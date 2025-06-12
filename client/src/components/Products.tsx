import React from 'react';
import { ShoppingCart, Star, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  rating: number;
  reviews: number;
  description: string;
  badge?: string;
  hasGift?: boolean;
}

interface ProductsProps {
  onCheckout: () => void;
}

const Products: React.FC<ProductsProps> = ({ onCheckout }) => {
  const { addItem } = useCart();

  const products: Product[] = [
    {
      id: 1,
      name: "Queijo da Cristina - Minas Artesanal - Microrregião da Canastra",
      image: "https://images.tcdn.com.br/img/img_prod/1250050/queijo_canastra_da_cristina_319_1_dd1c3053234930e28fa0b3fa0b07ed83.jpg",
      originalPrice: 49.90,
      salePrice: 25.90,
      rating: 4.9,
      reviews: 167,
      description: "Sabor genuíno da tradição mineira, preparado com leite fresco e receita familiar",
      badge: "OFERTA ESPECIAL",
      hasGift: true
    },
    {
      id: 2,
      name: "Queijo da Santa - 650g",
      image: "https://i.imgur.com/k30zCGo.jpg",
      originalPrice: 49.75,
      salePrice: 25.90,
      rating: 4.8,
      reviews: 89,
      description: "Queijo artesanal da Santa com sabor tradicional e textura cremosa"
    },
    {
      id: 3,
      name: "Kit com 4 Cocadas Cremosas",
      image: "https://i.imgur.com/37Ardvd.jpg",
      originalPrice: 89.90,
      salePrice: 49.90,
      rating: 4.9,
      reviews: 124,
      description: "O mais pedido! Kit imperdível com 4 cocadas cremosas artesanais",
      badge: "MAIS PEDIDO"
    },
    {
      id: 4,
      name: "Queijo Tulha - Fazenda Atalaia",
      image: "https://i.imgur.com/GNHtbFB.jpg",
      originalPrice: 49.90,
      salePrice: 25.90,
      rating: 4.7,
      reviews: 76,
      description: "Queijo artesanal da Fazenda Atalaia com sabor único e tradição familiar"
    },
    {
      id: 5,
      name: "Queijo Figueira - Fazenda Atalaia",
      image: "https://i.imgur.com/qmVRdYV.jpg",
      originalPrice: 90.00,
      salePrice: 79.90,
      rating: 4.8,
      reviews: 93,
      description: "Queijo premium da Fazenda Atalaia, maturado com técnicas especiais"
    },
    {
      id: 6,
      name: "Queijo Artesanal GOA",
      image: "https://i.imgur.com/2xc3Plt.jpg",
      originalPrice: 43.00,
      salePrice: 25.90,
      rating: 4.6,
      reviews: 67,
      description: "Queijo artesanal GOA com sabor marcante e textura perfeita"
    },
    {
      id: 7,
      name: "Queijo Malacaxeta 550g",
      image: "https://i.imgur.com/50tDOfl.jpg",
      originalPrice: 49.50,
      salePrice: 25.90,
      rating: 4.5,
      reviews: 54,
      description: "Queijo Malacaxeta tradicional com 550g de puro sabor mineiro"
    },
    {
      id: 8,
      name: "Queijo Minas Artesanal Jacuba",
      image: "https://i.imgur.com/eNDD9YK.jpg",
      originalPrice: 49.50,
      salePrice: 25.90,
      rating: 4.4,
      reviews: 41,
      description: "Queijo Minas artesanal Jacuba com receita tradicional da roça"
    },
    {
      id: 9,
      name: "Queijo Morro Azul",
      image: "https://i.imgur.com/iessxKT.jpg",
      originalPrice: 39.90,
      salePrice: 19.90,
      rating: 4.7,
      reviews: 58,
      description: "Queijo Morro Azul com sabor suave e textura cremosa"
    },
    {
      id: 10,
      name: "Doce de Leite Cremoso 500g",
      image: "https://img.fazendinha.me/production/produtor/528/produtos/4716/laticinios-moedense-doce-de-leite-pote-moedense-500g-1658161145.jpg",
      originalPrice: 45.90,
      salePrice: 32.90,
      rating: 4.8,
      reviews: 89,
      description: "Doce de leite artesanal com textura cremosa e sabor irresistível"
    },
    {
      id: 13,
      name: "Goiabada Cascão 800g",
      image: "https://www.mercadinhodabisa.com.br/cdn/shop/files/GoiabadaCascao30Kge50Kg.jpg?v=1742300673&width=493",
      originalPrice: 42.90,
      salePrice: 31.90,
      rating: 4.6,
      reviews: 67,
      description: "Goiabada cascão tradicional, feita com goiabas selecionadas e açúcar cristal"
    },
    {
      id: 15,
      name: "Rapadura Mineira 1kg",
      image: "https://http2.mlstatic.com/D_NQ_NP_983658-MLB84185476500_052025-O-rapadura-artesanal-canastra-kit-4-barras-500g-doce-gourmet.webp",
      originalPrice: 29.90,
      salePrice: 22.90,
      rating: 4.4,
      reviews: 41,
      description: "Rapadura tradicional feita com cana-de-açúcar pura das fazendas mineiras"
    }
  ];

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const calculateDiscount = (original: number, sale: number) => {
    return Math.round(((original - sale) / original) * 100);
  };

  return (
    <section id="products" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#9B6647] mb-8 text-center">
            Nossos Produtos Tradicionais
          </h2>

          {/* Grid de Produtos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const discount = calculateDiscount(product.originalPrice, product.salePrice);
              
              return (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.badge && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {product.badge}
                      </div>
                    )}
                    {product.hasGift && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full">
                        <Gift size={16} />
                      </div>
                    )}
                    {discount > 0 && !product.hasGift && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg text-gray-400 line-through">
                        R${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xl font-bold text-[#9B6647]">
                        R${product.salePrice.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-[#9B6647] hover:bg-[#825539] text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Destaque do Produto Principal */}
          <div className="mt-12 bg-amber-50 rounded-2xl p-6">
            <div className="text-center">
              <h3 className="text-xl font-serif font-bold text-[#9B6647] mb-2">
                Oferta Especial de Hoje
              </h3>
              <p className="text-amber-800 mb-4">
                Conjunto 3 Manteigas Tradicionais Premium - Pague 1, Leve 3!
              </p>
              <div className="flex justify-center items-center gap-4 mb-4">
                <span className="text-2xl text-gray-400 line-through">R$218,90</span>
                <span className="text-3xl font-bold text-red-600">R$69,90</span>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  68% OFF
                </span>
              </div>
              <button
                onClick={onCheckout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                APROVEITAR OFERTA
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;