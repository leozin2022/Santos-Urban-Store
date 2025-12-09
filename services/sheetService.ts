import Papa from 'papaparse';
import { Product } from '../types';

// Função auxiliar para corrigir links
const normalizeImageUrl = (url: string) => {
  if (!url) return '';
  let cleanUrl = url.trim();
  
  // 0. OTIMIZAÇÃO: Se for uma imagem em Base64 (código colado direto), retorna imediatamente.
  // Isso evita processamento desnecessário de strings gigantes.
  if (cleanUrl.startsWith('data:image')) {
    return cleanUrl;
  }

  // 1. Se for um link do Google Drive
  // Suporta formatos: 
  // - drive.google.com/file/d/ID/view
  // - drive.google.com/open?id=ID
  // - drive.google.com/uc?id=ID
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com')) {
    const idMatch = cleanUrl.match(/\/d\/(.+?)(\/|$)/) || cleanUrl.match(/id=(.+?)($|&)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
  }

  // 2. Se for um link de Resultado de Busca do Google (google.com/imgres?...)
  if (cleanUrl.includes('google.com') && (cleanUrl.includes('/imgres') || cleanUrl.includes('/search'))) {
    try {
      const urlObj = new URL(cleanUrl);
      const imgUrl = urlObj.searchParams.get('imgurl');
      if (imgUrl) {
        return imgUrl;
      }
    } catch (e) {
      console.warn('Falha ao extrair imagem do link do Google:', e);
    }
  }

  // 3. Imgur e outros CDNs comuns: garantir que usem HTTPS
  if (cleanUrl.startsWith('http://') && (cleanUrl.includes('imgur.com') || cleanUrl.includes('cloudinary'))) {
      return cleanUrl.replace('http://', 'https://');
  }

  // 4. Retorna o link original (funciona para links diretos .jpg, .png, etc)
  return cleanUrl;
};

export const fetchProducts = async (url: string): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    // Adiciona timestamp para evitar cache do navegador e ter comportamento ISR
    const freshUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;

    Papa.parse(freshUrl, {
      download: true,
      header: true,
      skipEmptyLines: true, // Ignora linhas vazias
      complete: (results) => {
        const data = results.data as Product[];
        
        // Filtra produtos válidos e corrige as URLs das imagens
        const validProducts = data
          .filter(p => p.id && p.nome) // Garante que tem ID e Nome
          .map(p => ({
            ...p,
            imagem: normalizeImageUrl(p.imagem) // Corrige o link da imagem
          }));
          
        resolve(validProducts);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};