import React, { useEffect, useState, useMemo } from 'react';
import { fetchProducts } from './services/sheetService';
import { Product, CartItem } from './types';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { Loader2, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

// --- CONFIGURAÇÃO ---
// COLUNAS NECESSÁRIAS NA PLANILHA (Linha 1):
// id | nome | marca | preco | imagem | categoria

// Link configurado para exportação direta da sua planilha
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1-2EAGtQgAnAt_0-rlllZxPO7fxYZAFxF0rXE5qTZ6v0/export?format=csv'; 

// Componente da Roda de Skate
const SkateboardWheel = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const styles = {
    tl: "top-16 -left-10 md:-left-12",
    tr: "top-16 -right-10 md:-right-12",
    bl: "bottom-16 -left-10 md:-left-12",
    br: "bottom-16 -right-10 md:-right-12",
  };

  return (
    <div className={`absolute ${styles[position]} z-0`}>
      {/* Eixo (Truck) */}
      <div className={`absolute w-14 h-6 bg-neutral-400 border-2 border-black top-1/2 -translate-y-1/2 
        ${position.includes('l') ? 'left-8' : 'right-8'}`} 
      />
      
      {/* A Roda */}
      <div className="w-14 h-14 md:w-16 md:h-16 bg-black rounded-full border-[5px] border-white shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden group">
        <div className="w-6 h-6 bg-neutral-300 rounded-full border-[3px] border-neutral-500 flex items-center justify-center z-10">
            <div className="w-2 h-2 bg-black rounded-full opacity-50"></div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-10 rounded-r-full"></div>
        <div className="absolute inset-0 animate-[spin_0.5s_linear_infinite]">
            <div className="w-1.5 h-1.5 bg-white absolute top-1.5 left-1/2 -translate-x-1/2 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const TruckBolts = ({ location }: { location: 'top' | 'bottom' }) => (
  <div className={`flex gap-16 justify-center py-4 select-none opacity-80 ${location === 'top' ? 'mb-2' : 'mt-2'}`}>
    <div className="grid grid-cols-2 gap-x-12 gap-y-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="w-2.5 h-2.5 bg-black rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5)] border border-neutral-700"></div>
      ))}
    </div>
  </div>
);

const GraffitiBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
     <h1 className="absolute top-[8%] left-[5%] font-display text-[4rem] sm:text-[6rem] text-black opacity-[0.06] -rotate-12 whitespace-nowrap">
        Só os Loucos Sabem
     </h1>
     <h1 className="absolute top-[25%] right-[-10%] font-display text-[5rem] sm:text-[8rem] text-black opacity-[0.05] rotate-6 whitespace-nowrap leading-none text-right">
        Dias de Luta<br/>Dias de Glória
     </h1>
     <h1 className="absolute top-[50%] left-[-5%] font-display text-[4rem] sm:text-[9rem] text-black opacity-[0.06] -rotate-3 whitespace-nowrap">
        Skate or Die
     </h1>
     <h1 className="absolute bottom-[20%] right-[2%] font-display text-[3rem] sm:text-[5rem] text-black opacity-[0.05] rotate-12 whitespace-nowrap">
        Charlie Brown Jr
     </h1>
      <h1 className="absolute bottom-[5%] left-[10%] font-display text-[6rem] sm:text-[10rem] text-black opacity-[0.04] -rotate-6 whitespace-nowrap">
        013
     </h1>
  </div>
);

// Frases laterais estilo pixação com fundo preto
// AJUSTE: Aumentado o afastamento (-left-24 para -left-32 / -right-24 para -right-32 e lg:-left-44) para não colar no skate
const SideGraffiti = () => (
  <>
    {/* Lado Esquerdo - Vertical bottom-to-top */}
    <div className="absolute -left-28 lg:-left-48 top-0 h-full hidden md:flex flex-col justify-center z-20 pointer-events-none">
      <div className="bg-black py-10 px-3 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] rotate-180 [writing-mode:vertical-rl] rounded-sm border-2 border-neutral-900">
        <h2 className="font-display text-white text-2xl lg:text-4xl whitespace-nowrap select-none tracking-[0.2em] leading-relaxed drop-shadow-lg uppercase">
          Meu escritório é na praia
        </h2>
      </div>
    </div>

    {/* Lado Direito - Vertical top-to-bottom */}
    <div className="absolute -right-28 lg:-right-48 top-0 h-full hidden md:flex flex-col justify-center z-20 pointer-events-none">
      <div className="bg-black py-10 px-3 shadow-[-4px_4px_0px_rgba(0,0,0,0.2)] [writing-mode:vertical-rl] rounded-sm border-2 border-neutral-900">
        <h2 className="font-display text-white text-2xl lg:text-4xl whitespace-nowrap select-none tracking-[0.2em] leading-relaxed drop-shadow-lg uppercase">
          Tamo Aí Na Atividade
        </h2>
      </div>
    </div>
  </>
);

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filters
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Initial Fetch
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!SHEET_URL) {
         throw new Error("URL_NOT_CONFIGURED"); 
      }
      
      const data = await fetchProducts(SHEET_URL);
      setProducts(data);
      
    } catch (err: any) {
       console.log("Erro ao carregar planilha (provavelmente vazia ou privada), usando dados de exemplo.", err);
       
       // Fallback mock para demonstração se a planilha não estiver conectada
       const mockData: Product[] = [
           { id: '1', nome: 'Shape Maple Pro', marca: 'Santa Cruz', preco: '389.90', imagem: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?q=80&w=1000&auto=format&fit=crop', categoria: 'Shape' },
           { id: '2', nome: 'Trucks Titanium', marca: 'Independent', preco: '449.90', imagem: 'https://images.unsplash.com/photo-1567516364583-b9dc6e868972?q=80&w=1000&auto=format&fit=crop', categoria: 'Trucks' },
           { id: '3', nome: 'Rodas 54mm 99a', marca: 'Spitfire', preco: '229.90', imagem: 'https://images.unsplash.com/photo-1531565637446-32307b194362?q=80&w=1000&auto=format&fit=crop', categoria: 'Rodas' },
           { id: '4', nome: 'Oversized Graffiti Tee', marca: 'Stussy', preco: '189.90', imagem: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop', categoria: 'Wear' },
           { id: '5', nome: 'Urban Cargo Pants', marca: 'Nike', preco: '349.90', imagem: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop', categoria: 'Wear' },
           { id: '6', nome: 'Skate High Pro', marca: 'Vans', preco: '429.90', imagem: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop', categoria: 'Wear' },
           { id: '7', nome: 'Hoodie Essential', marca: 'Adidas', preco: '399.90', imagem: 'https://images.unsplash.com/photo-1556906781-9a412961d289?q=80&w=1000&auto=format&fit=crop', categoria: 'Wear' },
       ];
       setProducts(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Derive unique brands for filters (Sorted)
  const brands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.marca).filter(Boolean))).sort();
  }, [products]);

  // Derive unique categories dynamically (Sorted)
  const categories = useMemo(() => {
    return Array.from(new Set(
      products
        .map(p => p.categoria?.trim()) // Trim whitespace
        .filter(Boolean)
    )).sort();
  }, [products]);

  // Filter Logic
  const filteredProducts = products.filter(product => {
    if (selectedBrand && product.marca !== selectedBrand) return false;
    if (selectedCategory && product.categoria.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    return true;
  });

  const handleCategorySelect = (category: string) => {
    // If empty string, reset filter
    setSelectedCategory(category === '' ? null : category);
    // Reset brand filter when switching major categories to avoid empty results
    setSelectedBrand(null);
    
    // Scroll to products grid
    const gridElement = document.getElementById('product-grid');
    if (gridElement) {
        gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBrandSelect = (brand: string) => {
    // If clicking same brand, toggle off. Else set new brand.
    const newBrand = selectedBrand === brand ? null : brand;
    setSelectedBrand(newBrand);
    
    // Reset category filter when selecting a brand to ensure the user sees all products of that brand
    // This creates a "vice-versa" clearing effect for better UX
    if (newBrand) {
        setSelectedCategory(null);
    }

    // Scroll to products grid
    const gridElement = document.getElementById('product-grid');
    if (gridElement) {
        gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --- CART ACTIONS ---
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Open cart immediately to show feedback
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  // Calculate total items for badge
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen py-10 px-2 sm:px-4 flex justify-center relative">
      
      {/* Cart Drawer Component */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Wrapper do Shape do Skate - Standard Size (max-w-3xl) */}
      <div className="relative w-full max-w-3xl group z-10">
        
        {/* Elementos de Pixação Laterais */}
        <SideGraffiti />
        
        {/* RODAS */}
        <SkateboardWheel position="tl" />
        <SkateboardWheel position="tr" />
        <SkateboardWheel position="bl" />
        <SkateboardWheel position="br" />

        {/* O Shape (Deck) */}
        <div className="relative bg-white border-[6px] md:border-[8px] border-black rounded-[50px] md:rounded-[70px] overflow-hidden shadow-[0_25px_60px_-10px_rgba(0,0,0,0.6)] min-h-[90vh] flex flex-col transform transition-transform duration-[2000ms] hover:scale-[1.01]">
          
          <GraffitiBackground />
          
          <div className="relative z-10 flex flex-col min-h-full">
            <Header 
              categories={categories}
              onCategorySelect={handleCategorySelect} 
              cartCount={cartCount} 
              onOpenCart={() => setIsCartOpen(true)}
            />
            
            {/* Parafusos Superiores */}
            <TruckBolts location="top" />

            <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
              
              {/* Hero Section */}
              <div className="mb-8 border-b-2 border-black pb-6 mx-auto max-w-2xl text-center">
                 <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-black uppercase leading-[0.9] tracking-wide transform -rotate-1 drop-shadow-lg">
                  <span className="whitespace-nowrap">Essa é minha cidade,</span><br/>
                  esse é meu time,<br/>
                  <span>Eu vim de Santos! 🎵</span>
                </h2>
                <p className="mt-4 text-black font-bold uppercase tracking-widest text-[10px] sm:text-xs bg-black text-white inline-block px-4 py-1.5 rotate-1 shadow-lg">
                  Chorão Eterno • 013
                </p>
              </div>

              {/* Filters Toolbar */}
              <div id="product-grid" className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm pb-2 pt-2 mb-6 border-b-2 border-neutral-100 mx-auto max-w-4xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar justify-center w-full md:w-auto px-4 md:px-0">
                    <Filter size={14} className="text-black mr-2 flex-shrink-0" />
                    
                    {/* Botão TODOS */}
                    <button
                      onClick={() => { setSelectedBrand(null); setSelectedCategory(null); }}
                      className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 transition-all whitespace-nowrap transform hover:-translate-y-0.5
                        ${!selectedBrand && !selectedCategory
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-black border-black hover:bg-neutral-100'}`}
                    >
                      Todos
                    </button>

                    {/* Divisor Visual para Categorias */}
                    <div className="w-px h-4 bg-neutral-300 mx-1 flex-shrink-0" />

                    {/* CATEGORIAS (Importante para Mobile) */}
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 transition-all whitespace-nowrap transform hover:-translate-y-0.5
                          ${selectedCategory === cat 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-black border-black hover:bg-neutral-100'}`}
                      >
                        {cat}
                      </button>
                    ))}

                    {/* Divisor Visual para Marcas */}
                    {brands.length > 0 && categories.length > 0 && (
                       <div className="w-px h-4 bg-neutral-300 mx-1 flex-shrink-0" />
                    )}

                    {/* MARCAS */}
                    {brands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => handleBrandSelect(brand)}
                        className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 transition-all whitespace-nowrap transform hover:-translate-y-0.5
                          ${selectedBrand === brand 
                            ? 'bg-neutral-800 text-white border-neutral-800' 
                            : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="animate-spin text-black" size={32} />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }} 
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ 
                        duration: 0.5, 
                        delay: (index % 4) * 0.05, 
                        ease: "easeOut" 
                      }}
                    >
                      <ProductCard 
                        product={product} 
                        onAddToCart={handleAddToCart}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-neutral-500 font-mono text-sm">
                    {selectedCategory 
                      ? `Nenhum item encontrado em "${selectedCategory}"` 
                      : 'Nada encontrado.'}
                  </p>
                  <button 
                    onClick={() => { setSelectedCategory(null); setSelectedBrand(null); }}
                    className="mt-4 text-xs font-bold underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </main>

            {/* Parafusos Inferiores */}
            <TruckBolts location="bottom" />

            {/* Footer */}
            <footer className="bg-black py-8 mt-auto border-t-4 border-black text-center relative z-20 pb-16 px-4">
              <h2 className="font-display text-2xl md:text-3xl text-white mb-6 [-webkit-text-stroke:1px_black] drop-shadow-[2px_2px_0_rgba(255,255,255,0.2)]">
                Santos Urban Store
              </h2>
              <p className="text-white font-['Arial'] font-bold text-xl md:text-2xl tracking-wide leading-relaxed transform -rotate-1">
                 " Já se foi aquele tempo da ladeira, irmão! "
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;