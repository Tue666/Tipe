import { Fragment, useState } from 'react';
import { Button, Drawer, Stack } from '@mui/material';
import { FilterAltOutlined } from '@mui/icons-material';

const FilterMobile = () => {
  const [isOpenFilterDrawer, setIsOpenFilterDrawer] = useState(false);
  return (
    <Fragment>
      <Stack direction="row-reverse" mb={1}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterAltOutlined />}
          onClick={() => setIsOpenFilterDrawer(true)}
        >
          Filter
        </Button>
      </Stack>
      <Drawer anchor="left" open={isOpenFilterDrawer} onClose={() => setIsOpenFilterDrawer(false)}>
        hehe
      </Drawer>
    </Fragment>
  );
};

export default FilterMobile;
