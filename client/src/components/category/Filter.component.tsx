import { ParsedUrlQuery } from 'querystring';
import { Checkbox, Stack, styled } from '@mui/material';
import { Link } from '../overrides';
import ApplyPrice from './ApplyPrice.component';
import { Stars, Collapse } from '@/components';
import { ICategory, IProduct, ISchema } from '@/models/interfaces';
import { PATH_MAIN } from '@/configs/routers';
import { SHOW_COLLAPSED_ATTRIBUTES_WHEN_REACH_NUMBER } from '@/configs/constants';

interface AttributeFilter {
  value: ISchema.Attribute['v'];
  selected: boolean;
}

interface AttributeFilters {
  [k: ISchema.Attribute['k']]: AttributeFilter[];
}

interface FilterProps extends Pick<IProduct.FindForRecommendResponse, 'attributes'> {
  _children: ICategory.NestedCategory['children'];
  queryParams: ParsedUrlQuery;
  handleSelectFilter: (
    key: ISchema.Attribute['k'],
    value: ISchema.Attribute['v'],
    isMultiple?: boolean
  ) => void;
}

const Filter = (props: FilterProps) => {
  const { _children, queryParams, handleSelectFilter, attributes } = props;
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
        <Text key={index} onClick={() => handleSelectFilter(key, value, true)}>
          {isMultiple && <Checkbox checked={selected} size="small" sx={{ p: '5px', mr: '5px' }} />}
          {value}
        </Text>
      );
    });
  return (
    <Root>
      {_children.length > 0 && (
        <Wrapper>
          <Title>Product portfolio</Title>
          {_children.map((category) => {
            const { _id, slug, name } = category;
            return (
              <Link key={_id} href={PATH_MAIN.category(slug, _id)}>
                <Text>{name}</Text>
              </Link>
            );
          })}
        </Wrapper>
      )}
      <Wrapper>
        <Title>rating</Title>
        <Stack>
          {[5, 4, 3].map((rating) => {
            return (
              <Text key={rating}>
                <Stars total={5} rating={rating} />
                &nbsp;{rating} Stars
              </Text>
            );
          })}
        </Stack>
      </Wrapper>
      <Wrapper>
        <Title>price</Title>
        <ApplyPrice />
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
  width: '250px',
  borderRight: `2px solid ${theme.palette.background.default}`,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
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
