import { twemoji } from "@/constants/theme";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";

export type Post = {
  id: string;
  name: string;
  avatar: string;
  body: string;
  mood: { label: string; emoji: string };
  color: string;
};

// gradient name: mask = the text, gradient shows through it
function GradientName({ name }: { name: string }) {
  return (
    <MaskedView maskElement={<Text style={styles.who}>{name}:</Text>}>
      <LinearGradient
        colors={["#421a92", "#231562"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.who, { opacity: 0 }]}>{name}:</Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function SlapCard({ post }: { post: Post }) {
  return (
    <View style={styles.card}>
      {/* framed avatar + update block */}
      <View style={styles.leftCol}>
        <View style={styles.avatarFrame}>
          <Text style={styles.avatar}>{post.avatar}</Text>
        </View>
        <View style={styles.updateChip}>
          <Text style={styles.updateTxt}>UPDATE</Text>
        </View>
      </View>

      <LinearGradient
        colors={["#bfe9ff", "#6ec6f0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.msgBox}
      >
        <GradientName name={post.name} />
        <View style={styles.bodyWrap}>
          <Text style={styles.body}>{post.body}</Text>
        </View>
        <View style={styles.feelingStrip}>
          <Text style={styles.feelingTxt}>
            FEELING:   <Text style={styles.feelingBold}>{post.mood.label}</Text>
          </Text>
          {/* invisible slot reserves the space where the overlay emoji lands */}
          <View style={{ width: 18, height: 18 }} />
        </View>
      </LinearGradient>

      {/* emoji overlay: child of the CARD (not the clipped box), painted on top */}
      <Image
        source={{ uri: twemoji(post.mood.emoji) }}
        style={styles.moodEmoji}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginHorizontal: 14,
    marginVertical: 10,
    padding: 12,
    minHeight: 150,
    borderRadius: 20,
    borderColor: "#a10861",
    borderTopLeftRadius: 32,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  leftCol: {
    width: 75,
    alignItems: "center",
    alignSelf: "flex-end",
    padding: 6,
    margin: 0,
    borderRadius: 12,
    backgroundColor: "#c94472",
  },
  avatarFrame: {
    width: 60,
    height: 65,
    backgroundColor: "#cda5bf",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { fontSize: 30 },
  updateChip: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  updateTxt: {
    color: "#efc959",
    fontWeight: "500",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  msgBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.35)",
    borderRadius: 12,
    padding: 10,
    paddingBottom: 0,
    overflow: "hidden",
  },
  who: {
    fontFamily: "futura",
    fontWeight: "bold",
    color: "purple",
    textTransform: "uppercase",
    fontSize: 17,
    marginBottom: 2,
  },
  body: {
    fontFamily: "Nunito Sans",
    fontSize: 15,
    color: "#14202b",
    textAlign: "center",
  },
  feelingStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#5cb2e0",
    marginHorizontal: -10,
    paddingVertical: 5,
    padding: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  feelingTxt: {
    fontFamily: "Baloo2_800ExtraBold",
    fontSize: 12,
    color: "#cc450b",
  },
  feelingBold: { fontSize: 15, color: "purple" },
  bodyWrap: {
    flex: 1,
    justifyContent: "center",
  },
  moodEmoji: {
    position: "absolute",   // painted over the box, ignores overflow: hidden
    right: 26,              // nudge by eye: smaller = further right
    bottom: 22,             // nudge by eye: smaller = lower
    width: 18,
    height: 18,
  },
});
