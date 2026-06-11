import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

interface Props {
  icon: React.ElementType;
  label: string;
  path: string;
  active: boolean;
  onNavigate?: () => void;
}

export default function SidebarItem({
  icon: Icon,
  label,
  path,
  active,
  onNavigate,
}: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <ListItemButton
      onClick={handleClick}
      sx={{
        borderRadius: 2,
        mx: 1,
        mb: 1,

        backgroundColor: active
          ? "#EEF2FF"
          : "transparent",

        color: active
          ? "#4F46E5"
          : "#374151",

        "&:hover": {
          backgroundColor:
            "#F3F4F6",
        },
      }}
    >
      <ListItemIcon
        sx={{
          color: active
            ? "#4F46E5"
            : "#6B7280",
        }}
      >
        <Icon />
      </ListItemIcon>

      <ListItemText
        primary={label}
      />
    </ListItemButton>
  );
}