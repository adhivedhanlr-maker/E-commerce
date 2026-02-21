import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentCategory?: mongoose.Types.ObjectId;
}

const categorySchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        image: { type: String },
        parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
