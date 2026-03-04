// Google login → get token → send token to backend → backend verifies → login user
// React App
//    ↓
// POST /auth/google
//    ↓
// Node.js server receives Google token
//    ↓
// Server verifies token with Google
//    ↓
// Extracts user email/name
//    ↓
// Returns login success
 import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

function Login() {

  const handleSuccess = async (credentialResponse) => {

    const token = credentialResponse.credential;

    // Optional: decode token to see user info
    const decoded = jwtDecode(token);
    console.log("User Info:", decoded);

    try {

      const response = await fetch("http://localhost:8080/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token
        })
      });

      const data = await response.json();

      console.log("Backend response:", data);

    } catch (error) {
      console.error("Backend login failed:", error);
    }

  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div>
      <h2>Login</h2>

      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />

    </div>
  );
}

export default Login;