// handles single emoji AND multi-part ones (⚠️ 🤷‍♀️) correctly
export const twemoji = (e: string) => {
  const cps = [...e].map((c) => c.codePointAt(0)!.toString(16));
  const stripped = cps.length <= 2 ? cps.filter((c) => c !== "fe0f") : cps;
  return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/${stripped.join("-")}.png`;
};

export type Mood = { label: string; emoji: string; img: string };

export const MOODS: Mood[] = [
  { label: "Happy", emoji: "😄" }, { label: "Giggly", emoji: "🤭" },
  { label: "Desperate", emoji: "😰" }, { label: "Excited", emoji: "🤩" },
  { label: "Emotional", emoji: "🥲" }, { label: "Confused", emoji: "😕" },
  { label: "Dramatic", emoji: "😱" }, { label: "Over It", emoji: "😑" },
  { label: "Sparkly", emoji: "✨" }, { label: "Sleepy", emoji: "😴" },
  { label: "Hungry", emoji: "🍕" }, { label: "Stressed", emoji: "😖" },
  { label: "Chill", emoji: "😎" }, { label: "Sassy", emoji: "😏" },
  { label: "In Love", emoji: "🥰" }, { label: "Dead", emoji: "💀" },
  { label: "Shook", emoji: "😲" }, { label: "Cozy", emoji: "🧸" },
  { label: "Focused", emoji: "🤓" }, { label: "Silly", emoji: "🤪" },
  { label: "Grateful", emoji: "🥹" }, { label: "Annoyed", emoji: "😒" },
  { label: "Bored", emoji: "🥱" }, { label: "Eye Roll", emoji: "🙄" },
  { label: "Strong", emoji: "💪" }, { label: "Nervous", emoji: "😬" },
  { label: "Mind Blown", emoji: "🤯" }, { label: "Melting", emoji: "🫠" },
  { label: "Angelic", emoji: "😇" }, { label: "Upside Down", emoji: "🙃" },
  { label: "On Fire", emoji: "🔥" }, { label: "Fabulous", emoji: "🌈" },
  { label: "Spilling Tea", emoji: "🍵" }, { label: "Iconic", emoji: "👑" },
  { label: "Unbothered", emoji: "💅" },
].map((m) => ({ ...m, img: twemoji(m.emoji) }));


export const PHONE_COLORS = ["#2f9fd8", "#e91e8c", "#7ac943", "#f7a41d", "#8e5bd4", "#ff5c5c"];


export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;


export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 800;
