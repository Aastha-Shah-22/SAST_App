const express = require("express");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const PORT = 8080;

/*
This must be the SAME client id
used in your React app
*/
const CLIENT_ID = "123470367309-b43gj1nrpqntdaaqbb6gh3nvojvia1vr.apps.googleusercontent.com";

/*
Google OAuth client
used for verifying tokens
*/
const client = new OAuth2Client(CLIENT_ID);

app.use(cors());
app.use(express.json());

/*
Google Authentication Route
*/
app.post("/auth/google", async (req, res) => {

  const { token } = req.body;

  try {

    const user = await verifyGoogleToken(token);

    console.log("User logged in:", user);

    /*
    Here you would normally:

    1. Check if user exists in DB
    2. Create user if not exists
    3. Generate session/JWT
    */

    res.json({
      success: true,
      user: user
    });

  } catch (error) {

    console.error("Token verification failed:", error);

    res.status(401).json({
      success: false,
      message: "Invalid Google token"
    });

  }

});

/*
Function that verifies
Google ID Token
*/
async function verifyGoogleToken(token) {

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  });

  const payload = ticket.getPayload();

  /*
  Google user data
  */
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture
  };

}

/*
Start server
*/
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});