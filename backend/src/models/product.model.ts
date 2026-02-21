import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    rating: number;
    numReviews: number;
    images: string[];
    category: string;
    brand: string;
    countInStock: number;
    variants: {
        size?: string;
        color?: string;
        stock: number;
    }[];
    specifications: {
        [key: string]: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const productSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        originalPrice: { type: Number, required: true, default: 0 },
        discountPercentage: { type: Number, default: 0 },
        rating: { type: Number, required: true, default: 0 },
        numReviews: { type: Number, required: true, default: 0 },
        images: [{ type: String, required: true }],
        category: { type: String, required: true },
        brand: { type: String, required: true },
        countInStock: { type: Number, required: true, default: 0 },
        variants: [
            {
                size: { type: String },
                color: { type: String },
                stock: { type: Number, default: 0 },
            },
        ],
        specifications: {
            type: Map,
            of: String,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
