import {
  Avatar,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        height: 70,
        px: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #e5e7eb",
        bgcolor: "#FFFFFF",
      }}
    >
      {isMobile && (
        <IconButton
          onClick={onMenuClick}
          sx={{
            color: "#5988EF",
            mr: 1,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
        <Box 
          onClick={handleProfileClick}
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2, 
            cursor: "pointer",
            "&:hover": { opacity: 0.7 },
          }}
        >
          <Avatar 
            sx={{ 
              width: { xs: 32, md: 40 }, 
              height: { xs: 32, md: 40 },
              bgcolor: "#5988EF",
            }} 
          />

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography
              sx={{ fontWeight: 600, fontSize: { xs: "13px", md: "14px" } }}
            >
              Admin User
            </Typography>

            <Typography
              variant="caption"
              sx={{ fontSize: { xs: "11px", md: "12px" } }}
            >
              Administrator
            </Typography>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem disabled>
          <Typography sx={{ fontWeight: 600 }}>Admin User</Typography>
        </MenuItem>
        <MenuItem disabled>
          <Typography variant="caption" color="text.secondary">
            administrator@example.com
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: "#ef4444" }}>
          <LogoutIcon sx={{ mr: 1, fontSize: "18px" }} />
          <Typography sx={{ fontSize: "14px" }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}