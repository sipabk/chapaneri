import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, themes, ThemeName } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground relative"
        >
          <Palette className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground px-1">Choose Theme</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(themes) as ThemeName[]).map((key) => {
              const t = themes[key];
              const isActive = theme === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all text-left",
                    isActive
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                  )}
                >
                  <div className="flex gap-0.5 flex-shrink-0">
                    {t.preview.map((color, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full border border-border/50"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-foreground flex-1">
                    {t.label}
                  </span>
                  {isActive && (
                    <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
