import React, { Component } from 'react';
import Menu from './MenuComponent';
import Inform from './InformComponent';
import Home from './HomeComponent';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './SignupComponent';
import Active from './ActiveComponent';
import Login from './LoginComponent';
import Myprofile from './MyprofileComponent';
import Mycart from './MycartComponent';
import Myorders from './MyordersComponent';
class Main extends Component {
  render() {
    return (
      <div className="body-customer">
        <Menu />
        <Inform />

        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/home" element={<Home />} />

          {/* hiển thị product theo category */}
          <Route
            path="/product/category/:cid"
            element={<Product />}
          />

          {/* hiển thị kết quả tìm kiếm */}
          <Route
            path="/product/search/:keyword"
            element={<Product />}
          />

          {/* ⭐ hiển thị chi tiết product */}
          <Route
            path="/product/:id"
            element={<ProductDetail />}
          />

          {/* ⭐ hiển thị trang đăng ký */}
          <Route
            path="/signup"
            element={<Signup />}
          />
          <Route path='/active' element={<Active />} />
          <Route path='/login' element={<Login />} />
          <Route path='/myprofile' element={<Myprofile />} />
          <Route path='/mycart' element={<Mycart />} />
          <Route path='/myorders' element={<Myorders />} />
        </Routes>
      </div>
    );
  }
}

export default Main;