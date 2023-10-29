import { styled } from '@mui/material';
import { IProduct } from '@/models/interfaces';

interface SpecificationProps extends Pick<IProduct.NestedProduct, 'specifications'> {}

const Specification = (props: SpecificationProps) => {
  const { specifications } = props;
  return (
    <Root>
      <tbody>
        {specifications.map((specification, index) => {
          const { k, v } = specification;
          return (
            <tr key={index}>
              <td className="title">{k}</td>
              <td>{v}</td>
            </tr>
          );
        })}
      </tbody>
    </Root>
  );
};

const Root = styled('table')(({ theme }) => ({
  width: '100%',
  fontSize: '14px',
  '& td.title': {
    width: '35%',
    backgroundColor: theme.palette.background.default,
    fontWeight: 'bold',
    borderRight: 'none',
  },
  '& td': {
    padding: '15px',
  },
}));

export default Specification;
