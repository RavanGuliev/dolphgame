<template>
  <div>
    <loading-bar v-if="loading"/>
    <NuxtLayout>
      <NuxtLoadingIndicator color="#f9a533"/>
      <header-section/>
      <NuxtPage/>
      <footer-section/>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import {loadingStore} from "~/stores/loadingStore";
import HeaderSection from "~/components/layouts/HeaderSection.vue";
import FooterSection from "~/components/layouts/FooterSection.vue";
import LoadingBar from "~/components/modules/loadingBar.vue";
import {storeToRefs} from "pinia";
import {authStore} from "~/stores/authStore";
import {useCookie} from "#app/composables/cookie";
import {userStore} from "~/stores/userStore";
import {basketStore} from "~/stores/basketStore";
import {generalStore} from "~/stores/generalStore";
const head = useNuxtApp().vueApp._context.provides.usehead
const loadingStore1 = loadingStore()
const general = generalStore()
const {setData} = general
const {mod} = storeToRefs(general)
const {data} = storeToRefs(general)
const userAuthStore = authStore()
const userStore1 = userStore()
const basketStore1 = basketStore()
const {setNotifications} = userStore1
const {loading} = storeToRefs(loadingStore1)
const {setUserData, setToken} = userAuthStore
const {setBaskets} = basketStore1
const {headers} = storeToRefs(userAuthStore)
const cookie = useCookie('token')
const mode = useState('mode', () => {
  if (useCookie('mode')) {
    return useCookie('mode').value
  } else {
    return mod.value
  }
})

const {$api} = useNuxtApp()
const dat = await $api.get('public/general')
setData(dat.data)
useHead({
  link: [
    {href: dat.data.fav, rel: 'icon'}
  ]
})
if (cookie.value) {
  setToken(cookie.value)
  try {
    const u =  await $api.get('user', headers.value)
    setUserData(u.data)
    $api.get('user/notifications?count=5', headers.value).then(res => {
      $api.get('user/notifications/count', headers.value).then(response => {
        setNotifications(res.data, response.data)
      })

    })
    $api.get('user/basket', headers.value).then(res => {
      setBaskets(res.data)
    })
  } catch (exception) {
      console.log(exception)
  }
}


watch(mod, (newVal, oldValue) => {
  if (oldValue === 'dark' || oldValue === '') {
    let existingLinks = document.querySelectorAll('#dark');
    existingLinks.forEach(link => link.parentNode.removeChild(link));
  }

  let linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = '/css/' + newVal + '.css';
  if (newVal === 'dark') {
    linkElement.id = 'dark';
  }
  document.head.appendChild(linkElement);
})






</script>