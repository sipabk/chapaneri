import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeName = "heritage" | "ocean" | "forest" | "royal" | "sunset" | "midnight";

interface ThemeColors {
  label: string;
  preview: string[];
  vars: Record<string, string>;
}

export const themes: Record<ThemeName, ThemeColors> = {
  heritage: {
    label: "Heritage",
    preview: ["#7a2e3a", "#d4a843", "#f5f0e8"],
    vars: {
      "--background": "40 20% 98%",
      "--foreground": "25 30% 12%",
      "--card": "40 25% 97%",
      "--card-foreground": "25 30% 12%",
      "--popover": "40 25% 97%",
      "--popover-foreground": "25 30% 12%",
      "--primary": "350 45% 35%",
      "--primary-foreground": "40 20% 98%",
      "--secondary": "38 35% 92%",
      "--secondary-foreground": "25 30% 18%",
      "--muted": "35 20% 90%",
      "--muted-foreground": "25 15% 45%",
      "--accent": "42 85% 55%",
      "--accent-foreground": "25 30% 12%",
      "--success": "145 35% 38%",
      "--success-foreground": "40 20% 98%",
      "--destructive": "0 65% 50%",
      "--destructive-foreground": "40 20% 98%",
      "--border": "35 25% 85%",
      "--input": "35 25% 85%",
      "--ring": "350 45% 35%",
      "--gradient-hero": "linear-gradient(135deg, hsl(350 45% 35%) 0%, hsl(25 35% 28%) 100%)",
      "--gradient-gold": "linear-gradient(135deg, hsl(42 85% 55%) 0%, hsl(38 75% 45%) 100%)",
      "--gradient-parchment": "linear-gradient(180deg, hsl(40 25% 97%) 0%, hsl(38 30% 93%) 100%)",
    },
  },
  ocean: {
    label: "Ocean",
    preview: ["#1e6091", "#48cae4", "#f0f7ff"],
    vars: {
      "--background": "210 30% 98%",
      "--foreground": "210 40% 10%",
      "--card": "210 25% 97%",
      "--card-foreground": "210 40% 10%",
      "--popover": "210 25% 97%",
      "--popover-foreground": "210 40% 10%",
      "--primary": "205 65% 35%",
      "--primary-foreground": "210 30% 98%",
      "--secondary": "205 30% 92%",
      "--secondary-foreground": "210 35% 18%",
      "--muted": "210 20% 90%",
      "--muted-foreground": "210 15% 45%",
      "--accent": "190 80% 55%",
      "--accent-foreground": "210 40% 10%",
      "--success": "160 45% 38%",
      "--success-foreground": "210 30% 98%",
      "--destructive": "0 65% 50%",
      "--destructive-foreground": "210 30% 98%",
      "--border": "210 25% 85%",
      "--input": "210 25% 85%",
      "--ring": "205 65% 35%",
      "--gradient-hero": "linear-gradient(135deg, hsl(205 65% 35%) 0%, hsl(220 50% 25%) 100%)",
      "--gradient-gold": "linear-gradient(135deg, hsl(190 80% 55%) 0%, hsl(200 70% 45%) 100%)",
      "--gradient-parchment": "linear-gradient(180deg, hsl(210 25% 97%) 0%, hsl(210 30% 93%) 100%)",
    },
  },
  forest: {
    label: "Forest",
    preview: ["#2d6a4f", "#95d5b2", "#f0f7f0"],
    vars: {
      "--background": "140 20% 98%",
      "--foreground": "150 30% 10%",
      "--card": "140 25% 97%",
      "--card-foreground": "150 30% 10%",
      "--popover": "140 25% 97%",
      "--popover-foreground": "150 30% 10%",
      "--primary": "153 50% 33%",
      "--primary-foreground": "140 20% 98%",
      "--secondary": "140 30% 92%",
      "--secondary-foreground": "150 25% 18%",
      "--muted": "140 18% 90%",
      "--muted-foreground": "150 12% 45%",
      "--accent": "80 55% 50%",
      "--accent-foreground": "150 30% 10%",
      "--success": "145 40% 38%",
      "--success-foreground": "140 20% 98%",
      "--destructive": "0 65% 50%",
      "--destructive-foreground": "140 20% 98%",
      "--border": "140 22% 85%",
      "--input": "140 22% 85%",
      "--ring": "153 50% 33%",
      "--gradient-hero": "linear-gradient(135deg, hsl(153 50% 33%) 0%, hsl(160 40% 22%) 100%)",
      "--gradient-gold": "linear-gradient(135deg, hsl(80 55% 50%) 0%, hsl(100 45% 40%) 100%)",
      "--gradient-parchment": "linear-gradient(180deg, hsl(140 25% 97%) 0%, hsl(140 28% 93%) 100%)",
    },
  },
  royal: {
    label: "Royal",
    preview: ["#6a1b9a", "#e1bee7", "#faf5ff"],
    vars: {
      "--background": "280 20% 98%",
      "--foreground": "270 30% 10%",
      "--card": "280 25% 97%",
      "--card-foreground": "270 30% 10%",
      "--popover": "280 25% 97%",
      "--popover-foreground": "270 30% 10%",
      "--primary": "280 60% 35%",
      "--primary-foreground": "280 20% 98%",
      "--secondary": "280 30% 92%",
      "--secondary-foreground": "270 25% 18%",
      "--muted": "275 18% 90%",
      "--muted-foreground": "270 12% 45%",
      "--accent": "45 80% 55%",
      "--accent-foreground": "270 30% 10%",
      "--success": "145 35% 38%",
      "--success-foreground": "280 20% 98%",
      "--destructive": "0 65% 50%",
      "--destructive-foreground": "280 20% 98%",
      "--border": "275 22% 85%",
      "--input": "275 22% 85%",
      "--ring": "280 60% 35%",
      "--gradient-hero": "linear-gradient(135deg, hsl(280 60% 35%) 0%, hsl(260 50% 25%) 100%)",
      "--gradient-gold": "linear-gradient(135deg, hsl(45 80% 55%) 0%, hsl(35 70% 45%) 100%)",
      "--gradient-parchment": "linear-gradient(180deg, hsl(280 25% 97%) 0%, hsl(280 28% 93%) 100%)",
    },
  },
  sunset: {
    label: "Sunset",
    preview: ["#c2410c", "#fb923c", "#fff7ed"],
    vars: {
      "--background": "30 30% 98%",
      "--foreground": "20 35% 10%",
      "--card": "30 30% 97%",
      "--card-foreground": "20 35% 10%",
      "--popover": "30 30% 97%",
      "--popover-foreground": "20 35% 10%",
      "--primary": "20 80% 42%",
      "--primary-foreground": "30 30% 98%",
      "--secondary": "30 35% 92%",
      "--secondary-foreground": "20 28% 18%",
      "--muted": "28 22% 90%",
      "--muted-foreground": "20 12% 45%",
      "--accent": "45 90% 55%",
      "--accent-foreground": "20 35% 10%",
      "--success": "145 35% 38%",
      "--success-foreground": "30 30% 98%",
      "--destructive": "0 65% 50%",
      "--destructive-foreground": "30 30% 98%",
      "--border": "28 25% 85%",
      "--input": "28 25% 85%",
      "--ring": "20 80% 42%",
      "--gradient-hero": "linear-gradient(135deg, hsl(20 80% 42%) 0%, hsl(350 60% 35%) 100%)",
      "--gradient-gold": "linear-gradient(135deg, hsl(45 90% 55%) 0%, hsl(30 80% 50%) 100%)",
      "--gradient-parchment": "linear-gradient(180deg, hsl(30 30% 97%) 0%, hsl(28 32% 93%) 100%)",
    },
  },
  midnight: {
    label: "Midnight",
    preview: ["#1e293b", "#60a5fa", "#0f172a"],
    vars: {
      "--background": "222 30% 7%",
      "--foreground": "210 20% 90%",
      "--card": "222 25% 11%",
      "--card-foreground": "210 20% 90%",
      "--popover": "222 25% 11%",
      "--popover-foreground": "210 20% 90%",
      "--primary": "217 70% 55%",
      "--primary-foreground": "222 30% 7%",
      "--secondary": "220 20% 18%",
      "--secondary-foreground": "210 18% 82%",
      "--muted": "220 15% 16%",
      "--muted-foreground": "215 12% 50%",
      "--accent": "38 80% 55%",
      "--accent-foreground": "222 30% 7%",
      "--success": "160 45% 40%",
      "--success-foreground": "222 30% 7%",
      "--destructive": "0 60% 50%",
      "--destructive-foreground": "210 20% 90%",
      "--border": "220 15% 20%",
      "--input": "220 15% 20%",
      "--ring": "217 70% 55%",
      "--gradient-hero": "linear-gradient(135deg, hsl(217 70% 35%) 0%, hsl(240 50% 22%) 100%)",
      "--gradient-gold": "linear-gradient(135deg, hsl(38 80% 55%) 0%, hsl(45 70% 45%) 100%)",
      "--gradient-parchment": "linear-gradient(180deg, hsl(222 25% 11%) 0%, hsl(222 22% 9%) 100%)",
    },
  },
};

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "heritage",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("chapaneri-theme") as ThemeName) || "heritage";
    }
    return "heritage";
  });

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem("chapaneri-theme", newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    const themeVars = themes[theme].vars;
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
