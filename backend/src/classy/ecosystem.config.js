module.exports = {
  apps: [{
    name: 'text-classifier-api',
    script: '/home/admin/workspace/votum/backend/src/classy/train_classifier.py', // the script to run
    args: '--api',                                                                // args for your script
    interpreter: '/home/admin/workspace/votum/backend/src/classy/venv/bin/python3', // your venv python
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      PYTHONUNBUFFERED: '1'
    }
  }]
};

