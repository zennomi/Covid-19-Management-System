const mongoose = require('mongoose');

const cachLySchema = new mongoose.Schema({
  idCachLy: {
    type: String,
    unique: true,
    required: true
  },
  soCCCD: {
    type: String,
    required: true
  },
  noiCachLy: String,
  thoiGian: Date,
  mucDo: String
})

const CachLy = mongoose.model('cachLy', cachLySchema);

module.exports = CachLy;