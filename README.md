# CyberTrader: Age of Pantheon (MVP)

Mobile-first Expo game MVP where the player is a rogue AI Eidolon booting a pirate cyberdeck OS and trading fictional S1LKROAD commodities to survive Energy drain and manage Heat.

## Install and Run

```bash
npm install
npm run start
```

Platform commands:

```bash
npm run ios
npm run android
npm run web
```

## Verification Commands

```bash
npm run typecheck
npm run lint
npm test
npx expo export --platform web
```

## Implemented Core Loop

- Intro cinematic stage and boot transition.
- Login with explicit `dev-identity` mode (wallet adapters scaffolded).
- Pirate OS cyberdeck metrics: Energy, `0BOL`, `$OBOL` status, Heat, Rank, OS tier.
- S1LKROAD 4.0 market with live tick advancement, chart, buy/sell, positions, and news.
- Burger-menu pages: profile, settings, inventory, progression, rank, leaderboard, rewards, notifications, help, legal.
- Rank and OS unlock progression logic with deterministic simulation tests.

## Currency and Compliance

- `0BOL` is non-withdrawable in-game currency.
- `$OBOL` integration is feature-flag oriented and defaults to locked state.
- No guaranteed-profit language or gambling/loot-box mechanics in MVP.
