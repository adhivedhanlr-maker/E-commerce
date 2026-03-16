const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkProducts() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const productSchema = new mongoose.Schema({
            name: { type: String, required: true },
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        });

        const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

        const products = await Product.find({}).lean();
        console.log('Total Products:', products.length);
        
        products.forEach(p => {
            console.log(`Product: ${p.name}, ID: ${p._id}, OwnerID: ${p.user || 'NONE'}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkProducts();
