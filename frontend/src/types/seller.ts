export interface IBusinessProfile {
    businessName: string;
    tradeName: string;
    businessType: 'Proprietorship' | 'Partnership' | 'LLP' | 'Pvt Ltd' | 'OPC';
    dateOfIncorporation: string;
    natureOfBusiness: 'Retailer' | 'Wholesaler' | 'Manufacturer' | 'Service Provider';
    category: string;
    panNumber: string;
    gstin?: string;
    cin?: string;
    msmeNumber?: string;
    ownerName: string;
    aadhaarNumber: string;
    mobileNumber: string;
    address: string;
    bankDetails: {
        accountHolderName: string;
        bankName: string;
        accountNumber: string;
        ifscCode: string;
        upiId?: string;
    };
    operationalDetails: {
        warehouseAddress: string;
        pickupAddress: string;
        returnAddress: string;
        estimatedTurnover: string;
        commissionAccepted: boolean;
    };
    documents?: {
        panCard?: string;
        gstCertificate?: string;
        incorporationCertificate?: string;
        aadhaarCard?: string;
        photo?: string;
        cancelledCheque?: string;
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
