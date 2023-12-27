import { NextFunction, Request, Response } from 'express';
import { Reminder } from '../models/Reminder';
import { Medication } from '../models/Medication';
// import { User } from '../models/User';
import asyncHandler from '../middlewares/async';
import ErrorResponse from '../utils/errorResponse';
import { statusCode } from '../statusCodes';


export const getAllReminders = asyncHandler (
    async(req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reminders = await Reminder.find();
      res.status(200).json({ success: true, data: reminders });
    } catch (error) {
      console.error('Error fetching reminders:', error);
      res.status(statusCode.badRequest).json({ success: false, error: 'Internal Server Error' });
    }
  });


  export const getReminder = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const reminderId = req.params.id;
  
      const reminder = await Reminder.findById(reminderId)
  
      if (!reminder) {
        return next(
          new ErrorResponse(
            'Reminder not found',
            statusCode.notFound
          )
        );
      }
      res
        .status(statusCode.success)
        .json({ success: true, reminder });
    }
  );
  


  export const createReminder = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
    
        const medicationId = req.params.medicationId;
  
        const medication = await Medication.findById(medicationId);
        // const name = await Medication.find(medicationName)
  
        if (!medication) {
          return next(
            new ErrorResponse(
              'Medication not found',
              statusCode.notFound
            )
          );
        }
  
        const createdBy = req.user?._id;
        // const medicationName = medication.medicationName
  
        const {
          dueAt
        } = req.body;
        const newReminder = new Reminder({
          dueAt,
          medication,
          createdBy,
        });


          const savedReminder = await newReminder.save();
  
          res.status(statusCode.created).json({
            success: true, 
            data: savedReminder,
            message: 'Reminder created successfully',
          });

      } catch (error) {
        console.error('Error creating reminder:', error);
        return next(
          new ErrorResponse(
            'Failed to create reminder',
            statusCode.unprocessable
          )
        );
      }
    }
  );


  export const updateReminder = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const reminderId = req.params.id;
  
    
  
      const existingReminder= await Reminder.findById(
        reminderId
      );
  
      if (!existingReminder) {
        return next(
          new ErrorResponse(
            'Reminder not found',
            statusCode.notFound
          )
        );
      }
  
      if (
        !(
          req.user?._id ===
          existingReminder.createdBy.toString()
        )
      ) {
        return next(
          new ErrorResponse(
            'You are not authorized to perform this action',
            statusCode.forbidden
          )
        );
      }
  
      
        const updatedReminder =
          await Reminder.findByIdAndUpdate(
            reminderId,
            { $set: req.body },
            { new: true }
          );
        if (!updatedReminder) {
          return next(
            new ErrorResponse(
              'Reminder not found',
              statusCode.notFound
            )
          );
        }
  
        return res.status(statusCode.success).json({
          success: true,
          project: updatedReminder,
          message: 'Reminder details updated successfully',
        });
  
    }
  );

  
export const deleteReminder = asyncHandler(
  async ( 
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return next(
        new ErrorResponse(
          'Reminder not found',
          statusCode.notFound
        )
      );
    }

    if (!(req.user?._id === reminder.createdBy.toString())) {
      return next(
        new ErrorResponse(
          'You are not authorized to perform this action',
          statusCode.forbidden
        )
      );
    }

    

    await reminder.deleteOne();

    res.status(statusCode.success).json({
      success: true,
      message: 'Reminder deleted successfully',
    });
  }
);

  