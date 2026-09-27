import { Image, Text } from "react-native";

export default function RetroEmoji({
  e, size = 16,
}: { e: { img?: string; emoji: string }; size?: number }) {
  return e.img
    ? <Image source={{ uri: e.img }} style={{ width: size, height: size, backgroundColor: "lime" }} />

    : <Text style={{ fontSize: size }}>{e.emoji}</Text>;
}
