export const generalStore = defineStore('generalStore', {
    state: () => {
        return {
            _data : {},
            _mod: ''
        }
    },
    getters: {
        data : (state) => state._data,
        mod : (state) => state._mod,
    },
    actions: {
        setData(payload: any) {
            this._data = payload
        },
        setMod(payload: any) {
            this._mod = payload
        }
    }
})