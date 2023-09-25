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
}

const Navbars = (props: NavbarsProps) => {
  const { menus } = props;
  return (
    <List component="nav" dense>
      {menus.map((menu, index) => {
        const { title, icon, href } = menu;
        return (
          <ListItemButton key={title} selected={index === 0}>
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
