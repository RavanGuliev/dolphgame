export const basketStore = defineStore('basketStore', {
    state: () => {
        return {
            _baskets: null,
            _baskets_count: 0,
        }
    },
    getters: {
        baskets: (state) => state._baskets,
        baskets_count: (state) => state._baskets_count,
    },
    actions: {
        setBaskets(payload: any) {
            this._baskets = payload
            this._baskets_count = payload.length
        },
    }
})