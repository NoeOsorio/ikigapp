import { SEASON_CLASSES, type Season } from "../constants/categories";
import FallingBackground from "./FallingBackground";
import Nav from "./Nav";

type StepForNav = "join" | "lobby" | "1" | "2" | "3" | "4" | "5" | "snapshot";

interface LayoutProps {
  children: React.ReactNode;
  step: StepForNav;
  season?: Season;
}

export default function Layout({ children, step, season = "spring" }: LayoutProps) {
  const theme = SEASON_CLASSES[season];
  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center font-body antialiased ${theme.bg} ${theme.text}`}>
      <FallingBackground season={season} />
      <Nav currentStep={step} />
      <main className="relative z-10 w-full flex flex-col items-center justify-center pt-20 pb-8 px-4 min-h-screen">
        {children}
      </main>
    </div>
  );
}
