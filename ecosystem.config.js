module.exports = {
  apps : [{
    name: 'Intersafety',
    script: 'npm',
    args: 'run start',

    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
