const mongoose = require('mongoose');

const khaiBaoSchema = new mongoose.Schema({
  idKhaiBao: {
    type: String,
    unique: true,
    required: true
  },
  soCCCD: {
    type: String,
    required: true
  },
  vungDich: String,
  ngayKhaiBao: Date,
  bieuHien: String
})

const KhaiBao = mongoose.model('khaiBao', khaiBaoSchema);

module.exports = KhaiBao;