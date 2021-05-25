const mongoose = require('mongoose');

const testCovidSchema = new mongoose.Schema({
  nhanKhauId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'NhanKhau'
  },
  thoiDiemTest: Date,
  hinhThucTest: {
    type: String,
    enum: ['PCR', 'TEST NHANH']
  },
  ketQua: {
    type: String,
    enum: ['DƯƠNG TÍNH', 'ÂM TÍNH', 'CHƯA CÓ']
  }
})

testCovidSchema.methods.getISOStrTZ = function () {
  return toIsoString(this.thoiDiemTest);
}

const TestCovid = mongoose.model('testCovid', testCovidSchema);

module.exports = TestCovid;

function toIsoString(date) {
  var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function(num) {
          var norm = Math.floor(Math.abs(num));
          return (norm < 10 ? '0' : '') + norm;
      };

  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds())
}
