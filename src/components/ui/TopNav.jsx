import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

function TopNav({ role = "client", onLogout }) {

  const location = useLocation();
  const isClient = role === "client";
  const isMobile = useMediaQuery("(max-width:900px)");

  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentPath =
    location.pathname.split("/")[1] || (isClient ? "overview" : "queue");

  const clientTabs = [
    { id: "overview", label: "Overview", path: "/overview" },
    { id: "submit", label: "Submit Target", path: "/submit" },
    { id: "findings", label: "Findings", path: "/findings" },
    { id: "reports", label: "Reports", path: "/reports" }
  ];

  const testerTabs = [
    { id: "queue", label: "Scan Queue", path: "/queue" },
    { id: "active", label: "Active Scans", path: "/active" },
    { id: "review", label: "Verify Fixes", path: "/review" },
    { id: "findings", label: "Findings", path: "/findings" }
  ];

  const tabs = isClient ? clientTabs : testerTabs;

  const tabIndex = tabs.findIndex((t) => t.id === currentPath);

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ background: "#070b12", borderBottom: "1px solid #1f2937" }}
      >
        <Toolbar>

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Typography
            component={Link}
            to={isClient ? "/overview" : "/queue"}
            sx={{
              textDecoration: "none",
              color: "white",
              fontWeight: 800,
              fontSize: "22px",
              mr: 3
            }}
          >
            Vumas
          </Typography>

          {/* Desktop Tabs */}
          {!isMobile && (
            <Tabs
              value={tabIndex}
              textColor="inherit"
              indicatorColor="secondary"
              sx={{ flexGrow: 1 }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  label={tab.label}
                  component={Link}
                  to={tab.path}
                />
              ))}
            </Tabs>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Notification */}
          <IconButton color="inherit">
            <Badge badgeContent={1} color="warning">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Avatar */}
          <Avatar
            sx={{
              bgcolor: isClient ? "#00e5ff" : "#a78bfa",
              ml: 2
            }}
          >
            {isClient ? "AC" : "TR"}
          </Avatar>

          {/* Logout */}
          {!isMobile && (
            <Button
              onClick={onLogout}
              sx={{ ml: 2, color: "#8b949e" }}
            >
              Logout
            </Button>
          )}

        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, background: "#070b12", height: "100%", color: "white" }}>
          <Typography sx={{ p: 2, fontWeight: 700 }}>
            Navigation
          </Typography>

          <List>
            {tabs.map((tab) => (
              <ListItem
                button
                key={tab.id}
                component={Link}
                to={tab.path}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={tab.label} />
              </ListItem>
            ))}

            <ListItem button onClick={onLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default TopNav;