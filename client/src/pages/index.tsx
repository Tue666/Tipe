import { GetStaticProps } from 'next';
import { Stack } from '@mui/material';
import { Page, Teleport, ProductSection, ProductList } from '@/components';
import { Banners, Categories } from '@/components/home';
import { HOME_TELEPORTS } from '@/configs/teleport';
import { categoryApi, productApi } from '@/apis';
import { ICategory, IProduct } from '@/models/interfaces';
import { LIMIT_SUGGESTION_NUMBER, LIMIT_WIDGET_NUMBER } from '@/configs/constants';

interface HomeProps {
  categories: ICategory.FindResponse;
  soldWidget: IProduct.FindForWidgetResponse;
  favoriteWidget: IProduct.FindForWidgetResponse;
  suggestion: IProduct.FindForSuggestionResponse;
}

const Home = (props: HomeProps) => {
  const { ids, titles, actions } = HOME_TELEPORTS;
  const { categories, soldWidget, favoriteWidget, suggestion } = props;
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
          products={soldWidget.products}
        />
        <ProductSection
          id={ids['favorite-section']}
          title={titles['favorite-section']}
          products={favoriteWidget.products}
        />
        <ProductList
          id={ids['product-list']}
          title={titles['product-list']}
          suggestion={suggestion}
        />
      </Stack>
    </Page>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const categories = await categoryApi.find({
      level: 1,
    });
    const soldWidget = await productApi.findForWidget({
      group: 'top_selling',
      limit: LIMIT_WIDGET_NUMBER,
    });
    const favoriteWidget = await productApi.findForWidget({
      group: 'top_favorite',
      limit: LIMIT_WIDGET_NUMBER,
    });
    const suggestion = await productApi.findForSuggestion({
      limit: LIMIT_SUGGESTION_NUMBER,
    });
    return {
      props: {
        categories,
        soldWidget,
        favoriteWidget,
        suggestion,
      },
    };
  } catch (error) {
    console.log('Home generated with error:', error);
    return {
      notFound: true,
    };
  }
};

export default Home;
