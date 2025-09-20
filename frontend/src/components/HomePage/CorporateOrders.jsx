import React from 'react';

const CorporateOrders = () => {
  return (
    <div className="py-24 bg-pink-200">
      <div className="container mx-auto px-6">
        {/* We'll use a 2-column grid for a cleaner layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Column 1: The Text Content */}
          <div className="mb-8 md:mb-0">
            <p className="text-lg font-semibold text-pink-500 uppercase">Sweetify for Business</p>
            <h2 className="text-4xl font-bold text-gray-900 font-serif mt-2 mb-4">
              Corporate & Bulk Orders
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Make your corporate events, celebrations, and gifting memorable with our exclusive range of sweets. Get in touch for customized orders and special pricing.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mt-4">
              We cater to all your needs, from custom branding to special assortments. Let us help make your next event a sweet success.
            </p>
          </div>
          
          {/* Column 2: The Form Card */}
          <div className="w-full">
            <div className="bg-pink-50 rounded-xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Get a Free Quote</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input 
                    type="text" 
                    id="name"
                    placeholder="Your Name" 
                    className="w-full p-3 mt-1 rounded-md text-gray-800 bg-white border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    placeholder="Your Email" 
                    className="w-full p-3 mt-1 rounded-md text-gray-800 bg-white border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input 
                    type="tel" 
                    id="contact"
                    placeholder="Contact Number" 
                    className="w-full p-3 mt-1 rounded-md text-gray-800 bg-white border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-pink-500 font-bold text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors shadow-lg"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateOrders;