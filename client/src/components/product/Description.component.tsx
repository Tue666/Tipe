import { styled } from '@mui/material';
import { ContentToggle } from '@/components';
import { STYLE } from '@/configs/constants';

interface DescriptionProps {
  description: string;
}

const Description = (props: DescriptionProps) => {
  const { description } = props;
  return (
    <ContentToggle>
      <Content dangerouslySetInnerHTML={{ __html: description }} />
    </ContentToggle>
  );
};

const Content = styled('div')({
  padding: '10px',
  marginBottom: '20px',
  maxHeight: STYLE.DESKTOP.PRODUCT.DESCRIPTION_MAX_HEIGHT,
  overflow: 'hidden',
  transition: 'all 0.5s',
});

export default Description;
