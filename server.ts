import express, { NextFunction, Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod";
import { Prisma, PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const PORTA = 3000;
const SEGREDO_JWT = process.env.JWT_SECRET || "fallback_secret";
const prisma = new PrismaClient();
const CHAVE_ACESSO_SITE_PRINCIPAL = "site:principal";

interface DadosToken {
  id: string;
  username: string;
}

interface RequisicaoAutenticada extends Request {
  usuarioToken?: DadosToken;
}

const esquemaLogin = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

const esquemaPerfil = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  username: z.string().trim().min(3).max(60).optional(),
  password: z.string().min(6).max(120).optional().or(z.literal("")),
});

const esquemaCriarCategoria = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).optional(),
});

const esquemaAtualizarCategoria = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).optional(),
});

const esquemaPostagem = z.object({
  title: z.string().trim().min(3).max(220),
  slug: z.string().trim().min(3).max(240).optional(),
  content: z.string().trim().min(10),
  categoryId: z.string().trim().min(1),
  seoTitle: z.string().trim().max(220).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(320).optional().or(z.literal("")),
  seoKeywords: z.string().trim().max(320).optional().or(z.literal("")),
});

const esquemaCriarOrcamento = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8).max(30),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  projectType: z.string().trim().min(2).max(120),
  urgency: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(5000),
});

app.use(express.json());

function gerarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extrairTokenCabecalho(cabecalho?: string) {
  if (!cabecalho) return null;
  const partes = cabecalho.split(" ");
  if (partes.length !== 2 || partes[0] !== "Bearer") return null;
  return partes[1];
}

function autenticarRequisicao(req: RequisicaoAutenticada, res: Response, next: NextFunction) {
  const token = extrairTokenCabecalho(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    const tokenDecodificado = jwt.verify(token, SEGREDO_JWT) as DadosToken;
    req.usuarioToken = tokenDecodificado;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

function responderErroValidacao(erro: unknown, res: Response) {
  if (erro instanceof z.ZodError) {
    return res.status(400).json({ error: erro.issues[0]?.message || "Dados inválidos" });
  }

  return res.status(500).json({ error: "Erro interno do servidor" });
}

async function incrementarMetricaAcesso(chave: string) {
  await prisma.metricaAcesso.upsert({
    where: { chave },
    create: {
      chave,
      total: 1,
    },
    update: {
      total: {
        increment: 1,
      },
    },
  });
}

async function garantirAdministradorInicial() {
  const usernameAdmin = process.env.ADMIN_USERNAME || "admin";
  const senhaAdmin = process.env.ADMIN_PASSWORD || "admin123";

  const usuarioExistente = await prisma.user.findUnique({
    where: { username: usernameAdmin },
  });

  if (!usuarioExistente) {
    const senhaHash = await bcrypt.hash(senhaAdmin, 10);
    await prisma.user.create({
      data: {
        username: usernameAdmin,
        passwordHash: senhaHash,
        name: "Administrador",
      },
    });
  }
}

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = esquemaLogin.parse(req.body);

    const usuario = await prisma.user.findUnique({ where: { username } });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(password, usuario.passwordHash);
    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: usuario.id, username: usuario.username }, SEGREDO_JWT, {
      expiresIn: "1d",
    });

    return res.json({
      token,
      user: {
        id: usuario.id,
        username: usuario.username,
        name: usuario.name,
      },
    });
  } catch (erro) {
    return responderErroValidacao(erro, res);
  }
});

app.get("/api/auth/me", autenticarRequisicao, async (req: RequisicaoAutenticada, res) => {
  const idUsuario = req.usuarioToken?.id;
  if (!idUsuario) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const usuario = await prisma.user.findUnique({ where: { id: idUsuario } });
  if (!usuario) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  return res.json({ id: usuario.id, username: usuario.username, name: usuario.name });
});

app.put("/api/auth/profile", autenticarRequisicao, async (req: RequisicaoAutenticada, res) => {
  try {
    const dadosPerfil = esquemaPerfil.parse(req.body);
    const idUsuario = req.usuarioToken?.id;

    if (!idUsuario) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    const dadosAtualizacao: Prisma.UserUpdateInput = {};

    if (dadosPerfil.name) {
      dadosAtualizacao.name = dadosPerfil.name;
    }

    if (dadosPerfil.username) {
      dadosAtualizacao.username = dadosPerfil.username;
    }

    if (dadosPerfil.password && dadosPerfil.password.trim()) {
      dadosAtualizacao.passwordHash = await bcrypt.hash(dadosPerfil.password, 10);
    }

    if (Object.keys(dadosAtualizacao).length === 0) {
      return res.status(400).json({ error: "Nenhuma alteração enviada" });
    }

    const usuarioAtualizado = await prisma.user.update({
      where: { id: idUsuario },
      data: dadosAtualizacao,
    });

    return res.json({
      success: true,
      user: {
        id: usuarioAtualizado.id,
        username: usuarioAtualizado.username,
        name: usuarioAtualizado.name,
      },
    });
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002") {
      return res.status(409).json({ error: "Este usuário já está em uso" });
    }
    return responderErroValidacao(erro, res);
  }
});

app.get("/api/admin/dashboard", autenticarRequisicao, async (_req, res) => {
  try {
    const inicioDoDia = new Date();
    inicioDoDia.setHours(0, 0, 0, 0);

    const [
      totalPostagens,
      totalCategorias,
      totalUsuarios,
      totalPostagensHoje,
      totalOrcamentosNaoVisualizados,
      metricaSitePrincipal,
      metricasAcessoPostagens,
      postagensRecentes,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.post.count({
        where: {
          createdAt: {
            gte: inicioDoDia,
          },
        },
      }),
      prisma.orcamento.count({
        where: {
          visualizado: false,
        },
      }),
      prisma.metricaAcesso.findUnique({
        where: {
          chave: CHAVE_ACESSO_SITE_PRINCIPAL,
        },
      }),
      prisma.metricaAcesso.findMany({
        where: {
          chave: {
            startsWith: "post:",
          },
        },
      }),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return res.json({
      totais: {
        postagens: totalPostagens,
        categorias: totalCategorias,
        usuarios: totalUsuarios,
        postagensHoje: totalPostagensHoje,
        orcamentosNaoVisualizados: totalOrcamentosNaoVisualizados,
        acessosSitePrincipal: metricaSitePrincipal?.total || 0,
      },
      acessosPostagens: metricasAcessoPostagens.map((metrica) => ({
        slug: metrica.chave.replace("post:", ""),
        total: metrica.total,
      })),
      atividadesRecentes: postagensRecentes.map((postagem) => ({
        id: postagem.id,
        titulo: postagem.title,
        criadoEm: postagem.createdAt,
        autor: postagem.author.name,
      })),
      statusSistema: {
        api: "Operacional",
        banco: "Conectado",
      },
    });
  } catch (erro) {
    console.error("Erro ao carregar dashboard:", erro);
    return res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
});

app.post("/api/analytics/site-principal", async (_req, res) => {
  try {
    await incrementarMetricaAcesso(CHAVE_ACESSO_SITE_PRINCIPAL);
    return res.status(201).json({ success: true });
  } catch (erro) {
    console.error("Erro ao registrar acesso do site principal:", erro);
    return res.status(500).json({ error: "Erro ao registrar acesso" });
  }
});

app.post("/api/analytics/postagens/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const postagem = await prisma.post.findUnique({ where: { slug } });
    if (!postagem) {
      return res.status(404).json({ error: "Postagem não encontrada" });
    }

    await incrementarMetricaAcesso(`post:${slug}`);
    return res.status(201).json({ success: true });
  } catch (erro) {
    console.error("Erro ao registrar acesso da postagem:", erro);
    return res.status(500).json({ error: "Erro ao registrar acesso" });
  }
});

app.get("/api/admin/analytics/acessos", autenticarRequisicao, async (_req, res) => {
  try {
    const [metricaSite, postagens, metricasPostagens] = await Promise.all([
      prisma.metricaAcesso.findUnique({
        where: { chave: CHAVE_ACESSO_SITE_PRINCIPAL },
      }),
      prisma.post.findMany({
        select: {
          slug: true,
          title: true,
        },
      }),
      prisma.metricaAcesso.findMany({
        where: {
          chave: {
            startsWith: "post:",
          },
        },
      }),
    ]);

    const titulosPorSlug = new Map(postagens.map((postagem) => [postagem.slug, postagem.title]));
    const acessosPorPostagem = metricasPostagens
      .map((metrica) => {
        const slug = metrica.chave.replace("post:", "");
        return {
          slug,
          titulo: titulosPorSlug.get(slug) || slug,
          total: metrica.total,
        };
      })
      .sort((a, b) => b.total - a.total);

    return res.json({
      sitePrincipal: metricaSite?.total || 0,
      postagens: acessosPorPostagem,
    });
  } catch (erro) {
    console.error("Erro ao carregar métricas de acesso:", erro);
    return res.status(500).json({ error: "Erro ao carregar métricas de acesso" });
  }
});

app.post("/api/orcamentos", async (req, res) => {
  try {
    const dadosOrcamento = esquemaCriarOrcamento.parse(req.body);

    const orcamentoCriado = await prisma.orcamento.create({
      data: {
        nome: dadosOrcamento.name,
        email: dadosOrcamento.email,
        telefone: dadosOrcamento.phone,
        empresa: dadosOrcamento.company || null,
        tipoProjeto: dadosOrcamento.projectType,
        urgencia: dadosOrcamento.urgency,
        descricao: dadosOrcamento.description,
      },
    });

    return res.status(201).json({ id: orcamentoCriado.id, success: true });
  } catch (erro) {
    return responderErroValidacao(erro, res);
  }
});

app.get("/api/admin/orcamentos", autenticarRequisicao, async (_req, res) => {
  try {
    const orcamentos = await prisma.orcamento.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json(orcamentos);
  } catch (erro) {
    console.error("Erro ao listar orçamentos:", erro);
    return res.status(500).json({ error: "Erro ao listar orçamentos" });
  }
});

app.get("/api/admin/orcamentos/resumo", autenticarRequisicao, async (_req, res) => {
  try {
    const [total, naoVisualizados] = await Promise.all([
      prisma.orcamento.count(),
      prisma.orcamento.count({ where: { visualizado: false } }),
    ]);

    return res.json({ total, naoVisualizados });
  } catch (erro) {
    console.error("Erro ao carregar resumo de orçamentos:", erro);
    return res.status(500).json({ error: "Erro ao carregar resumo de orçamentos" });
  }
});

app.patch("/api/admin/orcamentos/:id/visualizar", autenticarRequisicao, async (req, res) => {
  const { id } = req.params;

  try {
    const orcamentoAtualizado = await prisma.orcamento.update({
      where: { id },
      data: {
        visualizado: true,
        visualizadoEm: new Date(),
      },
    });

    return res.json({ success: true, orcamento: orcamentoAtualizado });
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2025") {
      return res.status(404).json({ error: "Orçamento não encontrado" });
    }
    console.error("Erro ao marcar orçamento como visualizado:", erro);
    return res.status(500).json({ error: "Erro ao atualizar orçamento" });
  }
});

app.delete("/api/admin/orcamentos/:id", autenticarRequisicao, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.orcamento.delete({
      where: { id },
    });

    return res.json({ success: true });
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2025") {
      return res.status(404).json({ error: "Orçamento não encontrado" });
    }
    console.error("Erro ao excluir orçamento:", erro);
    return res.status(500).json({ error: "Erro ao excluir orçamento" });
  }
});

app.get("/api/categories", async (_req, res) => {
  const categorias = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return res.json(categorias);
});

app.post("/api/categories", autenticarRequisicao, async (req, res) => {
  try {
    const dadosCategoria = esquemaCriarCategoria.parse(req.body);
    const slug = gerarSlug(dadosCategoria.slug || dadosCategoria.name);

    const categoriaCriada = await prisma.category.create({
      data: {
        name: dadosCategoria.name,
        slug,
      },
    });

    return res.status(201).json(categoriaCriada);
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002") {
      return res.status(409).json({ error: "Categoria já existe" });
    }
    return responderErroValidacao(erro, res);
  }
});

app.put("/api/categories/:id", autenticarRequisicao, async (req, res) => {
  try {
    const { id } = req.params;
    const dadosCategoria = esquemaAtualizarCategoria.parse(req.body);
    const slug = gerarSlug(dadosCategoria.slug || dadosCategoria.name);

    const categoriaAtualizada = await prisma.category.update({
      where: { id },
      data: {
        name: dadosCategoria.name,
        slug,
      },
    });

    return res.json(categoriaAtualizada);
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2025") {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002") {
      return res.status(409).json({ error: "Já existe outra categoria com esse nome ou slug" });
    }
    return responderErroValidacao(erro, res);
  }
});

app.delete("/api/categories/:id", autenticarRequisicao, async (req, res) => {
  const { id } = req.params;

  const totalPostagens = await prisma.post.count({ where: { categoryId: id } });
  if (totalPostagens > 0) {
    return res.status(409).json({
      error: "Categoria possui postagens vinculadas. Edite ou exclua as postagens antes.",
    });
  }

  try {
    await prisma.category.delete({ where: { id } });
    return res.json({ success: true });
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2025") {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    return res.status(500).json({ error: "Erro ao excluir categoria" });
  }
});

app.get("/api/posts", async (_req, res) => {
  const postagens = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return res.json(postagens);
});

app.get("/api/posts/slug/:slug", async (req, res) => {
  const { slug } = req.params;
  const postagem = await prisma.post.findUnique({ where: { slug } });

  if (!postagem) {
    return res.status(404).json({ error: "Postagem não encontrada" });
  }

  return res.json(postagem);
});

app.get("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const postagem = await prisma.post.findUnique({ where: { id } });

  if (!postagem) {
    return res.status(404).json({ error: "Postagem não encontrada" });
  }

  return res.json(postagem);
});

app.post("/api/posts", autenticarRequisicao, async (req: RequisicaoAutenticada, res) => {
  try {
    const dadosPostagem = esquemaPostagem.parse(req.body);
    const idUsuario = req.usuarioToken?.id;

    if (!idUsuario) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    const categoria = await prisma.category.findUnique({
      where: { id: dadosPostagem.categoryId },
    });

    if (!categoria) {
      return res.status(400).json({ error: "Categoria inválida" });
    }

    const slug = gerarSlug(dadosPostagem.slug || dadosPostagem.title);

    const postagemCriada = await prisma.post.create({
      data: {
        title: dadosPostagem.title,
        slug,
        content: dadosPostagem.content,
        categoryId: dadosPostagem.categoryId,
        authorId: idUsuario,
        seoTitle: dadosPostagem.seoTitle || null,
        seoDescription: dadosPostagem.seoDescription || null,
        seoKeywords: dadosPostagem.seoKeywords || null,
      },
    });

    return res.status(201).json(postagemCriada);
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002") {
      return res.status(409).json({ error: "Já existe postagem com esse slug" });
    }
    return responderErroValidacao(erro, res);
  }
});

app.put("/api/posts/:id", autenticarRequisicao, async (req, res) => {
  try {
    const { id } = req.params;
    const dadosPostagem = esquemaPostagem.parse(req.body);

    const categoria = await prisma.category.findUnique({
      where: { id: dadosPostagem.categoryId },
    });

    if (!categoria) {
      return res.status(400).json({ error: "Categoria inválida" });
    }

    const slug = gerarSlug(dadosPostagem.slug || dadosPostagem.title);

    const postagemAtualizada = await prisma.post.update({
      where: { id },
      data: {
        title: dadosPostagem.title,
        slug,
        content: dadosPostagem.content,
        categoryId: dadosPostagem.categoryId,
        seoTitle: dadosPostagem.seoTitle || null,
        seoDescription: dadosPostagem.seoDescription || null,
        seoKeywords: dadosPostagem.seoKeywords || null,
      },
    });

    return res.json(postagemAtualizada);
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2025") {
      return res.status(404).json({ error: "Postagem não encontrada" });
    }
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002") {
      return res.status(409).json({ error: "Já existe postagem com esse slug" });
    }
    return responderErroValidacao(erro, res);
  }
});

app.delete("/api/posts/:id", autenticarRequisicao, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.post.delete({ where: { id } });
    return res.json({ success: true });
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2025") {
      return res.status(404).json({ error: "Postagem não encontrada" });
    }
    return res.status(500).json({ error: "Erro ao excluir postagem" });
  }
});

async function iniciarServidor() {
  await garantirAdministradorInicial();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const caminhoDist = path.join(process.cwd(), "dist");
    app.use(express.static(caminhoDist));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(caminhoDist, "index.html"));
    });
  }

  app.listen(PORTA, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
  });
}

iniciarServidor().catch((erro) => {
  console.error("Erro ao iniciar servidor:", erro);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
