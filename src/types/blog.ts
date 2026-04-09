export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  image: string;
  readTime: string;
}

export type BlogCategory = "Inteligência Artificial" | "Desenvolvimento" | "SaaS" | "Futuro" | "Engenharia";
