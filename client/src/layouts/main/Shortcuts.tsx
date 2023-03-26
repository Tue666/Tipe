import { Grid, Stack } from "@mui/material";

// components
import Logo from "@/components/Logo";
import Hidden from "@/components/Hidden";
//
import SearchBar from "./SearchBar";
import CartPopover from "./CartPopover";
import SwitchTheme from "./SwitchTheme";

const Shortcuts = () => {
  return (
    <Grid container alignItems="center" flexGrow={1}>
      <Grid item xs={6} md={3}>
        <Logo />
      </Grid>
      <Hidden breakpoint="md" type="Down">
        <Grid item md={6}>
          <SearchBar />
        </Grid>
        <Grid item md={3}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={3}
          >
            <CartPopover />
            <SwitchTheme />
          </Stack>
        </Grid>
      </Hidden>
      <Hidden breakpoint="md" type="Up">
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={3}
          >
            <CartPopover />
            <SwitchTheme />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <SearchBar />
        </Grid>
      </Hidden>
    </Grid>
  );
};

export default Shortcuts;
