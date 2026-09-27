import ProfileIcon, { IconCircle, NavTile } from "@/components/ui/ProfileIcon";
import SlapCard, { type Post } from "@/components/ui/slapCard";
import { MOODS, type Mood } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  FlatList, ImageBackground, KeyboardAvoidingView, Modal,
  Platform, Pressable, ScrollView, StyleSheet,
  Text, TextInput, View,
} from "react-native";

const INITIAL_POSTS: Post[] = [
  { id: "1", name: "Tori Vega", avatar: "🎤", body: "So Victorious got cancelled... now I can go on Teen Mom!", mood: { label: "Excited", emoji: "🤩" }, color: "#2f9fd8" },
  { id: "2", name: "Cat Valentine", avatar: "🎈", body: "Does ANYONE out there have BIBBLE?! I'd do anything for bibble! ANYTHING!", mood: { label: "Desperate", emoji: "😰" }, color: "#e91e8c" },
  { id: "3", name: "Jade West", avatar: "🖤", body: "I like forks.", mood: { label: "Happy", emoji: "😄" }, color: "#ff5c5c" },
];

export default function App() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [draft, setDraft] = useState("");
  const [composing, setComposing] = useState(false);
  const [mood, setMood] = useState<Mood | null>(MOODS[0]);
  const [customFeeling, setCustomFeeling] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*, profile:profiles(name, emoji, color)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setPosts(data.map((r: any) => ({
        id: r.id,
        name: r.profile?.name ?? "Ghost",
        avatar: r.profile?.emoji ?? "👻",
        body: r.body,
        mood: JSON.parse(r.mood),
        color: r.profile?.color ?? "#8e5bd4",
      })));
    };
    fetchPosts();

    const channel = supabase
      .channel(`posts-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, fetchPosts)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const post = async () => {
    const body = draft.trim();
    if (!body) return;

    const custom = customFeeling.trim();
    const moodToPost = custom ? { label: custom, emoji: "" } : mood;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !moodToPost) return;

    await supabase.from("posts").insert({
      user_id: user.id,
      body,
      mood: JSON.stringify(moodToPost),
    });

    setDraft("");
    setCustomFeeling("");
    setComposing(false);
  };

  return (
    <View style={styles.screen}>
<ImageBackground
  source={require("@/components/ui/images.jpg")}
  style={StyleSheet.absoluteFill}
  resizeMode="cover"
  imageStyle={{ opacity: 0.5 }}
/>


      <View style={styles.headerRow}>
        <View style={{ width: 62 }} />
        <Text style={styles.header}>SlapBox</Text>
        <NavTile label="" onPress={() => router.push("/profile")}>
          {(tint) => (
            <IconCircle size={40}>
              <ProfileIcon size={22} color={tint} />
            </IconCircle>
          )}
        </NavTile>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SlapCard post={item} />}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
      />

      <Pressable style={styles.fab} onPress={() => setComposing(true)}>
        <Text style={styles.fabTxt}>+</Text>
      </Pressable>

      <Modal visible={composing} transparent animationType="slide" onRequestClose={() => setComposing(false)}>
        <Pressable style={styles.backdrop} onPress={() => setComposing(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheetAlign}>
            <Pressable style={styles.sheet}>
              <ScrollView
                style={styles.chipsScroll}
                contentContainerStyle={styles.chips}
                nestedScrollEnabled
              >
                {MOODS.map((m) => (
                  <Pressable
                    key={m.label}
                    onPress={() => setMood(mood?.label === m.label ? null : m)}
                    style={[styles.chip, mood?.label === m.label && styles.chipOn]}
                  >
                    <Text style={mood?.label === m.label ? styles.chipTextOn : styles.chipText}>
                      {m.emoji}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <TextInput
                style={styles.input}
                placeholder="or type your own feeling (optional)…"
                placeholderTextColor="#667"
                value={customFeeling}
                maxLength={30}
                onChangeText={setCustomFeeling}
              />

              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  placeholder="status..."
                  placeholderTextColor="#667"
                  value={draft}
                  maxLength={180}
                  autoFocus
                  onChangeText={setDraft}
                />
                <Pressable style={styles.updateBtn} onPress={post}>
                  <Text style={styles.updateTxt}>UPDATE</Text>
                </Pressable>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", paddingTop: 54, justifyContent: "space-between", paddingHorizontal: 20 },
  screen: { flex: 1, backgroundColor: "#12121b" },
  header: { color: "#ffd400", flex: 1, fontSize: 28, fontWeight: "900", fontStyle: "italic", textAlign: "center", paddingBottom: 6 },
  chipsScroll: { maxHeight: 96, marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    borderWidth: 1, borderColor: "#3a3a55", borderRadius: 14,
    width: 44, height: 38, marginRight: 6, marginBottom: 6,
    alignItems: "center", justifyContent: "center",
  },
  chipOn: { backgroundColor: "#ff2d78", borderColor: "#ff2d78" },
  chipText: { color: "#ccc", fontSize: 18 },
  chipTextOn: { color: "#fff", fontSize: 18 },
  row: { flexDirection: "row", gap: 8 },
  input: { flex: 1, backgroundColor: "#bfe7f7", borderRadius: 14, paddingHorizontal: 12, height: 42, color: "#123" },
  updateBtn: { backgroundColor: "#ff2d78", borderRadius: 14, justifyContent: "center", paddingHorizontal: 14 },
  updateTxt: { color: "#fff", fontWeight: "900" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ff2d78",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  fabTxt: { color: "#fff", fontSize: 30, fontWeight: "900", marginTop: -2 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheetAlign: { justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#1c1c2b",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 14,
  },
});