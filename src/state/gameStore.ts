import { create } from "zustand";
// Force CJS middleware entry to avoid import.meta in web bundle.
import { persist, createJSONStorage } from "zustand/middleware.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  applyEnergyDrain,
  buyEnergy,
  executeOrder,
  GameState,
  initialGameState,
  spawnNews,
  tickMarket,
} from "@/src/core/game";

type GameActions = {
  setIdentity: (handle: string, walletMode: GameState["walletMode"]) => void;
  markIntroSeen: () => void;
  advanceTutorial: () => void;
  advanceTick: () => void;
  buyEnergyPack: () => void;
  trade: (commodityId: string, quantity: number, side: "buy" | "sell") => void;
  setTutorialStep: (step: number) => void;
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      ...initialGameState(),
      setIdentity: (handle, walletMode) => set({ handle, walletMode }),
      markIntroSeen: () => set({ introSeen: true }),
      advanceTutorial: () => set((s) => ({ tutorialStep: s.tutorialStep + 1 })),
      setTutorialStep: (step) => set({ tutorialStep: step }),
      advanceTick: () =>
        set((s) => {
          const drained = applyEnergyDrain(s, 0.6 + s.heat / 500);
          const ticked = tickMarket(drained);
          return spawnNews(ticked);
        }),
      buyEnergyPack: () => set((s) => buyEnergy(s)),
      trade: (commodityId, quantity, side) => set((s) => executeOrder(s, commodityId, quantity, side)),
    }),
    {
      name: "cybertrader-game-state-v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        tick: s.tick,
        zeroBol: s.zeroBol,
        obolToken: s.obolToken,
        energyHours: s.energyHours,
        heat: s.heat,
        rankLevel: s.rankLevel,
        xp: s.xp,
        currentOs: s.currentOs,
        capacity: s.capacity,
        handle: s.handle,
        walletMode: s.walletMode,
        prices: s.prices,
        history: s.history,
        inventory: s.inventory,
        positions: s.positions,
        news: s.news,
        tutorialStep: s.tutorialStep,
        introSeen: s.introSeen,
        notifications: s.notifications,
      }),
    }
  )
);
