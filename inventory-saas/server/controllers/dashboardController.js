import Product from '../models/Product.js';
import Warehouse from '../models/Warehouse.js';
import Supplier from '../models/Supplier.js';
import StockMovement from '../models/StockMovement.js';

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics (aggregated data)
 * @access  Private
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get total warehouses
    const totalWarehouses = await Warehouse.countDocuments({ isActive: true });

    // Get total suppliers
    const totalSuppliers = await Supplier.countDocuments({ isActive: true });

    // Get low stock products (using aggregation)
    const lowStockProducts = await Product.aggregate([
      {
        $addFields: {
          isLowStock: { $lte: ['$quantity', '$lowStockThreshold'] },
        },
      },
      {
        $match: { isLowStock: true },
      },
      {
        $count: 'total',
      },
    ]);

    const lowStockCount = lowStockProducts[0]?.total || 0;

    // Get total inventory value
    const inventoryValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } },
        },
      },
    ]);

    const totalInventoryValue = inventoryValue[0]?.totalValue || 0;

    // Get category-wise product distribution
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get recent stock movements (last 10)
    const recentActivities = await StockMovement.find()
      .populate('product', 'name sku')
      .populate('performedBy', 'name')
      .populate('warehouse', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get warehouse-wise inventory
    const warehouseInventory = await Product.aggregate([
      {
        $group: {
          _id: '$warehouse',
          productCount: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'warehouses',
          localField: '_id',
          foreignField: '_id',
          as: 'warehouseInfo',
        },
      },
      {
        $unwind: '$warehouseInfo',
      },
      {
        $project: {
          warehouseName: '$warehouseInfo.name',
          location: '$warehouseInfo.location',
          productCount: 1,
          totalQuantity: 1,
        },
      },
    ]);

    // Get stock movement trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stockTrends = await StockMovement.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type',
          },
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    // Get top 5 products by quantity
    const topProducts = await Product.find()
      .populate('warehouse', 'name')
      .sort({ quantity: -1 })
      .limit(5)
      .select('name sku quantity price category');

    // Get products needing restock (low stock)
    const restockNeeded = await Product.find()
      .populate('warehouse', 'name')
      .populate('supplier', 'name contact')
      .sort({ quantity: 1 })
      .limit(10)
      .select('name sku quantity lowStockThreshold warehouse supplier');

    const restockList = restockNeeded.filter(
      (product) => product.quantity <= product.lowStockThreshold
    );

    res.status(200).json({
      success: true,
      stats: {
        overview: {
          totalProducts,
          totalWarehouses,
          totalSuppliers,
          lowStockCount,
          totalInventoryValue: totalInventoryValue.toFixed(2),
        },
        categoryDistribution,
        warehouseInventory,
        stockTrends,
        topProducts,
        restockNeeded: restockList,
        recentActivities,
      },
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/dashboard/alerts
 * @desc    Get system alerts (low stock, etc.)
 * @access  Private
 */
export const getAlerts = async (req, res) => {
  try {
    // Get low stock alerts
    const lowStockAlerts = await Product.find()
      .populate('warehouse', 'name')
      .populate('supplier', 'name contact')
      .select('name sku quantity lowStockThreshold warehouse supplier');

    const alerts = lowStockAlerts
      .filter((product) => product.quantity <= product.lowStockThreshold)
      .map((product) => ({
        type: 'low_stock',
        severity: product.quantity === 0 ? 'critical' : 'warning',
        product: {
          id: product._id,
          name: product.name,
          sku: product.sku,
          currentQuantity: product.quantity,
          threshold: product.lowStockThreshold,
        },
        warehouse: product.warehouse,
        supplier: product.supplier,
        message: `${product.name} is ${product.quantity === 0 ? 'out of stock' : 'running low'}`,
      }));

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error('Get Alerts Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
