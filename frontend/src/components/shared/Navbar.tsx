import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { WalletButton } from './ConnectWallet'
import { ThemeToggle } from '../../providers/ThemeProvider'
import { MobileMenu } from './MobileMenu'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-orange-500">
              BlockRoute
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className={`${
                  isActive('/') 
                    ? 'text-orange-500' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/create" 
                className={`${
                  isActive('/create') 
                    ? 'text-orange-500' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500'
                }`}
              >
                Create Shipment
              </Link>
              <Link 
                to="/dashboard" 
                className={`${
                  isActive('/dashboard') 
                    ? 'text-orange-500' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/track" 
                className={`${
                  isActive('/track') 
                    ? 'text-orange-500' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500'
                }`}
              >
                Track Shipment
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Wallet Connection */}
              <div className="hidden md:block">
                <WalletButton />
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  )
}
