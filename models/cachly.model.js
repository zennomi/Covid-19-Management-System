const mongoose = require('mongoose');

const cachLySchema = new mongoose.Schema({
  nhanKhauId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'NhanKhau',
    unique: true
  },
  noiCachLy: String,
  thoiGian: Date,
  mucDo: {
    type: String,
    enum: ['F0', 'F1', 'F2', 'F3', 'F4', 'F5']
  }
})

const CachLy = mongoose.model('cachLy', cachLySchema);

module.exports = CachLy;