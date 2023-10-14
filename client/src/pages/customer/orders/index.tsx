import {
  ReactNode,
  SyntheticEvent,
  ChangeEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { IconButton, InputAdornment, Pagination, Stack, Tab, Tabs, TextField } from '@mui/material';
import {
  CreditCardOffOutlined,
  InventoryOutlined,
  LocalShippingOutlined,
  RunningWithErrors,
  Search,
  BackspaceOutlined,
  WrongLocationOutlined,
} from '@mui/icons-material';
import { Page } from '@/components';
import { PageWithLayout } from '@/pages/_app';
import MainLayout from '@/layouts/main';
import CustomerLayout from '@/layouts/customer';
import { OrderPanel } from '@/components/customer';
import { HandlerReducer, createReducerHook } from '@/utils/hook.util';
import { ICommon, IOrder, ISchema } from '@/models/interfaces';
import orderApi from '@/apis/orderApi';
import { LIMIT_ORDER_EACH_PAGE_NUMBER } from '@/configs/constants';

export type OrderTabs = {
  [K in ISchema.OrderStatus]: {
    label: string;
    color?: string;
    icon?: ReactNode;
  };
};

export const ORDER_TABS: OrderTabs = {
  all: {
    label: 'ALL ORDERS',
  },
  awaiting_payment: {
    label: 'UNPAID',
    color: 'error.light',
    icon: <CreditCardOffOutlined />,
  },
  processing: {
    label: 'PROCESSING',
    color: 'warning.dark',
    icon: <RunningWithErrors />,
  },
  transporting: {
    label: 'TRANSPORTING',
    color: 'warning.dark',
    icon: <LocalShippingOutlined />,
  },
  delivered: {
    label: 'DELIVERED',
    color: 'success.main',
    icon: <InventoryOutlined />,
  },
  canceled: {
    label: 'CANCELED',
    color: 'error.main',
    icon: <WrongLocationOutlined />,
  },
};

type OrderState = {
  [K in ISchema.OrderStatus]: {
    orders: IOrder.Order[];
    totalPage: ICommon.Pagination['pagination']['totalPage'];
  };
};

const initialOrderState = {} as OrderState;
for (const tab in ORDER_TABS) {
  initialOrderState[tab as keyof typeof ORDER_TABS] = {
    orders: [],
    totalPage: 0,
  };
}

type Handler = 'FILL_TAB';

const handlers: HandlerReducer<Handler, OrderState> = {
  FILL_TAB: (state: OrderState, payload: Partial<OrderState>) => {
    const orderState = payload;
    return {
      ...state,
      ...orderState,
    };
  },
};

const reducer = createReducerHook(handlers);

interface CurrentOrder {
  tab: ISchema.OrderStatus;
  page: number;
  limit: number;
  search: string;
}

const initialCurrentOrder: CurrentOrder = {
  tab: 'all',
  page: 1,
  limit: LIMIT_ORDER_EACH_PAGE_NUMBER,
  search: '',
};

type VisitedTabs = {
  [K in ISchema.OrderStatus]: {
    page: number;
  };
} & { search: string };

const Orders: PageWithLayout = () => {
  const [orderState, dispatchOrder] = useReducer(reducer, initialOrderState);
  const [currentOrder, setCurrentOrder] = useState(initialCurrentOrder);
  const visitedTabs = useRef<VisitedTabs>({} as VisitedTabs); // Variable that will store tabs are visited to prevent fetch redundant data
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(); // Debounce for search value

  useEffect(() => {
    const { tab, page, limit, search } = currentOrder;
    // Refresh visited whenever search change
    if (visitedTabs.current.search !== search) {
      visitedTabs.current = {
        search,
      } as VisitedTabs;
    }

    const visitedTab = visitedTabs.current[tab];
    // Only fetch new data when first time visited or page of tab has been changed
    const canFetching = !visitedTab || visitedTab.page !== page;
    if (canFetching) {
      const getOrders = async () => {
        const findByStatusQuery: IOrder.FindByStatusQuery = {
          newest: (page - 1) * limit,
          limit,
        };
        if (tab !== 'all') findByStatusQuery['status'] = tab;
        if (search) findByStatusQuery['search'] = search;
        const { orders, pagination } = await orderApi.findByStatus(findByStatusQuery);
        dispatchOrder({
          type: 'FILL_TAB',
          payload: {
            [tab]: {
              orders,
              totalPage: pagination.totalPage,
            },
          },
        });

        // Update visited tab
        visitedTabs.current = {
          ...visitedTabs.current,
          [tab]: {
            page: !visitedTab ? 1 : page,
          },
        };
      };
      getOrders();
    }
  }, [currentOrder]);

  const handleChangeTab = (e: SyntheticEvent, switchedTab: ISchema.OrderStatus) => {
    setCurrentOrder({
      ...currentOrder,
      tab: switchedTab,
      page: visitedTabs.current[switchedTab]?.page || 1,
    });
  };
  const handleChangePage = (e: ChangeEvent<unknown>, newPage: number) => {
    setCurrentOrder({
      ...currentOrder,
      page: newPage,
    });
    window.scrollTo(0, 0);
  };
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = e.target.value;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setCurrentOrder({
        ...currentOrder,
        search: newSearchValue,
        page: 1,
      });
    }, 800);
  };
  const handleClickClearSearch = () => {
    setCurrentOrder({
      ...currentOrder,
      search: '',
      page: 1,
    });
  };
  return (
    <Page title="Orders">
      <Stack spacing={1}>
        <Tabs
          value={currentOrder.tab}
          variant="fullWidth"
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
          onChange={handleChangeTab}
        >
          {(Object.keys(ORDER_TABS) as Array<keyof typeof ORDER_TABS>).map((tab) => {
            const { label } = ORDER_TABS[tab];
            return <Tab key={tab} label={label} value={tab} />;
          })}
        </Tabs>
        <Stack direction="row" alignItems="center">
          <TextField
            value={currentOrder.search}
            fullWidth
            variant="outlined"
            size="small"
            color="secondary"
            placeholder="Find order by order number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClickClearSearch}>
                    <BackspaceOutlined sx={{ fontSize: '14px' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={handleChangeSearch}
            sx={{ bgcolor: (theme) => theme.palette.background.paper }}
          />
        </Stack>
        {(Object.keys(ORDER_TABS) as Array<keyof typeof ORDER_TABS>).map((tab) => {
          const isActiveTab = tab === currentOrder.tab;
          return (
            isActiveTab && (
              <OrderPanel
                key={tab}
                tabs={ORDER_TABS}
                orders={orderState[currentOrder.tab].orders}
              />
            )
          );
        })}
        {orderState[currentOrder.tab].totalPage > 1 && (
          <Pagination
            color="primary"
            page={currentOrder.page}
            count={orderState[currentOrder.tab].totalPage}
            hidePrevButton={currentOrder.page <= 1}
            hideNextButton={currentOrder.page >= orderState[currentOrder.tab].totalPage}
            onChange={handleChangePage}
            sx={{ alignSelf: 'end' }}
          />
        )}
      </Stack>
    </Page>
  );
};

Orders.getLayout = (page) => {
  return (
    <MainLayout hasGuard={true}>
      <CustomerLayout>{page}</CustomerLayout>
    </MainLayout>
  );
};

export default Orders;
