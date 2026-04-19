export const userStore = defineStore('userStore', {
    state: () => {
        return {
            _notifications: null,
            _notifications_count: 0
        }
    },
    getters: {
        notifications: (state) => state._notifications,
        notifications_count: (state) => state._notifications_count,
    },
    actions: {
        setNotifications(payload: any, count: any) {
            this._notifications = payload
            this._notifications_count = count
        }
    }
})