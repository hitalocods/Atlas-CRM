# Atlas Vault

Atlas Vault e um organizador pessoal de projetos feito para rodar localmente com Next.js, TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM e SQLite.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui local
- SQLite
- Prisma ORM
- Lucide Icons
- Framer Motion para animacoes leves

## Funcionalidades

- Dashboard dark premium com sidebar, header, busca global e cards responsivos
- CRUD de projetos com Server Actions
- Favoritos, filtros por status e stack
- Modal de detalhes e edicao do projeto
- Snippets com cadastro, exclusao e copiar para area de transferencia
- Seed inicial com Atlas Reserve, Arena Chapas, Trino, Eventos THE e Atlas Estoque

## Como rodar

```bash
npm install
npx prisma migrate dev
npm run dev
```

Abra `http://localhost:3000`.

## Banco local

O SQLite usa `DATABASE_URL="file:./dev.db"` em `.env`. O arquivo do banco fica dentro da pasta `prisma/` e nao deve ser versionado.

## Scripts uteis

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run build
```

## Estrutura

```text
app/                 Rotas, layout, estilos globais e Server Actions
components/          Shell do dashboard, cards, modais, forms e UI shadcn
lib/                 Prisma lazy singleton, tipos e utilitarios
prisma/              Schema, migration e seed
```
