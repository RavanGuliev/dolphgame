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
//         return {
//             // Bura fake data qoyuruq ki, sistem səni login olmuş saysın
//             _user: { 
//                 id: 1, 
//                 name: 'Tommy', 
//                 email: 'test@test.com' 
//             },
//             _token: 'test_token_12345',
//         }
//     },
//     getters: {
//         user: (state) => state._user,
//         token: (state) => state._token,
//         headers: (state) => {
//             return {
//                 headers: {
//                     'Authorization': `Bearer ${state._token}`
//                 }
//             }
//         },
//         fileHeaders: (state) => {
//             return {
//                 headers: {
//                     'Authorization': `Bearer ${state._token}`,
//                     'Content-Type': 'multipart/form-data'
//                 }
//             }
//         },
//     },
//     actions: {
//         setToken(token: any) {
//             this._token = token
//         },
//         setUserData(payload: any) {
//             this._user = payload
//         },
//     }
// })