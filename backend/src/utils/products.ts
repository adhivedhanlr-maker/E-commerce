const products = [
    { name: 'Aura Pods Elite', image: '/images/headphones.png?v=6', description: 'Studio-grade over-ear headphones with active noise cancellation.', brand: 'Nexus Audio', category: 'Studio', price: 349, originalPrice: 429, discountPercentage: 20, countInStock: 25, rating: 4.9, numReviews: 128 },
    { name: 'Titan Phone 15', image: '/images/phone.png?v=6', description: 'The pinnacle of mobile innovation. Titanium chassis.', brand: 'Titan Tech', category: 'Studio', price: 1199, originalPrice: 1299, discountPercentage: 8, countInStock: 15, rating: 4.8, numReviews: 256 },
    { name: 'Lumina Vision Pro', image: '/images/telescope.png?v=6', description: 'Cinematic clarity with a premium carbon fiber body.', brand: 'Visionary', category: 'Optics', price: 2499, originalPrice: 2799, discountPercentage: 10, countInStock: 10, rating: 5.0, numReviews: 42 },
    { name: 'Alpha Pro Mirrorless', image: '/images/electronics_3.png?v=6', description: 'Professional full-frame camera for cinematic capture.', brand: 'Visionary', category: 'Optics', price: 3200, originalPrice: 3500, discountPercentage: 9, countInStock: 5, rating: 4.9, numReviews: 76 },
    { name: 'Eames Silhouette Sofa', image: '/images/sofa.png?v=6', description: 'An icon of mid-century design. Premium leather.', brand: 'Heritage Home', category: 'Furniture', price: 1250, originalPrice: 1500, discountPercentage: 16, countInStock: 5, rating: 4.9, numReviews: 24 },
    { name: 'Zenith Minimalist Desk', image: '/images/desk.png?v=6', description: 'Sustainable Nordic oak with hidden cable management.', brand: 'Heritage Home', category: 'Furniture', price: 850, originalPrice: 950, discountPercentage: 10, countInStock: 12, rating: 4.8, numReviews: 38 },
    { name: 'Lunar Orbital Lamp', image: '/images/lamp.png?v=6', description: 'Sculptural lighting with hand-blown frosted glass.', brand: 'Lumina Design', category: 'Furniture', price: 220, originalPrice: 280, discountPercentage: 21, countInStock: 30, rating: 4.6, numReviews: 85 },
    { name: 'Obsidian Tech Jacket', image: '/images/jacket.png?v=6', description: 'The future of utility. Triple-layered Gore-Tex Pro.', brand: 'Apex Outdoor', category: 'Wear', price: 549, originalPrice: 650, discountPercentage: 15, countInStock: 20, rating: 4.9, numReviews: 64 },
    { name: 'Merino Precision Knit', image: '/images/merino_knit.png?v=6', description: 'Engineered comfort. Fine New Zealand Merino wool.', brand: 'Apex Outdoor', category: 'Wear', price: 180, originalPrice: 180, discountPercentage: 0, countInStock: 45, rating: 4.7, numReviews: 112 },
    { name: 'Equinox Chronograph', image: '/images/watch.png?v=6', description: 'Precision timing for the modern explorer.', brand: 'Temporal', category: 'Lifestyle', price: 890, originalPrice: 1100, discountPercentage: 19, countInStock: 8, rating: 4.8, numReviews: 31 },
    { name: 'Metropolis Weekender', image: '/images/backpack.png?v=6', description: 'The ultimate travel companion. Full-grain leather.', brand: 'Metro Craft', category: 'Lifestyle', price: 420, originalPrice: 420, discountPercentage: 0, countInStock: 18, rating: 4.5, numReviews: 22 },
    { name: 'Titan Watch Ultra', image: '/images/titan_watch_pro.png?v=6', description: 'Advanced biometric tracking and rugged design.', brand: 'Titan Tech', category: 'Studio', price: 799, originalPrice: 899, discountPercentage: 11, countInStock: 15, rating: 4.5, numReviews: 88 },
    { name: 'Zenith RGB Keyboard', image: '/images/keyboard.png?v=6', description: 'Mechanical precision with customizable RGB lighting.', brand: 'KeyClick', category: 'Studio', price: 159, originalPrice: 159, discountPercentage: 0, countInStock: 30, rating: 4.9, numReviews: 120 },
    { name: 'SlimBook Ultra 14', image: '/images/laptop.png?v=6', description: 'Ultra-thin, ultra-powerful professional laptop.', brand: 'SlimBook', category: 'Studio', price: 899, originalPrice: 999, discountPercentage: 10, countInStock: 10, rating: 4.6, numReviews: 55 },
    { name: 'Velvet Emerald Chair', image: '/images/furniture_2.png?v=6', description: 'Luxury tufted armchair in deep emerald velvet.', brand: 'Heritage Home', category: 'Furniture', price: 1200, originalPrice: 1500, discountPercentage: 20, countInStock: 4, rating: 4.9, numReviews: 15 },
    { name: 'Rustic Timber Table', image: '/images/furniture_3.png?v=6', description: 'Hand-crafted solid wood coffee table.', brand: 'Heritage Home', category: 'Furniture', price: 650, originalPrice: 750, discountPercentage: 13, countInStock: 7, rating: 4.7, numReviews: 10 },
    { name: 'Floating Oak Shelf', image: '/images/furniture_4.png?v=6', description: 'Minimalist wall-mounted storage solution.', brand: 'Heritage Home', category: 'Furniture', price: 320, originalPrice: 400, discountPercentage: 20, countInStock: 25, rating: 4.6, numReviews: 30 },
    { name: 'Urban Tech Hoodie', image: '/images/apparel_1.png?v=6', description: 'Heavyweight cotton hoodie with a modern fit.', brand: 'Apex Outdoor', category: 'Wear', price: 120, originalPrice: 150, discountPercentage: 20, countInStock: 20, rating: 5.0, numReviews: 12 },
    { name: 'Aero Aviator Glass', image: '/images/lifestyle_1.png?v=6', description: 'Classic aviator frame with polarized protection.', brand: 'Visionary', category: 'Wear', price: 140, originalPrice: 160, discountPercentage: 12, countInStock: 50, rating: 4.4, numReviews: 200 },
    { name: 'Aura Smart Bottle', image: '/images/lifestyle_3.png?v=6', description: 'Hydration tracking with a glowing smart base.', brand: 'Nexus Audio', category: 'Lifestyle', price: 85, originalPrice: 110, discountPercentage: 22, countInStock: 40, rating: 4.5, numReviews: 48 },
    { name: 'Digital Microscope', image: '/images/optics_1.png?v=6', description: 'Laboratory-grade digital imaging system.', brand: 'Visionary', category: 'Optics', price: 1200, originalPrice: 1500, discountPercentage: 20, countInStock: 100, rating: 4.8, numReviews: 320 },
    { name: 'Silver Smartwatch', image: '/images/electronics_1.png?v=6', description: 'Elegant circular design with full health suite.', brand: 'Temporal', category: 'Studio', price: 350, originalPrice: 450, discountPercentage: 22, countInStock: 60, rating: 4.7, numReviews: 75 },
    { name: 'Nexus Studio Microphone', image: '/images/microphone.png?v=6', description: 'Broadcast-quality large-diaphragm capture.', brand: 'Nexus Audio', category: 'Studio', price: 249, originalPrice: 299, discountPercentage: 16, countInStock: 35, rating: 4.9, numReviews: 120 },
    { name: 'Leather Card Wallet', image: '/images/lifestyle_2.png?v=6', description: 'Full-grain leather with dedicated RFID protection.', brand: 'Metro Craft', category: 'Lifestyle', price: 85, originalPrice: 110, discountPercentage: 22, countInStock: 60, rating: 4.7, numReviews: 154 },
    { name: 'Nordic Ergo Chair', image: '/images/chair.png?v=6', description: 'Professional mesh chair with lumbar support.', brand: 'Heritage Home', category: 'Furniture', price: 450, originalPrice: 550, discountPercentage: 18, countInStock: 15, rating: 4.8, numReviews: 42 },
    { name: 'Pro Gaming Mouse', image: '/images/electronics_5.png?v=6', description: 'High-precision sensor with RGB illumination.', brand: 'Nexus Audio', category: 'Studio', price: 89, originalPrice: 110, discountPercentage: 19, countInStock: 45, rating: 4.8, numReviews: 210 },
    { name: 'Horizon 4K Drone', image: '/images/electronics_4.png?v=6', description: 'Stunning 4K resolution aerial photography.', brand: 'Visionary', category: 'Optics', price: 899, originalPrice: 999, discountPercentage: 10, countInStock: 12, rating: 4.9, numReviews: 88 },
    { name: 'Apex Pro Runners', image: '/images/shoes.png?v=6', description: 'High-performance foam for maximum energy return.', brand: 'Apex Outdoor', category: 'Wear', price: 185, originalPrice: 220, discountPercentage: 16, countInStock: 60, rating: 4.7, numReviews: 145 },
    { name: 'Creative Pen Tablet', image: '/images/electronics_2.png?v=6', description: 'Professional digital canvas with pressure stylus.', brand: 'Nexus Audio', category: 'Studio', price: 499, originalPrice: 599, discountPercentage: 16, countInStock: 200, rating: 4.5, numReviews: 412 },
    { name: 'Studio Condenser Mic', image: '/images/studio_2.png?v=6', description: 'Large-capsule recording for pristine vocals.', brand: 'Nexus Audio', category: 'Studio', price: 320, originalPrice: 400, discountPercentage: 20, countInStock: 25, rating: 4.8, numReviews: 112 },
    { name: 'SoundShape Monitor', image: '/images/studio_1.png?v=6', description: 'Active studio speaker with transparent response.', brand: 'SoundShape', category: 'Studio', price: 540, originalPrice: 650, discountPercentage: 17, countInStock: 150, rating: 4.7, numReviews: 340 },
    { name: 'Stellar Binoculars', image: '/images/binoculars.png?v=6', description: 'High-magnification for celestial observation.', brand: 'Visionary', category: 'Optics', price: 245, originalPrice: 280, discountPercentage: 12, countInStock: 45, rating: 4.9, numReviews: 89 },
    { name: 'Astro Observatory', image: '/images/optics_2.png?v=6', description: 'Advanced telescope system for deep space.', brand: 'Visionary', category: 'Optics', price: 5200, originalPrice: 6000, discountPercentage: 13, countInStock: 85, rating: 4.6, numReviews: 178 },
    { name: 'Tactical Night Vision', image: '/images/optics_3.png?v=6', description: 'Military-grade ocular enhancement system.', brand: 'Visionary', category: 'Optics', price: 1800, originalPrice: 2200, discountPercentage: 18, countInStock: 10, rating: 4.9, numReviews: 12 },
    { name: 'Minimalist Platform Bed', image: '/images/furniture_1.png?v=6', description: 'Sleek wooden frame with breathable base.', brand: 'Heritage Home', category: 'Furniture', price: 1450, originalPrice: 1800, discountPercentage: 19, countInStock: 75, rating: 4.9, numReviews: 125 }
];

const targetCategories = ['Studio', 'Optics', 'Wear', 'Lifestyle', 'Furniture'];
const brands = ['Nexus Audio', 'Visionary', 'Apex Outdoor', 'Lumina Design', 'Heritage Home', 'SoundShape', 'Metro Craft', 'Temporal'];
const adjectives = ['Pro', 'Elite', 'Ultra', 'Premium', 'Essential', 'Classic', 'Modern', 'Minimalist', 'Luxe', 'Alpha', 'Zenith', 'Apex'];
const featureTags = ['Wireless', 'Durable', 'Ergonomic', 'Sustainable', 'High-Performance', 'Precision', 'Handcrafted', 'Next-Gen'];

interface SubItem {
    name: string;
    image: string;
}

const categorySubItems: Record<string, SubItem[]> = {
    'Studio': [
        { name: 'Headphones', image: '/images/headphones.png' },
        { name: 'Smartphone', image: '/images/phone.png' },
        { name: 'Smartwatch', image: '/images/electronics_1.png' },
        { name: 'Pen Tablet', image: '/images/electronics_2.png' },
        { name: 'Mechanical Keyboard', image: '/images/keyboard.png' },
        { name: 'Pro Laptop', image: '/images/laptop.png' },
        { name: 'Titan Watch', image: '/images/titan_watch_pro.png' },
        { name: 'Condenser Microphone', image: '/images/studio_4.png' },
        { name: 'Studio Monitor', image: '/images/studio_1.png' },
        { name: 'Vocal Mic', image: '/images/studio_2.png' },
        { name: 'Gaming Mouse', image: '/images/electronics_5.png' },
        { name: 'Audio Interface', image: '/images/studio_3.png' },
        { name: 'Reference Speakers', image: '/images/studio_5.png' },
        { name: 'Analog Synth', image: '/images/studio_6.png' },
        { name: 'MIDI Controller', image: '/images/studio_7.png' },
        { name: 'Studio Subwoofer', image: '/images/studio_8.png' },
        { name: 'Hardware Rack', image: '/images/studio_9.png' },
        { name: 'Boom Arm Stand', image: '/images/studio_10.png' },
        { name: 'Acoustic Diffuser', image: '/images/studio_11.png' },
        { name: 'Recording Booth', image: '/images/studio_12.png' }
    ],
    'Furniture': [
        { name: 'Modern Sofa', image: '/images/sofa.png' },
        { name: 'Nordic Desk', image: '/images/desk.png' },
        { name: 'Ergo Chair', image: '/images/chair.png' },
        { name: 'Orbital Lamp', image: '/images/lamp.png' },
        { name: 'Platform Bed', image: '/images/furniture_1.png' },
        { name: 'Emerald Armchair', image: '/images/furniture_2.png' },
        { name: 'Timber Table', image: '/images/furniture_3.png' },
        { name: 'Oak Shelf', image: '/images/furniture_4.png' }
    ],
    'Wear': [
        { name: 'Tech Jacket', image: '/images/jacket.png' },
        { name: 'Precision Knit', image: '/images/merino_knit.png' },
        { name: 'Pro Runners', image: '/images/shoes.png' },
        { name: 'Urban Hoodie', image: '/images/apparel_1.png' },
        { name: 'Aviator Shades', image: '/images/lifestyle_1.png' }
    ],
    'Lifestyle': [
        { name: 'Metro Backpack', image: '/images/backpack.png' },
        { name: 'Equinox Watch', image: '/images/watch.png' },
        { name: 'Leather Wallet', image: '/images/lifestyle_2.png' },
        { name: 'Smart Bottle', image: '/images/lifestyle_3.png' }
    ],
    'Optics': [
        { name: 'Refractor Telescope', image: '/images/telescope.png' },
        { name: 'Full-Frame Camera', image: '/images/electronics_3.png' },
        { name: 'Arial Drone', image: '/images/electronics_4.png' },
        { name: 'Digital Microscope', image: '/images/optics_1.png' },
        { name: 'Observatory System', image: '/images/optics_2.png' },
        { name: 'Night Vision', image: '/images/optics_3.png' },
        { name: 'Stellar Binoculars', image: '/images/binoculars.png' },
        { name: 'Advanced Telescope', image: '/images/optics_4.png' },
        { name: 'Range Binoculars', image: '/images/optics_5.png' },
        { name: 'Lab Microscope', image: '/images/optics_6.png' },
        { name: 'Camouflage Scope', image: '/images/optics_7.png' },
        { name: 'Optical Prism', image: '/images/optics_8.png' },
        { name: 'Thermal Goggles', image: '/images/optics_9.png' },
        { name: 'Macro Lens', image: '/images/optics_10.png' }
    ]
};

const generatedProducts = Array.from({ length: 200 }, (_, index) => {
    const i = index + 1;
    const catLen = targetCategories.length;
    const category = targetCategories[i % catLen];
    const catIndex = Math.floor(i / catLen); // Unique index within this category

    const subItems = categorySubItems[category] || categorySubItems['Lifestyle'];
    const subItemIndex = catIndex % subItems.length;
    const subItem = subItems[subItemIndex];
    
    const brand = brands[i % brands.length];
    const adj = adjectives[i % adjectives.length];
    const tag = featureTags[i % featureTags.length];
    
    // Variation Math: Use primes (137, 17) for visual dispersion within the sub-item group
    const variationIndex = Math.floor(catIndex / subItems.length);
    const hue = (variationIndex * 137) % 360; 
    const br = 95 + (variationIndex * 17) % 25; // Brightness between 95% and 120%

    // Image URL with v=9 cache-busting and visual filters
    const image = `${subItem.image}?v=9&hue=${hue}&br=${br}`;

    return {
        name: `${brand} ${subItem.name} ${adj} G${i}`,
        image,
        description: `The ${brand} ${subItem.name} from the ${adj} line. This ${tag.toLowerCase()} product for ${category.toLowerCase()} enthusiasts is designed for those who value both style and high-end performance.`,
        brand,
        category,
        price: 50 + (i % 300) + 19.99,
        originalPrice: 70 + (i % 300) + 29.99,
        discountPercentage: 10 + (i % 25),
        countInStock: 5 + (i % 90),
        rating: 4.2 + ((i % 8) / 10),
        numReviews: 10 + (i % 150),
        specifications: { 'Quality': 'Premium Grade', 'Edition': `${adj} ${tag}`, 'Batch': `X-${i}` }
    };
});

const finalProducts = [...products, ...generatedProducts];

export default finalProducts;
