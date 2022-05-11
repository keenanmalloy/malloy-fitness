import { Router } from 'express';
import auth from './auth';
import exercises from './exercises';
import muscleGroups from './muscle-groups';
import sleep from './sleep';
import storage from './storage';
import workouts from './workouts';
import sessions from './sessions';
import overview from './overview';
import account from './account';

const router = Router();

exercises(router);
muscleGroups(router);
workouts(router);
sleep(router);
auth(router);
storage(router);
sessions(router);
overview(router);
account(router);

router.get('/health', (req, res) => res.send('OK'));

// all other routes should throw 404 not found
router.use('*', (req, res) => {
  return res.status(404).send();
});

export default router;
