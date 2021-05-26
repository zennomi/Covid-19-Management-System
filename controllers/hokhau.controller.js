const NhanKhau = require('../models/nhankhau.model');

module.exports = {
    index: async (req, res) => {
        NhanKhau.aggregate([
            {
                $group: {
                    _id: "$maHoKhau",
                    count: { $sum: 1 },
                    hoVaTen: {
                        $push: {
                            $cond: {
                                if: { $eq: ["$chuHo", true] },
                                then: "$hoVaTen",
                                else: null
                            }
                        }
                    }
                }
            },
            {
                $unwind: "$hoVaTen"
            },
            {
                $match: {
                    hoVaTen: {
                        $ne: null
                    }
                }
            }
        ], (err, hoKhaus) => {
            if (err) return res.render('error', { err });
            res.render('hokhau/index', { hoKhaus });
        })
    }
}