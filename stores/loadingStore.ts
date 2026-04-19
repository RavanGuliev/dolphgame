export const loadingStore = defineStore('loadingStore', {
    state: () => {
        return {
            _isLoading : false
        }
    },
    getters: {
        loading: (state) => state._isLoading
    },
    actions: {
        setLoading(data:boolean) {
            this._isLoading = data
        }
    }
})