import { getThemeClasses, isSeasonTheme, type ThemeKind } from "../constants/categories";
import FallingBackground from "./FallingBackground";
import Nav from "./Nav";

type StepForNav = "join" | "lobby" | "1" | "2" | "3" | "4" | "5" | "snapshot";

interface LayoutProps {
  children: React.ReactNode;
  step: StepForNav;
  theme: ThemeKind;
}

export default function Layout({ children, step, theme }: LayoutProps) {
  const classes = getThemeClasses(theme);
  const showParticles = isSeasonTheme(theme);
  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center font-body antialiased ${classes.bg} ${classes.text}`}>
      {showParticles && <FallingBackground season={theme} />}
      <Nav currentStep={step} theme={theme} />
      <main className="relative z-10 w-full flex flex-col items-center justify-center pt-20 pb-8 px-4 min-h-screen">
        {children}
      </main>
    </div>
  );
}
