module.exports = {
  apps: [{
    name: 'carshare-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/CarShare',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_API_URL: 'http://3.89.119.110:3001'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
