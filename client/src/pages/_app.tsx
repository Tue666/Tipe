import type { AppProps } from "next/app";
import "@/theme/globals.css";
// react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// contexts
import { SettingsProvider } from "@/contexts/SettingsContext";
// layouts
import MainLayout from "@/layouts/main";
// theme
import ThemeConfig from "@/theme";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SettingsProvider>
      <ThemeConfig>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ThemeConfig>
    </SettingsProvider>
  );
};

export default App;
