export type Theme = "light" | "dark";
export type Mode = Theme | "system";

export interface ModeManager {
  getMode(): Mode;
  setMode(mode: Mode): void;
  watchMode(handler: (mode: Mode) => void): () => void;
  getTheme(): Theme;
  watchTheme(handler: (theme: Theme) => void): () => void;
}

export function sanitizeMode(mode: string): Mode {
  return mode === "light" || mode === "dark" ? mode : "system";
}

export function getCurrentTheme(mode: string): Theme {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const sanitizedMode = sanitizeMode(mode);
  return sanitizedMode === "system"
    ? (["light", "dark"] as const)[+mediaQuery.matches]
    : sanitizedMode;
}

export function mode(initialMode: string): ModeManager {
  let currentTheme = getCurrentTheme(initialMode);
  const themeWatchers: ((theme: Theme) => void)[] = [];
  function setTheme(theme: Theme): void {
    currentTheme = theme;
    themeWatchers.forEach((watcher) => watcher(theme));
  }
  function watchTheme(watcher: (typeof themeWatchers)[number]) {
    const wrapped: typeof watcher = (mode) => watcher(mode);
    wrapped(currentTheme);
    themeWatchers.push(wrapped);
    return () => {
      const index = themeWatchers.indexOf(wrapped);
      if (index !== -1) {
        themeWatchers.splice(index, 1);
      }
    };
  }

  function modeWatcher() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const eventListener = (e: MediaQueryListEvent) => {
      const theme = e.matches ? "dark" : "light";
      setTheme(theme);
    };
    let mediaQueryListener: typeof eventListener | undefined;
    return (mode: Mode) => {
      if (mediaQueryListener) {
        mediaQuery.removeEventListener("change", mediaQueryListener);
        mediaQueryListener = undefined;
      }
      if (mode === "system") {
        mediaQueryListener = eventListener;
        mediaQuery.addEventListener("change", mediaQueryListener);
        const newTheme = mediaQuery.matches ? "dark" : "light";
        setTheme(newTheme);
      } else {
        setTheme(mode);
      }
    };
  }

  let currentMode: Mode = "light";
  const modeWatchers: ((mode: Mode) => void)[] = [modeWatcher()];
  function setMode(mode: Mode) {
    currentMode = mode;
    modeWatchers.forEach((listener) => listener(mode));
  }
  function watchMode(watcher: (typeof modeWatchers)[number]) {
    const wrapped: typeof watcher = (mode) => watcher(mode);
    wrapped(currentMode);
    modeWatchers.push(wrapped);
    return () => {
      const index = modeWatchers.indexOf(wrapped);
      if (index !== -1) {
        modeWatchers.splice(index, 1);
      }
    };
  }

  setMode(sanitizeMode(initialMode));

  return {
    getMode() {
      return currentMode;
    },
    setMode(mode: Mode) {
      setMode(sanitizeMode(mode));
    },
    watchMode,
    getTheme() {
      return currentTheme;
    },
    watchTheme,
  };
}
