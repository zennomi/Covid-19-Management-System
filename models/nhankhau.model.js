const mongoose = require('mongoose');

const nhanKhauSchema = new mongoose.Schema({
  soCCCD: {
    type: String,
    unique: true,
    required: true
  },
  hoVaTen: {
    type: String,
    required: true
  },
  maHoKhau: String,
  namSinh: {
    type: Date,
    required: true
  },
  soDienThoai: String,
  gioiTinh: {
    type: String,
    enum: ['NAM', 'NỮ']
  },
  diaChi: String
})

const NhanKhau = mongoose.model('NhanKhau', nhanKhauSchema);

module.exports = NhanKhau;