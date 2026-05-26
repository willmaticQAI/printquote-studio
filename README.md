# PrintQuote Studio

**A local-first 3D print pricing and quote manager.**

PrintQuote Studio helps you calculate the true cost of a 3D print, estimate a customer price, manage filament profiles, save quotes, and eventually export quotes—all on your machine.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) — folder prepared; schema in a later phase
- SQLite — planned for local-first storage

## Local development

```bash
cd printquote-studio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run build` | Production build        |
| `npm run start` | Run production server   |
| `npm run lint`  | ESLint                  |

## Folder structure

```
printquote-studio/
├── app/
│   ├── api/
│   │   ├── quotes/       # API placeholder (501)
│   │   ├── filaments/
│   │   └── settings/
│   ├── calculator/       # Pricing calculator (Phase 1)
│   ├── filaments/        # Filament profiles (Phase 2)
│   ├── quotes/           # Saved quotes (Phase 3)
│   ├── settings/         # Shop defaults
│   ├── layout.tsx
│   ├── page.tsx          # Dashboard home
│   └── globals.css       # Theme tokens
├── components/
│   ├── layout/           # AppShell, Sidebar, Topbar
│   ├── ui/               # Button, Card, Input, etc.
│   ├── calculator/
│   ├── filaments/
│   └── quotes/
├── lib/
│   ├── constants.ts      # App name, nav, filament types
│   └── utils.ts
├── prisma/               # Prisma-ready (empty in Phase 0)
└── public/
```

## Planned roadmap

| Phase | Focus |
| ----- | ----- |
| **0** | Architecture, theme, shell, placeholder routes ✅ |
| **1** | Cost calculator formulas and inputs |
| **2** | Prisma + SQLite, filament profiles, settings persistence |
| **3** | Quote save/list/export |
| **4** | Polish, PDF/export, optional enhancements |

## Phase 0 completion notes

- Next.js app with TypeScript and Tailwind CSS v4
- Dark dashboard theme (near-black background, cyan accent)
- App shell: sidebar navigation, top bar, main content area
- Placeholder pages: `/`, `/calculator`, `/filaments`, `/quotes`, `/settings`
- Reusable UI primitives: Button, Card, Input, Select, Badge
- `lib/constants.ts` with app identity, navigation, and filament types
- API route stubs returning `501 Not Implemented`
- Prisma directory reserved; no schema yet
- No authentication, payments, or cloud deployment

## License

Private project — add license as needed.
