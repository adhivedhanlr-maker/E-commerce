export interface Product {
    _id: string;
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
    user: string;
    specifications?: Record<string, string>;
}
