module.exports = {
  apps: [
    {
      name: 'suivi-objectifs',
      script: 'server/index.ts',
      interpreter: './node_modules/.bin/tsx',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
