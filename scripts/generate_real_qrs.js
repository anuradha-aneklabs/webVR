import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const qrDir = 'C:/Users/aneka/Desktop/ParkVerse/public/assets/qr';
if (!fs.existsSync(qrDir)) {
  fs.mkdirSync(qrDir, { recursive: true });
}

const QR_ITEMS = [
  // 8 Stations
  { id: 'entrance', code: 'PARK-ENTRANCE-01', name: 'Main Entrance & Arrival Gate' },
  { id: 'reception', code: 'PARK-RECEPTION-02', name: 'Welcome Reception & Concierge' },
  { id: 'cottages', code: 'PARK-COTTAGES-03', name: 'Forest Cottages & Chalets' },
  { id: 'restaurant', code: 'PARK-RESTAURANT-04', name: 'The Forest Pavilion Restaurant' },
  { id: 'pool', code: 'PARK-POOL-05', name: 'Crystal Swimming Pool' },
  { id: 'spa', code: 'PARK-SPA-06', name: 'The Lotus Spa Sanctuary' },
  { id: 'garden', code: 'PARK-GARDEN-07', name: 'Botanical Garden & Gazebo' },
  { id: 'adventure', code: 'PARK-ADVENTURE-08', name: 'Canopy Adventure Zone' },

  // 8 Junction Checkpoints
  { id: 'jct_arrival', code: 'PARK-JCT-ARR', name: 'Arrival Plaza Junction' },
  { id: 'jct_central', code: 'PARK-JCT-CENTRAL', name: 'Central Promenade Fork' },
  { id: 'jct_chalet_cross', code: 'PARK-JCT-CHALET', name: 'West Chalet Crossroad' },
  { id: 'jct_dining_terrace', code: 'PARK-JCT-DINING', name: 'Restaurant Pavilion Terrace' },
  { id: 'jct_pool_promenade', code: 'PARK-JCT-POOLW', name: 'Pool Promenade West' },
  { id: 'jct_pool_garden', code: 'PARK-JCT-POOLE', name: 'Pool Garden Junction' },
  { id: 'jct_adventure_trail', code: 'PARK-JCT-SOUTH', name: 'South Forest Trailhead' },
  { id: 'jct_garden_adventure', code: 'PARK-JCT-EAST', name: 'Garden Canopy Junction' },
];

async function generate() {
  console.log(`Generating ${QR_ITEMS.length} real scannable QR Code PNGs...`);

  for (const item of QR_ITEMS) {
    const pngPath = path.join(qrDir, `${item.code}.png`);
    const svgPath = path.join(qrDir, `${item.code}.svg`);

    // Standard high-contrast QR with error correction level M
    await QRCode.toFile(pngPath, item.code, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });

    await QRCode.toFile(svgPath, item.code, {
      margin: 2,
      errorCorrectionLevel: 'M'
    });

    console.log(` -> Created ${item.code}.png (${item.name})`);
  }

  // Create an index HTML file for physical sign testing
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ParkVerse Physical QR Code Signs</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0b120e; color: #fff; padding: 2rem; }
    h1 { color: #34f480; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
    .card { background: #132219; border: 1px solid rgba(255,255,255,0.15); border-radius: 1rem; padding: 1rem; text-align: center; }
    .card img { width: 160px; height: 160px; border-radius: 0.5rem; background: #fff; padding: 0.5rem; }
    .code { font-family: monospace; color: #34f480; font-weight: bold; margin-top: 0.5rem; font-size: 0.9rem; }
    .name { font-size: 0.85rem; color: #ddd; margin-top: 0.25rem; }
  </style>
</head>
<body>
  <h1>ParkVerse Physical QR Signage Gallery</h1>
  <p>Point any smartphone or laptop camera to test real live QR barcode scanning.</p>
  <div class="grid">
    ${QR_ITEMS.map(i => `
      <div class="card">
        <img src="/assets/qr/${i.code}.png" alt="${i.name}">
        <div class="code">${i.code}</div>
        <div class="name">${i.name}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(qrDir, 'index.html'), htmlContent);
  console.log(`Generated QR Gallery at ${path.join(qrDir, 'index.html')}`);
}

generate().catch(console.error);

