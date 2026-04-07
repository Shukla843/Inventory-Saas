import Supplier from '../models/Supplier.js';
import Product from '../models/Product.js';

/**
 * @route   POST /api/supplier
 * @desc    Create a new supplier
 * @access  Private (Admin, Manager)
 */
export const createSupplier = async (req, res) => {
  try {
    const { name, contact, address, rating } = req.body;

    // Validate input
    if (!name || !contact || !contact.phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide supplier name and contact phone',
      });
    }

    // Create supplier
    const supplier = await Supplier.create({
      name,
      contact,
      address,
      rating,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      supplier,
    });
  } catch (error) {
    console.error('Create Supplier Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/supplier
 * @desc    Get all suppliers
 * @access  Private
 */
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate('productsSupplied', 'name sku')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Add product count for each supplier
    const suppliersWithCount = await Promise.all(
      suppliers.map(async (supplier) => {
        const productCount = await Product.countDocuments({
          supplier: supplier._id,
        });

        return {
          ...supplier.toObject(),
          productCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: suppliers.length,
      suppliers: suppliersWithCount,
    });
  } catch (error) {
    console.error('Get Suppliers Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @route   GET /api/supplier/:id
 * @desc    Get single supplier
 * @access  Private
 */
export const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('productsSupplied', 'name sku quantity price')
      .populate('createdBy', 'name email');

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found',
      });
    }

    // Get all products from this supplier
    const products = await Product.find({ supplier: supplier._id })
      .populate('warehouse', 'name location');

    res.status(200).json({
      success: true,
      supplier,
      products,
    });
  } catch (error) {
    console.error('Get Supplier Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @route   PUT /api/supplier/:id
 * @desc    Update supplier
 * @access  Private (Admin, Manager)
 */
export const updateSupplier = async (req, res) => {
  try {
    const { name, contact, address, rating, isActive } = req.body;

    let supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found',
      });
    }

    // Update supplier
    supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, contact, address, rating, isActive },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Supplier updated successfully',
      supplier,
    });
  } catch (error) {
    console.error('Update Supplier Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @route   DELETE /api/supplier/:id
 * @desc    Delete supplier
 * @access  Private (Admin only)
 */
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found',
      });
    }

    // Check if supplier has products
    const productCount = await Product.countDocuments({
      supplier: supplier._id,
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete supplier. ${productCount} products are linked to this supplier. Please reassign or delete products first.`,
      });
    }

    await supplier.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Supplier deleted successfully',
    });
  } catch (error) {
    console.error('Delete Supplier Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
