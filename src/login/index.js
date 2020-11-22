import { generateLiveApiInstance } from '../common/appId';
import { addToken } from '../common/utils/storageManager';
import axios from 'axios';

const api = generateLiveApiInstance();
async function addTokenForLogin(token) {
    try {
        const { authorize } = await api.authorize(token);
        const { landing_company_name: lcName } = authorize;
        const {
            landing_company_details: { has_reality_check: hasRealityCheck },
        } = await api.getLandingCompanyDetails(lcName);
        addToken(token, authorize, !!hasRealityCheck, ['iom', 'malta'].includes(lcName) && authorize.country === 'gb');

        document.location.href = 'bot.html';
    } catch (e) {
        throw e;
    }
    return api.disconnect();
}

$('.login100-form-btn').on('click', async () => {
    $('#emailHelper1').hide();
    $('#emailHelper2').hide();
    $('#tokenHelper').hide();
    const token = $('#access_token').val();
    const email = $('#email').val();
    let isRegisterd = false;
    if (token == '' || token == undefined) {
        return false;
    }
    if (email == '' || email == undefined) {
        return false;
    }
    axios
        .get('https://192.248.170.206/api/check_inverstor', {
            params: {
                email,
            },
        })
        .then(response => {
            isRegisterd = response.data.isRegistered;
            if (isRegisterd == 'true') {
                const user_data = api.authorize(token);
                return user_data;
            } 
            throw 'Not Registered';
            
        })
        .then(res => {
            const { authorize } = res;
            const { email: bin_email } = authorize;
            const n = email.localeCompare(bin_email);
            if (n == 0) {
                addTokenForLogin(token);
            } else {
                throw 'Email Difference';
            }
        })
        .catch(e => {
            try {
                const n = e.localeCompare('Not Registered');
                const m = e.localeCompare('Email Difference');
                if (n == 0) {
                    $('#emailHelper1').show();
                } else if (m == 0) {
                    $('#emailHelper2').show();
                }
            } catch {
                $('#tokenHelper').show();
            }
        });
});
