
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, List } from 'lucide-react';
import { ModeToggle } from './ui/mode-toggle';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Procurement Dashboard</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-white">
            <List className="h-5 w-5 mr-1" />
            <span>Products</span>
          </Link>
          <Link to="/create-invoice" className="flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-white">
            <FileText className="h-5 w-5 mr-1" />
            <span>Create Invoice</span>
          </Link>
          <Link to="/invoice-history" className="flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-white">
            <FileText className="h-5 w-5 mr-1" />
            <span>Invoice History</span>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
