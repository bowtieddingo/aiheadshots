import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    alias: 'id',
  },
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  image: String,
}, { timestamps: true });

// This will allow us to use 'id' instead of '_id' when working with the model
UserSchema.virtual('id').get(function() {
  return this._id;
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
