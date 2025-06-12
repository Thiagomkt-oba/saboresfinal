import React, { useState } from 'react';
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail, Package, Copy, CheckCircle, Clock } from 'lucide-react';
import InputMask from 'react-input-mask';
import { useCart } from '../context/CartContext';

interface CheckoutProps {
  onBack: () => void;
}

interface Address {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
}

interface FormData {
  nome: string;
  telefone: string;
  email: string;
  endereco: Address;
}

interface PixData {
  transactionId: string;
  pixQrCode: string;
  pixCode: string;
  amount: number;
  expiresAt: string;
  status: string;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack }) => {
  const { items, totalPrice, totalOriginalPrice } = useCart();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    telefone: '',
    email: '',
    endereco: {
      cep: '',
      logradouro: '',
      complemento: '',
      bairro: '',
      localidade: '',
      uf: '',
      numero: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'paid' | 'expired'>('pending');

  const savings = totalOriginalPrice - totalPrice;

  const validateCEP = (cep: string): boolean => {
    const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;
    return cepRegex.test(cep);
  };

  const fetchAddressByCEP = async (cep: string) => {
    if (!validateCEP(cep)) return;

    setCepLoading(true);
    try {
      const cleanCEP = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          cep: cep,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          localidade: data.localidade || '',
          uf: data.uf || '',
          complemento: data.complemento || ''
        }
      }));

      setErrors(prev => ({ ...prev, cep: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, cep: 'Erro ao buscar CEP' }));
    } finally {
      setCepLoading(false);
    }
  };

  const handleCEPChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      endereco: { ...prev.endereco, cep: value }
    }));

    if (value.replace(/\D/g, '').length === 8) {
      fetchAddressByCEP(value);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome completo é obrigatório';
    }

    if (!formData.telefone.replace(/\D/g, '')) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.endereco.cep.replace(/\D/g, '')) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!validateCEP(formData.endereco.cep)) {
      newErrors.cep = 'CEP inválido';
    }

    if (!formData.endereco.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePix = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const requestBody = {
        nome: formData.nome,
        cpf: '000.000.000-00', // CPF fictício para teste
        email: formData.email,
        telefone: formData.telefone,
        cep: formData.endereco.cep,
        logradouro: formData.endereco.logradouro,
        numero: formData.endereco.numero,
        bairro: formData.endereco.bairro,
        cidade: formData.endereco.localidade,
        estado: formData.endereco.uf,
        complemento: formData.endereco.complemento,
        amount: totalPrice,
        items: [
          {
            unitPrice: Math.round(totalPrice * 100),
            title: "Conjunto 3 Manteigas Sabores de Minas",
            quantity: 1,
            tangible: true
          }
        ]
      };

      const response = await fetch('/api/create-pix-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro HTTP: ${response.status}`);
      }

      if (data.pixQrCode && data.pixCode) {
        setPixData({
          transactionId: data.transactionId,
          pixQrCode: data.pixQrCode,
          pixCode: data.pixCode,
          amount: data.amount,
          expiresAt: data.expiresAt,
          status: data.status
        });
      } else {
        throw new Error('Dados do PIX não foram retornados pela API');
      }

    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      alert(`Erro ao gerar PIX: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = async () => {
    if (pixData?.pixCode) {
      try {
        await navigator.clipboard.writeText(pixData.pixCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Erro ao copiar:', error);
        // Fallback para navegadores que não suportam clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = pixData.pixCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePix();
  };

  return (
    <div className="min-h-screen bg-[#F7F3EF] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#9B6647] hover:text-[#825539] transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar para o produto
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl font-serif font-bold text-[#9B6647] mb-6">
                Finalizar Pedido
              </h1>

              {!pixData ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dados Pessoais */}
                  <div>
                    <h2 className="text-lg font-semibold text-[#9B6647] mb-4 flex items-center gap-2">
                      <User size={20} />
                      Dados Pessoais
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={formData.nome}
                          onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent ${
                            errors.nome ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Digite seu nome completo"
                        />
                        {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefone *
                          </label>
                          <InputMask
                            mask="(99) 99999-9999"
                            value={formData.telefone}
                            onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent ${
                              errors.telefone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="(11) 99999-9999"
                          />
                          {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="seu@email.com"
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div>
                    <h2 className="text-lg font-semibold text-[#9B6647] mb-4 flex items-center gap-2">
                      <MapPin size={20} />
                      Endereço de Entrega
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CEP *
                          </label>
                          <div className="relative">
                            <InputMask
                              mask="99999-999"
                              value={formData.endereco.cep}
                              onChange={(e) => handleCEPChange(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent ${
                                errors.cep ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="00000-000"
                            />
                            {cepLoading && (
                              <div className="absolute right-3 top-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#9B6647]"></div>
                              </div>
                            )}
                          </div>
                          {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número *
                          </label>
                          <input
                            type="text"
                            value={formData.endereco.numero}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              endereco: { ...prev.endereco, numero: e.target.value }
                            }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent ${
                              errors.numero ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="123"
                          />
                          {errors.numero && <p className="text-red-500 text-sm mt-1">{errors.numero}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Logradouro
                        </label>
                        <input
                          type="text"
                          value={formData.endereco.logradouro}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, logradouro: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent"
                          placeholder="Rua, Avenida, etc."
                          readOnly={!!formData.endereco.logradouro}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bairro
                          </label>
                          <input
                            type="text"
                            value={formData.endereco.bairro}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              endereco: { ...prev.endereco, bairro: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent"
                            placeholder="Bairro"
                            readOnly={!!formData.endereco.bairro}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Complemento
                          </label>
                          <input
                            type="text"
                            value={formData.endereco.complemento}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              endereco: { ...prev.endereco, complemento: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent"
                            placeholder="Apto, Casa, etc."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cidade
                          </label>
                          <input
                            type="text"
                            value={formData.endereco.localidade}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                          </label>
                          <input
                            type="text"
                            value={formData.endereco.uf}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-[#9B6647] mb-4">
                    Pagamento PIX Gerado
                  </h2>
                  
                  {paymentStatus === 'paid' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        Pagamento Confirmado!
                      </h3>
                      <p className="text-green-700">
                        Seu pedido foi processado com sucesso. Você receberá um email com os detalhes.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {pixData.pixQrCode && (
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 inline-block">
                          <img 
                            src={pixData.pixQrCode} 
                            alt="QR Code PIX" 
                            className="w-64 h-64 rounded-lg"
                          />
                        </div>
                      )}
                      
                      <p className="text-gray-700 mb-4">
                        Escaneie o QR Code acima com o app do seu banco ou copie o código PIX abaixo:
                      </p>
                      
                      {pixData.pixCode && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between">
                            <code className="text-sm text-gray-800 break-all flex-1 mr-2">
                              {pixData.pixCode}
                            </code>
                            <button
                              onClick={copyPixCode}
                              className="bg-[#9B6647] hover:bg-[#825539] text-white px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
                            >
                              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                              {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="text-blue-600" size={20} />
                          <span className="font-semibold text-blue-800">
                            Aguardando Pagamento (Simulação)
                          </span>
                        </div>
                        <p className="text-blue-700 text-sm">
                          Valor: R${pixData.amount.toFixed(2)} • 
                          Verificando pagamento automaticamente...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
              <h2 className="text-lg font-semibold text-[#9B6647] mb-4 flex items-center gap-2">
                <Package size={20} />
                Resumo do Pedido
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#9B6647]">
                        R${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="line-through text-gray-400">R${totalOriginalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Desconto:</span>
                    <span className="text-green-600">-R${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete:</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-[#9B6647]">R${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {!pixData && (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#9B6647] hover:bg-[#825539] disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Gerando PIX...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Gerar PIX
                      </>
                    )}
                  </button>
                )}

                <div className="text-center text-xs text-gray-500">
                  <p>Pagamento 100% seguro</p>
                  <p>Seus dados estão protegidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;