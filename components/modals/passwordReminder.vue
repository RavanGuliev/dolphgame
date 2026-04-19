<script setup lang="ts">


const {$api, $toast} = useNuxtApp()
const router = useRouter()
const tokenCookie = useCookie('token', {
  maxAge: 60 * 60 * 24 * 200
})
const store = authStore()
const loading = loadingStore()
const userStore1 = userStore()
const basketStore1 = basketStore()
const {setNotifications} = userStore1
const {setBaskets} = basketStore1
const {setLoading} = loading
const {headers} = storeToRefs(store)
const {setToken, setUserData} = store
const step = ref(false)
const email = ref('')
const otp = ref('')
const password = ref('')
const password_confirmation = ref('')
const eye1 = ref(true)
const eye2 = ref(true)
const pass1 = ref(true)
const pass2 = ref(true)
const first = () => {
  $api.post('forgot-password', {email: email.value}).then(res => {
    $toast.success(res.data)
    step.value = true
  }).catch(err => {
    $toast.error(err)
  })
}
const last = () => {
  setLoading(true)
  $api.post('forgot-password/otp', {
    email: email.value,
    otp: otp.value,
    password: password.value,
    password_confirmation: password_confirmation.value,
  }).then(res => {
    tokenCookie.value = res.data
    setToken(res.data)
    $('.js-signin-modal').removeClass('cd-signin-modal--is-visible')
    $api.get('user', headers.value).then(res => {
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
const changeEye1 = () => {
  eye1.value = !eye1.value
  pass1.value = !pass1.value

}
const changeEye2 = () => {
  eye2.value = !eye2.value
  pass2.value = !pass2.value
}
</script>

<template>
  <div>
    <div v-if="!step" class="cd-signin-modal__block js-signin-modal-block " data-type="reset">
      <p class="cd-signin-modal__message">Şifrənizi unutmusunuz? Zəhmət olmasa e-poçt adresinizi daxil
        edin. Yeni bir şifrə yaratmaq üçün bir məktub alacaqsınız.</p>

      <form @submit.prevent="first" method="post" class="cd-signin-modal__form">
        <p class="cd-signin-modal__fieldset">
          <label
              class="cd-signin-modal__label cd-signin-modal__label--email cd-signin-modal__label--image-replace"
              for="reset-email">E-mail</label>
          <input v-model="email" name="email"
                 class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border"
                 id="reset-email" type="email" placeholder="E-mail">
        </p>

        <p class="cd-signin-modal__fieldset">
          <input
              class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding signup-color"
              type="submit" value="Şifrəni yenilə">
        </p>
      </form>

      <p class="cd-signin-modal__bottom-message js-signin-modal-trigger"><a href="#0" data-signin="login">Giriş
        bölümünə dön</a></p>
    </div>

    <!-- new pass password form -->
    <div v-else class="cd-signin-modal__block js-signin-modal-block cd-signin-modal__block--is-selected"
         data-type="newpass">
      <p class="cd-signin-modal__message">Şifrənizi uğurla sıfırlandı. Zəhmət olmasa yeni şifrənizi daxil
        edin.</p>

      <form @submit.prevent="last" class="cd-signin-modal__form">
        <p class="cd-signin-modal__fieldset">
          <label
              class="cd-signin-modal__label cd-signin-modal__label--email cd-signin-modal__label--image-replace"
              for="newPass">OTP kod</label>
          <input v-model="otp"
              class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border"
              id="newPass" type="text" placeholder="OTP kod">
        </p>
        <p class="cd-signin-modal__fieldset">
          <label
              class="cd-signin-modal__label cd-signin-modal__label--email cd-signin-modal__label--image-replace"
              for="newPass">Yeni şifrə</label>
          <input :type="!pass1 ? 'text' : 'password'" v-model="password"
              class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border"
              id="newPass" type="password" placeholder="Yeni şifrə">
          <a @click="changeEye1" style="cursor: pointer" class="cd-signin-modal__hide-password js-hide-password"><i  :class="{'fa-eye': eye1, 'fa-eye-slash': !eye1}"
              class="fas fa-eye"></i></a>
        </p>

        <p class="cd-signin-modal__fieldset">
          <label
              class="cd-signin-modal__label cd-signin-modal__label--email cd-signin-modal__label--image-replace"
              for="renewPass">Yeni şifrə təkrar</label>
          <input :type="!pass2 ? 'text' : 'password'" v-model="password_confirmation"
              class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border"
              id="renewPass" type="password" placeholder="Yeni şifrə təkrar">
          <a @click="changeEye2" style="cursor: pointer" class="cd-signin-modal__hide-password js-hide-password"><i :class="{'fa-eye': eye2, 'fa-eye-slash': !eye2}"
              class="fas"></i></a>
        </p>

        <p class="cd-signin-modal__fieldset">
          <input
              class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding signup-color"
              type="submit" value="Şifrəni yenilə">
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>