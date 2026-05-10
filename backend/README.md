Start pm2 process
`pm2 flush votum-server;pm2 delete votum-server;pm2 start ./src/server.js -i max --name 'votum-server'`

Start pm2 process in debug mode
`pm2 flush votum-server;pm2 delete votum-server;pm2 start ./src/server.js -i max --name 'votum-server' -- --debug`

Redeploy universal job
```
pm2 flush votum-universal-job;pm2 delete votum-universal-job;pm2 start ./src/jobs/universalJob.js -i 1 --name 'votum-universal-job'
```
