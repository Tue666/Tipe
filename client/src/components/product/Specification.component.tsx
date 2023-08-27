import { styled } from '@mui/material';

const Specification = () => {
  return (
    <Root>
      <tbody>
        {[...Array(10)].map((_, index) => {
          return (
            <tr key={index}>
              <td className="title">CPU speed</td>
              <td>4 core 2.3 GHz & 4 core 1.8 GHz</td>
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
