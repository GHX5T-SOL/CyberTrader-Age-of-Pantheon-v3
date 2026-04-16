import { describe, expect, test } from "vitest";
import {
  applyEnergyDrain,
  buyEnergy,
  executeOrder,
  initialGameState,
  isDormant,
  rankFromXp,
  spawnNews,
  tickMarket,
  unrealizedPnl,
} from "@/src/core/game";

describe("market determinism", () => {
  test("same state produces same tick result", () => {
    const a = tickMarket(initialGameState());
    const b = tickMarket(initialGameState());
    expect(a.prices).toEqual(b.prices);
  });

  test("news can impact price path", () => {
    const s0 = initialGameState();
    const withNews = spawnNews({ ...s0, tick: 99 });
    const t1 = tickMarket(withNews);
    expect(t1.tick).toBe(100);
  });
});

describe("orders and pnl", () => {
  test("buy updates inventory and position", () => {
    const next = executeOrder(initialGameState(), "fdst", 2, "buy");
    expect(next.inventory.fdst).toBe(2);
    expect(next.positions.length).toBe(1);
  });

  test("sell realizes pnl", () => {
    const s1 = executeOrder(initialGameState(), "fdst", 2, "buy");
    const bumped = { ...s1, prices: { ...s1.prices, fdst: s1.prices.fdst * 1.2 } };
    const s2 = executeOrder(bumped, "fdst", 1, "sell");
    expect(s2.zeroBol).toBeGreaterThan(s1.zeroBol);
    expect(unrealizedPnl(s2)).toBeDefined();
  });
});

describe("resources and progression", () => {
  test("energy drains and dormant mode works", () => {
    const s1 = applyEnergyDrain(initialGameState(), 90);
    expect(isDormant(s1)).toBe(true);
  });

  test("energy purchase restores hours", () => {
    const s1 = applyEnergyDrain(initialGameState(), 40);
    const s2 = buyEnergy(s1);
    expect(s2.energyHours).toBeGreaterThan(s1.energyHours);
  });

  test("rank unlock threshold", () => {
    expect(rankFromXp(360)).toBe(5);
  });
});
