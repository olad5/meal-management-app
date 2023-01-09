import isCI from 'is-ci';
import dockerCompose from 'docker-compose';

module.exports = async () => {
  if (isCI) {
    dockerCompose.down();
  } else {
    if (Math.ceil(Math.random() * 10) === 10) {
      console.log('truncate the database table');
    }
  }
};
