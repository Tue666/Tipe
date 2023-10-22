import { Checkbox, Chip, Stack, styled } from '@mui/material';
import { Link } from '../overrides';
import ApplyPrice from './ApplyPrice.component';
import { Stars, Collapse } from '@/components';
import { ICategory, IProduct } from '@/models/interfaces';
import { PATH_MAIN } from '@/configs/routers';
import { Attribute } from '@/models/interfaces/schema';
import { SHOW_COLLAPSED_ATTRIBUTES_WHEN_REACH_NUMBER } from '@/configs/constants';

interface FilterProps extends Pick<IProduct.FindForRecommendResponse, 'attributes'> {
  _children: ICategory.NestedCategory['children'];
  handleNavigate: any;
}

const Filter = (props: FilterProps) => {
  const { _children, attributes, handleNavigate } = props;
  const attributeMapping = attributes.reduce((mapping, attribute) => {
    const { k, v } = attribute;
    if (!mapping[k]) {
      mapping[k] = [v];
      return mapping;
    }
    return { ...mapping, [k]: [...mapping[k], v] };
  }, {} as { [k: Attribute['k']]: Attribute['v'][] });
  const renderAttributes = (attributes: Attribute['v'][], multi_select: boolean) =>
    attributes.map((attribute, index) => {
      return (
        <Text key={index} onClick={handleNavigate}>
          {multi_select && <Checkbox size="small" sx={{ p: '5px', mr: '5px' }} />}
          {attribute}
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
        {/* {[...Array(5)].map((_, index) => {
          return (
            <Chip
              key={index}
              label="From 400.000 to 13.500.000"
              variant="outlined"
              color="primary"
              sx={{ my: '2px' }}
              size="small"
            />
          );
        })} */}
        <ApplyPrice />
      </Wrapper>
      {Object.keys(attributeMapping).map((attributeKey) => {
        const attributeValues = attributeMapping[attributeKey];
        const showingAttributes = attributeValues.splice(
          0,
          SHOW_COLLAPSED_ATTRIBUTES_WHEN_REACH_NUMBER
        );
        return (
          showingAttributes.length > 0 && (
            <Wrapper key={attributeKey}>
              <Title>{attributeKey.replace(/-/g, ' ')}</Title>
              <Stack>
                {renderAttributes(showingAttributes, true)}
                {attributeValues.length > 0 && (
                  <Collapse>{renderAttributes(attributeValues, true)}</Collapse>
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
