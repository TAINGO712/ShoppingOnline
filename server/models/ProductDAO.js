require('../utils/MongooseUtil');
const Models = require('./Models');

const ProductDAO = {
  async selectByCount() {
    const query = {};
    const noProducts = await Models.Product.countDocuments(query).exec();
    return noProducts;
  },

  async selectBySkipLimit(skip, limit) {
    const products = await Models.Product.find({})
      .skip(skip)
      .limit(limit)
      .exec();
    return products;
  },

  async selectByID(_id) {
    const product = await Models.Product.findById(_id).exec();
    return product;
  },

  async insert(product) {
    const mongoose = require('mongoose');
    product._id = new mongoose.Types.ObjectId();
    const result = await Models.Product.create(product);
    return result;
  },

  async update(product) {
    const newvalues = {
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    };

    const result = await Models.Product.findByIdAndUpdate(
      product._id,
      newvalues,
      { new: true }
    );
    return result;
  },

  async delete(_id) {
    const result = await Models.Product.findByIdAndDelete(_id);
    return result;
  },

  // latest products (limit)
  async selectNew(limit) {
    const query = {};
    const products = await Models.Product.find(query)
      .sort({ cdate: -1 })
      .limit(limit)
      .exec();
    return products;
  },

  // some hot products (random sample)
  async selectHot(limit) {
    const products = await Models.Product.aggregate([
      { $sample: { size: limit } }
    ]);
    return products;
  },

  // products by category id
  async selectByCategory(categoryId) {
    const mongoose = require('mongoose');
    const objectId = new mongoose.Types.ObjectId(categoryId);
    const products = await Models.Product.find({
      "category._id": objectId
    }).exec();
    return products;
  },

  // ⭐ search products by keyword (đã thêm)
  async selectByKeyword(keyword) {
    const query = {
      name: { $regex: new RegExp(keyword, "i") }
    };
    const products = await Models.Product.find(query).exec();
    return products;
  }
};

module.exports = ProductDAO;