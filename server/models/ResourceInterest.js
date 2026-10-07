const mongoose = require('mongoose');

const resourceInterestSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

resourceInterestSchema.index({ resource: 1, requester: 1 }, { unique: true });

module.exports = mongoose.model('ResourceInterest', resourceInterestSchema);
