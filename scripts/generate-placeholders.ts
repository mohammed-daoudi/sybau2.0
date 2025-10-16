const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'products');
const IMAGES_DIR = path.join(PRODUCTS_DIR, 'images');
const MODELS_DIR = path.join(PRODUCTS_DIR, 'models');

// Ensure directories exist
[PRODUCTS_DIR, IMAGES_DIR, MODELS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Generate placeholder images
async function generatePlaceholderImages() {
  const images = [
    // Cyberpunk LED Jacket
    {
      name: 'cyberpunk-jacket-front.jpg',
      width: 1600,
      height: 1600,
      text: 'Cyberpunk Jacket Front View'
    },
    {
      name: 'cyberpunk-jacket-back.jpg',
      width: 1600,
      height: 1600,
      text: 'Cyberpunk Jacket Back View'
    },
    {
      name: 'cyberpunk-jacket-detail.jpg',
      width: 1200,
      height: 800,
      text: 'Cyberpunk Jacket Details'
    },
    {
      name: 'cyberpunk-jacket-3d-preview.jpg',
      width: 800,
      height: 800,
      text: '3D Preview'
    },
    // Quantum Backpack
    {
      name: 'quantum-backpack-main.jpg',
      width: 1600,
      height: 1600,
      text: 'Quantum Backpack Main View'
    },
    {
      name: 'quantum-backpack-open.jpg',
      width: 1600,
      height: 1600,
      text: 'Quantum Backpack Open View'
    },
    {
      name: 'quantum-backpack-tech.jpg',
      width: 1200,
      height: 800,
      text: 'Quantum Backpack Tech Features'
    },
    {
      name: 'quantum-backpack-3d-preview.jpg',
      width: 800,
      height: 800,
      text: '3D Preview'
    }
  ];

  for (const image of images) {
    await sharp({
      create: {
        width: image.width,
        height: image.height,
        channels: 4,
        background: { r: 30, g: 30, b: 40, alpha: 1 }
      }
    })
      .composite([{
        input: Buffer.from(`<svg width="${image.width}" height="${image.height}">
          <text x="50%" y="50%" text-anchor="middle" font-family="Arial" font-size="48" fill="white">
            ${image.text}
          </text>
        </svg>`),
        top: 0,
        left: 0,
      }])
      .jpeg({ quality: 90 })
      .toFile(path.join(IMAGES_DIR, image.name));
    
    console.log(`Generated ${image.name}`);
  }
}

// Generate placeholder 3D models
function generatePlaceholderModels() {
  const models = [
    'cyberpunk-jacket.glb',
    'quantum-backpack.glb'
  ];

  for (const model of models) {
    // Create empty GLB file as placeholder
    fs.writeFileSync(
      path.join(MODELS_DIR, model),
      Buffer.from('glTF Binary\0', 'utf8')
    );
    console.log(`Generated ${model}`);
  }
}

async function main() {
  try {
    console.log('Generating placeholder images...');
    await generatePlaceholderImages();
    
    console.log('\nGenerating placeholder 3D models...');
    generatePlaceholderModels();
    
    console.log('\nPlaceholder assets generated successfully!');
  } catch (error) {
    console.error('Error generating placeholders:', error);
    process.exit(1);
  }
}

main();