// src/app/data/comic.ts

export interface ComicItem {
  title: string;
  image: string;
  tag: string;
  type: "Manhwa" | "Manga" | "Manhua" | "Webcomics";
  description?: string;
}

export const featuredCovers: ComicItem[] = [
  {
    title: "Debut or Die",
    image: "/images/covers/Debut%20or%20Die.jpg",
    tag: "Trending",
    type: "Manhwa",
    description:
      "After failing his civil service exam for 4 years, a guy suddenly wakes up in a stranger's body 3 years in the past. If he doesn't debut as an idol within a year, he dies!",
  },
  {
    title: "Life of a Quack Healer",
    image: "/images/covers/life%20of%20a%20quck%20healer.jpg",
    tag: "Recommended",
    type: "Manhwa",
    description:
      "Follow the hilarious and action-packed life of a support class healer who accidentally moves faster and hits harder than the main damage dealers.",
  },
  {
    title: "The Player Hides His Past",
    image: "/images/covers/The%20player%20hides%20his%20past.jpg",
    tag: "Continue",
    type: "Manhwa",
    description:
      "A former hardcore RPG player gets transported into a world based on his favorite game, but he has to hide his embarrassingly edgy past character history to survive.",
  },
  {
    title: "The Ultimate Shut In",
    image: "/images/covers/The%20Ultimate%20Shut%20in.jpg",
    tag: "New",
    type: "Manhwa",
    description:
      "A legendary shut-in with overpowered passive abilities is forced to save humanity without ever leaving the comfort of his magical room.",
  },
  {
    title: "Return of The Mad Demon",
    image: "/images/covers/Return%20of%20the%20Mad%20Demon.jpg",
    tag: "New",
    type: "Manhwa",
    description:
      "The Mad Demon, Jaha Lee, dreams of flying. In his pursuit, he falls from a cliff—only to wake up back in his past as a humble inn employee...",
  },
  {
    title: "The Greatest Estate Developer",
    image: "/images/covers/The%20Greatest%20Estate%20Developer.jpg",
    tag: "New",
    type: "Manhwa",
    description:
      "An engineering student wakes up as a lazy noble in a fantasy novel. Using his civil engineering knowledge, he begins building infrastructure to avoid his family's ruin!",
  },
];
