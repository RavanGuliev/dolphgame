import {defineStore} from "pinia";

export const paginateStore = defineStore('paginateStore', {
    state: () => {
        return {
            _headers: {},
            _data: {},
        }
    },
    getters: {
        headers: (state) => state._headers,
        data: (state) => state._data,
    },
    actions: {
        setPaginateData(data: any) {
            this._data = data
        }
    }
})