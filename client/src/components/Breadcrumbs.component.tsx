import { Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material';
import { Link } from './overrides';
import { PATH_MAIN } from '@/configs/routers';

interface LinkItemProps {
  title: string;
  path: string;
}

interface BreadcrumbsProps {
  current: string;
  links?: LinkItemProps[];
}

const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { current, links } = props;
  return (
    <MUIBreadcrumbs separator=">" sx={{ my: 1 }}>
      <Link href={PATH_MAIN.home}>
        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
          Home
        </Typography>
      </Link>
      {links &&
        links.map((link, index) => {
          const { title, path } = link;
          return (
            <Link key={index} href={path}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                {title}
              </Typography>
            </Link>
          );
        })}
      <Typography>{current}</Typography>
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
