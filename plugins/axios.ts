import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
     const defaultUrl = "https://rest.dolphgame.com/api/";

    let api = axios.create({
        baseURL: defaultUrl
    });
    api.interceptors.response.use((response) => {
        return response.data
    }, (error) => {
        if (error.response.status == 422) {
            if (isNaN(Object.keys(error.response.data.errors)[0])) {
                return Promise.reject(error.response.data.errors[Object.keys(error.response.data.errors)[0]][0])
            } else {
                return Promise.reject(error.response.data.errors[0][0])
            }
        }
        if (error.response.status == 401) {
            useCookie('token').value = ''
            return Promise.reject('Zəhmət olmasa sayta daxil olun')
        }
        if (error.response.status == 403) {
            return Promise.reject('Bunu etməyə icazəniz yoxdur.')
        }
        if (error.response.status == 429) {
            return Promise.reject(error.response.data)
        }
    })
    return {
        provide: {
            api: api,
        },
    };
});