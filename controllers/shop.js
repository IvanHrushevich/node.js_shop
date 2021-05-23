const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows]) => {
            res.render('shop/product-list', {
                prods: rows,
                pageTitle: 'All products',
                path: '/products',
            });
        })
        .catch(error => console.log(`error`, error));
};

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id, product => {
        res.render('shop/product-detail', {
            product,
            pageTitle: product.title,
            path: '/products',
        });
    });

    Product.findById(id)
        .then(([products]) => {
            console.log(`products`, products[0]);
            res.render('shop/product-detail', {
                product: products[0],
                pageTitle: products[0].title,
                path: '/products',
            });
        })
        .catch(error => console.log(`error`, error));
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(([rows]) => {
            res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/',
            });
        })
        .catch(error => console.log(`error`, error));
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (const product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({
                        productData: product,
                        qty: cartProductData.qty,
                    });
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your cart',
                products: cartProducts,
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { path: '/orders', pageTitle: 'Your orders' });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' });
};
