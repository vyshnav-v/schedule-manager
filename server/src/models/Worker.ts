import { Schema, model, Document } from 'mongoose';
import { WorkerBase, Availability } from '../types';

export interface IWorker extends WorkerBase, Document {}

const WorkerSchema = new Schema<IWorker>(
  {
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    color: { type: String, default: '#3B82F6' },
    skills: [{ type: String }],
    availability: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Casual'] satisfies Availability[],
      default: 'Full-time',
    },
    rating: { type: Number, min: 0, max: 5, default: 5 },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default model<IWorker>('Worker', WorkerSchema);
