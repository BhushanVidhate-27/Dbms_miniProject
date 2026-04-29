const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  membershipId: {
    type: String,
    unique: true
  },
  membershipType: {
    type: String,
    enum: ['Student', 'Faculty', 'Public'],
    default: 'Student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  address: String
}, { timestamps: true });

// Auto-generate membership ID
memberSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Member').countDocuments();
    this.membershipId = `LIB${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);
