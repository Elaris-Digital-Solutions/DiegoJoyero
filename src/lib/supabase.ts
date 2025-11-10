import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasSupabaseConfig = Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

if (!hasSupabaseConfig && import.meta.env.DEV) {
  console.warn('Supabase no está configurado. Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para cargar el catálogo.');
}

export const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null;

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  material: 'gold' | 'silver';
  category: string;
  image_url: string;
  stock: number;
  featured: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type ProductInsert = {
  name: string;
  description: string;
  price: number;
  material: 'gold' | 'silver';
  category: string;
  image_url: string;
  stock: number;
  featured?: boolean;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
};

export type ProductUpdate = Partial<ProductInsert> & {
  id: string;
};
