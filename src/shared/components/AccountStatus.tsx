import { FC, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { useModal, useTranslations, useToggle } from "../hooks";
import { ModalKey } from "../containers/ModalProvider";
import { useAuth } from "../../features/auth/hooks";

export const AccountStatus: FC = () => {
  const { username, logout } = useAuth();
  const { messages } = useTranslations();
  const { open } = useModal(ModalKey.login);
  const { isOn, turnOff, turnOn } = useToggle(false);
  const anchor = useRef<HTMLElement | null>(null);
  const history = useHistory();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    anchor.current = event.currentTarget;
    turnOn();
  };

  return (
    <>
      <IconButton
        aria-controls="fade-menu"
        aria-haspopup="true"
        onClick={username ? handleClick : () => open({ canExit: true })}
      >
        <Typography>{username}</Typography>
        <AccountCircle />
      </IconButton>
      <Menu
        id="fade-menu"
        anchorEl={anchor.current}
        keepMounted
        open={isOn}
        onClose={turnOff}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => {
            turnOff();
            logout();
            history.replace("/");
          }}
        >
          {messages.signOut}
        </MenuItem>
      </Menu>
    </>
  );
};
