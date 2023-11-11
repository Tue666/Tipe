import { ParsedUrlQuery } from 'querystring';
import { Checkbox, Stack, styled } from '@mui/material';
import ApplyPrice from './ApplyPrice.component';
import { Stars, Collapse } from '@/components';
import { IProduct, ISchema } from '@/models/interfaces';
import { SHOW_COLLAPSED_ATTRIBUTES_WHEN_REACH_NUMBER, STYLE } from '@/configs/constants';

interface AttributeFilter {
  value: ISchema.Attribute['v'];
  selected: boolean;
}

interface AttributeFilters {
  [k: ISchema.Attribute['k']]: AttributeFilter[];
}

interface FilterProps extends Pick<IProduct.FindForRecommendResponse, 'attributes'> {
  queryParams: ParsedUrlQuery;
  handleChangeQueryParam: (
    key: ISchema.Attribute['k'],
    value: ISchema.Attribute['v'],
    isMultiple?: boolean,
    resetPage?: boolean
  ) => void;
}

const Filter = (props: FilterProps) => {
  const { queryParams, handleChangeQueryParam, attributes } = props;
  const attributeFilters = attributes.reduce((filters, attribute) => {
    const { k: key, v: value } = attribute;
    const selected = queryParams[key]?.indexOf(value)! > -1 ?? false;
    const attributeFilter = { value, selected };
    if (!filters[key]) {
      filters[key] = [attributeFilter];
      return filters;
    }
    return { ...filters, [key]: [...filters[key], attributeFilter] };
  }, {} as AttributeFilters);
  const renderAttributes = (
    key: ISchema.Attribute['k'],
    filters: AttributeFilter[],
    isMultiple: boolean = true
  ) =>
    filters.map((filter, index) => {
      const { value, selected } = filter;
      return (
        <Text key={index} onClick={() => handleChangeQueryParam(key, value, true, true)}>
          {isMultiple && <Checkbox checked={selected} size="small" sx={{ p: '5px', mr: '5px' }} />}
          {value}
        </Text>
      );
    });
  return (
    <Root>
      <Wrapper>
        <Title>rating</Title>
        <Stack>
          {[5, 4, 3].map((rating) => {
            return (
              <Text
                key={rating}
                onClick={() => handleChangeQueryParam('rating', `${rating} Stars`, false, true)}
              >
                <Stars total={5} rating={rating} />
                &nbsp;{rating} Stars
              </Text>
            );
          })}
        </Stack>
      </Wrapper>
      <Wrapper>
        <Title>price</Title>
        <ApplyPrice handleChangeQueryParam={handleChangeQueryParam} />
      </Wrapper>
      {Object.keys(attributeFilters).map((filterKey) => {
        const attributeFilter = attributeFilters[filterKey];
        const sortedFilterValues = attributeFilter.sort(
          (a, b) => Number(b.selected) - Number(a.selected)
        );
        const collapsedFilterValues = sortedFilterValues.splice(
          (sortedFilterValues.length - SHOW_COLLAPSED_ATTRIBUTES_WHEN_REACH_NUMBER) * -1
        );
        return (
          sortedFilterValues.length > 0 && (
            <Wrapper key={filterKey}>
              <Title>{filterKey.replace(/-/g, ' ')}</Title>
              <Stack>
                {renderAttributes(filterKey, sortedFilterValues)}
                {collapsedFilterValues.length > 0 && (
                  <Collapse>{renderAttributes(filterKey, collapsedFilterValues)}</Collapse>
                )}
              </Stack>
            </Wrapper>
          )
        );
      })}
    </Root>
  );
};

const Root = styled(Stack)(({ theme }) => ({
  width: STYLE.DESKTOP.CATEGORY.FILTER_WIDTH,
  borderRight: `2px solid ${theme.palette.background.default}`,
  [theme.breakpoints.down('sm')]: {
    width: STYLE.MOBILE.CATEGORY.FILTER_WIDTH,
    marginBottom: '10px',
  },
}));

const Wrapper = styled('div')(({ theme }) => ({
  padding: '10px',
  backgroundColor: theme.palette.background.paper,
  borderBottom: `2px solid ${theme.palette.background.default}`,
}));

const Title = styled('span')({
  fontWeight: 'bold',
  fontSize: '13px',
  display: 'block',
  paddingBottom: '10px',
  textTransform: 'uppercase',
});

const Text = styled('span')(({ theme }) => ({
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  paddingBottom: '5px',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

export default Filter;
