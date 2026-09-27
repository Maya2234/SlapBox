import ProfileIcon, { IconCircle, NavTile } from "@/components/ui/ProfileIcon";
import SlapCard, { type Post } from "@/components/ui/slapCard";
import { MOODS } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ImageBackground, Modal, Text, View } from "react-native";

import {
  FlatList,
  KeyboardAvoidingView, Platform,
  Pressable,
  StyleSheet,
  TextInput
} from "react-native";


export default function App() {
  const [posts, setPosts] = useState<Post[]>();
  const [draft, setDraft] = useState("");
  const [mood, setMood] = useState(MOODS[0]);
  const [composing, setComposing] = useState(false);

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

const post = async () => { // async: network call happens
  const body = draft.trim();
  if (!body) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;  

  await supabase.from("posts").insert({
    user_id: user.id,
    body,
    mood: JSON.stringify(mood),
  });

  setDraft("");
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
      {/* floating pink + */}
<Pressable style={styles.fab} onPress={() => setComposing(true)}>
  <Text style={styles.fabTxt}>+</Text>
</Pressable>

{/* compose modal */}
<Modal visible={composing} transparent animationType="slide" onRequestClose={() => setComposing(false)}>
  <Pressable style={styles.backdrop} onPress={() => setComposing(false)}>
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheetAlign}>
      <Pressable style={styles.sheet}>
          <View style={styles.chips}>
            {MOODS.map((m) => (
              <Pressable
                key={m.label}
                onPress={() => setMood(m)}
                style={[styles.chip, mood.label === m.label && styles.chipOn]}
              >
                <Text style={mood.label === m.label ? styles.chipTextOn : styles.chipText}>
                  {m.emoji}
                </Text>
              </Pressable>
            ))}
          </View>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="What's your status?"
            placeholderTextColor="#667"
            value={draft}
            maxLength={180}
            autoFocus                    // keyboard pops immediately
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
  header: { color: "#ffd400", flex: 1, width: 62, fontSize: 28, fontWeight: "900", fontStyle: "italic", textAlign: "center", paddingBottom: 6 },
  compose: { backgroundColor: "#1c1c2b", padding: 10 },
  chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  chip: { borderWidth: 1, borderColor: "#3a3a55", borderRadius: 14, paddingHorizontal: 8, paddingVertical: 4, marginRight: 6, marginBottom: 6 },
  chipOn: { backgroundColor: "#ff2d78", borderColor: "#ff2d78" },
  chipText: { color: "#ccc" },
  chipTextOn: { color: "#fff", fontWeight: "700" },
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
  borderRadius: 28,              // half of size = circle
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
