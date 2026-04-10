export const authStore = defineStore('authStore', {
    state: () => {
        return {
            _user: null,
            _token: null,
        }
    },
    getters: {
        user: (state) => state._user,
        token: (state) => state._token,
        headers: (state) => {
            return {
                headers: {
                    'Authorization': `Bearer ${state._token}`
                }
            }
        },
        fileHeaders: (state) => {
            return {
                headers: {
                    'Authorization': `Bearer ${state._token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        },
    },
    actions: {
        setToken(token: any) {
            this._token = token
        },
        setUserData(payload: any) {
            this._user = payload
        },
    }
})


// export const authStore = defineStore('authStore', {
//     state: () => {
//         const userCookie = useCookie('_user');
//         const tokenCookie = useCookie('_token');

//         // Əgər cookie boşdursa, bura fake məlumatları yazırıq
//         // Beləcə hər refresh-də sistem səni login kimi görəcək
//         const defaultUser = userCookie.value || { id: 1, name: "Tommy", role: "admin" };
//         const defaultToken = tokenCookie.value || "fake-token-12345";

//         return {
//             _user: defaultUser,
//             _token: defaultToken,
//         }
//     },
//     actions: {
//         setToken(token: any) {
//             this._token = token;
//             useCookie('_token').value = token;
//         },
//         setUserData(payload: any) {
//             this._user = payload;
//             useCookie('_user').value = payload;
//         },
//         logout() {
//             this._user = null;
//             this._token = null;
//             useCookie('_token').value = null;
//             useCookie('_token').value = null;
//             window.location.reload(); 
//         }
//     },
//     getters: {
//         user: (state) => state._user,
//         token: (state) => state._token,
       
//         headers: (state) => ({
//             headers: { 'Authorization': `Bearer ${state._token}` }
//         })
//     }
// })





