import { Stack, Typography } from '@mui/material';
import {
  timelineItemClasses,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import { IOrder } from '@/models/interfaces';

interface OrderTrackingProps {
  tracking_info: IOrder.Order['tracking_info'];
}

const OrderTracking = (props: OrderTrackingProps) => {
  const { tracking_info } = props;
  const { status_text, tracking_list } = tracking_info;
  const timelineItemStyle = {
    minHeight: '45px',
  };
  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      <TimelineItem sx={{ ...timelineItemStyle }}>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="subtitle2">{status_text}</Typography>
        </TimelineContent>
      </TimelineItem>
      {tracking_list.map((tracking, index) => {
        const { description, time } = tracking;
        return (
          <TimelineItem key={index} sx={{ ...timelineItemStyle }}>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Stack>
                <Typography variant="caption">{description}</Typography>
                <Typography variant="caption">{time}</Typography>
              </Stack>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default OrderTracking;
