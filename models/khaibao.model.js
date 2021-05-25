const mongoose = require('mongoose');

const khaiBaoSchema = new mongoose.Schema({
  nhanKhauId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'NhanKhau',
    unique: true
  },
  vungDich: [String],
  ngayKhaiBao: Date,
  tiepXuc: [String],
  bieuHien: [String],
  benhNen: [String]
})

const KhaiBao = mongoose.model('khaiBao', khaiBaoSchema);

module.exports = KhaiBao;