const KhaiBao = require("../models/khaibao.model");
const NhanKhau = require("../models/nhankhau.model");

module.exports = {
  index: async (req, res) => {
    let nhanKhaus;
    try {
      nhanKhaus = await NhanKhau.find({});
    } catch (err) {
      return res.render('error', { err });
    }
    res.render('nhankhau/index', { nhanKhaus });
  },
  create: (req, res) => {
    res.render('nhankhau/create');
  },
  update: async (req, res) => {
    let nhanKhau;
    try {
      nhanKhau = await NhanKhau.findById(req.params.id);
      if (!nhanKhau) throw new Erorr("Not found");
    } catch (err) {
      return res.render('error', { err });
    }
    res.render('nhankhau/update', { nhanKhau });
  },
  read: async (req, res) => {
    let nhanKhau;
    try {
      nhanKhau = await NhanKhau.findById(req.params.id);
      if (!nhanKhau) throw new Erorr("Not found");
    } catch (err) {
      return res.render('error', { err });
    }
    res.render('nhankhau/read', { nhanKhau });
  },
  delete: async (req, res) => {
    let nhanKhau;
    try {
      nhanKhau = await NhanKhau.findById(req.params.id);
      if (!nhanKhau) throw new Erorr("Not found");
    } catch (err) {
      return res.render('error', { err });
    }
    res.render('nhankhau/delete', { nhanKhau });
  },
  postCreate: async (req, res) => {
    NhanKhau.create(req.body, (err, nhanKhau) => {
      if (err) return res.render('error', { err });
      res.redirect('/nhan-khau');
    })
  },
  postUpdate: async (req, res) => {
    NhanKhau.findByIdAndUpdate(req.params.id, req.body, (err, nhanKhau) => {
      if (err) return res.render('error', { err });
      res.redirect('/nhan-khau/' + nhanKhau._id + '/cap-nhat');
    })
  },
  postDelete: async (req, res) => {
    try {
      await NhanKhau.findByIdAndDelete(req.params.id);
      await KhaiBao.deleteMany({nhanKhauId: req.params.id});
    } catch (err) {
      return res.render('error', { err });
    }
    res.redirect('/nhan-khau/');
  }
}