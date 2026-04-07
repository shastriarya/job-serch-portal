import app from "./app.js";
import connectDB from "./config/db.js";
import { config } from "./config/env.js";
import logger from "./config/logger.js";

const PORT = config.PORT;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(
        `✅ Server running on port ${PORT} in ${config.NODE_ENV} mode`,
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
