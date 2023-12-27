import {model, Document, Schema } from 'mongoose';
import { UserDocument } from './User';

export interface MedicationDocument extends Document {
  medicationName: string;
  description: string;
  dosage: string;
  interval: number;
  startDate: string;
  createdAt: Date;
  createdBy: UserDocument['_id'];
}

const MedicationSchema = new Schema<MedicationDocument>({
  medicationName: { type: String, required: true },
  description: {type: String, required: true},
  dosage: { type: String, required: true },
  interval: {type: Number, required: true},
  startDate: { type: String, required: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);

MedicationSchema.virtual('reminders', {
  ref: 'Reminder',
  localField: '_id',
  foreignField: 'medication',
  justOne: false,
});

export const Medication = model<MedicationDocument>('Medication', MedicationSchema);