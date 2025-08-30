import { createServer } from "./index";

const app = createServer();
const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(`🚀 Subsidy Backend API running on port ${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`🏥 Health check: http://localhost:${port}/api/ping`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
