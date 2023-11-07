import _ from 'lodash';
import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { Stack } from '@mui/material';
import { Page, Teleport, ProductSection, ProductList } from '@/components';
import { Banners, Categories } from '@/components/home';
import { HOME_TELEPORTS } from '@/configs/teleport';
import { categoryApi, productApi } from '@/apis';
import { ICategory, IProduct } from '@/models/interfaces';
import { LIMIT_WIDGET_NUMBER } from '@/configs/constants';

interface HomeProps {
  categories: ICategory.FindResponse;
}

interface Widgets {
  soldWidget: IProduct.FindForWidgetResponse;
  favoriteWidget: IProduct.FindForWidgetResponse;
}

const Home = (props: HomeProps) => {
  const { ids, titles, actions } = HOME_TELEPORTS;
  const { categories } = props;
  const [widgets, setWidgets] = useState<Widgets | null>(null);

  useEffect(() => {
    const findWidgets = async () => {
      const soldWidget = await productApi.findForWidget({
        group: 'top_selling',
        limit: LIMIT_WIDGET_NUMBER,
      });
      const favoriteWidget = await productApi.findForWidget({
        group: 'top_favorite',
        limit: LIMIT_WIDGET_NUMBER,
      });
      setWidgets({
        soldWidget,
        favoriteWidget,
      });
    };

    findWidgets();
  }, []);
  return (
    <Page title="Tipe Shop - Buy online, good price, good quality, fast shipping">
      <Teleport actions={actions} />
      <Stack spacing={3}>
        <Banners id={ids['banners']} />
        <Categories
          id={ids['categories']}
          title={titles['categories']}
          categories={categories.categories}
        />
        <ProductSection
          id={ids['sold-section']}
          title={titles['sold-section']}
          {...(!_.isNil(widgets) ? { products: widgets.soldWidget.products } : {})}
        />
        <ProductSection
          id={ids['favorite-section']}
          title={titles['favorite-section']}
          {...(!_.isNil(widgets) ? { products: widgets.favoriteWidget.products } : {})}
        />
        <ProductList id={ids['product-list']} title={titles['product-list']} />
      </Stack>
    </Page>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const categories = await categoryApi.find({
      level: 1,
    });
    return {
      props: {
        categories,
      },
      revalidate: 1800,
    };
  } catch (error) {
    console.log('Home generated with error:', error);
    return {
      notFound: true,
    };
  }
};

export default Home;
