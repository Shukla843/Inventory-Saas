import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Admin, Manager)
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      quantity,
      price,
      lowStockThreshold,
      warehouse,
      supplier,
      description,
    } = req.body;

    // Validate required fields
    if (!name || !sku || !category || quantity === undefined || !price || !warehouse) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create product
    const product = await Product.create({
      name,
      sku,
      category,
      quantity,
      price,
      lowStockThreshold,
      warehouse,
      supplier,
      description,
      createdBy: req.user.id,
    });

    // Create initial stock movement record
    if (quantity > 0) {
      await StockMovement.create({
        product: product._id,
        type: 'inward',
        quantity: quantity,
        previousQuantity: 0,
        newQuantity: quantity,
        reason: 'Initial stock',
        performedBy: req.user.id,
        warehouse: warehouse,
      });
    }

    const populatedProduct = await Product.findById(product._id)
      .populate('warehouse', 'name location')
      .populate('supplier', 'name contact')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct,
    });
  } catch (error) {
    console.error('Create Product Error:', error.message);
    
    // Handle duplicate SKU error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and filters
 * @access  Private
 */
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      warehouse,
      lowStock,
      search,
    } = req.query;

    // Build query
    const query = {};

    if (category) query.category = category;
    if (warehouse) query.warehouse = warehouse;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products
    let products = await Product.find(query)
      .populate('warehouse', 'name location')
      .populate('supplier', 'name contact')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Filter low stock products if requested
    if (lowStock === 'true') {
      products = products.filter((product) => product.quantity <= product.lowStockThreshold);
    }

    // Get total count
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error('Get Products Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 * @access  Private
 */
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('warehouse', 'name location')
      .populate('supplier', 'name contact')
      .populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Get recent stock movements
    const movements = await StockMovement.find({ product: product._id })
      .populate('performedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      product,
      recentMovements: movements,
    });
  } catch (error) {
    console.error('Get Product Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private (Admin, Manager)
 */
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      lowStockThreshold,
      supplier,
      description,
    } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update product (note: quantity is updated through stock movement)
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, price, lowStockThreshold, supplier, description },
      { new: true, runValidators: true }
    )
      .populate('warehouse', 'name location')
      .populate('supplier', 'name contact');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update Product Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private (Admin only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete associated stock movements
    await StockMovement.deleteMany({ product: product._id });

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete Product Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @route   GET /api/products/low-stock
 * @desc    Get all low stock products
 * @access  Private
 */
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('warehouse', 'name location')
      .populate('supplier', 'name contact');

    // Filter products where quantity <= lowStockThreshold
    const lowStockProducts = products.filter(
      (product) => product.quantity <= product.lowStockThreshold
    );

    res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      products: lowStockProducts,
    });
  } catch (error) {
    console.error('Get Low Stock Products Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
