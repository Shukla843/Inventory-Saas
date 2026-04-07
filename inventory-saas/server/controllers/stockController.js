import StockMovement from '../models/StockMovement.js';
import Product from '../models/Product.js';

/**
 * @route   POST /api/stock/move
 * @desc    Record stock movement (inward/outward)
 * @access  Private
 */
export const moveStock = async (req, res) => {
  try {
    const { productId, type, quantity, reason, reference } = req.body;

    // Validate input
    if (!productId || !type || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product, type, and quantity',
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Store previous quantity
    const previousQuantity = product.quantity;
    let newQuantity;

    // Calculate new quantity based on movement type
    if (type === 'inward') {
      newQuantity = previousQuantity + parseInt(quantity);
    } else if (type === 'outward') {
      // Check if sufficient stock available
      if (previousQuantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${previousQuantity}, Requested: ${quantity}`,
        });
      }
      newQuantity = previousQuantity - parseInt(quantity);
    } else if (type === 'adjustment') {
      newQuantity = parseInt(quantity); // Direct adjustment
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid movement type. Must be inward, outward, or adjustment',
      });
    }

    // Update product quantity
    product.quantity = newQuantity;
    await product.save();

    // Create stock movement record
    const movement = await StockMovement.create({
      product: productId,
      type,
      quantity: parseInt(quantity),
      previousQuantity,
      newQuantity,
      reason,
      reference,
      performedBy: req.user.id,
      warehouse: product.warehouse,
    });

    // Populate movement details
    const populatedMovement = await StockMovement.findById(movement._id)
      .populate('product', 'name sku')
      .populate('performedBy', 'name email')
      .populate('warehouse', 'name location');

    res.status(201).json({
      success: true,
      message: `Stock ${type} recorded successfully`,
      movement: populatedMovement,
      updatedProduct: {
        id: product._id,
        name: product.name,
        previousQuantity,
        newQuantity,
        isLowStock: newQuantity <= product.lowStockThreshold,
      },
    });
  } catch (error) {
    console.error('Move Stock Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/stock/history
 * @desc    Get stock movement history with filters
 * @access  Private
 */
export const getStockHistory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      productId,
      warehouse,
      type,
      startDate,
      endDate,
    } = req.query;

    // Build query
    const query = {};

    if (productId) query.product = productId;
    if (warehouse) query.warehouse = warehouse;
    if (type) query.type = type;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get movements
    const movements = await StockMovement.find(query)
      .populate('product', 'name sku category')
      .populate('performedBy', 'name email')
      .populate('warehouse', 'name location')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const total = await StockMovement.countDocuments(query);

    res.status(200).json({
      success: true,
      count: movements.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      movements,
    });
  } catch (error) {
    console.error('Get Stock History Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @route   GET /api/stock/recent
 * @desc    Get recent stock movements (last 50)
 * @access  Private
 */
export const getRecentMovements = async (req, res) => {
  try {
    const movements = await StockMovement.find()
      .populate('product', 'name sku')
      .populate('performedBy', 'name')
      .populate('warehouse', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: movements.length,
      movements,
    });
  } catch (error) {
    console.error('Get Recent Movements Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @route   GET /api/stock/product/:productId
 * @desc    Get stock history for a specific product
 * @access  Private
 */
export const getProductStockHistory = async (req, res) => {
  try {
    const { productId } = req.params;

    const movements = await StockMovement.find({ product: productId })
      .populate('performedBy', 'name email')
      .populate('warehouse', 'name')
      .sort({ createdAt: -1 });

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product: {
        id: product._id,
        name: product.name,
        sku: product.sku,
        currentQuantity: product.quantity,
      },
      movements,
    });
  } catch (error) {
    console.error('Get Product Stock History Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
