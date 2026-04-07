import Warehouse from '../models/Warehouse.js';
import Product from '../models/Product.js';

/**
 * @route   POST /api/warehouse
 * @desc    Create a new warehouse
 * @access  Private (Admin, Manager)
 */
export const createWarehouse = async (req, res) => {
  try {
    const { name, location, capacity, description } = req.body;

    // Validate input
    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide warehouse name and location',
      });
    }

    // Create warehouse
    const warehouse = await Warehouse.create({
      name,
      location,
      capacity,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Warehouse created successfully',
      warehouse,
    });
  } catch (error) {
    console.error('Create Warehouse Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/warehouse
 * @desc    Get all warehouses
 * @access  Private
 */
export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Get product count for each warehouse
    const warehousesWithCount = await Promise.all(
      warehouses.map(async (warehouse) => {
        const productCount = await Product.countDocuments({
          warehouse: warehouse._id,
        });

        return {
          ...warehouse.toObject(),
          productCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: warehouses.length,
      warehouses: warehousesWithCount,
    });
  } catch (error) {
    console.error('Get Warehouses Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @route   GET /api/warehouse/:id
 * @desc    Get single warehouse
 * @access  Private
 */
export const getWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    // Get products in this warehouse
    const products = await Product.find({ warehouse: warehouse._id });

    res.status(200).json({
      success: true,
      warehouse: {
        ...warehouse.toObject(),
        productCount: products.length,
      },
    });
  } catch (error) {
    console.error('Get Warehouse Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @route   PUT /api/warehouse/:id
 * @desc    Update warehouse
 * @access  Private (Admin, Manager)
 */
export const updateWarehouse = async (req, res) => {
  try {
    const { name, location, capacity, description, isActive } = req.body;

    let warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    // Update warehouse
    warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { name, location, capacity, description, isActive },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Warehouse updated successfully',
      warehouse,
    });
  } catch (error) {
    console.error('Update Warehouse Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @route   DELETE /api/warehouse/:id
 * @desc    Delete warehouse
 * @access  Private (Admin only)
 */
export const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    // Check if warehouse has products
    const productCount = await Product.countDocuments({
      warehouse: warehouse._id,
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete warehouse. It contains ${productCount} products. Please move or delete products first.`,
      });
    }

    await warehouse.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Warehouse deleted successfully',
    });
  } catch (error) {
    console.error('Delete Warehouse Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
