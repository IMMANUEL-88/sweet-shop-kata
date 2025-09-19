import React from 'react';

const categories = [
  { name: 'Chocolates', image: 'https://placehold.co/400x300/d946ef/ffffff?text=Chocolates' },
  { name: 'Candies', image: 'https://placehold.co/400x300/ec4899/ffffff?text=Candies' },
  { name: 'Pastries', image: 'https://placehold.co/400x300/f472b6/ffffff?text=Pastries' },
  { name: 'Cookies', image: 'https://placehold.co/400x300/fb923c/ffffff?text=Cookies' },
];

const Categories = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.name} className="group cursor-pointer">
              <div className="overflow-hidden rounded-lg">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <h3 className="text-center mt-4 font-semibold text-lg text-gray-700">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
