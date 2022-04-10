import express from 'express';
const router = express.Router()
import { createProduct, deleteProduct, getProducts, getProductsById, updateProduct, createProductReview, getTopProducts } from '../controllers/productController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

// @desc Fetch all products
// @route GET /api/products
// @access Public

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/:id/reviews').post(protect, createProductReview)
router.get('/top', getTopProducts)
router.route('/:id').get(getProductsById).delete(protect, admin, deleteProduct).
put(protect, admin, updateProduct)


export default router