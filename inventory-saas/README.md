# 📦 Inventory & Supply Chain Management System (Enterprise SaaS)

A full-stack MERN application for managing inventory, warehouses, suppliers, and stock movements with real-time analytics and role-based access control.

![Tech Stack](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication with httpOnly cookies
- Role-based access control (Admin, Manager, Staff)
- Secure password hashing with bcrypt

### 🏢 Multi-Warehouse Management
- Create and manage multiple warehouse locations
- Track inventory across different warehouses
- Warehouse capacity management

### 📦 Inventory Management
- Complete CRUD operations for products
- Real-time stock level monitoring
- Low stock alerts and notifications
- Category-based product organization
- SKU-based product identification

### 🔄 Stock Movement Tracking
- Inward, Outward, and Adjustment tracking
- Complete movement history with timestamps
- Movement performed by user tracking
- Reference number support for auditing

### 🚚 Supplier Management
- Supplier contact information
- Supplier rating system
- Track products linked to suppliers

### 📊 Advanced Dashboard
- Real-time analytics and statistics
- Interactive charts (Recharts)
- Category distribution visualization
- Warehouse inventory breakdown
- Recent activity tracking
- Low stock alerts

### ✨ UI/UX Features
- Modern glassmorphism design
- GSAP animations for smooth transitions
- Responsive design (mobile-friendly)
- Dark theme optimized
- DaisyUI components

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cookie-Parser** - Cookie handling

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **DaisyUI** - UI components
- **GSAP** - Animations
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Routing
- **Lucide React** - Icons

---

## 📁 Project Structure

```
inventory-saas/
├── server/                     # Backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Warehouse.js       # Warehouse schema
│   │   ├── Product.js         # Product schema
│   │   ├── Supplier.js        # Supplier schema
│   │   └── StockMovement.js   # Stock movement schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── warehouseController.js
│   │   ├── productController.js
│   │   ├── supplierController.js
│   │   ├── stockController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── warehouseRoutes.js
│   │   ├── productRoutes.js
│   │   ├── supplierRoutes.js
│   │   ├── stockRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/
│   │   └── auth.js            # JWT & role-based auth
│   ├── .env                   # Environment variables
│   ├── server.js              # Entry point
│   └── package.json
│
├── client/                     # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Warehouses.jsx
│   │   │   ├── Suppliers.jsx
│   │   │   └── StockMovements.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── animations.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd inventory-saas
```

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (already created, but update MongoDB URI if needed)
# .env content:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/inventory-saas
# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
# CLIENT_URL=http://localhost:5173

# Start MongoDB (if running locally)
# Linux/Mac:
sudo systemctl start mongod
# OR
mongod

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

Open a new terminal window:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🎯 Usage

### 1. Access the Application
Open your browser and go to: `http://localhost:5173`

### 2. Create an Account
- Click on "Sign Up"
- Fill in your details
- Select your role:
  - **Admin**: Full access to all features
  - **Manager**: Can manage inventory, warehouses, and suppliers
  - **Staff**: Can view and update stock only

### 3. Demo Credentials (Create these users via signup)
```
Admin:
- Email: admin@demo.com
- Password: password
- Role: admin

Manager:
- Email: manager@demo.com
- Password: password
- Role: manager

Staff:
- Email: staff@demo.com
- Password: password
- Role: staff
```

### 4. Getting Started Workflow

1. **Create Warehouses**
   - Go to "Warehouses" page
   - Click "Add Warehouse"
   - Enter name, location, and capacity

2. **Add Suppliers** (Optional)
   - Go to "Suppliers" page
   - Click "Add Supplier"
   - Enter contact details

3. **Add Products**
   - Go to "Inventory" page
   - Click "Add Product"
   - Fill in product details
   - Select warehouse
   - Set initial quantity

4. **Track Stock Movements**
   - Go to "Stock Movements" page
   - Click "Record Movement"
   - Select product and movement type (Inward/Outward/Adjustment)
   - Enter quantity and reason

5. **View Analytics**
   - Go to "Dashboard"
   - View real-time statistics
   - Monitor low stock alerts
   - Analyze charts and trends

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/signup      - Register new user
POST   /api/auth/login       - Login user
POST   /api/auth/logout      - Logout user
GET    /api/auth/me          - Get current user
```

### Warehouses
```
GET    /api/warehouse        - Get all warehouses
GET    /api/warehouse/:id    - Get single warehouse
POST   /api/warehouse        - Create warehouse (Admin/Manager)
PUT    /api/warehouse/:id    - Update warehouse (Admin/Manager)
DELETE /api/warehouse/:id    - Delete warehouse (Admin)
```

### Products
```
GET    /api/products         - Get all products (with pagination)
GET    /api/products/:id     - Get single product
POST   /api/products         - Create product (Admin/Manager)
PUT    /api/products/:id     - Update product (Admin/Manager)
DELETE /api/products/:id     - Delete product (Admin)
GET    /api/products/low-stock - Get low stock products
```

### Stock Movements
```
POST   /api/stock/move       - Record stock movement
GET    /api/stock/history    - Get movement history
GET    /api/stock/recent     - Get recent movements
GET    /api/stock/product/:productId - Get product movement history
```

### Suppliers
```
GET    /api/supplier         - Get all suppliers
GET    /api/supplier/:id     - Get single supplier
POST   /api/supplier         - Create supplier (Admin/Manager)
PUT    /api/supplier/:id     - Update supplier (Admin/Manager)
DELETE /api/supplier/:id     - Delete supplier (Admin)
```

### Dashboard
```
GET    /api/dashboard/stats  - Get dashboard statistics
GET    /api/dashboard/alerts - Get system alerts
```

---

## 🎨 Features Breakdown

### Role-Based Access Control

| Feature | Admin | Manager | Staff |
|---------|-------|---------|-------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Inventory | ✅ | ✅ | ✅ |
| Add/Edit Products | ✅ | ✅ | ❌ |
| Delete Products | ✅ | ❌ | ❌ |
| Manage Warehouses | ✅ | ✅ | ❌ |
| Delete Warehouses | ✅ | ❌ | ❌ |
| Manage Suppliers | ✅ | ✅ | ❌ |
| Record Stock Movement | ✅ | ✅ | ✅ |
| View Reports | ✅ | ✅ | ✅ |

---

## 🎭 GSAP Animations

The application uses GSAP for smooth, professional animations:

- **Page Load**: Fade-in animations for all pages
- **Card Reveal**: Staggered animations for product/warehouse cards
- **Number Counters**: Animated number counting in dashboard stats
- **Hover Effects**: Scale and glow effects on buttons and cards
- **Slide Animations**: Slide-in effects for modals and sidebars

---

## 🔐 Security Features

- JWT tokens stored in httpOnly cookies (prevents XSS)
- Password hashing with bcrypt
- Role-based access control
- Input validation on both client and server
- Protected API routes
- CORS configuration
- SQL injection prevention (MongoDB)

---

## 🚀 Production Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Update `.env` with production values:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory
JWT_SECRET=use_a_strong_random_secret_here
CLIENT_URL=https://your-frontend-url.com
NODE_ENV=production
```

2. Deploy to your platform

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd client
npm run build
```

2. Deploy the `dist` folder

3. Update API base URL in production

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
sudo systemctl status mongod

# Or start it
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ for learning and portfolio purposes

---

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack MERN development
- RESTful API design
- Authentication & Authorization
- Database modeling with Mongoose
- State management with Context API
- Modern React practices (Hooks, Router)
- Responsive UI design
- Animation with GSAP
- Data visualization
- Role-based access control
- Production-ready code structure

---

## 📞 Support

For issues or questions, please open an issue in the GitHub repository.

---

**Happy Coding! 🚀**
