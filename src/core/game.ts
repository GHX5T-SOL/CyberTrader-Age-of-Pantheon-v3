export type WalletMode = "dev-identity" | "web-wallet" | "mobile-wallet-adapter";
export type OsTier = "pirate" | "agent" | "pantheon";

export type Commodity = {
  id: string;
  ticker: string;
  name: string;
  lore: string;
  basePrice: number;
  volatility: number;
  size: number;
  heatRisk: number;
  tags: string[];
};

export type Position = {
  commodityId: string;
  quantity: number;
  averageEntry: number;
  realizedPnl: number;
};

export type MarketNews = {
  id: string;
  headline: string;
  affectedTickers: string[];
  direction: "up" | "down" | "mixed";
  credibility: number;
  expiresAtTick: number;
  multiplier: number;
};

export type GameState = {
  tick: number;
  zeroBol: number;
  obolToken: number;
  energyHours: number;
  heat: number;
  rankLevel: number;
  xp: number;
  currentOs: OsTier;
  capacity: number;
  handle: string;
  walletMode: WalletMode | null;
  prices: Record<string, number>;
  history: Record<string, number[]>;
  inventory: Record<string, number>;
  positions: Position[];
  news: MarketNews[];
  tutorialStep: number;
  introSeen: boolean;
  notifications: string[];
};

export const COMMODITIES: Commodity[] = [
  { id: "fdst", ticker: "FDST", name: "Fractol Dust", lore: "Crystalline AI residue.", basePrice: 220, volatility: 0.19, size: 3, heatRisk: 0.26, tags: ["supply", "shocks"] },
  { id: "pgas", ticker: "PGAS", name: "Plutonion Gas", lore: "Micro-reactor vapor.", basePrice: 340, volatility: 0.15, size: 4, heatRisk: 0.32, tags: ["infra", "spikes"] },
  { id: "ngls", ticker: "NGLS", name: "Neon Glass", lore: "Optical memory shards.", basePrice: 180, volatility: 0.11, size: 2, heatRisk: 0.16, tags: ["archives"] },
  { id: "hxmd", ticker: "HXMD", name: "Helix Mud", lore: "Cooling sludge.", basePrice: 140, volatility: 0.13, size: 5, heatRisk: 0.14, tags: ["raids"] },
  { id: "vblm", ticker: "VBLM", name: "Void Bloom", lore: "Compute feed fungus.", basePrice: 90, volatility: 0.09, size: 6, heatRisk: 0.08, tags: ["bulk"] },
  { id: "orrs", ticker: "ORRS", name: "Oracle Resin", lore: "Predictive wafers.", basePrice: 290, volatility: 0.2, size: 2, heatRisk: 0.28, tags: ["news"] },
  { id: "snps", ticker: "SNPS", name: "Synapse Silk", lore: "Neural stealth weave.", basePrice: 260, volatility: 0.17, size: 2, heatRisk: 0.21, tags: ["stealth"] },
  { id: "mtrx", ticker: "MTRX", name: "Matrix Salt", lore: "Relay decrypt lattice.", basePrice: 310, volatility: 0.14, size: 3, heatRisk: 0.22, tags: ["nodes"] },
  { id: "aeth", ticker: "AETH", name: "Aether Tabs", lore: "Perception patches.", basePrice: 120, volatility: 0.25, size: 1, heatRisk: 0.3, tags: ["rumor"] },
  { id: "blck", ticker: "BLCK", name: "Blacklight Serum", lore: "Ghost packet dye.", basePrice: 410, volatility: 0.22, size: 1, heatRisk: 0.4, tags: ["high-risk"] },
];

const byId = Object.fromEntries(COMMODITIES.map((c) => [c.id, c]));

export function initialGameState(): GameState {
  const prices = Object.fromEntries(COMMODITIES.map((c) => [c.id, c.basePrice]));
  const history = Object.fromEntries(COMMODITIES.map((c) => [c.id, [c.basePrice]]));
  return {
    tick: 0,
    zeroBol: 1_000_000,
    obolToken: 0,
    energyHours: 72,
    heat: 8,
    rankLevel: 0,
    xp: 0,
    currentOs: "pirate",
    capacity: 100,
    handle: "",
    walletMode: null,
    prices,
    history,
    inventory: {},
    positions: [],
    news: [],
    tutorialStep: 0,
    introSeen: false,
    notifications: [],
  };
}

export function seeded(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function tickMarket(state: GameState): GameState {
  const nextTick = state.tick + 1;
  const nextPrices: Record<string, number> = {};
  const nextHistory: Record<string, number[]> = { ...state.history };
  for (const c of COMMODITIES) {
    const prev = state.prices[c.id];
    const randomWalk = 1 + (seeded(nextTick * 97 + c.basePrice) - 0.5) * c.volatility;
    const momentum = prev > c.basePrice ? 1.01 : 0.99;
    const meanRev = 1 + ((c.basePrice - prev) / c.basePrice) * 0.06;
    const heatPressure = 1 - state.heat / 1000;
    const eventMultiplier = eventFactor(c.ticker, state.news, nextTick);
    const candidate = prev * randomWalk * momentum * meanRev * heatPressure * eventMultiplier;
    const bounded = Math.max(c.basePrice * 0.2, Math.min(c.basePrice * 4, candidate));
    nextPrices[c.id] = Number(bounded.toFixed(2));
    nextHistory[c.id] = [...(state.history[c.id] ?? [c.basePrice]), nextPrices[c.id]].slice(-80);
  }
  const nextHeat = Math.max(0, state.heat - 1.1);
  return { ...state, tick: nextTick, prices: nextPrices, history: nextHistory, heat: Number(nextHeat.toFixed(2)) };
}

function eventFactor(ticker: string, events: MarketNews[], tick: number): number {
  const active = events.filter((n) => n.expiresAtTick >= tick && n.affectedTickers.includes(ticker));
  if (!active.length) return 1;
  return active.reduce((acc, n) => acc * n.multiplier, 1);
}

export function spawnNews(state: GameState): GameState {
  const roll = seeded(state.tick * 13 + 7);
  if (roll < 0.55) return state;
  const commodity = COMMODITIES[Math.floor(seeded(state.tick * 59) * COMMODITIES.length)];
  const dir = roll > 0.75 ? "up" : "down";
  const isFake = seeded(state.tick * 71) > 0.8;
  const multiplier = dir === "up" ? (isFake ? 1.06 : 1.18) : (isFake ? 0.95 : 0.86);
  const next: MarketNews = {
    id: `${state.tick}-${commodity.ticker}`,
    headline: `${commodity.name} route ${dir === "up" ? "squeeze" : "sweep"} detected`,
    affectedTickers: [commodity.ticker],
    direction: dir,
    credibility: isFake ? 42 : 84,
    expiresAtTick: state.tick + 3,
    multiplier,
  };
  return { ...state, news: [next, ...state.news].slice(0, 14) };
}

export function inventoryUsed(state: GameState): number {
  return Object.entries(state.inventory).reduce((total, [id, qty]) => total + qty * (byId[id]?.size ?? 0), 0);
}

export function buyEnergy(state: GameState): GameState {
  if (state.zeroBol < 10_000) return state;
  return {
    ...state,
    zeroBol: state.zeroBol - 10_000,
    energyHours: Math.min(72, state.energyHours + 12),
    notifications: ["Energy purchased: +12h", ...state.notifications].slice(0, 24),
  };
}

export function applyEnergyDrain(state: GameState, hours: number): GameState {
  const energy = Math.max(0, state.energyHours - hours);
  return { ...state, energyHours: Number(energy.toFixed(2)) };
}

export function isDormant(state: GameState): boolean {
  return state.energyHours <= 0;
}

export function executeOrder(state: GameState, commodityId: string, quantity: number, side: "buy" | "sell"): GameState {
  const commodity = byId[commodityId];
  if (!commodity || quantity <= 0) return state;
  const price = state.prices[commodityId];
  const feeFactor = 1.01 + state.heat / 2500;
  const inventory = { ...state.inventory };
  const positions = [...state.positions];
  if (side === "buy") {
    const required = quantity * commodity.size + inventoryUsed(state);
    if (required > state.capacity) return state;
    const cost = price * quantity * feeFactor;
    if (state.zeroBol < cost) return state;
    inventory[commodityId] = (inventory[commodityId] ?? 0) + quantity;
    const existing = positions.find((p) => p.commodityId === commodityId);
    if (existing) {
      const totalQty = existing.quantity + quantity;
      existing.averageEntry = (existing.averageEntry * existing.quantity + price * quantity) / totalQty;
      existing.quantity = totalQty;
    } else {
      positions.push({ commodityId, quantity, averageEntry: price, realizedPnl: 0 });
    }
    return {
      ...state,
      zeroBol: Number((state.zeroBol - cost).toFixed(2)),
      heat: Number((state.heat + 1 + commodity.heatRisk * quantity * 0.3).toFixed(2)),
      inventory,
      positions,
      xp: state.xp + 5,
    };
  }

  const owned = inventory[commodityId] ?? 0;
  if (owned < quantity) return state;
  const proceeds = price * quantity * 0.992;
  inventory[commodityId] = owned - quantity;
  if (inventory[commodityId] <= 0) delete inventory[commodityId];
  const existing = positions.find((p) => p.commodityId === commodityId);
  let realized = 0;
  if (existing) {
    realized = (price - existing.averageEntry) * quantity;
    existing.quantity -= quantity;
    existing.realizedPnl += realized;
  }
  const cleanPositions = positions.filter((p) => p.quantity > 0);
  const xpGain = realized > 0 ? 35 : 8;
  const nextXp = state.xp + xpGain;
  const nextRank = rankFromXp(nextXp);
  const nextOs: OsTier = nextRank >= 20 ? "pantheon" : nextRank >= 5 ? "agent" : "pirate";
  return {
    ...state,
    zeroBol: Number((state.zeroBol + proceeds).toFixed(2)),
    heat: Number(Math.max(0, state.heat + 0.4 + commodity.heatRisk * quantity * 0.1).toFixed(2)),
    inventory,
    positions: cleanPositions,
    xp: nextXp,
    rankLevel: nextRank,
    currentOs: nextOs,
  };
}

export function rankFromXp(xp: number): number {
  if (xp >= 2100) return 20;
  if (xp >= 1200) return 12;
  if (xp >= 700) return 8;
  if (xp >= 360) return 5;
  if (xp >= 180) return 3;
  if (xp >= 80) return 2;
  if (xp >= 30) return 1;
  return 0;
}

export function unrealizedPnl(state: GameState): number {
  return state.positions.reduce((sum, pos) => sum + (state.prices[pos.commodityId] - pos.averageEntry) * pos.quantity, 0);
}
