import React from 'react';
import { Pizza, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Pizza className="h-8 w-8 text-primary-500" />
              <span className="font-display font-bold text-xl">PizzaCraft</span>
            </div>
            <p className="text-gray-300">
              Crafting authentic, delicious pizzas with fresh ingredients since 2020. 
              Your neighborhood's favorite pizza destination.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-500" />
                <span className="text-gray-300">(555) 123-PIZZA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-500" />
                <span className="text-gray-300">hello@pizzacraft.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary-500" />
                <span className="text-gray-300">123 Pizza Street, Food City, FC 12345</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Hours</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>Mon - Thu:</span>
                <span>11am - 10pm</span>
              </div>
              <div className="flex justify-between">
                <span>Fri - Sat:</span>
                <span>11am - 11pm</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>12pm - 9pm</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-primary-500 transition-colors">
                About Us
              </a>
              <a href="#" className="block text-gray-300 hover:text-primary-500 transition-colors">
                Nutrition Info
              </a>
              <a href="#" className="block text-gray-300 hover:text-primary-500 transition-colors">
                Careers
              </a>
              <a href="#" className="block text-gray-300 hover:text-primary-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-gray-300 hover:text-primary-500 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 PizzaCraft. All rights reserved. Made with ❤️ and lots of cheese.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;