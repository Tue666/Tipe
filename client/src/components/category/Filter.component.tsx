import { Checkbox, Chip, Stack, styled } from '@mui/material';
import { Link } from '../overrides';
import ApplyPrice from './ApplyPrice.component';
import { Stars, Collapse } from '@/components';
import { ICategory } from '@/models/interfaces';
import { PATH_MAIN } from '@/configs/routers';

interface FilterProps {
  _children: ICategory.NestedCategory['children'];
}

const Filter = (props: FilterProps) => {
  const { _children } = props;
  const renderAttribute = (multi_select: boolean) =>
    [...Array(5)].map((_, index) => {
      return (
        <Text key={index}>
          {multi_select && <Checkbox size="small" sx={{ p: '5px', mr: '5px' }} />}
          Samsung
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
          {[...Array(3)].map((_, index) => {
            return (
              <Text key={index}>
                <Stars total={5} rating={5} />
                &nbsp;5 Stars
              </Text>
            );
          })}
        </Stack>
      </Wrapper>
      <Wrapper>
        <Title>price</Title>
        {[...Array(5)].map((_, index) => {
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
        })}
        <ApplyPrice />
      </Wrapper>
      {[...Array(5)].map((_, index) => {
        return (
          <Wrapper key={index}>
            <Title>brand</Title>
            <Stack>
              {renderAttribute(true)}
              <Collapse>{renderAttribute(true)}</Collapse>
            </Stack>
          </Wrapper>
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
