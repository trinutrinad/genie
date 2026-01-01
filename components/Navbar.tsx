'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from './Button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">
              Gaon Seva
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/register/provider"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Become a Provider
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              About
            </Link>

            {/* Language Toggle */}
            <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
              <Globe className="h-4 w-4" />
              <span className="text-sm">EN</span>
            </button>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register/customer">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-200">
            <Link
              href="/"
              className="block text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="block text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/register/provider"
              className="block text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Become a Provider
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register/customer">
                <Button variant="primary" size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
