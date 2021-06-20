const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;

    req.user
        .createProduct({ title, price, imageUrl, description })
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(error => console.log(`error`, error));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;
    req.user
        .getProducts({ where: { id: prodId } })
        .then(products => {
            const product = products[0];

            if (!product) {
                res.redirect('/');
            }

            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/edit-product',
                editing: editMode,
                product,
            });
        })
        .catch(error => console.log(`error`, error));
};

exports.postEditProduct = (req, res, next) => {
    const updatedProduct = req.body;

    Product.findByPk(updatedProduct.productId)
        .then(product => {
            product.title = updatedProduct.title;
            product.price = updatedProduct.price;
            product.description = updatedProduct.description;
            product.imageUrl = updatedProduct.imageUrl;

            return product.save();
        })
        .then(() => {
            res.redirect('/admin/products');
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.destroy({ where: { id } })
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(error => console.log(`error`, error));
};

exports.getProducts = (req, res, next) => {
    req.user
        .getProducts()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch(error => console.log(`error`, error));
};
