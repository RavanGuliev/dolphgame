import {useCookie} from "#app/composables/cookie";

export default defineNuxtRouteMiddleware(() => {
    const token = useCookie('token')
    const {$toast} = useNuxtApp()
    if (!token.value) {
        if (process.client) {
            document.getElementById('login-button').click()
            $toast.warning('Zəhmət olmasa əvvəlcə şəxsi kabinetə giriş edin')
        }
         return navigateTo('/')
    }
    return;

}) 