const { createApp } = require("./app");

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Scanner API running on port ${PORT}`);
});

