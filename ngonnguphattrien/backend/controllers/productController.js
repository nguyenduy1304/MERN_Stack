import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';


// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 8
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})


// @desc Fetch single products
// @route GET /api/products/:id
// @access Public
const getProductsById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc Xóa sản phẩm
// @route delete /api/products/:id
// @access chỉ cho admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        await product.remove()
        res.json({ message: 'đã xóa sản phẩm' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})


// @desc Create sản phẩm
// @route Post /api/products/
// @access chỉ cho admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Yencam',
        price: 50,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Gucci',
        category: 'shirt',
        size: 'L',
        countInStock: 0,
        numReviews: 0,
        description: 'yencammmmmmm'
    })

    const createdProduct = await product.save();
    res.status(201).json(createdProduct)
})


// @desc Update sản phẩm
// @route PUT /api/products/:id
// @access chỉ cho admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name,
        price,
        description,
        image,
        brand,
        category,
        size,
        countInStock }
        = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.size = size
        product.countInStock = countInStock

        const updatedProduct = await product.save();
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Không tin thấy sản phẩm')
    }
})

// @desc Đánh giá sản phẩm
// @route PÓT /api/products/:id/REVIew
// @access chỉ cho 1/1user private
const createProductReview = asyncHandler(async (req, res) => {
    const {
        rating, comment
    }
        = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        const alreadyReviewd = product.reviews.find(r => r.user.toString() === req.user._id.toString())
        if (alreadyReviewd) {
            res.status(400)
            throw new Error('Sản phẩm đã cos review')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length
        await product.save()
        res.status(201).json({ message: 'Đã thêm đánh giá' })
    } else {
        res.status(404)
        throw new Error('Không tin thấy sản phẩm')
    }
})

// @desc  sản phẩm bán chạy
// @route get /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4)
    res.json(products)
})

export {
    getProducts,
    getProductsById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts
}