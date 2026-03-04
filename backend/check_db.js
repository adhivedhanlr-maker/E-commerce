const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to DB');
    const Product = mongoose.connection.collection('products');
    const products = await Product.find({}).toArray();
    console.log(`Found ${products.length} products`);
    let badProducts = products.filter(p => typeof p._id === 'string' || typeof p._id === 'number');
    console.log('Products with string/number _id:', badProducts.length);
    if (badProducts.length > 0) {
        console.log('Example bad product:', badProducts[0]);
    }

    // Check if any product has id matching 0.3693702057851125
    let specificProduct = products.find(p => String(p._id) === "0.3693702057851125");
    if (specificProduct) {
        console.log('Found specific product!', specificProduct);
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
