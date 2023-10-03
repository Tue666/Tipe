import { ReactNode } from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from '@/components/overrides';

interface Menu {
  title: string;
  icon: ReactNode;
  href: string;
}

interface NavbarsProps {
  menus: Menu[];
  currentHref: Menu['href'];
}

const Navbars = (props: NavbarsProps) => {
  const { menus, currentHref } = props;
  return (
    <List component="nav" dense>
      {menus.map((menu) => {
        const { title, icon, href } = menu;
        return (
          <ListItemButton key={title} selected={href === currentHref}>
            <ListItemIcon>{icon}</ListItemIcon>
            <Link href={href}>
              <ListItemText primary={title} />
            </Link>
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default Navbars;
