import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  Users, 
  ArrowLeftRight, 
  LogOut,
  User
} from 'lucide-react';
import { fadeIn } from '../utils/animations';

/**
 * Navbar Component
 * Main navigation bar with user menu
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      fadeIn(navRef.current);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div ref={navRef} className="navbar glass sticky top-0 z-50 px-6">
      <div className="navbar-start">
        <Link to="/dashboard" className="text-xl font-bold gradient-text">
          📦 InventoryPro
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link to="/dashboard" className="hover:bg-primary/20">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/inventory" className="hover:bg-primary/20">
              <Package size={18} />
              Inventory
            </Link>
          </li>
          <li>
            <Link to="/warehouses" className="hover:bg-primary/20">
              <Warehouse size={18} />
              Warehouses
            </Link>
          </li>
          <li>
            <Link to="/suppliers" className="hover:bg-primary/20">
              <Users size={18} />
              Suppliers
            </Link>
          </li>
          <li>
            <Link to="/stock-movements" className="hover:bg-primary/20">
              <ArrowLeftRight size={18} />
              Stock Movements
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-4">
        {/* User dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar placeholder"
          >
            <div className="bg-primary text-white rounded-full w-10">
              <span className="text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg glass rounded-box w-52"
          >
            <li className="menu-title">
              <span>{user?.name}</span>
              <span className="text-xs text-gray-400">{user?.email}</span>
            </li>
            <li>
              <span className="text-xs">
                <span className="badge badge-primary badge-sm">{user?.role}</span>
              </span>
            </li>
            <div className="divider my-1"></div>
            <li>
              <a onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg glass rounded-box w-52"
          >
            <li>
              <Link to="/dashboard">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/inventory">
                <Package size={18} /> Inventory
              </Link>
            </li>
            <li>
              <Link to="/warehouses">
                <Warehouse size={18} /> Warehouses
              </Link>
            </li>
            <li>
              <Link to="/suppliers">
                <Users size={18} /> Suppliers
              </Link>
            </li>
            <li>
              <Link to="/stock-movements">
                <ArrowLeftRight size={18} /> Stock Movements
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
