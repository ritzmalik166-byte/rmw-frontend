/** PM2 config for Next.js server mode. Keep old `new-rmw` on :3000 for /api only. */
module.exports = {
  apps: [
    {
      name: "rmw-frontend",
      cwd: "/var/www/rmw-frontend",
      script: "npm",
      args: "run start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3001",
      },
      max_memory_restart: "400M",
    },
  ],
};
