import React from 'react';
import { X, Trash2, MessageCircle, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity
}) => {
  const WHATSAPP_NUMBER = '5589999867161';

  // Helper to parse price string to number
  const getPrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(',', '.'));
  };

  const total = cartItems.reduce((acc, item) => {
    return acc + (getPrice(item.preco) * item.quantity);
  }, 0);

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(total);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    let message = `*Eae! Vim do site Santos Urban Store.* 🛹\n\nGostaria de fechar esse pedido:\n\n`;
    
    cartItems.forEach(item => {
      const subtotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getPrice(item.preco) * item.quantity);
      // Added item.imagem to the message
      message += `▪ ${item.quantity}x ${item.nome} (${item.marca})\n   Preço: ${subtotal}\n   Foto: ${item.imagem}\n\n`;
    });

    message += `*Total: ${formattedTotal}*`;
    message += `\n\nAguardo confirmação!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col border-l-4 border-black"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-black text-white">
              <h2 className="font-display text-3xl mt-2 tracking-wide">Seu Carrinho</h2>
              <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4">
                  <p className="font-mono text-sm uppercase">O carrinho está vazio.</p>
                  <button onClick={onClose} className="text-black font-bold underline text-sm">
                    Voltar as compras
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="w-20 h-24 bg-neutral-100 flex-shrink-0 border border-neutral-200 overflow-hidden">
                      <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm uppercase leading-tight pr-2">{item.nome}</h3>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-500 font-mono uppercase mb-2">{item.marca}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono font-bold text-sm">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getPrice(item.preco) * item.quantity)}
                        </span>
                        
                        <div className="flex items-center border border-black rounded-sm overflow-hidden">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-2 py-1 hover:bg-neutral-100 font-mono text-sm"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 font-mono text-xs border-x border-black bg-neutral-50 min-w-[30px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-2 py-1 hover:bg-neutral-100 font-mono text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs uppercase font-bold text-neutral-500">Total Estimado</span>
                  <span className="font-display text-3xl text-black">{formattedTotal}</span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="group w-full bg-black text-white border-2 border-black py-4 px-6 rounded-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-white hover:text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                >
                  <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                  <span>Finalizar Pedido</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[10px] text-center text-neutral-400 mt-3 font-mono">
                  Checkout via WhatsApp Seguro
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};