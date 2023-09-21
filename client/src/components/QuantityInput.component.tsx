import _ from 'lodash';
import { FocusEvent, ChangeEvent } from 'react';
import { styled, Stack, Box, Typography, BoxProps, TextFieldProps, useTheme } from '@mui/material';
import { IProduct } from '@/models/interfaces';
import { SHOW_STOCK_QUANTITY_WHEN_REACH_NUMBER } from '@/configs/constants';

interface QuantityInputProps {
  isInCart: boolean;
  input: string;
  quantity: IProduct.NestedProduct['quantity'];
  limit: IProduct.NestedProduct['limit'];
  setInput: (newInput: string) => void;
  onSelfRemove?: () => void;
}

const QuantityInput = (props: QuantityInputProps) => {
  const { isInCart, input, quantity, limit, setInput, onSelfRemove } = props;
  const theme = useTheme();
  const buttonStyle = {
    width: '30px',
    '&.normal:hover': {
      cursor: 'pointer',
      border: '1px solid #2195F3',
    },
    ...(isInCart && {
      '&.warning:hover': {
        cursor: 'pointer',
        border: `1px solid ${theme.palette.error.main}`,
      },
    }),
  };

  const handlePrepareInput = (newInput: number): number | undefined => {
    // Handle remove item if quantity less than 1
    if (newInput < 1) {
      if (!isInCart) return;
      onSelfRemove && onSelfRemove();
      return;
    }

    // Validate quantity before change
    const prepareChange = {
      hasError: false,
      errorMessage: '',
    };
    if (newInput > quantity) {
      prepareChange.hasError = true;
      prepareChange.errorMessage = `The remaining quantity of the product is ${quantity}`;
    }
    if (newInput > limit && limit < quantity) {
      prepareChange.hasError = true;
      prepareChange.errorMessage = `Maximum purchase quantity for this product is ${limit}`;
    }
    if (prepareChange.hasError) {
      console.log(prepareChange.errorMessage);
      return;
    }
    return newInput;
  };
  const handleBlurInput = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (_.isEmpty(value)) setInput('1');
  };
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    if (value === '0') value = '1';
    const preparedInput = handlePrepareInput(parseInt(value));
    preparedInput && setInput(preparedInput.toString());
  };
  const handleClickGroupButton = (sign: 1 | -1) => {
    const newInput = parseInt(input) + 1 * sign;
    const preparedInput = handlePrepareInput(newInput);
    preparedInput && setInput(preparedInput.toString());
  };
  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <GroupInput
          className={parseInt(input) <= 1 ? 'warning' : 'normal'}
          component="button"
          onClick={() => handleClickGroupButton(-1)}
          sx={buttonStyle}
        >
          -
        </GroupInput>
        <GroupInput
          className="normal"
          component="input"
          type="text"
          value={input}
          onChange={handleChangeInput}
          onBlur={handleBlurInput}
          sx={{ width: '40px' }}
        />
        <GroupInput
          className="normal"
          component="button"
          onClick={() => handleClickGroupButton(1)}
          sx={buttonStyle}
        >
          +
        </GroupInput>
      </Stack>
      {quantity <= SHOW_STOCK_QUANTITY_WHEN_REACH_NUMBER && (
        <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
          {quantity} product(s) left
        </Typography>
      )}
    </Stack>
  );
};

const GroupInput = styled(Box)<BoxProps & TextFieldProps>(({ theme }) => ({
  height: '30px',
  fontSize: '14px',
  textAlign: 'center',
  outline: 'none',
  transition: 'border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s',
  border: `1px solid ${theme.palette.background.default}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

export default QuantityInput;
