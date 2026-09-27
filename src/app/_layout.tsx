import { supabase } from "@/lib/supabase";
import { Baloo2_400Regular, Baloo2_800ExtraBold, useFonts } from "@expo-google-fonts/baloo-2";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Baloo2_400Regular, Baloo2_800ExtraBold });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        setReady(true);
        if (!session) router.replace("/login");
      } else if (event === "SIGNED_IN") {
        router.replace("/");
      } else if (event === "SIGNED_OUT") {
        router.replace("/login");
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // one gate for BOTH conditions: fonts and auth
  if (!fontsLoaded || !ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color="#ff2d78" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  boot: { flex: 1, justifyContent: "center", backgroundColor: "#12121b" },
});
