<script setup lang="ts">
import {userStore} from "~/stores/userStore";

const {$api, $toast} = useNuxtApp()
import {authStore} from "~/stores/authStore";
import {loadingStore} from "~/stores/loadingStore";
import {storeToRefs} from "pinia";
import {basketStore} from "~/stores/basketStore";
import {useRouter} from "vue-router";
const router = useRouter()
const tokenCookie = useCookie('token', {
  maxAge: 60 * 60 * 24 * 200
})
const email = ref('')
const password = ref('')
const store = authStore()
const {setToken, setUserData} = store
const loading = loadingStore()
const userStore1 = userStore()
const basketStore1 = basketStore()
const {setNotifications} = userStore1
const {setBaskets} = basketStore1
const {setLoading} = loading
const {headers} = storeToRefs(store)
const postLogin = () => {
  setLoading(true)
  $api.post('login', {
    email: email.value,
    password: password.value,
  }).then(res => {
    tokenCookie.value = res.data
    setToken(res.data)
    $('.js-signin-modal').removeClass('cd-signin-modal--is-visible')
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
      window.location = '/user/dashboard'
    })
  }).catch(err => {
   $toast.error(err)
  }).finally(() => setLoading(false))
}
</script>

<template>
  <div class="cd-signin-modal__block js-signin-modal-block" data-type="login">
    <form @submit.prevent="postLogin" method="post" class="cd-signin-modal__form">
      <p class="cd-signin-modal__fieldset">
        <label
            class="cd-signin-modal__label cd-signin-modal__label--email cd-signin-modal__label--image-replace"
            for="signin-email">E-mail</label>
        <input v-model="email"
               class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border"
               id="signin-email" type="email" placeholder="E-mail">
      </p>

      <p class="cd-signin-modal__fieldset">
        <label
            class="cd-signin-modal__label cd-signin-modal__label--password cd-signin-modal__label--image-replace"
            for="signin-password">Şifrə</label>
        <input v-model="password" name="password"
               class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border"
               id="signin-password" type="password" placeholder="Şifrə">
        <a style="cursor: pointer" class="cd-signin-modal__hide-password js-hide-password"><i
            class="fas fa-eye"></i></a>
      </p>

      <p class="cd-signin-modal__fieldset">
        <input class="cd-signin-modal__input cd-signin-modal__input--full-width" type="submit"
               value="Daxil ol">
      </p>
    </form>

    <p class="cd-signin-modal__bottom-message js-signin-modal-trigger"><a href="#0" data-signin="reset">Şifrəni
      Unutmusan?</a></p>
  </div>
</template>

<style scoped>

</style>