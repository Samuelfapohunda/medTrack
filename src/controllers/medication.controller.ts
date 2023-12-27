import { NextFunction, Request, Response } from 'express';
import { Medication } from '../models/Medication';
// import { User } from '../models/User';
import asyncHandler from '../middlewares/async';
import ErrorResponse from '../utils/errorResponse';
import { statusCode } from '../statusCodes';


export const getAllMedications = asyncHandler (
  async (req: Request, res: any, next: NextFunction) => {
    res
      .status(statusCode.success)
      .json(res.advancedResults);
  });

  export const getMedication = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const medicationId = req.params.id;

    const medication = await Medication.findById(medicationId).populate({
      path: 'reminders',
      select: 'dueAt createdBy',
    });;

    if (!medication) {
      return next(
        new ErrorResponse(
          'Project not found',
          statusCode.notFound
        )
      );
    }
    res
      .status(statusCode.success)
      .json({ success: true, medication });
  }
);


export const addMedication = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const createdBy = req.user?._id;

    const {
      medicationName,
      description,
      dosage,
      interval,
      startDate
    } = req.body;
    const newMedication = new Medication({
      medicationName,
      description,
      dosage,
      interval,
      startDate,
      createdBy
    });

    const existingMedication = await Medication.findOne({
      medicationName,
    });
    if (existingMedication) {
      return next(
        new ErrorResponse(
          'Medication with this name already exists',
          statusCode.badRequest
        )
      );
    }

    const savedMedication = await newMedication.save();
    res.status(statusCode.created).json({
      success: true,
      medication: savedMedication,
      message: 'Medication added successfully',
    });
}
);


export const updateMedication = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const medicationId = req.params.id;

  

    const existingMedication= await Medication.findById(
      medicationId
    );

    if (!existingMedication) {
      return next(
        new ErrorResponse(
          'Medication not found',
          statusCode.notFound
        )
      );
    }

    if (
      !(
        req.user?._id ===
        existingMedication.createdBy.toString()
      )
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to perform this action',
          statusCode.forbidden
        )
      );
    }

    
      const updatedMedication =
        await Medication.findByIdAndUpdate(
          medicationId,
          { $set: req.body },
          { new: true }
        );
      if (!updatedMedication) {
        return next(
          new ErrorResponse(
            'Medication not found',
            statusCode.notFound
          )
        );
      }

      return res.status(statusCode.success).json({
        success: true,
        project: updatedMedication,
        message: 'Medication updated successfully',
      });

  }
);

export const deleteMedication = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return next(
        new ErrorResponse(
          'Medication not found',
          statusCode.notFound
        )
      );
    }

    if (!(req.user?._id === medication.createdBy.toString())) {
      return next(
        new ErrorResponse(
          'You are not authorized to perform this action',
          statusCode.forbidden
        )
      );
    }

    

    await medication.deleteOne();

    res.status(statusCode.success).json({
      success: true,
      message: 'Medication deleted successfully',
    });
  }
);
