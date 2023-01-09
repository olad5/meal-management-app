const isPortReachable = require('is-port-reachable');
const path = require('path');
const dockerCompose = require('docker-compose');
const { execSync } = require('child_process');

module.exports = async () => {
  console.time('global-setup');

  const isDBReachable = await isPortReachable(54318);
  if (!isDBReachable) {
    await dockerCompose.upAll({
      cwd: path.join(__dirname),
      log: true,
    });

    await dockerCompose.exec(
      'database',
      ['sh', '-c', 'until pg_isready ; do sleep 1; done'],
      {
        cwd: path.join(__dirname),
      },
    );

    execSync('npm run migrate:test-mode');
  }

  // 👍🏼 We're ready
  console.timeEnd('global-setup');
};
