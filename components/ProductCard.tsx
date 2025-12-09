import React, { useState } from 'react';
import { ShoppingBag, ImageOff, ZoomIn, X } from 'lucide-react';
import { Product } from '../types';
import { createPortal } from 'react-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Format price to currency BRL
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(product.preco.replace(',', '.')));

  const handleZoomToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomOpen(!isZoomOpen);
  };

  return (
    <>
      <div className="group relative flex flex-col bg-white border border-neutral-200 hover:border-black transition-colors duration-300 shadow-sm hover:shadow-lg">
        {/* Image Container */}
        <div 
          className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-100 flex items-center justify-center cursor-pointer"
          onClick={handleZoomToggle}
          title="Clique para ampliar"
        >
          
          {/* Skeleton Loading State */}
          {!isLoaded && !imgError && (
            <div className="absolute inset-0 bg-neutral-200 animate-pulse z-0" />
          )}
          
          {!imgError ? (
            <img
              src={product.imagem}
              alt={product.nome}
              // AJUSTE: group-hover:scale-110 para um zoom mais forte no hover
              className={`relative w-full h-full object-cover grayscale transition-all duration-500 ease-in-out group-hover:grayscale-0 group-hover:scale-110 z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                setImgError(true);
                setIsLoaded(true);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-400 p-4 text-center z-10">
              <ImageOff size={32} className="mb-2 opacity-50" />
              <span className="text-[10px] uppercase font-mono tracking-wider">Sem Imagem</span>
            </div>
          )}
          
          {/* Zoom Icon Overlay (Visible on Hover) */}
          {!imgError && isLoaded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 pointer-events-none">
              <div className="bg-white/80 p-2 rounded-full backdrop-blur-sm shadow-md">
                <ZoomIn size={20} className="text-black" />
              </div>
            </div>
          )}

          {/* Brand Tag Overlay */}
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm border border-black/10 px-2 py-0.5 shadow-sm z-20 pointer-events-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black">
              {product.marca}
            </span>
          </div>
        </div>

        {/* Product Info - Compact Version */}
        <div className="p-3 flex flex-col flex-grow justify-between border-t border-neutral-100 bg-white z-10">
          <div>
            <h3 className="text-sm font-bold text-black leading-tight mb-0.5 font-sans uppercase tracking-tight line-clamp-2">
              {product.nome}
            </h3>
            <p className="text-[10px] text-neutral-500 font-mono mb-2">
              {product.categoria}
            </p>
          </div>

          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-bold text-black font-mono">
              {formattedPrice}
            </span>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="p-1.5 bg-black text-white hover:bg-neutral-800 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center rounded-sm"
              aria-label="Adicionar ao carrinho"
              title="Adicionar ao Carrinho"
            >
              <ShoppingBag size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {isZoomOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={handleZoomToggle}
        >
          <button 
            onClick={handleZoomToggle}
            className="absolute top-4 right-4 text-white hover:text-neutral-300 p-2 bg-white/10 rounded-full transition-colors z-[101]"
          >
            <X size={32} />
          </button>
          
          <div 
            className="relative max-w-full max-h-full overflow-hidden rounded-md shadow-2xl border-4 border-black bg-white"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking image itself
          >
            <img 
              src={product.imagem} 
              alt={product.nome} 
              className="max-w-[95vw] max-h-[90vh] object-contain" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4 text-center">
              <h3 className="text-lg font-bold font-display uppercase tracking-wider">{product.nome}</h3>
              <p className="text-sm font-mono text-neutral-400">{product.marca} • {formattedPrice}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};