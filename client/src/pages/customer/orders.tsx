import {
  ReactNode,
  SyntheticEvent,
  ChangeEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { InputAdornment, Pagination, Stack, Tab, Tabs, TextField } from '@mui/material';
import {
  CreditCardOffOutlined,
  InventoryOutlined,
  LocalShippingOutlined,
  RunningWithErrors,
  Search,
  WrongLocationOutlined,
} from '@mui/icons-material';
import { Page } from '@/components';
import { PageWithLayout } from '../_app';
import MainLayout from '@/layouts/main';
import CustomerLayout from '@/layouts/customer';
import { OrderPanel } from '@/components/order';
import { HandlerReducer, createReducerHook } from '@/utils/hook.util';
import { IOrder, ISchema } from '@/models/interfaces';
import orderApi from '@/apis/orderApi';
import { AuthGuard } from '@/guards';
import { LIMIT_ORDER_EACH_PAGE_NUMBER } from '@/configs/constants';

interface VisitedTab {
  tabs: ISchema.OrderStatus[];
  page: number;
  search: string;
}

const initialVisitedTab: VisitedTab = {
  tabs: [],
  page: 1,
  search: '',
};

interface OrderTab {
  value: ISchema.OrderStatus;
  label: string;
  color: string;
  icon: ReactNode;
}

const ORDER_TABS: OrderTab[] = [
  {
    value: 'all',
    label: 'ALL ORDERS',
    color: 'error.light',
    icon: <CreditCardOffOutlined />,
  },
  {
    value: 'awaiting_payment',
    label: 'UNPAID',
    color: 'error.light',
    icon: <CreditCardOffOutlined />,
  },
  {
    value: 'processing',
    label: 'PROCESSING',
    color: 'warning.dark',
    icon: <RunningWithErrors />,
  },
  {
    value: 'transporting',
    label: 'TRANSPORTING',
    color: 'warning.dark',
    icon: <LocalShippingOutlined />,
  },
  {
    value: 'delivered',
    label: 'DELIVERED',
    color: 'success.main',
    icon: <InventoryOutlined />,
  },
  {
    value: 'canceled',
    label: 'CANCELED',
    color: 'error.main',
    icon: <WrongLocationOutlined />,
  },
];

type OrdersState = {
  [K in ISchema.OrderStatus]: {
    orders: IOrder.Order[];
    totalPage: number;
  };
};

const initialState = ORDER_TABS.reduce((states, state) => {
  const { value } = state;
  return {
    ...states,
    [value]: {
      orders: [],
      totalPage: 0,
    },
  };
}, {} as OrdersState);

type Handler = 'FILL_TAB';

const handlers: HandlerReducer<Handler, OrdersState> = {
  FILL_TAB: (state: OrdersState, payload: Partial<OrdersState>) => {
    const orderState = payload;
    return {
      ...state,
      ...orderState,
    };
  },
};

const reducer = createReducerHook(handlers);

const Orders: PageWithLayout = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [current, setCurrent] = useState({
    value: ORDER_TABS[0].value,
    page: 1,
    limit: LIMIT_ORDER_EACH_PAGE_NUMBER,
    search: '',
  });
  const searchRef = useRef('');
  // Visited variable will store tabs are visited to prevent fetch redundant data
  const visited = useRef<VisitedTab>(initialVisitedTab);
  console.log(state);

  useEffect(() => {
    const { value, page, limit, search } = current;

    // Refresh visited whenever search change
    if (visited.current.search !== search) {
      visited.current = initialVisitedTab;
    }

    const isVisitedTab = visited.current.tabs.indexOf(value) !== -1;
    // Only fetch new data when first time visited or page has been changed
    const canFetching = !isVisitedTab || visited.current.page !== page;
    if (canFetching) {
      // Update visited tab
      visited.current = {
        ...visited.current,
        tabs: !isVisitedTab ? [...visited.current.tabs, value] : [...visited.current.tabs],
        page,
      };

      const status = value !== 'all' ? value : '';
      const getOrders = async () => {
        const { orders, pagination } = await orderApi.findByStatus({
          newest: (page - 1) * limit,
          limit,
          status,
        });
        console.log(pagination);
        dispatch({
          type: 'FILL_TAB',
          payload: {
            [value]: {
              orders,
              totalPage: pagination.totalPage,
            },
          },
        });
      };
      getOrders();
    }
  }, [current]);

  const handleChangeTab = (e: SyntheticEvent, switchedTab: ISchema.OrderStatus) => {
    setCurrent({
      ...current,
      value: switchedTab,
      page: 1,
    });
  };
  const handleChangePage = (e: ChangeEvent<unknown>, newPage: number) => {
    setCurrent({
      ...current,
      page: newPage,
    });
    window.scrollTo(0, 0);
  };
  return (
    <Page title="Orders">
      <Stack spacing={1}>
        <Tabs
          value={current.value}
          variant="fullWidth"
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
          onChange={handleChangeTab}
        >
          {ORDER_TABS.map((tab) => {
            const { value, label } = tab;
            return <Tab key={value} label={label} value={value} />;
          })}
        </Tabs>
        <Stack direction="row" alignItems="center">
          <TextField
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
            }}
            sx={{ bgcolor: (theme) => theme.palette.background.paper }}
          />
        </Stack>
        {ORDER_TABS.map((tab) => {
          const { value, color, icon } = tab;
          const isActive = value === current.value;
          return (
            isActive && (
              <OrderPanel
                key={value}
                orders={state[current.value].orders}
                color={color}
                icon={icon}
              />
            )
          );
        })}
        {state[current.value].totalPage > 1 && (
          <Pagination
            color="primary"
            page={current.page}
            count={state[current.value].totalPage}
            hidePrevButton={current.page <= 1}
            hideNextButton={current.page >= state[current.value].totalPage}
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
    <MainLayout>
      <AuthGuard>
        <CustomerLayout>{page}</CustomerLayout>
      </AuthGuard>
    </MainLayout>
  );
};

export default Orders;
