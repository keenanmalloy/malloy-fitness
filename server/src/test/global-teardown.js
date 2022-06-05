const isCI = require('is-ci');
const dockerCompose = require('docker-compose');
const { deleteAllTestExercises } = require('./helpers/exercise');
const { deleteAllTestWorkouts } = require('./helpers/workout');
const { deleteAllAccounts } = require('./helpers/account');
const { deleteAllTestSets } = require('./helpers/sets');

module.exports = async () => {
  if (isCI) {
    // ️️️✅ Best Practice: Leave the DB up in dev environment
    dockerCompose.down();
  } else {
    // ✅ Best Practice: Clean the database occasionally
    if (Math.ceil(Math.random() * 10) === 10) {
      await deleteAllTestSets();
      await deleteAllTestExercises();
      await deleteAllTestWorkouts();
      await deleteAllAccounts();
    }
  }
};
