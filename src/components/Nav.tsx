import { Link } from "react-router-dom";
import type { ThemeKind } from "../constants/categories";

const NAV_THEME: Record<
  ThemeKind,
  { bar: string; text: string; accent: string }
> = {
  dawn: {
    bar: "bg-dawn-bg border-b border-dawn-accent/10",
    text: "text-dawn-dark",
    accent: "text-dawn-accent",
  },
  lobby: {
    bar: "bg-lobby-bg border-b border-lobby-accent/10",
    text: "text-lobby-dark",
    accent: "text-lobby-accent",
  },
  matcha: {
    bar: "bg-matcha-bg border-b border-matcha-accent/10",
    text: "text-matcha-dark",
    accent: "text-matcha-accent",
  },
  spring: {
    bar: "bg-spring-bg border-b border-spring-accent/10",
    text: "text-spring-dark",
    accent: "text-spring-accent",
  },
  summer: {
    bar: "bg-summer-bg border-b border-summer-accent/10",
    text: "text-summer-dark",
    accent: "text-summer-accent",
  },
  autumn: {
    bar: "bg-autumn-bg border-b border-autumn-accent/10",
    text: "text-autumn-dark",
    accent: "text-autumn-accent",
  },
  winter: {
    bar: "bg-winter-bg border-b border-winter-accent/10",
    text: "text-winter-dark",
    accent: "text-winter-accent",
  },
};

interface NavProps {
  theme: ThemeKind;
  /** When true, nav bar is transparent (e.g. lobby full-screen look). */
  transparent?: boolean;
}

export default function Nav({ theme, transparent = false }: NavProps) {
  const { bar, text, accent } = NAV_THEME[theme];
  const barClasses = transparent
    ? "bg-transparent border-transparent"
    : bar;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-100 ${barClasses} px-6 py-4 sm:px-10 flex items-center justify-between`}
      aria-label="Principal"
    >
      <Link
        to="/"
        className={`font-display flex items-center gap-3 ${text} tracking-wide hover:opacity-80 transition-opacity`}
      >
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xl ${accent} bg-black/5 ring-1 ring-black/6`}
          aria-hidden
        >
          生
        </span>
        <span className="text-lg sm:text-xl font-medium">Ikigai</span>
      </Link>
    </nav>
  );
}
