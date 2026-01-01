const { execSync } = require('child_process');

const name = process.argv[2];
if (!name) {
  console.error('도메인 이름 필요');
  process.exit(1);
}

execSync(`nest g module ${name}`, { stdio: 'inherit' });
execSync(`nest g service ${name}`, { stdio: 'inherit' });
execSync(`nest g controller ${name}`, { stdio: 'inherit' });
