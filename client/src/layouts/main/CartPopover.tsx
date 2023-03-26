import { Badge, IconButton } from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";

// components
import { Link } from "@/components/overrides";
// configs
import { PATH_MAIN } from "@/configs/routers";

const CartPopover = () => {
  return (
    <Badge
      color="primary"
      badgeContent={10}
      max={99}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Link href={PATH_MAIN.cart}>
        <IconButton color="primary">
          <ShoppingCartOutlined />
        </IconButton>
      </Link>
    </Badge>
  );
};

export default CartPopover;
