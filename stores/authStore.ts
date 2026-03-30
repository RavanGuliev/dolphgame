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