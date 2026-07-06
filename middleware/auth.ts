import {useCookie} from "#app/composables/cookie";

export default defineNuxtRouteMiddleware(() => {
    const token = useCookie('token')
    const {$toast} = useNuxtApp()
    if (!token.value) {
        if (process.client) {
            $toast.warning('Zəhmət olmasa əvvəlcə şəxsi kabinetə giriş edin')
            window.dispatchEvent(new CustomEvent('dolph-open-auth', { detail: 'login' }))
        }
        return navigateTo('/')
    }
    return;
}) 