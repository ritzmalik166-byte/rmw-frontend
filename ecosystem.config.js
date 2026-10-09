/** PM2 config for rmw-frontend on port 3002 */
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
        PORT: "3002",
      },
      max_memory_restart: "400M",
    },
  ],
};