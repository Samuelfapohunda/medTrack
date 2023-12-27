import {
    getAllReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    getReminder
  } from '../controllers/reminder.controller';
  import express from 'express';
  import authenticate from '../middlewares/authentication';
  import advancedResults from '../middlewares/advancedResults';
  import { Reminder } from '../models/Reminder';
  import { validateObjectId } from '../middlewares/objectIdValidator';
  
//   const router = express.Router();

  const router = express.Router({ mergeParams: true });
  

  
  router.get('/', getAllReminders);
  router.post('/', authenticate, createReminder);

  router.get(
    '/:id',
    validateObjectId,
    authenticate,
    getReminder
  );

  router.patch(
    '/:id/update',
    validateObjectId,
    authenticate,
    updateReminder
  );
  router.delete(
    '/:id/delete',
    validateObjectId,
    authenticate,
    deleteReminder
  );
  
  export default router;