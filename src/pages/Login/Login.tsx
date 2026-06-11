import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Link,
} from "@mui/material";

import { loginUser } from "../../api/authApi";
import robotSvg from "../../assets/robot.svg";
import logo from "../../assets/logo.svg";

export default function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginUser({
        userId,
        password,
      });

      if (response.status === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <Box
    sx={{
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    height: "100%",
    width: "100%",
    overflow: "hidden",
    bgcolor: "#FFFFFF",
  }}
  >
    {/* Left Side Illustration */}
    <Box
      sx={{
        flex: 1,
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F1F5F9",
        overflow: "hidden",
      }}
    >
      <img
        src={robotSvg}
        alt="PrepRoute Robot"
        style={{
          width: "60%",
          maxWidth: "450px",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </Box>

    {/* Right Side Login Form */}
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "510px",
          px: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Mobile Illustration */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            justifyContent: "center",
            mb: 2,
          }}
        >
          <img
            src={robotSvg}
            alt="PrepRoute Robot"
            style={{
              width: "70%",
              maxWidth: "250px",
              height: "auto",
            }}
          />
        </Box>

        {/* Logo */}
        <Box
          sx={{
            width: 135,
            height: 150,
          }}
        >
          <img
            src={logo}
            alt="PrepRoute"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Header */}
        <Box>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#1F2937",
              mb: 1,
            }}
          >
            Login
          </Typography>

          <Typography
            sx={{
              fontSize: "14px",
              color: "#6B7280",
            }}
          >
            Use your company provided Login credentials
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            fullWidth
            label="User ID"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          <Box>
            <TextField
              fullWidth
              type="password"
              label="Password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <Link
              href="#"
              sx={{
                mt: 1.5,
                display: "inline-block",
                fontSize: "14px",
                color: "#2563EB",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              height: "48px",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              backgroundColor: "#5988EF",
              "&:hover": {
                backgroundColor: "#4973D9",
              },
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Box>
    </Box>
  </Box>
);
}