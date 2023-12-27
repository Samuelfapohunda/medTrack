import {
    forgotPassword,
    resetPassword,
  } from './../controllers/auth.controller';
  import express from 'express';
  import {
    registerPatient,
    loginUser,
    logoutUser,
  } from '../controllers/auth.controller';
  import authenticate from '../middlewares/authentication';
  
  const router = express.Router();
  
  router.post('/register/patient', registerPatient);
  router.post('/login', loginUser);
  router.post('/forgot-password', forgotPassword);
  router.put('/reset-password/:resettoken', resetPassword);
  router.post('/logout', authenticate, logoutUser);
  
  export default router;  
  