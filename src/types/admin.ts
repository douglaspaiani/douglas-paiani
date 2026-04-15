export interface User {
  id: string;
  username: string;
  name: string;
  cargo?: string | null;
  bio?: string | null;
  fotoPerfil?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML or Markdown
  categoryId: string;
  createdAt: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface Orcamento {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string | null;
  tipoProjeto: string;
  urgencia: string;
  descricao: string;
  visualizado: boolean;
  visualizadoEm?: string | null;
  createdAt: string;
  updatedAt: string;
}
