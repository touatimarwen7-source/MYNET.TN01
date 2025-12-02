import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBox, FaFileInvoice, FaCog, FaShieldAlt } from 'react-icons/fa';

const AdminDashboardPage = () => {
  const stats = [
    { icon: <FaUsers className="text-4xl text-blue-500" />, value: '150', label: 'Total Users' },
    { icon: <FaBox className="text-4xl text-green-500" />, value: '75', label: 'Active Tenders' },
    { icon: <FaFileInvoice className="text-4xl text-yellow-500" />, value: '200', label: 'Total Invoices' },
  ];

  const quickLinks = [
    { path: '/admin/user-management', label: 'User Management', icon: <FaUsers /> },
    { path: '/admin/tender-monitoring', label: 'Tender Monitoring', icon: <FaBox /> },
    { path: '/admin/system-settings', label: 'System Settings', icon: <FaCog /> },
    { path: '/admin/audit-log', label: 'Audit Log', icon: <FaShieldAlt /> },
  ];

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <FaTachometerAlt className="mr-3 text-red-600" />
        Admin Dashboard
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
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Admin Actions</h2>
        <div className="flex flex-wrap gap-4">
          {quickLinks.map((link, index) => (
            <Link key={index} to={link.path} className="flex items-center bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              {link.icon}
              <span className="ml-2">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;