import connectDB from './db/mongodbService.js';
import mongoose from 'mongoose';
import createApp from './app.js';

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
      console.log(`\nReceived ${signal}. Shutting down...`);

      server.close(async () => {
        console.log(' HTTP server closed');

        await mongoose.connection.close();
        console.log(' MongoDB connection closed');

        process.exit(0);
      });
      
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (err) {
    console.error(' Failed to start server:', err);
    process.exit(1);
  }
}

startServer();


