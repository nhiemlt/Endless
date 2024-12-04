import axios from 'axios';

const GHN_API_BASE_URL = "https://online-gateway.ghn.vn";
const GHN_API_TOKEN = "7bb9af15-8fb6-11ef-a205-de063ca823db";
const SHOP_ID = "5404381";

const GHNService = {

    getProvinces: async () => {
        try {
            const response = await axios.get(`${GHN_API_BASE_URL}/shiip/public-api/master-data/province`, {
                headers: {
                    'Token': GHN_API_TOKEN,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching provinces:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    getDistrictsByProvince: async (provinceId) => {
        try {
            const response = await axios.post(`${GHN_API_BASE_URL}/shiip/public-api/master-data/district`, 
                {
                    province_id: Number(provinceId)
                },
                {
                    headers: {
                        'Token': GHN_API_TOKEN,
                        'Content-Type': 'application/json'
                    }
                });
            return response.data;
        } catch (error) {
            console.error('Error fetching districts:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    getWardsByDistrict: async (districtId) => {
        try {
            const response = await axios.post(`${GHN_API_BASE_URL}/shiip/public-api/master-data/ward`, 
                {
                    district_id: Number(districtId)
                },
                {
                    headers: {
                        'Token': GHN_API_TOKEN,
                        'Content-Type': 'application/json'
                    }
                });
            return response.data;
        } catch (error) {
            console.error('Error fetching wards:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    calculateShippingFee: async ({
        toDistrictId,
        toWardCode,
        weight,
        items,
        serviceTypeId = 2,
    }) => {
        try {
            const response = await axios.post(
                `${GHN_API_BASE_URL}/shiip/public-api/v2/shipping-order/fee`,
                {
                    service_type_id: serviceTypeId,
                    to_district_id: toDistrictId,
                    to_ward_code: toWardCode,
                    weight: weight,
                    items: items, 
                },
                {
                    headers: {
                        'Token': GHN_API_TOKEN,
                        'ShopId': SHOP_ID,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('API Error:', error.response.data);
            } else {
                console.error('Network or configuration error:', error.message);
            }
            throw error; 
        }
    }
};

export default GHNService;
