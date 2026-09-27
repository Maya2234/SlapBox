import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export default function Profile() {
  const [me, setMe] = useState<{ name: string; emoji: string; color: string; email: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: p } = await supabase
        .from("profiles").select("name, emoji, color").eq("id", user.id).single();
      setMe({
        name: p?.name ?? "Ghost", emoji: p?.emoji ?? "👻", color: p?.color ?? "#8e5bd4",
        email: user.email ?? "",
      });
    })();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();   // _layout hears SIGNED_OUT → routes to /login
  };

  if (!me) return <ActivityIndicator style={{ flex: 1 }} color="#ff2d78" />;

  return (
    <View style={styles.screen}>
      <View style={[styles.pearCard, { backgroundColor: me.color }]}>
        <Text style={styles.emoji}>{me.emoji}</Text>
        <Text style={styles.name}>{me.name}</Text>
        <Text style={styles.email}>{me.email}</Text>
      </View>
      <Pressable style={styles.btn} onPress={logout}>
        <Text style={styles.btnTxt}>LOG OUT</Text>
      </Pressable>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← back to the feed</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#12121b", justifyContent: "center", alignItems: "center", padding: 28 },
  pearCard: { borderRadius: 40, borderTopLeftRadius: 70, borderBottomRightRadius: 64, padding: 30, alignItems: "center", width: "100%" },
  emoji: { fontSize: 56 },
  name: { color: "#fff", fontSize: 22, fontWeight: "800", marginTop: 8 },
  email: { color: "rgba(255,255,255,0.8)", marginTop: 4 },
  btn: { backgroundColor: "#ff2d78", borderRadius: 14, padding: 14, alignItems: "center", alignSelf: "stretch", marginTop: 24 },
  btnTxt: { color: "#fff", fontWeight: "900", letterSpacing: 1 },
  back: { color: "#8f8fa8", marginTop: 18 },
});
