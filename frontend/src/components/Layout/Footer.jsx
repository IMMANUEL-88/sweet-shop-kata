import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-pink-500 text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold font-serif mb-4">Sweetify</h3>
            <p className="text-pink-200">
              Your daily dose of happiness, delivered. Handcrafted sweets made with love.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-pink-200">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">All Sweets</a></li>
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-pink-200">
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <p className="text-pink-200">Stay updated with our latest treats and offers!</p>
            {/* Add social media icons here if needed */}
          </div>
        </div>
        <div className="text-center text-pink-300 mt-10 pt-6 border-t border-pink-700">
          © {new Date().getFullYear()} Sweetify. All rights reserved by Immanuel Jeyam.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
