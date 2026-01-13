"use client";

import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/app/context/AuthContext";
import { AppBar, Toolbar, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const Navigation = ({ children }) => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <div>
      <AppBar position="static" color="gradient" sx={{ mb: 3 }}>
        <Toolbar>
          <Button color="inherit" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => router.push("/countries")}>
            Countries
          </Button>
          {/* <Button color="inherit" onClick={() => router.push("/example")}>
            Example
          </Button> */}
          <Button color="inherit" onClick={() => router.push("/protected")}>
            Protected
          </Button>
          {user && (
            <Button color="inherit" onClick={() => signOut()}>
              Logout
            </Button>
          )}
          {user && (
            <Button color="inherit" onClick={() => router.push("/profile")}>
              Profile
            </Button>
          )}
          {!user && (
            <Button color="inherit" onClick={() => router.push("/login")}>
              Login
            </Button>
          )}
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
};

export default Navigation;
