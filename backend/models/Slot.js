import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  experienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  time: {
    type: String, // HH:MM format
    required: true
  },
  maxSeats: {
    type: Number,
    required: true,
    default: 20
  },
  availableSeats: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Prevent double booking for same slot
slotSchema.index({ experienceId: 1, date: 1, time: 1 }, { unique: true });

export default mongoose.model('Slot', slotSchema);