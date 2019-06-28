const nodemon = require('nodemon');

const watch = (scriptPath) => {
  const script = nodemon({
    script: scriptPath,
    ignore: ['src', 'scripts', 'examples', 'config', 'build/client'],
    delay: 200,
  });

  script.on('restart', () => {
    console.log('watching...');
  });

  script.on('quit', () => {
    console.log('quit...');
    process.exit();
  });

  script.on('error', () => {
    console.log('An error occured. Exiting', 'error');
    process.exit(1);
  });
};

module.exports = {
  watch,
};
