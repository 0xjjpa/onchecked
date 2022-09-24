import { Link } from "./Link";
import {
  HamburgerIcon,
  AddIcon,
  InfoIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import {
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Menu,
} from "@chakra-ui/react";

export const NavMenu = () => {
  return (
    <Menu>
      <MenuButton
        mt="10"
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <MenuList>
      <MenuItem as={Link} href="/" icon={<InfoIcon />} command="/">
          Home
        </MenuItem>
        <MenuItem as={Link} href="/sign" icon={<AddIcon />} command="/sign">
          New Proof
        </MenuItem>
        <MenuItem as={Link} href="/dashboard" icon={<ExternalLinkIcon />} command="/dashboard">
          Dashboard
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
