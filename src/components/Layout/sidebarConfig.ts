import DashboardIcon from "@mui/icons-material/Dashboard";

import DescriptionIcon from "@mui/icons-material/Description";

import TrackChangesIcon from "@mui/icons-material/TrackChanges";

import SettingsIcon from "@mui/icons-material/Settings";

export const sidebarMenus = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: DashboardIcon,
  },

  {
    label: "Test Creation",
    path: "/tests/create",
    icon: DescriptionIcon,
  },

  {
    label: "Test Tracking",
    path: "/tests",
    icon: TrackChangesIcon,
  },
  {
    label: "Settings",
    path: "#",
    icon: SettingsIcon,
  },
];