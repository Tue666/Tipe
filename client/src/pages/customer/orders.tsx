import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { InputAdornment, Pagination, Stack, Tab, Tabs, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Page } from '@/components';
import { PageWithLayout } from '../_app';
import MainLayout from '@/layouts/main';
import CustomerLayout from '@/layouts/customer';
import { OrderPanel } from '@/components/order';
import { HandlerReducer, createReducerHook } from '@/utils/hook.util';
import { IOrder } from '@/models/interfaces';
import orderApi from '@/apis/orderApi';

type Tab = 'all' | 'awaiting_payment' | 'processing' | 'transporting' | 'delivered' | 'canceled';

interface OrderTab {
  value: Tab;
  label: string;
}

const ORDER_TABS: OrderTab[] = [
  {
    value: 'all',
    label: 'ALL ORDERS',
  },
  {
    value: 'awaiting_payment',
    label: 'UNPAID',
  },
  {
    value: 'processing',
    label: 'PROCESSING',
  },
  {
    value: 'transporting',
    label: 'TRANSPORTING',
  },
  {
    value: 'delivered',
    label: 'DELIVERED',
  },
  {
    value: 'canceled',
    label: 'CANCELED',
  },
];

type OrdersState = {
  [K in Tab]: {
    orders: IOrder.Order[];
    totalPage: number;
  };
};

const initialState = ORDER_TABS.reduce((states, state) => {
  const { value } = state;
  return {
    ...states,
    [value]: {
      order: [],
      totalPage: 0,
    },
  };
}, {} as OrdersState);

type Handler = 'FILL_TAB';

const handlers: HandlerReducer<Handler, OrdersState> = {
  FILL_TAB: (state: OrdersState, payload: Partial<OrdersState>) => {
    const orderTab = payload;
    return {
      ...state,
      ...orderTab,
    };
  },
};

const reducer = createReducerHook(handlers);

const Orders: PageWithLayout = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [current, setCurrent] = useState({
    value: ORDER_TABS[0].value,
    newest: 1,
    limit: 10,
  });
  console.log(state);

  useEffect(() => {
    const { value, newest, limit } = current;
    const status = value !== 'all' ? value : '';
    const getOrders = async () => {
      const { orders, pagination } = await orderApi.findByStatus({
        newest,
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
  }, [current]);

  const handleChangeTab = (e: SyntheticEvent, newValue: string) => {
    console.log(newValue);
  };
  return (
    <Page title="Orders">
      <Stack spacing={1}>
        <Tabs
          value="all"
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
          const { value } = tab;
          const isActive = value === current.value;
          return isActive && <OrderPanel key={value} orders={state[current.value].orders} />;
        })}
        <Pagination color="primary" sx={{ alignSelf: 'end' }} />
      </Stack>
    </Page>
  );
};

Orders.getLayout = (page) => {
  return (
    <MainLayout>
      <CustomerLayout>{page}</CustomerLayout>
    </MainLayout>
  );
};

export default Orders;
