import React, { useState, useEffect } from "react";

const DiscountHeader = () => {
  const messages = [
    (
      <>
        🎉 Use code <span className="font-bold">INCUBYTE</span> for additional{" "}
        <span className="underline">10% OFF</span> on your order!
      </>
    ),
    (
      <>
        🥳 Use code <span className="font-bold">WELCOME</span> for{" "}
        <span className="underline">20% OFF</span> on your first order!
      </>
    )
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000); // change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-pink-600 text-white text-center py-2 text-sm font-medium">
      <p
        key={index} // helps retrigger animation
        className="transition-opacity duration-700 ease-in-out opacity-100 animate-fade"
      >
        {messages[index]}
      </p>
    </div>
  );
};

export default DiscountHeader;
