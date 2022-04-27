import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { createSessionMutation } from 'queries/sessions/createSessionMutation';
import { deleteSessionMutation } from 'queries/sessions/deleteSessionMutation';
import { retrievePreviewSessionsQuery } from 'queries/sessions/retrievePreviewSessionsQuery';
import { retrieveSessionQuery } from 'queries/sessions/retrieveSessionQuery';
import { retrieveSessionsQuery } from 'queries/sessions/retrieveSessionsQuery';
import { updateSessionMutation } from 'queries/sessions/updateSessionMutation';
import startSessionRouter from './start';
import endSessionRouter from './end';
import exercisesRouter from './exercises';
import setsRouter from './sets';

const router = Router();

// Retrieve all Sessions (LIMIT 20) -------- /
// Retrieve todays Session(s) -------------- /?date=today
// Retrieve yesterdays Session(s) ---------- /?date=yesterday
// Retrieve tomorrows Session(s) ----------- /?date=tomorrow
// Retrieve future Session(s) -------------- /?date=future
// Retrieve Session(s) at a specific date -- /?date=YYYY-MM-DD
// Retrieve Session(s) by type ------------- /?type=strength
// Retrieve Session(s) by activtiy --------- /?activity=in-progress (in-progress, completed, scheduled, default)
// Retrieve Session(s) by completed true --- /?complete=1
// Retrieve Session(s) by completed false -- /?complete=0
// Retrieve Session(s) sorted by ----------- /?sortBy=created-asc (created-asc, created-desc, updated-asc, updated-descm scheduled-asc, scheduled-desc)
router.get('/', authenticate, async (req, res) => {
  await retrieveSessionsQuery(req, res);
});

// Retrieve Preview Sessions
router.get('/preview', authenticate, async (req, res) => {
  await retrievePreviewSessionsQuery(req, res);
});

// Retrieve Session
router.get('/:sessionId', authenticate, authorize, async (req, res) => {
  await retrieveSessionQuery(res, req.params.sessionId);
});

// Create new Session
router.post('/', authenticate, authorize, async (req, res) => {
  await createSessionMutation(res, req.body);
});

// Delete Session
router.delete('/:sessionId', authenticate, authorize, async (req, res) => {
  await deleteSessionMutation(res, req.params.sessionId);
});

// Update Session
router.patch('/:sessionId', authenticate, authorize, async (req, res) => {
  await updateSessionMutation(res, req.body, req.params.sessionId);
});

startSessionRouter(router);
endSessionRouter(router);
exercisesRouter(router);
setsRouter(router);

export default (parentRouter: Router) => {
  parentRouter.use('/sessions', router);
};