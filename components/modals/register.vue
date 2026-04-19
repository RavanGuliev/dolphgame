<script setup lang="ts">
import {authStore, basketStore, loadingStore, userStore} from "#imports";
import {useRouter} from "vue-router";
const tokenCookie = useCookie('token', {
  maxAge: 60 * 60 * 24 * 200
})
const {$api, $toast} = useNuxtApp()
const router = useRouter()
const loading = loadingStore()
const basketStore1 = basketStore()
const {setBaskets} = basketStore1
const userStore1 = userStore()
const {setNotifications} = userStore1
const name = ref('')
const surname = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const auth = authStore()
const {user, headers} = storeToRefs(auth)
const {setLoading} = loading
const {setUserData, setToken} = auth
const register = () => {
  setLoading(true)
    $api.post('register', {
      name: name.value,
      surname: surname.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
    }, headers.value).then(res => {
      tokenCookie.value = res.data
      setToken(res.data)
      $toast.success('Müvəffəqiyyətlə giriş edildi')
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
        window.location = '/user/dashboard'
      })
    }).catch(err => $toast.error(err)).finally(() => {
      setLoading(false)
    })
}
</script>

<template>
  <div class="cd-signin-modal__block js-signin-modal-block" data-type="signup">
    <form @submit.prevent="register" class="cd-signin-modal__form" method="post">
      <p class="cd-signin-modal__fieldset">
        <label
            class="cd-signin-modal__label cd-signin-modal__label--username cd-signin-modal__label--image-replace"
            for="signup-username">Ad</label>
        <input v-model="name"
               class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border"
               id="signup-username" type="text" placeholder="Ad">
      </p>

      <p class="cd-signin-modal__fieldset">
        <label
            class="cd-signin-modal__label cd-signin-modal__label--username cd-signin-modal__label--image-replace"
            for="signup-surname">Soyad</label>
        <input v-model="surname"
               class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border"
               id="signup-surname" type="text" placeholder="Soyad">
      </p>

      <p class="cd-signin-modal__fieldset">
        <label
            class="cd-signin-modal__label cd-signin-modal__label--email cd-signin-modal__label--image-replace"
            for="signup-email">E-mail</label>
        <input v-model="email"
               class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border"
               id="signup-email" type="email" placeholder="E-mail">
      </p>

      <p class="cd-signin-modal__fieldset">
        <label
            class="cd-signin-modal__label cd-signin-modal__label--username cd-signin-modal__label--image-replace"
            for="signup-phone">Telefon</label>
        <input v-maska data-maska="(###)-###-##-##" v-model="phone"
               class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border"
               id="signup-phone" type="text" placeholder="Telefon">
      </p>

      <p class="cd-signin-modal__fieldset">
        <label
            class="cd-signin-modal__label cd-signin-modal__label--password cd-signin-modal__label--image-replace"
            for="signup-password">Şifrə</label>
        <input v-model="password"
               class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border"
               id="signup-password" type="password" placeholder="Şifrə">
        <a style="cursor: pointer" class="cd-signin-modal__hide-password js-hide-password"><i
            class="fas fa-eye"></i></a>
      </p>


      <p class="cd-signin-modal__fieldset accept">
        <input checked name="accept" value="on" type="checkbox" id="accept-terms"
               class="cd-signin-modal__input ">
        <span> <nuxt-link target="_blank" to="/pages/privacy">Qanun və qaydaları </nuxt-link>oxudum və qəbul edirəm.</span>
      </p>

      <p class="cd-signin-modal__fieldset">
        <input
            class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding signup-color"
            type="submit" value="Qeydiyyatdan keç">
      </p>
    </form>
  </div>
</template>

<style scoped>

</style>