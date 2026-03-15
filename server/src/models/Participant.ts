import { Schema, model, Document } from 'mongoose';
import { ParticipantBase } from '../types';

export interface IParticipant extends ParticipantBase, Document {}

const ParticipantSchema = new Schema<IParticipant>(
  {
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    color: { type: String, default: '#0EA5E9' },
    ndisNumber: { type: String, default: '' },
    needs: [{ type: String }],
    location: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default model<IParticipant>('Participant', ParticipantSchema);
