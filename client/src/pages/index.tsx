import { Stack } from '@mui/material';
import { Page, Teleport, ProductSection, ProductList } from '@/components';
import { Banners, Categories } from '@/components/home';
import { HOME_TELEPORTS } from '@/configs/teleport';

const Home = () => {
  const { ids, titles, actions } = HOME_TELEPORTS;
  return (
    <Page title="Tipe Shop - Buy online, good price, good quality, fast shipping">
      <Teleport actions={actions} />
      <Stack spacing={3}>
        <Banners id={ids['banners']} />
        <Categories id={ids['categories']} title={titles['categories']} />
        <ProductSection id={ids['sold-section']} title={titles['sold-section']} />
        <ProductSection id={ids['search-section']} title={titles['search-section']} />
        <ProductList id={ids['product-list']} title={titles['product-list']} />
      </Stack>
    </Page>
  );
};

export default Home;
