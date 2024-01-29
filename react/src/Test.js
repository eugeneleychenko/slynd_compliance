import React, { useState } from "react";
import { Box, Button, Drawer, Typography } from "@mui/material";

const SidebarMainComponent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{ width: sidebarOpen ? "70%" : 0, flexShrink: 0 }}
      >
        <Box sx={{ width: "70%", padding: 2 }}>
          <Button onClick={toggleSidebar}>
            {sidebarOpen ? "Hide" : "Show"} Sidebar
          </Button>
          {/* Sidebar content goes here */}
          <Typography variant="h6">Sidebar Content</Typography>
          <Typography>
            Here is some example text for the sidebar. You can customize this
            content as needed.
          </Typography>
        </Box>
      </Drawer>
      {!sidebarOpen && (
        <Box sx={{ position: "absolute", left: 0, top: 0 }}>
          <Button onClick={toggleSidebar}>Show Sidebar</Button>
        </Box>
      )}
      <Box
        component="main"
        sx={{ flexGrow: 1, width: sidebarOpen ? "50%" : "100%" }}
      >
        {/* Main content goes here */}
        <Typography variant="h4">Main Content Area</Typography>
        <Typography>
          This is the main content section. When the sidebar is open, this area
          takes up 70% of the width.
        </Typography>
      </Box>
    </Box>
  );
};

export default SidebarMainComponent;
