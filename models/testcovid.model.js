const mongoose = require('mongoose');

const testCovidSchema = new mongoose.Schema({
  idTest: {
    type: String,
    unique: true,
    required: true
  },
  soCCCD: {
    type: String,
    required: true
  },
  thoiDiemTest: Date,
  hinhThucTest: String,
  ketQua: String
})

const TestCovid = mongoose.model('testCovid', testCovidSchema);

module.exports = TestCovid;