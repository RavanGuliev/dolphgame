<script setup lang="ts">
import {authStore, basketStore, loadingStore, userStore} from "#imports";
import {useRoute, useRouter} from "vue-router";

const {$api, $toast} = useNuxtApp()
const tokenCookie = useCookie('token', {
  maxAge: 60 * 60 * 24 * 200
})
const route = useRoute()
const router = useRouter()
const auth =  authStore()
const loading = loadingStore()
const userStore1 = userStore()
const basketStore1 = basketStore()
const {setLoading} = loading
const {headers} = storeToRefs(auth)
const {setToken, setUserData} = auth
const {setNotifications} = userStore1
const {setBaskets} = basketStore1
setLoading(true)
$api.post('social-network/token/google', {token: route.query.token}).then(res => {
  tokenCookie.value = res.data
  setToken(res.data)
  $api.get('user',  headers.value).then(res => {
    setUserData(res.data)
    $api.get('user/notifications?count=5', headers.value).then(res => {
      $api.get('user/notifications/count', headers.value).then(response => {
        setNotifications(res.data, response.data)
      })
    })
    $api.get('user/basket', headers.value).then(res => {
      setBaskets(res.data)
    })
    $toast.success('Müvəffəqiyyətlə giriş edildi')
    router.push('/user/dashboard')
  })
}).catch(err => {
  $toast.error('Xəta baş verdi')
  window.location = '/'
}).finally(() => setLoading(false))

</script>

<template>

</template>

<style scoped>

</style>