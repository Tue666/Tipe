import type { AvatarProps as MUIAvatarProps } from '@mui/material';
import { Avatar as MAvatar } from '@mui/material';

interface AvatarProps extends MUIAvatarProps {
  name: string;
}

const Avatar = (props: AvatarProps) => {
  const { name, src, sx } = props;
  return <MAvatar alt={name} src={src} sx={{ width: 60, height: 60, ...sx }} />;
};

export default Avatar;
