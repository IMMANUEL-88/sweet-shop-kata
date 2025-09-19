import React from 'react';

const CorporateOrders = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-purple-600 text-white rounded-lg p-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Corporate & Bulk Orders</h2>
            <p className="mb-6">
              Make your corporate events, celebrations, and gifting memorable with our exclusive range of sweets. Get in touch for customized orders and special pricing.
            </p>
          </div>
          <div className="w-full md:w-1/2 md:pl-10">
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full p-3 rounded-md text-gray-800" />
              <input type="email" placeholder="Your Email" className="w-full p-3 rounded-md text-gray-800" />
              <input type="tel" placeholder="Contact Number" className="w-full p-3 rounded-md text-gray-800" />
              <button type="submit" className="w-full bg-pink-500 font-bold py-3 px-6 rounded-md hover:bg-pink-600 transition-colors">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateOrders;
