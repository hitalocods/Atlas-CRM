import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
  {
    name: "Atlas Reserve",
    client: "Atlas",
    description: "Sistema de reservas com painel operacional e controle de disponibilidade.",
    status: "Em produção",
    projectType: "Dashboard",
    stack: "Next.js, TypeScript, Prisma, Tailwind",
    githubUrl: "https://github.com/",
    deployUrl: "https://atlasreserve.vercel.app/",
    notes: "Link salvo em notes.txt: https://atlasreserve.vercel.app/",
    promptUsed: "Prompt Codex para dashboard operacional de reservas com SQLite local, cards financeiros e modal premium.",
    problemsSolved: "realtime reservas, controle de disponibilidade, dashboard admin",
    projectValue: 2500,
    maintenanceActive: true,
    maintenanceValue: 250,
    paymentStatus: "Pago",
    nextPaymentDate: new Date("2026-07-10T12:00:00"),
    lastUpdate: new Date("2026-06-13T12:00:00"),
    favorite: true,
    timeline: [
      { title: "Projeto criado", createdAt: new Date("2026-06-10T12:00:00") },
      { title: "Deploy realizado", createdAt: new Date("2026-06-11T12:00:00") },
      { title: "Cliente aprovou", createdAt: new Date("2026-06-13T12:00:00") },
    ],
  },
  {
    name: "Arena Chapas",
    client: "Arena Chapas",
    description: "Organizador de pedidos e acompanhamento de produção.",
    status: "Em andamento",
    projectType: "App",
    stack: "Next.js, SQLite, shadcn/ui",
    githubUrl: "https://github.com/hitalocods/ArenaChapas",
    deployUrl: "https://arenachapas-de41d.web.app/#",
    notes: "Deploy: https://arenachapas-de41d.web.app/#\nGitHub: https://github.com/hitalocods/ArenaChapas\nValor registrado em notes.txt: 1000, sem mensalidade no momento.",
    promptUsed: "Prompt dashboard simples para organizar pedidos, produção e status operacional.",
    problemsSolved: "fluxo pedidos, produção, consulta rápida",
    projectValue: 1200,
    maintenanceActive: true,
    maintenanceValue: 120,
    paymentStatus: "Pendente",
    nextPaymentDate: new Date("2026-07-15T12:00:00"),
    lastUpdate: new Date("2026-06-12T12:00:00"),
    favorite: false,
    timeline: [
      { title: "Escopo inicial registrado", createdAt: new Date("2026-06-08T12:00:00") },
      { title: "Deploy Firebase publicado", createdAt: new Date("2026-06-12T12:00:00") },
    ],
  },
  {
    name: "Trino",
    client: "Trino",
    description: "Dashboard minimalista para centralizar links, deploys e notas técnicas.",
    status: "Ideia",
    projectType: "Site",
    stack: "React, Tailwind, Framer Motion",
    githubUrl: "https://github.com/hitalocods/trinoimobiliaria",
    deployUrl: "https://trino-imobiliaria.web.app/",
    notes: "Deploy: https://trino-imobiliaria.web.app/\nGitHub: https://github.com/hitalocods/trinoimobiliaria\nNegociando a mensalidade. Vendido por 1000.",
    promptUsed: "Prompt landing imobiliária com visual limpo e CTA direto.",
    problemsSolved: "landing imobiliária, deploy Firebase, organização de proposta",
    projectValue: 1000,
    maintenanceActive: false,
    maintenanceValue: 0,
    paymentStatus: "Pago",
    nextPaymentDate: null,
    lastUpdate: new Date("2026-06-14T12:00:00"),
    favorite: false,
    timeline: [
      { title: "Landing entregue", createdAt: new Date("2026-06-09T12:00:00") },
      { title: "Mensalidade em negociação", createdAt: new Date("2026-06-14T12:00:00") },
    ],
  },
  {
    name: "Eventos THE",
    client: "THE",
    description: "Base para projetos de eventos, páginas públicas e controle interno.",
    status: "Concluído",
    projectType: "Landing",
    stack: "Next.js, TypeScript, Vercel",
    githubUrl: "https://github.com/",
    deployUrl: "https://eventos-the.web.app/",
    notes: "Link salvo em notes.txt: https://eventos-the.web.app/\nObservação: em andamento.",
    promptUsed: "Prompt landing de eventos com organização de seções e checklist de deploy.",
    problemsSolved: "landing eventos, publicação, checklist deploy",
    projectValue: 900,
    maintenanceActive: false,
    maintenanceValue: 0,
    paymentStatus: "Cancelado",
    nextPaymentDate: null,
    lastUpdate: new Date("2026-06-07T12:00:00"),
    favorite: true,
    timeline: [
      { title: "Projeto criado", createdAt: new Date("2026-06-05T12:00:00") },
      { title: "Referências salvas", createdAt: new Date("2026-06-07T12:00:00") },
    ],
  },
  {
    name: "Atlas Estoque",
    client: "Atlas",
    description: "Controle leve de estoque para produtos, movimentações e alertas.",
    status: "Em andamento",
    projectType: "Dashboard",
    stack: "Next.js, Prisma, SQLite, Lucide",
    githubUrl: "https://github.com/hitalocods/AtlasEstoque",
    deployUrl: "https://atlas-estoque.vercel.app/",
    notes: "GitHub: https://github.com/hitalocods/AtlasEstoque\nDeploy: https://atlas-estoque.vercel.app/\nStatus comercial: em negociação.",
    promptUsed: "Prompt dashboard de estoque com CRUD direto, alertas e relatórios pequenos.",
    problemsSolved: "crud estoque, alertas, relatórios",
    projectValue: 1800,
    maintenanceActive: true,
    maintenanceValue: 180,
    paymentStatus: "Atrasado",
    nextPaymentDate: new Date("2026-07-05T12:00:00"),
    lastUpdate: new Date("2026-06-10T12:00:00"),
    favorite: true,
    timeline: [
      { title: "Modelagem inicial do estoque", createdAt: new Date("2026-06-06T12:00:00") },
      { title: "Deploy Vercel validado", createdAt: new Date("2026-06-10T12:00:00") },
    ],
  },
  {
    name: "Cibele",
    client: "CS Studio Beauty",
    description: "Sistema de agendamento para studio de beleza com links de deploy e repositório centralizados.",
    status: "Em produção",
    projectType: "App",
    stack: "React, Firebase, CSS",
    githubUrl: "https://github.com/hitalocods/Agendamento",
    deployUrl: "https://cs-studiobeauty.web.app/",
    notes: "Deploy: https://cs-studiobeauty.web.app/\nGitHub: https://github.com/hitalocods/Agendamento\nVendido por 200 sem mensalidade.",
    promptUsed: "Prompt app de agendamento simples para studio de beleza.",
    problemsSolved: "auth, agendamento, Firebase deploy",
    projectValue: 200,
    maintenanceActive: false,
    maintenanceValue: 0,
    paymentStatus: "Pago",
    nextPaymentDate: null,
    lastUpdate: new Date("2026-06-04T12:00:00"),
    favorite: false,
    timeline: [
      { title: "Sistema vendido", createdAt: new Date("2026-06-03T12:00:00") },
      { title: "Deploy Firebase publicado", createdAt: new Date("2026-06-04T12:00:00") },
    ],
  },
  {
    name: "Larissa",
    client: "Larissa Santana",
    description: "Projeto web para apresentação profissional com deploy publicado e repositório versionado.",
    status: "Em produção",
    projectType: "Landing",
    stack: "Next.js, TypeScript, Vercel",
    githubUrl: "https://github.com/hitalocods/LarissaSantana",
    deployUrl: "https://larissa-santana.vercel.app/",
    notes: "GitHub: https://github.com/hitalocods/LarissaSantana\nDeploy: https://larissa-santana.vercel.app/\nValor registrado: 200 reais.",
    promptUsed: "Prompt landing profissional com foco em apresentação e conversão.",
    problemsSolved: "copy, deploy Vercel, responsividade",
    projectValue: 200,
    maintenanceActive: false,
    maintenanceValue: 0,
    paymentStatus: "Pago",
    nextPaymentDate: null,
    lastUpdate: new Date("2026-06-02T12:00:00"),
    favorite: false,
    timeline: [
      { title: "Projeto criado", createdAt: new Date("2026-06-01T12:00:00") },
      { title: "Deploy aprovado", createdAt: new Date("2026-06-02T12:00:00") },
    ],
  },
  {
    name: "Rimpots",
    client: "RR Acessórios",
    description: "Projeto web para RR Acessórios com deploy e repositório organizados no vault.",
    status: "Em produção",
    projectType: "Site",
    stack: "Next.js, TypeScript, Vercel",
    githubUrl: "https://github.com/hitalocods/RRAcessorios",
    deployUrl: "https://rr-acessorios.vercel.app/",
    notes: "GitHub: https://github.com/hitalocods/RRAcessorios\nDeploy: https://rr-acessorios.vercel.app/",
    promptUsed: "Prompt site comercial leve para catálogo e presença digital.",
    problemsSolved: "catálogo, deploy Vercel, imagens",
    projectValue: 650,
    maintenanceActive: true,
    maintenanceValue: 90,
    paymentStatus: "Pendente",
    nextPaymentDate: new Date("2026-07-20T12:00:00"),
    lastUpdate: new Date("2026-06-08T12:00:00"),
    favorite: false,
    timeline: [
      { title: "Repositório conectado", createdAt: new Date("2026-06-06T12:00:00") },
      { title: "Deploy publicado", createdAt: new Date("2026-06-08T12:00:00") },
    ],
  },
];

const snippets = [
  {
    title: "Prompt dashboard premium",
    category: "Prompt",
    tag: "codex, ui, dashboard",
    content: "Crie um dashboard premium, escuro, denso e operacional para um OS de freelancer com cards, filtros, modais e métricas reais.",
    favorite: true,
  },
  {
    title: "Prisma reset local",
    category: "Prisma",
    tag: "database, reset",
    content: "npx prisma migrate reset && npx prisma db seed",
    favorite: false,
  },
  {
    title: "Next dev",
    category: "Deploy",
    tag: "next, local",
    content: "npm run dev",
    favorite: false,
  },
  {
    title: "Deploy checklist",
    category: "Deploy",
    tag: "vercel, release",
    content: "Gerar build, revisar envs, validar links, publicar release.",
    favorite: true,
  },
  {
    title: "Firebase deploy",
    category: "Firebase",
    tag: "firebase, deploy",
    content: "firebase deploy --only hosting",
    favorite: false,
  },
  {
    title: "Copy CTA landing",
    category: "Copy",
    tag: "landing, vendas",
    content: "Transforme sua operação em um sistema simples, rápido e pronto para vender todos os dias.",
    favorite: false,
  },
];

function projectId(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  for (const project of projects) {
    const { timeline, ...projectData } = project;
    const id = projectId(project.name);

    await prisma.project.upsert({
      where: { id },
      update: projectData,
      create: {
        id,
        ...projectData,
      },
    });

    await prisma.projectTimeline.deleteMany({ where: { projectId: id } });
    await prisma.projectTimeline.createMany({
      data: timeline.map((item) => ({
        projectId: id,
        title: item.title,
        createdAt: item.createdAt,
      })),
    });
  }

  for (const snippet of snippets) {
    const exists = await prisma.snippet.findFirst({ where: { title: snippet.title } });
    if (exists) {
      await prisma.snippet.update({ where: { id: exists.id }, data: snippet });
    } else {
      await prisma.snippet.create({ data: snippet });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
