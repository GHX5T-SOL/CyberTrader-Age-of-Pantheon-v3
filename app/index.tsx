import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Circle, Polyline } from "react-native-svg";
import { COMMODITIES, unrealizedPnl } from "@/src/core/game";
import { useGameStore } from "@/src/state/gameStore";

const menuPages = ["profile", "settings", "inventory", "progression", "rank", "leaderboard", "rewards", "notifications", "help", "legal"];

export default function IndexScreen() {
  const game = useGameStore();
  const [selected, setSelected] = useState(COMMODITIES[0].id);
  const [qty, setQty] = useState("1");
  const [handleInput, setHandleInput] = useState("");
  const selectedCommodity = COMMODITIES.find((c) => c.id === selected) ?? COMMODITIES[0];
  const selectedPrice = game.prices[selectedCommodity.id] ?? selectedCommodity.basePrice;
  const isLoggedIn = game.walletMode !== null && game.handle.length > 0;
  const pnl = unrealizedPnl(game);

  const chartPoints = useMemo(() => {
    const chart = game.history[selectedCommodity.id] ?? [selectedPrice];
    const max = Math.max(...chart);
    const min = Math.min(...chart);
    return chart
      .map((p, i) => {
        const x = (i / Math.max(1, chart.length - 1)) * 280;
        const y = 90 - ((p - min) / Math.max(1, max - min || 1)) * 80;
        return `${x},${y}`;
      })
      .join(" ");
  }, [game.history, selectedCommodity.id, selectedPrice]);

  if (!game.introSeen) {
    return (
      <View style={styles.container}>
        <Text style={styles.brand}>CYBERTRADER: AGE OF PANTHEON</Text>
        <Text style={styles.story}>2077. Pantheon shattered. You are an Eidolon shard booting a stolen deck.</Text>
        <View style={styles.terminalBox}>
          {["ESTABLISHING SYSLINK...", "ROUTING VIA ONION RELAY...", "VERIFYING EIDOLON SIGNATURE...", "BOOTING Ag3nt_0S//pIRAT3..."].map((line) => (
            <Text key={line} style={styles.termLine}>{line}</Text>
          ))}
        </View>
        <Pressable style={styles.primaryBtn} onPress={game.markIntroSeen}>
          <Text style={styles.primaryText}>ENTER SIGNAL</Text>
        </Pressable>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.brand}>Ag3nt_0S//pIRAT3 LOGIN</Text>
        <TextInput style={styles.input} placeholder="Eidolon Handle" placeholderTextColor="#7f9394" value={handleInput} onChangeText={setHandleInput} />
        <Pressable style={styles.primaryBtn} onPress={() => game.setIdentity(handleInput.trim() || "EIDOLON_77", "dev-identity")}>
          <Text style={styles.primaryText}>CONTINUE WITH DEV IDENTITY</Text>
        </Pressable>
        <Text style={styles.copy}>Wallet adapters are scaffolded and feature-flagged for legal-safe rollout.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>Ag3nt_0S//pIRAT3 • {game.handle}</Text>
      <View style={styles.metrics}>
        <Metric label="Energy" value={`${game.energyHours.toFixed(1)}h`} />
        <Metric label="0BOL" value={game.zeroBol.toFixed(0)} />
        <Metric label="$OBOL" value={`${game.obolToken.toFixed(2)} (locked)`} />
        <Metric label="Heat" value={game.heat.toFixed(1)} />
        <Metric label="Rank" value={`${game.rankLevel}`} />
        <Metric label="OS" value={game.currentOs} />
      </View>

      <View style={styles.row}>
        <Pressable style={styles.primaryBtn} onPress={game.buyEnergyPack}><Text style={styles.primaryText}>BUY ENERGY</Text></Pressable>
        <Pressable style={styles.secondaryBtn} onPress={game.advanceTick}><Text style={styles.secondaryText}>ADVANCE TICK</Text></Pressable>
      </View>

      <Text style={styles.section}>S1LKROAD 4.0 • Tick {game.tick} • Unrealized {pnl.toFixed(2)}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tickerRow}>
        {COMMODITIES.map((c) => (
          <Pressable key={c.id} style={[styles.chip, c.id === selected && styles.chipActive]} onPress={() => setSelected(c.id)}>
            <Text style={styles.chipText}>{c.ticker} {game.prices[c.id].toFixed(1)}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.chartCard}>
        <Text style={styles.section}>{selectedCommodity.name} • {selectedPrice.toFixed(2)}</Text>
        <Svg width={300} height={95}><Polyline points={chartPoints} fill="none" stroke="#00e3de" strokeWidth={3} /></Svg>
      </View>

      <View style={styles.row}>
        <TextInput keyboardType="numeric" style={[styles.input, styles.qty]} value={qty} onChangeText={setQty} />
        <Pressable style={styles.primaryBtn} onPress={() => game.trade(selectedCommodity.id, Number(qty), "buy")}><Text style={styles.primaryText}>BUY</Text></Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => game.trade(selectedCommodity.id, Number(qty), "sell")}><Text style={styles.secondaryText}>SELL</Text></Pressable>
      </View>

      <View style={styles.newsCard}>
        <Text style={styles.section}>News Feed</Text>
        {game.news.slice(0, 3).map((n) => (
          <Text key={n.id} style={styles.copy}>[{n.credibility}%] {n.headline} ({n.affectedTickers.join(", ")})</Text>
        ))}
      </View>

      <Text style={styles.section}>Burger Menu</Text>
      <View style={styles.menuWrap}>
        {menuPages.map((m) => (
          <Link key={m} href={{ pathname: "/menu/[slug]", params: { slug: m } }} asChild>
            <Pressable style={styles.menuButton}><Text style={styles.menuText}>{m.toUpperCase()}</Text></Pressable>
          </Link>
        ))}
      </View>

      <View style={styles.logoCard}>
        <Svg width={92} height={92}>
          <Circle cx="46" cy="46" r="36" stroke="#00e3de" fill="none" strokeWidth={3} />
          <Polyline points="18,52 36,36 48,46 68,28 74,36 50,58 36,46 24,58" fill="none" stroke="#f3ff6a" strokeWidth={4} />
        </Svg>
        <Text style={styles.copy}>Fractured AI eye + cursor crown insignia.</Text>
      </View>
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030806", justifyContent: "center", padding: 18, gap: 12 },
  screen: { flex: 1, backgroundColor: "#030806" },
  content: { padding: 14, gap: 10, paddingBottom: 38 },
  brand: { color: "#d1fff8", fontSize: 20, fontWeight: "700" },
  story: { color: "#98bbb8", fontSize: 14, lineHeight: 20 },
  terminalBox: { backgroundColor: "#07110f", borderColor: "#13d9d6", borderWidth: 1, padding: 10, gap: 8 },
  termLine: { color: "#69fe8f", fontSize: 13 },
  primaryBtn: { backgroundColor: "#00e3de", padding: 10, borderRadius: 8, minWidth: 96, alignItems: "center" },
  primaryText: { color: "#04100e", fontWeight: "700" },
  secondaryBtn: { backgroundColor: "#0d1717", borderColor: "#f84d66", borderWidth: 1, padding: 10, borderRadius: 8, minWidth: 96, alignItems: "center" },
  secondaryText: { color: "#ff6f85", fontWeight: "700" },
  input: { borderColor: "#1f5855", borderWidth: 1, color: "#d8f5ee", borderRadius: 8, padding: 10, flex: 1 },
  copy: { color: "#8ea5a6", fontSize: 13, lineHeight: 18 },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metric: { backgroundColor: "#09120f", borderWidth: 1, borderColor: "#17413f", borderRadius: 8, padding: 8, width: "31%" },
  metricLabel: { color: "#6c9694", fontSize: 11 },
  metricValue: { color: "#d2fff9", fontWeight: "700" },
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  section: { color: "#e7fffa", fontWeight: "700", marginTop: 8 },
  tickerRow: { marginVertical: 5 },
  chip: { borderWidth: 1, borderColor: "#28514f", borderRadius: 30, paddingHorizontal: 9, paddingVertical: 7, marginRight: 6 },
  chipActive: { borderColor: "#00e3de" },
  chipText: { color: "#c5ffff" },
  chartCard: { backgroundColor: "#050f0d", borderRadius: 10, borderWidth: 1, borderColor: "#1f3f3d", padding: 10 },
  qty: { maxWidth: 80 },
  newsCard: { backgroundColor: "#090f12", borderWidth: 1, borderColor: "#2b3847", borderRadius: 8, padding: 10, gap: 4 },
  menuWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  menuButton: { borderWidth: 1, borderColor: "#2f5553", borderRadius: 7, paddingVertical: 8, paddingHorizontal: 10 },
  menuText: { color: "#c9f3f0", fontSize: 12 },
  logoCard: { alignItems: "center", padding: 12, borderColor: "#1c3d3b", borderWidth: 1, borderRadius: 9, marginTop: 8 },
});
