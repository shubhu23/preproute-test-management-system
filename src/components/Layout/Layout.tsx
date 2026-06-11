import {
  Box,
  useMediaQuery,
} from "@mui/material";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  children: React.ReactNode;
}

export default function Layout({
  children,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        overflowX: "hidden",
        flexDirection: "column",
      }}
    >
      {isMobile && (
        <Header onMenuClick={() => setSidebarOpen(true)} />
      )}

      <Box
        sx={{
          display: "flex",
          flex: 1,
        }}
      >
        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <Box
          sx={{
            ml: isMobile ? 0 : "260px",
            flex: 1,
            minHeight: "100vh",
            bgcolor: "#F9FAFB",
            overflowX: "hidden",
          }}
        >
          {!isMobile && <Header onMenuClick={() => {}} />}
          {children}
        </Box>
      </Box>
    </Box>
  );
}