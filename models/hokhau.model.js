const mongoose = require('mongoose');

const hoKhauSchema = new mongoose.Schema({
    maHoKhau: {
        type: String,
        unique: true,
        required: true
    },
    diaChi: {
        type: String,
        required: true
    },
    chuHoKhauId: {
        type: mongoose.Types.ObjectId,
        ref: 'NhanKhau',
        unique: true
    }
})

hoKhauSchema.virtual('nhanKhau', {
    ref: 'NhanKhau',
    localField: '_id',
    foreignField: 'hoKhauId',
    justOne: false
})

module.exports = mongoose.model('HoKhau', hoKhauSchema);