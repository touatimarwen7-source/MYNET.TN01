import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaFileContract, FaBoxOpen, FaFileInvoice, FaUserCircle } from 'react-icons/fa';

const SupplierDashboardPage = () => {
  const stats = [
    { icon: <FaFileContract className="text-4xl text-blue-500" />, value: '12', label: 'Active Tenders' },
    { icon: <FaBoxOpen className="text-4xl text-green-500" />, value: '5', label: 'Awarded Contracts' },
    { icon: <FaFileInvoice className="text-4xl text-yellow-500" />, value: '3', label: 'Pending Invoices' },
  ];

  const quickLinks = [
    { path: '/tenders', label: 'Browse Tenders', icon: <FaFileContract /> },
    { path: '/purchase-orders', label: 'My Purchase Orders', icon: <FaBoxOpen /> },
    { path: '/profile', label: 'My Profile', icon: <FaUserCircle /> },
  ];

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <FaTachometerAlt className="mr-3 text-blue-600" />
        Supplier Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center">
            {stat.icon}
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          {quickLinks.map((link, index) => (
            <Link key={index} to={link.path} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              {link.icon}
              <span className="ml-2">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboardPage;