import { Schema, model, Document } from 'mongoose';
import { LinkBase } from '../types';

export interface ILink extends LinkBase, Document {}

const LinkSchema = new Schema<ILink>(
  {
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    participantId: { type: Schema.Types.ObjectId, ref: 'Participant', required: true },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// A worker can only be linked to a participant once
LinkSchema.index({ workerId: 1, participantId: 1 }, { unique: true });

export default model<ILink>('Link', LinkSchema);
