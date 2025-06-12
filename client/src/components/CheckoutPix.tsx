import React, { useState } from 'react';
import { Copy, CheckCircle, CreditCard, User, MapPin, Phone, Mail, Package, Clock, AlertCircle } from 'lucide-react';
import InputMask from 'react-input-mask';
import { useTracking } from '../hooks/useTracking';

interface FormData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
}

interface PixData {
  pixQrCode: string;
  pixCode: string;
  transactionId: string;
  status: string;
}

const CheckoutPix: React.FC = () => {
  const trackingParams = useTracking();
  
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: ''
  });

  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

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
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        complemento: data.complemento || ''
      }));

      setErrors(prev => ({ ...prev, cep: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, cep: 'Erro ao buscar CEP' }));
    } finally {
      setCepLoading(false);
    }
  };

  const handleCEPChange = (value: string) => {
    setFormData(prev => ({ ...prev, cep: value }));

    if (value.replace(/\D/g, '').length === 8) {
      fetchAddressByCEP(value);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome completo é obrigatório';
    }

    if (!formData.cpf.replace(/\D/g, '')) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.replace(/\D/g, '')) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.cep.replace(/\D/g, '')) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!validateCEP(formData.cep)) {
      newErrors.cep = 'CEP inválido';
    }

    if (!formData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGerarPix = async () => {
    setErrorMessage('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Preparar dados para a API incluindo parâmetros de tracking
      const requestBody = {
        nome: formData.nome,
        cpf: formData.cpf,
        email: formData.email,
        telefone: formData.telefone,
        cep: formData.cep,
        logradouro: formData.logradouro,
        numero: formData.numero,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        complemento: formData.complemento,
        amount: 69.90,
        items: [
          {
            unitPrice: 6990,
            title: "Conjunto 3 Manteigas Sabores de Minas",
            quantity: 1,
            tangible: true
          }
        ],
        trackingParams
      };

      // Construir URL com parâmetros UTM para o backend
      const urlParams = new URLSearchParams();
      Object.entries(trackingParams).forEach(([key, value]) => {
        if (value) {
          urlParams.append(key, value);
        }
      });

      const apiUrl = `/api/create-pix-payment${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;

      // Chamar nossa API
      const response = await fetch(apiUrl, {
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
          pixQrCode: data.pixQrCode,
          pixCode: data.pixCode,
          transactionId: data.transactionId,
          status: data.status
        });
      } else {
        throw new Error('Dados do PIX não foram retornados pela API');
      }

    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      setErrorMessage(`Erro ao gerar PIX: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
        // Fallback para navegadores antigos
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
    await handleGerarPix();
  };

  return (
    <div className="min-h-screen bg-[#F7F3EF] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-serif font-bold text-[#9B6647] mb-8 text-center">
          Checkout PIX - Sabores de Minas
        </h1>



        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-600" size={20} />
              <span className="font-semibold text-red-800">Erro</span>
            </div>
            <p className="text-red-700 mt-1">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {!pixData ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dados Pessoais */}
                  <div>
                    <h2 className="text-lg font-semibold text-[#9B6647] mb-4 flex items-center gap-2">
                      <User size={20} />
                      Dados Pessoais
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CPF *
                        </label>
                        <InputMask
                          mask="999.999.999-99"
                          value={formData.cpf}
                          onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent ${
                            errors.cpf ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="000.000.000-00"
                        />
                        {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone *
                        </label>
                        <InputMask
                          mask="(99) 99999-9999"
                          value={formData.telefone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent ${
                            errors.telefone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="(11) 99999-9999"
                        />
                        {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="seu@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                              value={formData.cep}
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
                            value={formData.numero}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
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
                          value={formData.logradouro}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, logradouro: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent"
                          placeholder="Rua, Avenida, etc."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bairro
                          </label>
                          <input
                            type="text"
                            value={formData.bairro}
                            onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent"
                            placeholder="Bairro"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Complemento
                          </label>
                          <input
                            type="text"
                            value={formData.complemento}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, complemento: e.target.value }))}
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
                            value={formData.cidade}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent"
                            placeholder="Cidade"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                          </label>
                          <input
                            type="text"
                            value={formData.estado}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B6647] focus:border-transparent"
                            placeholder="UF"
                            maxLength={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-[#9B6647] mb-4">
                    PIX Gerado com Sucesso!
                  </h2>
                  
                  {pixData.pixQrCode && (
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 inline-block">
                      <img 
                        src={pixData.pixQrCode} 
                        alt="QR Code do PIX" 
                        className="w-64 h-64 mx-auto"
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
                        Aguardando Pagamento
                      </span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Valor: R$ 69,90 • ID: {pixData.transactionId}
                    </p>
                  </div>
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
                <div className="flex gap-3">
                  <img
                    src="https://i.imgur.com/PaTOyu4.jpg"
                    alt="Conjunto 3 Manteigas"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">
                      Conjunto 3 Manteigas
                    </h3>
                    <p className="text-sm text-gray-600">Qtd: 1</p>
                    <p className="text-sm font-bold text-[#9B6647]">
                      R$ 69,90
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-[#9B6647]">R$ 69,90</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete:</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-[#9B6647]">R$ 69,90</span>
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

export default CheckoutPix;