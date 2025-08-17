Start pm2 process
`pm2 start ./src/server.js -i max --name 'votum-server'`

Start pm2 process in debug mode
`pm2 start ./src/server.js -i max --name 'votum-server' -- --debug`