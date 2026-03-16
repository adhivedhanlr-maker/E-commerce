const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend/.env') });

async function checkProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const Product = mongoose.model('Product', new mongoose.Schema({
            name: String,
            user: mongoose.Schema.Types.ObjectId
        }));

        const products = await Product.find({}).lean();
        console.log('Total Products:', products.length);
        
        products.forEach(p => {
            console.log(`Product: ${p.name}, OwnerID: ${p.user || 'NONE'}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkProducts();
