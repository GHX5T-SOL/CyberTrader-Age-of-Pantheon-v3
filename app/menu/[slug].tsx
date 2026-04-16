import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useGameStore } from "@/src/state/gameStore";

const content: Record<string, string> = {
  profile: "Eidolon dossier, wallet mode, rank lineage, and OS tier.",
  settings: "Replay intro, toggle reduced motion, and session controls.",
  inventory: "Commodity storage, capacity usage, and scarcity tags.",
  progression: "Rank gates, OS unlock thresholds, and next objectives.",
  rank: "Current XP, title tier, and unlock schedule.",
  leaderboard: "Season placeholders replaced with local ranking summary.",
  rewards: "Claimable milestones from trade performance and survival.",
  notifications: "Recent system events, market notices, and warnings.",
  help: "How to play: manage Energy, control Heat, and trade S1LKROAD.",
  legal: "0BOL is non-withdrawable game currency. $OBOL features are optional, feature-flagged, and region-dependent.",
};

export default function MenuPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const page = slug ?? "profile";
  const game = useGameStore();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{page.toUpperCase()}</Text>
      <Text style={styles.body}>{content[page] ?? "No content."}</Text>
      <View style={styles.card}>
        <Text style={styles.body}>Energy {game.energyHours.toFixed(1)}h</Text>
        <Text style={styles.body}>Heat {game.heat.toFixed(1)}</Text>
        <Text style={styles.body}>0BOL {game.zeroBol.toFixed(0)}</Text>
        <Text style={styles.body}>Rank {game.rankLevel}</Text>
      </View>
      <Link href="/" asChild>
        <Pressable style={styles.button}><Text style={styles.buttonText}>BACK TO CYBERDECK</Text></Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#040907" },
  content: { padding: 18, gap: 14 },
  title: { color: "#cffff8", fontSize: 22, fontWeight: "700" },
  body: { color: "#9db7b5", lineHeight: 20 },
  card: { borderColor: "#234341", borderWidth: 1, borderRadius: 10, padding: 12, gap: 6, backgroundColor: "#09110f" },
  button: { backgroundColor: "#00e3de", borderRadius: 8, padding: 12, alignItems: "center" },
  buttonText: { color: "#02100f", fontWeight: "700" },
});
