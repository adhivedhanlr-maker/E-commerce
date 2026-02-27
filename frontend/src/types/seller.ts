export interface IBusinessProfile {
    businessName: string;
    tradeName?: string;
    businessType?: 'Proprietorship' | 'Partnership' | 'LLP' | 'Pvt Ltd' | 'OPC';
    dateOfIncorporation?: string;
    natureOfBusiness: 'Retailer' | 'Wholesaler' | 'Manufacturer' | 'Service Provider' | 'E-commerce';
    category: string;
    panNumber: string;
    gstin?: string;
    cin?: string;
    msmeNumber?: string;
    licenseNumber?: string;
    udyamNumber?: string;
    ownerName: string;
    aadhaarNumber?: string;
    mobileNumber: string;
    isMobileVerified?: boolean;
    address?: string; // Residential - renamed in form to shopAddress but keeping for compatibility if needed
    shopAddress?: {
        street: string;
        city: string;
        district: string;
        state: string;
        pincode: string;
    };
    bankDetails: {
        accountHolderName: string;
        bankName: string;
        accountNumber: string;
        ifscCode: string;
        upiId?: string;
    };
    operationalDetails: {
        warehouseAddress?: string;
        pickupAddress?: string;
        returnAddress?: string;
        estimatedTurnover?: string;
        commissionAccepted: boolean;
        registrationId?: string;
    };
    documents?: {
        panCard?: string;
        gstCertificate?: string;
        incorporationCertificate?: string;
        aadhaarCard?: string;
        photo?: string;
        cancelledCheque?: string;
        shopLogo?: string;
        idProof?: string;
        digitalSignature?: string;
    };
}

export interface ISellerUser {
    _id: string;
    name: string;
    email: string;
    onboardingStatus: 'none' | 'draft' | 'pending' | 'approved' | 'rejected';
    businessProfile?: IBusinessProfile;
    createdAt: string;
}
