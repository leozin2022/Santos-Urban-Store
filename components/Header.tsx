import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface HeaderProps {
  categories: string[];
  onCategorySelect: (category: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ categories, onCategorySelect, cartCount, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white shadow-md">
      {/* Container ajustado para não vazar do Shape arredondado */}
      <div className="w-full px-5 py-4 flex items-center justify-between">
        
        {/* Logo - Ajustado tamanho para caber no celular sem quebrar a borda redonda */}
        <div className="flex-1 text-left">
          <h1 
            onClick={() => onCategorySelect('')}
            className="font-display text-xl sm:text-3xl md:text-4xl uppercase select-none cursor-pointer leading-none tracking-wider hover:scale-105 transition-transform origin-left"
          >
            <span className="text-white [-webkit-text-stroke:1px_black] drop-shadow-[2px_2px_0_rgba(255,255,255,0.2)]">
              Santos Urban Store
            </span>
          </h1>
        </div>

        {/* Desktop Nav - Agora dinâmico baseado na planilha */}
        {categories.length > 0 && (
          <nav className="hidden md:flex gap-4 lg:gap-6 mx-4">
            {categories.map((item) => (
              <button 
                key={item} 
                onClick={() => onCategorySelect(item)}
                className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors hover:underline decoration-2 underline-offset-4 bg-transparent border-none cursor-pointer"
              >
                {item}
              </button>
            ))}
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center flex-shrink-0 z-50 pl-2">
          <div className="relative group cursor-pointer hover:scale-110 transition-transform duration-200">
            <button 
              onClick={onOpenCart}
              className="text-black bg-white hover:bg-neutral-200 transition-colors p-2.5 rounded-full border-2 border-black shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            >
              <ShoppingCart size={20} strokeWidth={2.5} />
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-black shadow-sm animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Grip tape texture line */}
      <div className="h-1 w-full bg-neutral-800 bg-[url('https://www.transparenttextures.com/patterns/asphalt-dark.png')] opacity-50"></div>
    </header>
  );
};