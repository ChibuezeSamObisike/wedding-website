import mongoose, { Schema, Document } from 'mongoose';

export interface ISong extends Document {
  name: string;
  artist: string;
  title: string;
  link?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const SongSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    artist: {
      type: String,
      required: [true, 'Artist is required'],
      trim: true,
      minlength: [2, 'Artist name must be at least 2 characters long'],
      maxlength: [100, 'Artist name cannot exceed 100 characters'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    link: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true; // Allow empty
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Link must be a valid URL starting with http:// or https://',
      },
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform: function (_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Add indexes for better query performance
SongSchema.index({ artist: 1, title: 1 });
SongSchema.index({ status: 1 });
SongSchema.index({ createdAt: -1 });

export default mongoose.model<ISong>('Song', SongSchema);
