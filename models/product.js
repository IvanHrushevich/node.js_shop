const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');

const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = cb => {
  fs.readFile(p, (error, fileContent) => {
    if (error) {
      cb([]);
    } else {
      try {
        cb(JSON.parse(fileContent));
      } catch {
        cb([]);
      }
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
