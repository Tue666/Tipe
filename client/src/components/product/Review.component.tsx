import { Fragment } from 'react';
import { Pagination, Stack, Typography, styled } from '@mui/material';
import Stars from '../Stars.component';
import { StarRounded } from '@mui/icons-material';
import Comment from './Comment.component';
import { STYLE } from '@/configs/constants';
import { IProduct } from '@/models/interfaces';

interface ScoreRangeProps {
  total: number;
  score: number;
}

interface ReviewProps extends Pick<IProduct.NestedProduct, 'ratings'> {}

const Review = (props: ReviewProps) => {
  const { ratings } = props;
  const { rating_average, rating_count, scores } = ratings;
  return (
    <Fragment>
      <Stack direction={{ xs: 'column', md: 'row', lg: 'row' }}>
        <Stack sx={{ width: STYLE.DESKTOP.PRODUCT.RATING_WIDTH }} mb={2}>
          <Stack direction="row" alignItems="center">
            <Typography variant="h3" sx={{ p: 2, fontWeight: 'bold' }}>
              {rating_average}
            </Typography>
            <Stack justifyContent="center">
              <Stars total={5} rating={rating_average} />
              <Typography variant="caption">{rating_count} ratings</Typography>
            </Stack>
          </Stack>
          <Stack>
            {scores?.length > 0 &&
              scores.map((score, index) => {
                return (
                  <Stack key={index} direction="row" alignItems="center">
                    <Stars total={5} rating={index + 1} />
                    <Range total={rating_count} score={score} />
                    <Typography variant="caption">{score}</Typography>
                  </Stack>
                );
              })}
          </Stack>
        </Stack>
        <Stack>
          <Typography variant="subtitle2">Filter reviews by:</Typography>
          <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <Filter>Mới nhất</Filter>
            {[5, 4, 3, 2, 1].map((rating, index) => {
              return (
                <Filter key={index}>
                  {rating} <StarRounded fontSize="small" sx={{ color: 'rgb(253, 216, 54)' }} />
                </Filter>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
      <Stack>
        <Comment />
        <Comment />
      </Stack>
      <PaginationWrapper>
        <Pagination
          color="primary"
          page={1}
          count={10}
          // hidePrevButton={pagination.page <= 1}
          // hideNextButton={pagination.page >= pagination.totalPage}
          // onChange={(event, value) => handleNavigate('page', value)}
        />
      </PaginationWrapper>
    </Fragment>
  );
};

const Range = styled('div')<ScoreRangeProps>(({ total, score }) => ({
  width: '150px',
  height: '6px',
  backgroundColor: 'rgb(238, 238, 238)',
  position: 'relative',
  zIndex: 1,
  margin: '0px 6px',
  borderRadius: '99em',
  '&:before': {
    content: '""',
    width: `calc(100%*${score}/${total})`,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgb(120, 120, 120)',
    borderRadius: '99em',
  },
}));

const Filter = styled('div')(({ theme }) => ({
  display: 'flex',
  fontSize: '14px',
  padding: '8px 17px',
  borderRadius: '20px',
  backgroundColor: theme.palette.background.default,
  margin: '0px 12px 12px 0px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    transition: '0.3s',
  },
}));

const PaginationWrapper = styled('div')({
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'flex-end',
});

export default Review;
