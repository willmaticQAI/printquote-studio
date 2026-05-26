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
- Saved quotes with status tracking
- Saved print history for internal/non-sale jobs
- Local persistence through JSON-backed API routes

## Tech stack

- [Next.js](https://nextjs.org/) App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Local JSON file storage in `data/store.json`

`prisma/` remains in the repo as a future migration path if you later want SQLite or a fuller database layer.

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

## How data is stored

The app uses local file-backed persistence.

- App data is stored in `data/store.json`
- The `data/` directory is ignored by git
- API routes under `app/api/` read and write that file

This keeps the app simple and local-first while still giving you a small backend for settings, filaments, quotes, and prints.

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
├── data/                # local runtime storage, gitignored
├── lib/
│   ├── data-store.ts
│   ├── quote-calculations.ts
│   ├── types.ts
│   └── utils.ts
└── prisma/              # reserved for future DB migration
```

## License

MIT
