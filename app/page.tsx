'use client'
'use client'
import { useState, useEffect } from 'react';

// Types
type Color = {
  name: string;
  label: string;
};

type ShippingInfo = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  [key: string]: string; // For other properties that might come from the API
};

type ProductData = {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  colors: Color[];
  sizes: string[];
  rating: number;
  reviews: number;
};

type SavedData = {
  selectedColor: string;
  selectedSize: string;
  cep: string;
  shippingInfo: ShippingInfo | null;
  quantity: number;
  timestamp: string;
};

// Dados do produto (simulando uma API)
const productData: ProductData = {
  id: 'tenis-esportivo-2023',
  title: 'Tênis Esportivo Premium',
  description: 'Tênis esportivo de alta performance com tecnologia de amortecimento avançada para maior conforto durante suas atividades físicas.',
  price: 299.90,
  discountPrice: 249.90,
  colors: [
    { name: 'preto', label: 'Preto' },
    { name: 'branco', label: 'Branco' },
    { name: 'azul', label: 'Azul' },
  ],
  sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
  rating: 4.7,
  reviews: 128,
};

const ProductPage = () => {
  // Estados
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [mainImage, setMainImage] = useState<string>('');
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [cep, setCep] = useState<string>('');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [cepError, setCepError] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Carregar dados salvos ao montar o componente
  useEffect(() => {
    const savedData = localStorage.getItem('productPageData');
    if (savedData) {
      try {
        const parsedData: SavedData = JSON.parse(savedData);
        const savedTime:Date = new Date(parsedData.timestamp);
        const now:Date = new Date();

        // Verificar se os dados têm menos de 15 minutos
        if ((now.getTime() - savedTime.getTime()) < 15 * 60 * 1000) {
          setSelectedColor(parsedData.selectedColor || '');
          setSelectedSize(parsedData.selectedSize || '');
          setCep(parsedData.cep || '');
          setQuantity(parsedData.quantity || 1);

          if (parsedData.selectedColor) {
            loadImages(parsedData.selectedColor);
          }

          if (parsedData.cep && parsedData.shippingInfo) {
            setShippingInfo(parsedData.shippingInfo);
          }
        } else {
          localStorage.removeItem('productPageData');
        }
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }

    // Se não houver cor selecionada, seleciona a primeira por padrão
    if (!selectedColor && productData.colors.length > 0) {
      handleColorSelect(productData.colors[0].name);
    }
  }, []);

  // Salvar dados sempre que houver alterações
  useEffect(() => {
    const dataToSave: SavedData = {
      selectedColor,
      selectedSize,
      cep,
      shippingInfo,
      quantity,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('productPageData', JSON.stringify(dataToSave));
  }, [selectedColor, selectedSize, cep, shippingInfo, quantity]);

  // Carregar imagens baseadas na cor selecionada
  const loadImages = (color: string) => {
    const images = [
      `tenis-01-${color}.avif`,
      `tenis-02-${color}.avif`,
      `tenis-03-${color}.avif`,
      `tenis-04-${color}.avif`,
    ];
    setMainImage(images[0]);
    setThumbnails(images);
    setSelectedColor(color);
  };

  // Selecionar cor
  const handleColorSelect = (color: string) => {
    loadImages(color);
  };

  // Selecionar tamanho
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  // Alterar imagem principal ao clicar na miniatura
  const handleThumbnailClick = (image: string) => {
    setMainImage(image);
  };

  // Consultar CEP
  const handleCepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCepError('');

    // Validar CEP
    const cleanedCep = cep.replace(/\D/g, '');
    if (cleanedCep.length !== 8) {
      setCepError('CEP deve conter 8 dígitos');
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data: ShippingInfo = await response.json();

      if (data.erro) {
        setCepError('CEP não encontrado');
        setShippingInfo(null);
      } else {
        setShippingInfo(data);
      }
    } catch (error) {
      setCepError('Erro ao consultar CEP. Tente novamente.');
      setShippingInfo(null);
    }
  };

  // Ajustar quantidade
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return;
    setQuantity(newQuantity);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Galeria de Imagens */}
        <div className="md:w-2/5">
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={`/${mainImage}`}
              alt={productData.title}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {thumbnails.map((thumb, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(thumb)}
                className={`cursor-pointer bg-gray-100 rounded-md overflow-hidden ${mainImage === thumb ? 'ring-2 ring-blue-500' : ''}`}
              >
                <img
                  src={`/${thumb}`}
                  alt={`${productData.title} - ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Informações do Produto */}
        <div className="md:w-3/5">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{productData.title}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(productData.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 ml-2">{productData.rating} ({productData.reviews} avaliações)</span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">R$ {productData.discountPrice.toFixed(2)}</span>
            {productData.discountPrice < productData.price && (
              <>
                <span className="text-lg text-gray-500 line-through ml-2">R$ {productData.price.toFixed(2)}</span>
                <span className="text-green-600 font-medium ml-2">
                  {Math.round((1 - productData.discountPrice / productData.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-700 mb-6">{productData.description}</p>

          {/* Seletor de Cores */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cor: {productData.colors.find(c => c.name === selectedColor)?.label}</h3>
            <div className="flex gap-2">
              {productData.colors.map(color => (
                <button
                  key={color.name}
                  onClick={() => handleColorSelect(color.name)}
                  className={`cursor-pointer w-10 h-10 rounded-full border-2 ${selectedColor === color.name ? 'border-blue-500' : 'border-gray-300'}`}
                  style={{ backgroundColor: color.name === 'branco' ? '#fff' : color.name === 'preto' ? '#000' : '#1e40af' }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Seletor de Tamanhos */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tamanho</h3>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`cursor-pointer px-4 py-2 border rounded-md ${selectedSize === size ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-800 border-gray-300'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Quantidade</h3>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="cursor-pointer px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1 border-t border-b border-gray-300 bg-white text-center w-12">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="cursor-pointer px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Botão de Comprar */}
          <button
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md mb-6 transition-colors"
            disabled={!selectedSize || !selectedColor}
          >
            Adicionar ao Carrinho
          </button>

          {/* Frete */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Calcular frete e prazo</h3>
            <form onSubmit={handleCepSubmit} className="flex gap-2 mb-2">
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="Digite seu CEP"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Calcular
              </button>
            </form>

            {cepError && (
              <p className="text-red-500 text-sm mb-2">{cepError}</p>
            )}

            {shippingInfo && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-700">
                  <span className="font-medium">Endereço:</span> {shippingInfo.logradouro}, {shippingInfo.bairro}, {shippingInfo.localidade} - {shippingInfo.uf}
                </p>
                <p className="text-gray-700 mt-1">
                  <span className="font-medium">Frete:</span> Grátis (entrega em 3-5 dias úteis)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;