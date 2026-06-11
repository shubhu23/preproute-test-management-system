import {
    Box,
    Divider,
    List,
    Typography,
    useMediaQuery,
    Drawer,
} from "@mui/material";

import {
    useLocation,
} from "react-router-dom";

import SidebarItem from "./SidebarItem";

import { sidebarMenus } from "./sidebarConfig";
import logo from "../../assets/logo.svg";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width:768px)");

    const sidebarContent = (
        <Box
            sx={{
                width: isMobile ? 280 : 260,
                height: "100vh",
                bgcolor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    px: 3,
                    py: 4,
                }}
            >
                <img 
                    src={logo} 
                    alt="PrepRoute Logo" 
                    style={{ 
                        width: '100%', 
                        maxWidth: isMobile ? '135px' : '135px', 
                        height: 'auto',
                        objectFit: 'contain'
                    }} 
                />
            </Box>

            <Divider />

            <List sx={{ mt: 2, flex: 1 }}>
                {sidebarMenus.map(
                    (menu) => (
                        <SidebarItem
                            key={menu.path}
                            icon={menu.icon}
                            label={menu.label}
                            path={menu.path}
                            active={
                                location.pathname ===
                                menu.path
                            }
                            onNavigate={onClose}
                        />
                    )
                )}
            </List>

            <Box
                sx={{
                    px: 3,
                    py: 2,
                    mt: "auto",
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Version 1.0.0
                </Typography>
            </Box>
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 280,
                    },
                }}
            >
                {sidebarContent}
            </Drawer>
        );
    }

    return (
        <Box
            sx={{
                width: 260,
                minWidth: 260,
                height: "100vh",
                bgcolor: "#FFFFFF",
                borderRight: "1px solid #E5E7EB",
                position: "fixed",
                left: 0,
                top: 0,
            }}
        >
            {sidebarContent}
        </Box>
    );
}