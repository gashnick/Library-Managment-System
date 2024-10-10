import React from "react";

export default function Home() {
  return (
    <div
      style={{
        backgroundImage: 'url("/images/image1.jpg")', // Adjust the path to your image
        backgroundSize: "cover", // Ensures the image covers the entire header
        backgroundPosition: "center", // Centers the background image
        height: "100vh",
        width: "100%",
        display: "flex", // Flexbox to position content if needed
        justifyContent: "center", // Center content horizontally
        alignItems: "center", // Center content vertically
      }}
    >
      <h1 className="font-bold text-white">LIBRARY MANAGEMENT SYSTEM</h1>
    </div>
  );
}
