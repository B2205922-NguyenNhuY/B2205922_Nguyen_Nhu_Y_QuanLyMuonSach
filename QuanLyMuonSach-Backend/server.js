const app = require('./app');
const { connectDB, config } = require('./app/config');

const startServer = async () => {
  try {
    // Kết nối MongoDB
    await connectDB(process.env.MONGO_URI || config.db.uri);

    // Khởi động Express server
    app.listen(config.app.port, () => {
      console.log(`Server is running on port ${config.app.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
