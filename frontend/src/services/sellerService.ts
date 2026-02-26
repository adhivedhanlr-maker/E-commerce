import api from './api';

export const getOnboardingStatus = async () => {
    const { data } = await api.get('/seller/onboarding/status');
    return data;
};

export const saveOnboardingDraft = async (businessProfile: any) => {
    const { data } = await api.post('/seller/onboarding/draft', { businessProfile });
    return data;
};

export const submitOnboarding = async (businessProfile: any) => {
    const { data } = await api.post('/seller/onboarding/submit', { businessProfile });
    return data;
};
