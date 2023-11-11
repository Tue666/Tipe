import _ from 'lodash';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Pagination, Skeleton, Stack, Typography, styled } from '@mui/material';
import { productApi } from '@/apis';
import { Page, ProductCard } from '@/components';
import { IProduct } from '@/models/interfaces';
import { LIMIT_VIEW_MORE_WIDGET_NUMBER } from '@/configs/constants';
import { PATH_MAIN } from '@/configs/routers';

const buildTitle = (group: string) => {
  return group.replaceAll('_', ' ');
};

const Widget = () => {
  const [widget, setWidget] = useState<IProduct.FindForWidgetResponse | null>(null);
  const { query, isReady, push } = useRouter();
  const { group, newest } = query;
  useEffect(() => {
    const findForWidget = async () => {
      const widget = await productApi.findForWidget({
        group: group as IProduct.WidgetGroup,
        newest: newest ? parseInt(newest as string) : 0,
        limit: LIMIT_VIEW_MORE_WIDGET_NUMBER,
      });
      setWidget(widget);
    };

    isReady && findForWidget();

    return () => setWidget(null);
  }, [group, newest, isReady]);

  const handleChangePage = (e: ChangeEvent<unknown>, newPage: number) => {
    const newest = (newPage - 1) * LIMIT_VIEW_MORE_WIDGET_NUMBER;
    push(`${PATH_MAIN.widget(group as IProduct.WidgetGroup)}&newest=${newest}`);
  };
  return (
    <Page title="Tipe Shop | Buy and Sell on Mobile App or Website">
      {!_.isNil(widget) &&
        (() => {
          const { products, pagination } = widget;
          const { currentPage, totalPage } = pagination;
          return (
            <Fragment>
              {group && (
                <Stack alignItems="center">
                  <Typography variant="h4" my={3} sx={{ textTransform: 'capitalize' }}>
                    {buildTitle(group as string)}
                  </Typography>
                </Stack>
              )}
              <ProductWrapper>
                {products.map((product, index) => {
                  return <ProductCard key={index} product={product} />;
                })}
              </ProductWrapper>
              {products?.length > 0 && (
                <Stack alignItems="end" mt={2}>
                  <Pagination
                    color="primary"
                    page={currentPage}
                    count={totalPage}
                    hidePrevButton={currentPage <= 1}
                    hideNextButton={currentPage >= totalPage}
                    onChange={handleChangePage}
                  />
                </Stack>
              )}
            </Fragment>
          );
        })()}
      {_.isNil(widget) && (
        <Fragment>
          <Stack alignItems="center">
            <Skeleton variant="text" width={250} height={50} />
          </Stack>
          <ProductWrapper>
            {[...Array(15)].map((_, index) => {
              return (
                <Stack key={index} sx={{ p: 2 }}>
                  <Skeleton variant="rectangular" width={180} height={180} />
                  <Skeleton variant="text" height={45} />
                  <Skeleton variant="text" width={150} />
                  <Skeleton variant="text" width={130} />
                </Stack>
              );
            })}
          </ProductWrapper>
        </Fragment>
      )}
    </Page>
  );
};

const ProductWrapper = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

export default Widget;
