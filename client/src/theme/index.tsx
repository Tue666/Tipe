import { ReactNode } from "react";
import type { ThemeOptions } from "@mui/material";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

// overrides
import { palette, typography } from "./overrides";
// hooks
import useSettings from "@/hooks/useSettings";

interface ThemeConfigProps {
  children: ReactNode;
}

const ThemeConfig = ({ children }: ThemeConfigProps) => {
  const { themeMode } = useSettings();
  const isLight = themeMode === "light";

  const themeOptions: ThemeOptions = {
    // overrides MUI properties here...
    palette: isLight ? palette.light : palette.dark,
    typography,
  };
  const theme = createTheme(themeOptions);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeConfig;
