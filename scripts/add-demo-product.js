// Script to add a showcase product
const fetch = require('node-fetch');

async function addProduct() {
  try {
    const product = {
      title: "Neon Pulse Snapback",
      description: `Step into the future with our Neon Pulse Snapback. This premium headwear piece combines sleek modern design with unmatched comfort.

Features:
• Premium cotton-polyester blend
• Moisture-wicking sweatband
• Adjustable snapback closure
• Embroidered ventilation eyelets
• 3D-rendered customization available
• Limited edition design

Perfect for both street style and casual wear, the Neon Pulse Snapback represents the pinnacle of contemporary urban fashion.`,
      price: 59.99,
      stock: 25,
      images: [
        "/products/neon-pulse-1.webp",
        "/products/neon-pulse-2.webp"
      ],
      tags: ["limited-edition", "premium", "streetwear", "neon", "snapback"],
      variants: [
        {
          name: "Color",
          value: "Neon Blue",
          price: 59.99,
          stock: 10
        },
        {
          name: "Color",
          value: "Neon Pink",
          price: 59.99,
          stock: 8
        },
        {
          name: "Color",
          value: "Neon Green",
          price: 59.99,
          stock: 7
        }
      ]
    };

    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Product created successfully:', data.product);
    } else {
      console.error('❌ Failed to create product:', data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addProduct();