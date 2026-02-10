const { createApp } = require("./app");
const connectDB = require('./db/mongodbService.js');

const PORT = process.env.PORT || 3000;

const startServer = async () => { 
  try {
    await connectDB();
    console.log('MongoDB connection established');

    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log(`Scanner API running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Shutting down...`);

      server.close(async () => {
        console.log('🧹 HTTP server closed');

        const mongoose = require('mongoose');
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');

        process.exit(0);
      });
      
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();


