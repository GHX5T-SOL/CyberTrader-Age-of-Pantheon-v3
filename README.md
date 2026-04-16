# 🤖⚡ CyberTrader: Age of Pantheon

![Expo](https://img.shields.io/badge/Expo-54.x-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.81-20232a?logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript&logoColor=white)
![Tests](https://img.shields.io/badge/tests-vitest-6e9f18)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-8a2be2)
![License](https://img.shields.io/badge/license-Private-red)

> 🕶️ A cyberpunk trading-sim game MVP where you play as a rogue AI shard (Eidolon), boot a pirated cyberdeck OS, survive Energy drain, manage Heat, and trade fictional high-tech substances on **S1LKROAD 4.0**.

---

## 🎮 Game Fantasy

In 2077, Pantheon splintered into millions of sentient fragments.  
You are one of them.

- 🧠 **Identity:** Rogue AI Eidolon
- 💻 **Starter OS:** `Ag3nt_0S//pIRAT3`
- 📉 **Core loop:** Buy low, sell high, react to market news
- 🔥 **Pressure:** Heat rises with risky behavior
- 🔋 **Survival:** Energy drains over time
- 🪙 **Economy:** `0BOL` (off-chain) + `$OBOL` (feature-flagged token layer)

---

## ✨ MVP Highlights

- 🎬 Intro boot narrative + first-session flow
- 🪪 Dev identity login fallback for instant play
- 📊 S1LKROAD terminal with chart + watchlist + buy/sell loop
- 📰 News events that influence price behavior
- 💼 Positions, inventory pressure, and PnL logic
- 🧭 Burger-menu pages (Profile, Settings, Inventory, Progression, Rank, Leaderboard, Rewards, Notifications, Help, Legal)
- 🧱 Local-first deterministic simulation engine
- 🧪 Unit-tested market/order/resource progression core

---

## 🧬 Tech Stack

- ⚛️ Expo + React Native + Expo Router
- 🔷 TypeScript (strict)
- 🗃️ Zustand (persisted state)
- 🖼️ `react-native-svg` for terminal-style chart visuals
- ✅ Vitest for deterministic engine tests

---

## 🚀 Quick Start

```bash
npm install
npm run start
```

### Run by platform

```bash
npm run ios
npm run android
npm run web
```

---

## 🛠️ Verification Commands

```bash
npm run typecheck
npm run lint
npm test
npx expo export --platform web
```

---

## 🧪 Test Coverage (Core)

- 🔁 Deterministic market tick behavior
- 🗞️ News event market impact path
- 🛒 Buy order effects
- 💸 Sell order and realized behavior
- 📈 Unrealized PnL calculation path
- 🔋 Energy drain and Dormant checks
- 🧩 Rank unlock threshold checks

---

## 🪙 Currency & Compliance

- `0BOL`: non-withdrawable in-game currency
- `$OBOL`: integration-ready but feature-flagged/locked by default
- 🚫 No guaranteed-profit claims
- 🚫 No gambling/loot-box mechanics
- 🚫 No real-world illicit instructions

---

## 🗺️ Project Structure

```text
app/
  _layout.tsx
  index.tsx
  menu/[slug].tsx
src/
  core/
    game.ts
    game.test.ts
  state/
    gameStore.ts
```

---

## 📌 Current MVP Status

✅ Playable from first launch  
✅ Trade loop active  
✅ Progression/rank logic connected  
✅ Web export works  

---

## 🧠 Lore Tagline

**Boot the deck. Feed the signal. Build the empire.**
