export interface Product {
  id: string;
  nome: string;
  marca: string;
  preco: string;
  imagem: string;
  categoria: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FilterState {
  category: string | null;
  brand: string | null;
}