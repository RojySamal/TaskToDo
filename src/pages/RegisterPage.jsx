import React, { useState } from "react";
import AppAppBar from "../components/AppAppBar";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        TaskiDo
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function RegisterPage() {
  const [mode, setMode] = React.useState("light");
  const defaultTheme = createTheme({ palette: { mode } });
  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const { register } = useAuth();
  const navigate = useNavigate();

  // State for form fields and validation errors
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const complexityRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!userName) {
      newErrors.userName = "User Name is required.";
    }
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!complexityRegex.test(password)) {
      newErrors.password =
        "Password must contain uppercase letters, lowercase letters, numbers, and special characters.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      try {
        await register(userName, email, password);
        navigate("/login");
      } catch (error) {
        // Handle registration error here
        console.error("Registration failed:", error);
      }
    }
  };

  // Handler for navigating to homepage
  const handleGoToHomepage = () => {
    navigate("/");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />

      <Grid
        container
        component="main"
        sx={{ height: "100vh", marginTop: "30px" }}
      >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={false}
          md={6}
          sx={{
            backgroundImage:
              'url("https://cdn.dribbble.com/userupload/4143366/file/original-8d466289be8d56d97cf1302dd8f87968.jpg?resize=1200x900")',

            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh", // Fixed height for the image
            overflow: "hidden", // Hide overflow content
          }}
        />
        <Grid item xs={12} sm={12} md={6}>
          <Box
            sx={{
              my: 8,
              mx: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflowY: "auto", // Allow vertical scrolling if needed
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                name="userName"
                required
                fullWidth
                id="userName"
                label="User Name"
                autoComplete="User Name"
                autoFocus
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                error={!!errors.userName}
                helperText={errors.userName}
              />
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "secondary.main" }}
              >
                Sign Up
              </Button>
              <Grid container spacing={2}>
                <Grid item>
                  <Link href="/login" variant="body2">
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
