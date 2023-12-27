import {
    getAllMedications,
    addMedication,
     getMedication,
     updateMedication,
     deleteMedication

  } from '../controllers/medication.controller';
  import express from 'express';
  import authenticate from '../middlewares/authentication';
  import reminderRouter from './reminder.route';
  import advancedResults from '../middlewares/advancedResults';
  import { Medication } from '../models/Medication';
  import { validateObjectId } from '../middlewares/objectIdValidator';
  
  const router = express.Router();

  

  
  router.use(
    '/:medicationId/new-reminder',
    // validateObjectId,
    authenticate,
    reminderRouter
  );
  
  
  router
    .route('/')
    .get(advancedResults(Medication, 'reminders'), getAllMedications); 
   
  router.post('/new-medication', authenticate, addMedication);
  
  router.get(
    '/:id',
    validateObjectId,
    authenticate,
    getMedication
  );
  router.patch(
    '/:id/update',
    validateObjectId,
    authenticate,
    updateMedication
  );
  router.delete(
    '/:id/delete',
    validateObjectId,
    authenticate, 
    deleteMedication
  );
  
  export default router;
  