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
    hoKhauId: {
        type: mongoose.Types.ObjectId,
        ref: 'HoKhau',
        required: true
    },
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
    trangThai: {
        type: String,
        enum: ['', 'MỚI SINH', 'ĐÃ MẤT', 'NHẬP CƯ'],
        default: ''
    },
    lichSu: {
        type: String,
        default: ''
    }
})

nhanKhauSchema.virtual('hoKhau', {
    ref: 'HoKhau',
    localField: 'maHoKhau',
    foreignField: 'maHoKhau',
    justOne: true
})

const NhanKhau = mongoose.model('NhanKhau', nhanKhauSchema);

module.exports = NhanKhau;