import {model, Document, Schema } from 'mongoose';
import { UserDocument } from './User';
import { MedicationDocument } from './Medication';

export interface ReminderDocument extends Document {
  dueAt: Date;
  instruction?: string;
  medication: MedicationDocument['_id'];
  createdAt: Date;
  createdBy: UserDocument['_id'];
}

const ReminderSchema = new Schema<ReminderDocument>({
  dueAt: {
    type: Date,
    required: true,
  },
instruction: {
    type: String
},
medication: {
    type: Schema.Types.ObjectId,
    ref: 'Medication',
    required: true,
},
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Prevent user from creating more than one reminder per medication
// ReminderSchema.index({ medication: 1, createdBy: 1 }, { unique: true }); 

export const Reminder = model<ReminderDocument>('Reminder', ReminderSchema);