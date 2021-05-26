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
    enum: ['NAM', 'NỮ'],
    required: true
  },
  diaChi: String,
  trangThai: {
    type: String,
    enum: ['', 'MỚI SINH', 'ĐÃ MẤT', 'NHẬP CƯ'],
    default: ''
  },
  chuHo: {
    type: Boolean,
    default: false
  },
  lichSu: {
    type: String,
    default: ''
  }
})

const NhanKhau = mongoose.model('NhanKhau', nhanKhauSchema);

module.exports = NhanKhau;