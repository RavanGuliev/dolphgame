<script setup lang="ts">
import {authStore} from "~/stores/authStore";
import {storeToRefs} from "pinia";
import {useHead} from "@unhead/vue";
import {loadingStore} from "~/stores/loadingStore";
const loading = loadingStore()
const {$api, $toast} = useNuxtApp()
const userAuth = authStore()
const {headers, fileHeaders, user} = storeToRefs(userAuth)
const {setUserData} = userAuth
const otp = ref()
const name = ref(user.value? user.value.name : '')
const surname = ref(user.value? user.value.surname : '')
const email = ref(user.value? user.value.email : '')
const phone = ref(user.value? user.value.phone : '')
const birthday = ref(user.value? user.value.birthday : '')
const gender = ref(user.value? user.value.gender : '')
const old_password = ref('')
const new_password = ref('')
const new_password_confirmation = ref('')
const {setLoading} = loading

const changeAccount = () => {
  setLoading(true)
  $api.put('user/account', {
    name: name.value,
    surname: surname.value,
    email: email.value,
    phone: phone.value,
    birthday: birthday.value,
    gender: gender.value,
  }, headers.value).then(res => {
    $toast.success(res.data)
    $api.get('user',  headers.value).then(res => {
      setUserData(res.data)
    })
  }).catch(err => {
    $toast.error(err)
  }).finally(() => setLoading(false))
}
const changeAvatar = (event: any) => {
  setLoading(true)
  let formData = new FormData()
  formData.append('image', event.target.files[0])
  $api.$post('user/avatar', formData, fileHeaders.value).then(res => {
    $toast.success(res.data)
    $api.get('user',  headers.value).then(res => {
      setUserData(res.data)
    })
  }).finally(() => setLoading(false))
}

const changeIdPhoto = (event: any) => {
  setLoading(true)
  let formData = new FormData()
  formData.append('image', event.target.files[0])
  $api.post('user/id_photo', formData, fileHeaders.value).then(res => {
    $toast.success(res.data)
    $api.get('user',  headers.value).then(res => {
      setUserData(res.data)
    })
  }).finally(() => setLoading(false))
}

const changePassword = () => {
  setLoading(true)
  $api.put('user/password', {
    old_password: old_password.value,
    new_password: new_password.value,
    new_password_confirmation: new_password_confirmation.value
  }, headers.value).then(res => {
    $toast.success(res.data)
    old_password.value = ''
    new_password.value = ''
    new_password_confirmation.value = ''
  }).catch(err => {
    $toast.error(err)
  }).finally(() => setLoading(false))
}

const sendOtp = () => {
  setLoading(true)
   $api.post('user/email/otp/send', {}, headers.value).then(res => {
     $toast.success(res.data)
     $('#otpSend').modal()
   }).catch(err => $toast.error(err)).finally(() => setLoading(false))
}

const checkOtp = () => {
  setLoading(true)
  $api.post('user/email/otp/check', {otp: otp.value}, headers.value).then(res => {
    $toast.success(res.data)
    $('#otpSend').modal('hide')
    $api.get('user',  headers.value).then(res => {
      setUserData(res.data)
    })
  }).catch(err => $toast.error(err)).finally(() => setLoading(false))
}

const sendSmsOtp = () => {
  setLoading(true)
  $api.post('user/sms/otp/send', {}, headers.value).then(res => {
    $toast.success(res.data)
    $('#otpSendSms').modal()
  }).catch(err => $toast.error(err)).finally(() => setLoading(false))
}

const checkOtpSms = () => {
  setLoading(true)
  $api.post('user/sms/otp/check', {otp: otp.value}, headers.value).then(res => {
    $toast.success(res.data)
    $('#otpSendSms').modal('hide')
    $api.get('user',  headers.value).then(res => {
      setUserData(res.data)
    })
  }).catch(err => $toast.error(err)).finally(() => setLoading(false))
}

useHead({
  title: 'Hesab tənzimləmələri'
})
</script>

<template>
  <div id="otpSend" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">OTP kodu daxil edin</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <input type="text" class="form-control" v-model="otp">
        </div>
        <div class="modal-footer">
          <button @click="checkOtp" type="button" class="btn btn-primary">Təsdiqlə</button>
        </div>
      </div>
    </div>
  </div>
  <div id="otpSendSms" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">OTP kodu daxil edin</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <input type="text" class="form-control" v-model="otp">
        </div>
        <div class="modal-footer">
          <button @click="checkOtpSms" type="button" class="btn btn-primary">Təsdiqlə</button>
        </div>
      </div>
    </div>
  </div>
  <div class="right-dashboard">
    <div v-if="user" class="row">
      <div class="col-md-12 text-center">
        <h5 class="tab-title"> Tənzimləmələr</h5>
      </div>
      <div class="col-md-12">
        <form @submit.prevent="changeAccount" enctype="multipart/form-data"
              method="post" class="row profil-edit">
          <div class="col-md-4">
            <label  for="name">Adınız</label>
            <input v-model="name" id="name" class="form-control" type="text">
          </div>
          <div class="col-md-4">
            <label  for="surname">Soyadınız</label>
            <input v-model="surname" id="surname" class="form-control" type="text"
            >
          </div>
          <div class="col-md-4 accept-tel">
            <label  for="email">E-mail Adresiniz</label>
            <input :readonly="user.email_verified" v-model="email" id="email" class="form-control user-phone" type="email"
                   >
            <a v-if="!user.email_verified" style="cursor: pointer" @click="sendOtp">Təsdiqlə</a>
          </div>
          <div class="col-md-3 accept-tel">
            <label for="dynamic-mask">Telefon Nömrəsi</label>
            <input :readonly="user.mobile_verified" v-model="phone" v-maska data-maska="(###)-###-##-##"
                   class="form-control user-phone" type="text"
            >
            <a v-if="!user.mobile_verified" style="cursor: pointer" @click="sendSmsOtp">Təsdiqlə</a>
          </div>
          <div class="col-md-3 accept-tel">
            <label for="birthday">Doğum tarixi</label>
            <input id="birthday" v-model="birthday"
                   class="form-control" type="date"
            >
          </div>
          <div class="col-md-3 accept-tel">
            <label for="birthday">Cinsiyyət</label>
            <select v-model="gender" class="form-control" id="birthday">
              <option value="">-</option>
              <option value="man">Kişi</option>
              <option value="woman">Qadın</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="photo">Profil Şəklini Dəyiş</label>
            <input @change.prevent="changeAvatar" name="photo" hidden id="photo" class="form-control" type="file">
            <label id="choose" class="form-control" for="photo">Profil Şəkli
              seç</label>
          </div>
          <div  v-if="!user.id_verified" class="col-md-4">
            <label for="id_photo">Vəsiqə Şəkli</label>
            <input @change.prevent="changeIdPhoto" name="photo" hidden id="id_photo" class="form-control" type="file">
            <label id="choose" class="form-control" for="id_photo">Vəsiqə şəklini
              göndər</label>
          </div>
          <div class="col-md-4">
            <label for="sign">Qeydiyyat Tarixi</label>
            <input name="photo" accept="image/*" id="sign" class="form-control"
                   type="text"
                   :value="user.register_date"
                   disabled>
          </div>
          <div class="col-md-4">
            <label for="sign">Son Giriş</label>
            <input name="photo" accept="image/*" id="sign" class="form-control"
                   type="text"
                   :value="user.last_login"
                   disabled>
          </div>
          <div class="col-md-12 text-right">
            <button class="save-form" type="submit">Yadda Saxla</button>
            <hr>
          </div>
        </form>
        <div class="col-md-12 text-center">
          <h5 class="tab-title"> Şifrəni Yenilə</h5>
        </div>
        <form @submit.prevent="changePassword" method="post" class="row change-password">
          <div class="col-md-4">
            <label class="mt-0" for="password">Mövcud Şifrə</label>
            <input v-model="old_password" id="password" class="form-control"
                   type="password">
          </div>
          <div class="col-md-4">
            <label class="mt-0" for="repassword">Yeni Şifrə</label>
            <input v-model="new_password" id="repassword" class="form-control"
                   type="password">
          </div>
          <div class="col-md-4">
            <label class="mt-0" for="repassword">Yeni Şifrə Təkrar</label>
            <input v-model="new_password_confirmation" id="repassword" class="form-control"
                   type="password">
          </div>
          <div class="col-md-12 text-right mb-15">
            <button class="save-form" type="submit">Yadda Saxla</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>