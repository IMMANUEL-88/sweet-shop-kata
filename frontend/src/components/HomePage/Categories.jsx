import React, { useState, useEffect } from 'react';
import { searchSweets } from '/src/api/api.js';
import { useAuth } from '/src/context/AuthContext.jsx';
import Modal from '/src/components/Layout/Modal.jsx';
import SweetCard from '/src/components/SweetCard.jsx'; // Make sure this is imported

const categories = [
  { name: 'Chocolates', image: 'https://media.istockphoto.com/id/522735736/photo/chocolate-background.jpg?s=612x612&w=0&k=20&c=fmBbjHi5zXpcbzAQWGy3xtPgcIJkc7eHXjZiYsi396A=' },
  { name: 'Candy', image: 'https://imageio.forbes.com/specials-images/imageserve/670d62f446c86d73906cf4da/Lollipops-candies-and-sweet-sugar-jelly-multicolored/0x0.jpg?format=jpg&crop=1404,658,x0,y265,safe&width=960' },
  { name: 'Pastry', image: 'https://images.stockcake.com/public/b/8/b/b8bca4f2-33d0-40cb-a267-d57d747713cc_large/assorted-breakfast-pastries-stockcake.jpg' },
  { name: 'Cookies', image: 'https://krbakes.com/cdn/shop/articles/What_Are_the_Most_Popular_Cookies_in_India.webp?v=1746536283&width=480' },
];

const Categories = ({ onAddToCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useAuth();

  useEffect(() => {
    if (selectedCategory) {
      const fetchSweetsByCategory = async () => {
        setIsLoading(true);
        try {
          const { data } = await searchSweets({ category: selectedCategory });
          setSweets(data);
        } catch (error) {
          showNotification('Could not fetch sweets for this category.', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      fetchSweetsByCategory();
    }
  }, [selectedCategory, showNotification]);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setSweets([]);
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-left text-gray-800 mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-center mt-4 font-semibold text-lg text-gray-700 group-hover:text-pink-500 transition-colors">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        // FIX: Pass maxWidthClass to make the modal wider
        <Modal onClose={handleCloseModal} maxWidthClass="max-w-4xl"> {/* Changed from max-w-md */}
          <h2 className="text-3xl font-bold text-pink-500 font-serif mb-6 text-center">{selectedCategory} Sweets</h2>
          {isLoading ? (
            <p className="text-center text-gray-500">Loading sweets...</p>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Increased gap */}
                {sweets.length > 0 ? (
                  sweets.map(sweet => (
                    <SweetCard
                      key={sweet._id}
                      sweet={sweet}
                      onAddToCart={onAddToCart}
                      isCompact={true} // <-- Pass this new prop
                    />
                  ))
                ) : (
                  <p className="text-center col-span-full text-gray-500 text-lg">No sweets found in this category.</p>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Categories;