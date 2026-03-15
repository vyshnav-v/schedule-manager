import { Schema, model, Document } from 'mongoose';
import { ShiftBase, ServiceType, ShiftStatus } from '../types';

export interface IShift extends ShiftBase, Document {}

const SERVICE_TYPES: ServiceType[] = [
  'Personal Care',
  'Community Access',
  'Domestic',
  'Transport',
  'Behaviour Support',
  'Medication',
  'Other',
];

const SHIFT_STATUSES: ShiftStatus[] = ['pending', 'confirmed', 'cancelled'];

const ShiftSchema = new Schema<IShift>(
  {
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    participantId: { type: Schema.Types.ObjectId, ref: 'Participant', required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    serviceType: { type: String, enum: SERVICE_TYPES, default: 'Other' },
    status: { type: String, enum: SHIFT_STATUSES, default: 'pending' },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export default model<IShift>('Shift', ShiftSchema);
