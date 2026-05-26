# PrintQuote Studio

Local-first 3D print pricing, quote tracking, and print-cost history.

PrintQuote Studio helps you:

- calculate the real cost of a 3D print
- generate customer-facing quotes
- save internal print records for jobs that are not for sale
- manage filament profiles and spool inventory
- store shop pricing defaults locally on your machine

## Current features

- Live dashboard with quote totals, revenue estimates, and inventory alerts
- Working calculator with explicit `Calculate Summary` flow
- Hover help tooltips for pricing and machine-cost fields
- Saved filament profiles used directly by the calculator
- Saved quotes with status tracking, editing, and deletion
- Saved print history for internal/non-sale jobs with editing and deletion
- Filament profile create, edit, and delete
- Local persistence through Prisma + SQLite

## Tech stack

- [Next.js](https://nextjs.org/) App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma ORM](https://www.prisma.io/)
- SQLite

## Local development

```bash
cd printquote-studio
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful scripts:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production server |
| `npm run typecheck` | TypeScript validation |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Create/apply local Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |

## How data is stored

The app uses a local SQLite database through Prisma.

- Prisma schema: `prisma/schema.prisma`
- Prisma migrations: `prisma/migrations/`
- Local SQLite file: `dev.db` or the file referenced by `DATABASE_URL`
- Local environment template: `.env.example`

The app will bootstrap from an existing legacy `data/store.json` if one is present and the database has not been initialized yet.

## Main routes

- `/` dashboard
- `/calculator` cost calculator and save flow
- `/filaments` filament inventory management
- `/quotes` customer quote history
- `/prints` internal print history
- `/settings` shop defaults

## Typical workflow

1. Add one or more filament profiles.
2. Set your shop defaults in Settings.
3. Open the Calculator and enter print details.
4. Click `Calculate Summary`.
5. Save the job as either:
   - `Save Quote` for customer work
   - `Save Print` for internal/non-sale work
6. Edit existing quotes and prints by opening them back into the calculator.

## Project structure

```text
printquote-studio/
├── app/
│   ├── api/
│   │   ├── filaments/
│   │   ├── prints/
│   │   ├── quotes/
│   │   └── settings/
│   ├── calculator/
│   ├── filaments/
│   ├── prints/
│   ├── quotes/
│   ├── settings/
│   └── page.tsx
├── components/
│   ├── calculator/
│   ├── filaments/
│   ├── prints/
│   ├── quotes/
│   ├── settings/
│   └── ui/
├── lib/
│   ├── db.ts
│   ├── data-store.ts
│   ├── quote-calculations.ts
│   ├── types.ts
│   └── utils.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
└── prisma.config.ts
```

## License

MIT
