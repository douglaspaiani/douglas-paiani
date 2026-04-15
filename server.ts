import express, { NextFunction, Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod";
import { Prisma, PrismaClient } from "@prisma/client";
import multer from "multer";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

dotenv.config();

const app = express();
const SEGREDO_JWT = process.env.JWT_SECRET || "fallback_secret";
const prisma = new PrismaClient();
const CHAVE_ACESSO_SITE_PRINCIPAL = "site:principal";
const uploadEmMemoria = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

interface ConfiguracaoBackblaze {
  chaveId: string;
  chaveAplicacao: string;
  nomeBucket: string;
  regiao: string;
  endpoint: string;
  urlPublica: string | null;
  prefixoImagens: string;
}

let clienteBackblazeEmCache: S3Client | null = null;

function obterPortaViaArgumentos(): number | null {
  const argumentos = process.argv.slice(2);

  for (let i = 0; i < argumentos.length; i += 1) {
    const argumento = argumentos[i];

    if (argumento === "-p" || argumento === "--port") {
      const valorPorta = argumentos[i + 1];
      const portaConvertida = Number(valorPorta);
      if (Number.isInteger(portaConvertida) && portaConvertida > 0 && portaConvertida <= 65535) {
        return portaConvertida;
      }
    }

    if (argumento.startsWith("--port=")) {
      const valorPorta = argumento.split("=")[1];
      const portaConvertida = Number(valorPorta);
      if (Number.isInteger(portaConvertida) && portaConvertida > 0 && portaConvertida <= 65535) {
        return portaConvertida;
      }
    }
  }

  return null;
}

function obterPortaServidor(): number {
  const portaPorArgumento = obterPortaViaArgumentos();
  if (portaPorArgumento) return portaPorArgumento;

  const portaPorAmbiente = Number(process.env.PORT);
  if (Number.isInteger(portaPorAmbiente) && portaPorAmbiente > 0 && portaPorAmbiente <= 65535) {
    return portaPorAmbiente;
  }

  return 3000;
}

const PORTA = obterPortaServidor();

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
  cargo: z.string().trim().max(120).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  fotoPerfil: z.string().trim().url().max(500).optional().or(z.literal("")),
  instagramUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  githubUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
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
  imagemDestacada: z.string().trim().url().max(500).optional().or(z.literal("")),
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

function normalizarUrlComHttps(url: string) {
  const urlSemEspacos = url.trim();
  if (!urlSemEspacos) return "";
  if (/^https?:\/\//i.test(urlSemEspacos)) {
    return urlSemEspacos.replace(/\/+$/g, "");
  }
  return `https://${urlSemEspacos.replace(/\/+$/g, "")}`;
}

function obterConfiguracaoBackblaze(): ConfiguracaoBackblaze {
  const chaveId = process.env.BACKBLAZE_KEY_ID?.trim() || "";
  const chaveAplicacao = process.env.BACKBLAZE_APPLICATION_KEY?.trim() || "";
  const nomeBucket = process.env.BACKBLAZE_BUCKET_NAME?.trim() || "";
  const regiao = process.env.BACKBLAZE_REGION?.trim() || "";
  const endpointPadrao = `https://s3.${regiao}.backblazeb2.com`;
  const endpoint = normalizarUrlComHttps(process.env.BACKBLAZE_ENDPOINT?.trim() || endpointPadrao);
  const urlPublicaBruta = process.env.BACKBLAZE_PUBLIC_URL?.trim() || "";
  const urlPublica = urlPublicaBruta ? normalizarUrlComHttps(urlPublicaBruta) : null;
  const prefixoImagens = (process.env.BACKBLAZE_PREFIXO_IMAGENS?.trim() || "uploads/imagens")
    .replace(/^\/+|\/+$/g, "");

  if (!chaveId || !chaveAplicacao || !nomeBucket || !regiao) {
    throw new Error(
      "Configuração Backblaze incompleta. Defina BACKBLAZE_KEY_ID, BACKBLAZE_APPLICATION_KEY, BACKBLAZE_BUCKET_NAME e BACKBLAZE_REGION.",
    );
  }

  return {
    chaveId,
    chaveAplicacao,
    nomeBucket,
    regiao,
    endpoint,
    urlPublica,
    prefixoImagens,
  };
}

function obterClienteBackblaze(configuracao: ConfiguracaoBackblaze) {
  if (clienteBackblazeEmCache) return clienteBackblazeEmCache;

  clienteBackblazeEmCache = new S3Client({
    region: configuracao.regiao,
    endpoint: configuracao.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: configuracao.chaveId,
      secretAccessKey: configuracao.chaveAplicacao,
    },
  });

  return clienteBackblazeEmCache;
}

function obterExtensaoPorMimeType(mimeType: string) {
  const mapaExtensoes: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/svg+xml": "svg",
    "image/heic": "heic",
    "image/heif": "heif",
  };

  return mapaExtensoes[mimeType] || "bin";
}

function processarUploadImagem(req: Request, res: Response, next: NextFunction) {
  // Centraliza o tratamento do multer para garantir respostas JSON em erros de upload.
  uploadEmMemoria.single("imagem")(req, res, (erroUpload: unknown) => {
    if (!erroUpload) {
      next();
      return;
    }

    if (erroUpload instanceof multer.MulterError) {
      if (erroUpload.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({ error: "A imagem excede o limite de 10MB." });
        return;
      }
      res.status(400).json({ error: "Erro ao processar arquivo enviado." });
      return;
    }

    res.status(500).json({ error: "Erro inesperado ao processar upload." });
  });
}

function montarUrlPublicaImagem(configuracao: ConfiguracaoBackblaze, caminhoArquivo: string) {
  if (configuracao.urlPublica) {
    const urlPublicaSemBarra = configuracao.urlPublica.replace(/\/+$/g, "");

    // Compatibilidade com Backblaze "friendly URL" (ex.: https://f005.backblazeb2.com),
    // que exige o formato /file/<bucket>/<arquivo>.
    if (/^https?:\/\/f\d+\.backblazeb2\.com$/i.test(urlPublicaSemBarra)) {
      return `${urlPublicaSemBarra}/file/${configuracao.nomeBucket}/${caminhoArquivo}`;
    }

    // Se a URL já vier com "/file/<bucket>", apenas concatena o caminho.
    if (new RegExp(`/file/${configuracao.nomeBucket}$`, "i").test(urlPublicaSemBarra)) {
      return `${urlPublicaSemBarra}/${caminhoArquivo}`;
    }

    // Se vier só com "/file", completa com bucket.
    if (/\/file$/i.test(urlPublicaSemBarra)) {
      return `${urlPublicaSemBarra}/${configuracao.nomeBucket}/${caminhoArquivo}`;
    }

    return `${urlPublicaSemBarra}/${caminhoArquivo}`;
  }

  return `${configuracao.endpoint}/${configuracao.nomeBucket}/${caminhoArquivo}`;
}

function normalizarUrlImagemBackblaze(urlImagem: string | null | undefined) {
  if (!urlImagem) return null;
  const urlLimpa = urlImagem.trim();
  if (!urlLimpa) return null;

  const nomeBucket = process.env.BACKBLAZE_BUCKET_NAME?.trim() || "";
  if (!nomeBucket) return urlLimpa;

  try {
    const url = new URL(urlLimpa);
    const ehHostFriendlyBackblaze = /^f\d+\.backblazeb2\.com$/i.test(url.hostname);
    if (!ehHostFriendlyBackblaze) return urlLimpa;

    if (url.pathname.startsWith(`/file/${nomeBucket}/`)) {
      return urlLimpa;
    }

    if (url.pathname.startsWith("/file/")) {
      return urlLimpa;
    }

    const caminhoSemBarraInicial = url.pathname.replace(/^\/+/, "");
    return `${url.protocol}//${url.host}/file/${nomeBucket}/${caminhoSemBarraInicial}`;
  } catch {
    return urlLimpa;
  }
}

function obterValorOuNull(texto?: string) {
  if (!texto) return null;
  const textoLimpo = texto.trim();
  return textoLimpo ? textoLimpo : null;
}

function obterLinksSociaisPadrao() {
  return {
    instagramUrl: "https://instagram.com/douglaspaiani",
    linkedinUrl: "https://www.linkedin.com/in/douglaspaiani/",
    githubUrl: "https://github.com/douglaspaiani",
  };
}

function mapearPerfilPublicoUsuario(usuario: {
  id: string;
  name: string;
  cargo: string | null;
  bio: string | null;
  fotoPerfil: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
}) {
  const linksPadrao = obterLinksSociaisPadrao();

  return {
    id: usuario.id,
    name: usuario.name,
    cargo: usuario.cargo || "Autor & Engenheiro",
    bio:
      usuario.bio ||
      "Engenheiro de Software com 15 anos de experiência, especialista em IA e criador de SaaS de alto nível.",
    fotoPerfil: normalizarUrlImagemBackblaze(usuario.fotoPerfil) || "https://picsum.photos/seed/douglas/100/100",
    instagramUrl: usuario.instagramUrl || linksPadrao.instagramUrl,
    linkedinUrl: usuario.linkedinUrl || linksPadrao.linkedinUrl,
    githubUrl: usuario.githubUrl || linksPadrao.githubUrl,
  };
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
        cargo: usuario.cargo,
        bio: usuario.bio,
        fotoPerfil: normalizarUrlImagemBackblaze(usuario.fotoPerfil),
        instagramUrl: usuario.instagramUrl,
        linkedinUrl: usuario.linkedinUrl,
        githubUrl: usuario.githubUrl,
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

  return res.json({
    id: usuario.id,
    username: usuario.username,
    name: usuario.name,
    cargo: usuario.cargo,
    bio: usuario.bio,
    fotoPerfil: normalizarUrlImagemBackblaze(usuario.fotoPerfil),
    instagramUrl: usuario.instagramUrl,
    linkedinUrl: usuario.linkedinUrl,
    githubUrl: usuario.githubUrl,
  });
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

    if (dadosPerfil.cargo !== undefined) {
      dadosAtualizacao.cargo = obterValorOuNull(dadosPerfil.cargo);
    }

    if (dadosPerfil.bio !== undefined) {
      dadosAtualizacao.bio = obterValorOuNull(dadosPerfil.bio);
    }

    if (dadosPerfil.fotoPerfil !== undefined) {
      dadosAtualizacao.fotoPerfil = obterValorOuNull(dadosPerfil.fotoPerfil);
    }

    if (dadosPerfil.instagramUrl !== undefined) {
      dadosAtualizacao.instagramUrl = obterValorOuNull(dadosPerfil.instagramUrl);
    }

    if (dadosPerfil.linkedinUrl !== undefined) {
      dadosAtualizacao.linkedinUrl = obterValorOuNull(dadosPerfil.linkedinUrl);
    }

    if (dadosPerfil.githubUrl !== undefined) {
      dadosAtualizacao.githubUrl = obterValorOuNull(dadosPerfil.githubUrl);
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
        cargo: usuarioAtualizado.cargo,
        bio: usuarioAtualizado.bio,
        fotoPerfil: normalizarUrlImagemBackblaze(usuarioAtualizado.fotoPerfil),
        instagramUrl: usuarioAtualizado.instagramUrl,
        linkedinUrl: usuarioAtualizado.linkedinUrl,
        githubUrl: usuarioAtualizado.githubUrl,
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

app.get("/api/publico/autor", async (_req, res) => {
  try {
    const usuario = await prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        cargo: true,
        bio: true,
        fotoPerfil: true,
        instagramUrl: true,
        linkedinUrl: true,
        githubUrl: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Autor não encontrado" });
    }

    return res.json(mapearPerfilPublicoUsuario(usuario));
  } catch (erro) {
    console.error("Erro ao buscar perfil público do autor:", erro);
    return res.status(500).json({ error: "Erro ao buscar autor" });
  }
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
        imagemDestacada: obterValorOuNull(dadosPostagem.imagemDestacada),
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
        imagemDestacada: obterValorOuNull(dadosPostagem.imagemDestacada),
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

app.post(
  "/api/admin/upload-imagem",
  autenticarRequisicao,
  processarUploadImagem,
  async (req, res) => {
    try {
      const arquivo = req.file;
      if (!arquivo) {
        return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
      }

      if (!arquivo.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Arquivo inválido. Envie apenas imagens." });
      }

      const configuracaoBackblaze = obterConfiguracaoBackblaze();
      const clienteBackblaze = obterClienteBackblaze(configuracaoBackblaze);
      const extensao = obterExtensaoPorMimeType(arquivo.mimetype);

      // Gera um caminho único por arquivo para evitar colisão entre uploads simultâneos.
      const caminhoArquivo = `${configuracaoBackblaze.prefixoImagens}/${Date.now()}-${randomUUID()}.${extensao}`;

      await clienteBackblaze.send(
        new PutObjectCommand({
          Bucket: configuracaoBackblaze.nomeBucket,
          Key: caminhoArquivo,
          Body: arquivo.buffer,
          ContentType: arquivo.mimetype,
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );

      const url = montarUrlPublicaImagem(configuracaoBackblaze, caminhoArquivo);
      return res.status(201).json({ url, caminhoArquivo });
    } catch (erro) {
      console.error("Erro no upload para Backblaze:", erro);
      return res.status(500).json({ error: "Erro ao enviar imagem para o Backblaze" });
    }
  },
);

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
