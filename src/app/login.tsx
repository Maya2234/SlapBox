import { PHONE_COLORS } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const go = async () => {
    if (!email.includes("@") || password.length < 6) {
      return Alert.alert("Hold up", "Valid email + password of at least 6 characters.");
    }
    setBusy(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setBusy(false); return Alert.alert("Sign up failed", error.message); }
      if (data.session && data.user) {
        // have a session → create the profile and enter the feed
        await supabase.from("profiles").upsert({
          id: data.user.id,
          name: name.trim() || "New Student",
          emoji: "🍏",
          color: PHONE_COLORS[Math.floor(Math.random() * PHONE_COLORS.length)],
        });
        router.replace("/");
      } else {
        // email confirmation is ON → no session yet
        setBusy(false);
        Alert.alert("Check your email", "Confirm to finish signing up. (For the demo, you can turn off 'Confirm email' in Supabase → Authentication → Sign In / Providers.)");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return Alert.alert("Login failed", error.message);
      router.replace("/");
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.logo}>SlapBox</Text>
      <Text style={styles.tag}>{mode === "signin" ? "welcome back" : "join hollywood arts"}</Text>

      {mode === "signup" && (
        <TextInput style={styles.input} placeholder="Your name" placeholderTextColor="#677"
          value={name} onChangeText={setName} />
      )}
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#677"
        autoCapitalize="none" keyboardType="email-address"
        value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#677"
        secureTextEntry value={password} onChangeText={setPassword} />

      <Pressable style={styles.btn} onPress={go} disabled={busy}>
        <Text style={styles.btnTxt}>{busy ? "..." : mode === "signin" ? "SIGN IN" : "SIGN UP"}</Text>
      </Pressable>

      <Pressable onPress={() => setMode(mode === "signin" ? "signup" : "signin")}>
        <Text style={styles.switchTxt}>
          {mode === "signin" ? "new here? make an account" : "have an account? sign in"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#12121b", justifyContent: "center", padding: 28 },
  logo: { color: "#ffd400", fontSize: 40, fontWeight: "900", fontStyle: "italic", textAlign: "center" },
  tag: { color: "#8f8fa8", textAlign: "center", marginBottom: 28 },
  input: { backgroundColor: "#bfe7f7", borderRadius: 14, padding: 12, marginBottom: 10, color: "#123" },
  btn: { backgroundColor: "#ff2d78", borderRadius: 14, padding: 14, alignItems: "center", marginTop: 6 },
  btnTxt: { color: "#fff", fontWeight: "900", letterSpacing: 1 },
  switchTxt: { color: "#8f8fa8", textAlign: "center", marginTop: 18 },
});
