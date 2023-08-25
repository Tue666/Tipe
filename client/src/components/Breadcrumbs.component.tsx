import { Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material';
import { Link } from './overrides';
import { PATH_MAIN } from '@/configs/routers';

interface LinkItemProps {
  title: string;
  path: string;
}

interface BreadcrumbsProps {
  links?: LinkItemProps[];
}

const Breadcrumbs = ({ links }: BreadcrumbsProps) => {
  return (
    <MUIBreadcrumbs separator=">">
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
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
