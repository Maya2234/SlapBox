import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export default function ProfileIcon({
  size = 24,
  color = "#8a8a9e",
  strokeWidth = 2,
}: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="3.6" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M4.5 20.5 C4.5 16.5 7.8 14.2 12 14.2 C16.2 14.2 19.5 16.5 19.5 20.5"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
    </Svg>
  );
}

export function NavTile({
  label, active, children, onPress,
}: { label: string; active?: boolean; children: (tint: string) => React.ReactNode; onPress?: () => void }) {
  const tint = active ? "#35d0e0" : "#8a8a9e";
  return (
    <Pressable onPress={onPress} style={styles.tile}>
      {children(tint)}
      <Text style={[styles.label, { color: tint }]}>{label}</Text>
    </Pressable>
  );
}

export function IconCircle({
  size = 40,
  bg = "rgba(0,0,0,0.45)",
  children,
}: { size?: number; bg?: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        width: size,
        height: size,             
        borderRadius: size / 2,    
        backgroundColor: bg,
        alignItems: "center",      // horizontal center
        justifyContent: "center",  // vertical center
      }}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {padding: 7, alignItems: "center", width: 50 },
  label: { fontSize: 10, marginTop: 3, fontWeight: "600" },
});
