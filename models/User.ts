import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  image: String,
  stripeSubscriptionId: String,
  stripePlanId: String,
  isSubscriptionActive: {
    type: Boolean,
    default: false,
  },
  tokens: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Virtual for `id`
UserSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
