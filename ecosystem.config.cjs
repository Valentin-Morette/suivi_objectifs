module.exports = {
  apps: [
    {
      name: 'suivi-objectifs',
      script: 'npm',
      args: 'run start',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
