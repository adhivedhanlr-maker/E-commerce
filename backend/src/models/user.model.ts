import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IBusinessProfile {
    // Step 1: Basic Details
    businessName?: string;
    tradeName?: string;
    businessType?: 'Proprietorship' | 'Partnership' | 'LLP' | 'Pvt Ltd' | 'OPC';
    dateOfIncorporation?: Date;
    natureOfBusiness?: 'Retailer' | 'Wholesaler' | 'Manufacturer' | 'Service Provider';
    category?: string;

    // Step 2: Tax & Legal
    panNumber?: string;
    gstin?: string;
    cin?: string;
    msmeNumber?: string;
    documents?: {
        panCard?: string;
        gstCertificate?: string;
        incorporationCertificate?: string;
        aadhaarCard?: string;
        photo?: string;
        cancelledCheque?: string;
    };

    // Step 3: Owner Details
    ownerName?: string;
    aadhaarNumber?: string;
    mobileNumber?: string;
    isMobileVerified?: boolean;
    isEmailVerified?: boolean;
    address?: string;

    // Step 4: Bank Details
    bankDetails?: {
        accountHolderName?: string;
        bankName?: string;
        accountNumber?: string;
        ifscCode?: string;
        upiId?: string;
    };

    // Step 5: Operations
    operationalDetails?: {
        warehouseAddress?: string;
        pickupAddress?: string;
        returnAddress?: string;
        shippingPartner?: string;
        estimatedTurnover?: string;
        commissionAccepted?: boolean;
    };
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'admin' | 'seller';
    isActive: boolean;
    onboardingStatus: 'none' | 'draft' | 'pending' | 'approved' | 'rejected';
    businessProfile?: IBusinessProfile;
    matchPassword(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['user', 'admin', 'seller'],
            default: 'user',
        },
        isActive: { type: Boolean, default: true },
        onboardingStatus: {
            type: String,
            enum: ['none', 'draft', 'pending', 'approved', 'rejected'],
            default: 'none'
        },
        businessProfile: {
            businessName: String,
            tradeName: String,
            businessType: { type: String, enum: ['Proprietorship', 'Partnership', 'LLP', 'Pvt Ltd', 'OPC'] },
            dateOfIncorporation: Date,
            natureOfBusiness: { type: String, enum: ['Retailer', 'Wholesaler', 'Manufacturer', 'Service Provider'] },
            category: String,
            panNumber: String,
            gstin: String,
            cin: String,
            msmeNumber: String,
            documents: {
                panCard: String,
                gstCertificate: String,
                incorporationCertificate: String,
                aadhaarCard: String,
                photo: String,
                cancelledCheque: String,
            },
            ownerName: String,
            aadhaarNumber: String,
            mobileNumber: String,
            isMobileVerified: { type: Boolean, default: false },
            isEmailVerified: { type: Boolean, default: false },
            address: String,
            bankDetails: {
                accountHolderName: String,
                bankName: String,
                accountNumber: String,
                ifscCode: String,
                upiId: String,
            },
            operationalDetails: {
                warehouseAddress: String,
                pickupAddress: String,
                returnAddress: String,
                shippingPartner: String,
                estimatedTurnover: String,
                commissionAccepted: { type: Boolean, default: false },
            }
        }
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (this: any) {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
