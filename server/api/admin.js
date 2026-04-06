const express = require('express');
const router = express.Router();

// Tiện ích xử lý JWT
const JwtUtil = require('../utils/JwtUtil');


// Các mô hình dữ liệu
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO'); // DAO sản phẩm
const OrderDAO = require('../models/OrderDAO');
const EmailUtil = require('../utils/EmailUtil');
const CustomerDAO = require('../models/CustomerDAO');
// =======================
// ĐĂNG NHẬP
// =======================
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
    if (admin) {
      const token = JwtUtil.genToken(username, password);
      res.json({
        success: true,
        message: 'Xác thực thành công',
        token: token
      });
    } else {
      res.json({
        success: false,
        message: 'Sai tên đăng nhập hoặc mật khẩu'
      });
    }
  } else {
    res.json({
      success: false,
      message: 'Vui lòng nhập tên đăng nhập và mật khẩu'
    });
  }
});

// =======================
// KIỂM TRA TOKEN
// =======================
router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({
    success: true,
    message: 'Token hợp lệ',
    token: token
  });
});

// =======================
// CATEGORY
// =======================
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  if (!name) {
    return res.json({ success: false, message: 'Tên danh mục là bắt buộc' });
  }
  const category = { name: name };
  const result = await CategoryDAO.insert(category);
  res.json({
    success: true,
    message: 'Tạo danh mục thành công',
    data: result
  });
});

router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  if (!name) {
    return res.json({ success: false, message: 'Tên danh mục là bắt buộc' });
  }
  const category = { _id: _id, name: name };
  const result = await CategoryDAO.update(category);
  res.json({
    success: true,
    message: 'Cập nhật danh mục thành công',
    data: result
  });
});

router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json({
    success: true,
    message: 'Xóa danh mục thành công',
    data: result
  });
});

// =======================
// PRODUCT – PHÂN TRANG
// =======================
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  const noProducts = await ProductDAO.selectByCount();
  const sizePage = 4;
  const noPages = Math.ceil(noProducts / sizePage);
  let curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page);
  const skip = (curPage - 1) * sizePage;
  const products = await ProductDAO.selectBySkipLimit(skip, sizePage);

  res.json({
    products: products,
    noPages: noPages,
    curPage: curPage
  });
});

// =======================
// PRODUCT – THÊM MỚI
// =======================
router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;

  if (!name || !price || !cid) {
    return res.json({
      success: false,
      message: 'Thiếu thông tin sản phẩm'
    });
  }

  const now = new Date().getTime();
  const category = await CategoryDAO.selectByID(cid);

  const product = {
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };

  const result = await ProductDAO.insert(product);
  res.json({
    success: true,
    message: 'Thêm sản phẩm thành công',
    data: result
  });
});

// =======================
// PRODUCT – CẬP NHẬT ✅ (UPDATED)
// =======================
router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id; // ✔ lấy từ URL
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime();

  const category = await CategoryDAO.selectByID(cid);

  const product = {
    _id: _id,
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };

  const result = await ProductDAO.update(product);
  res.json({
    success: true,
    message: 'Cập nhật sản phẩm thành công',
    data: result
  });
});

// =======================
// PRODUCT – XÓA
// =======================
router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json({
    success: true,
    message: 'Xóa sản phẩm thành công',
    data: result
  });
});

// order
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});

// customer
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
    const customers = await CustomerDAO.selectAll();
    res.json(customers);
});
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);

  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);
    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});

// order
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
});

router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const token = req.body.token;
    const result = await CustomerDAO.active(_id, token, 0);
    res.json(result);
});

module.exports = router;
