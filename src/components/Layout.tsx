import { getThemeClasses, isSeasonTheme, type ThemeKind } from "../constants/categories";
import FallingBackground from "./FallingBackground";
import Nav from "./Nav";

interface LayoutProps {
  children: React.ReactNode;
  theme: ThemeKind;
  /** When true, nav bar is transparent (e.g. lobby full-screen). */
  navTransparent?: boolean;
}

export default function Layout({ children, theme, navTransparent = false }: LayoutProps) {
  const classes = getThemeClasses(theme);
  const showParticles = isSeasonTheme(theme);
  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center font-body antialiased ${classes.bg} ${classes.text}`}>
      {showParticles && <FallingBackground season={theme} />}
      <Nav theme={theme} transparent={navTransparent} />
      <main className="relative z-10 w-full flex flex-col items-center justify-center pt-20 pb-8 px-4 min-h-screen">
        {children}
      </main>
    </div>
  );
}
