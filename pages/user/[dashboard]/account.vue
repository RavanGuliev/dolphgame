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
const activeTab = ref('profile')
const passwordRules = computed(() => ({
  length: new_password.value.length >= 8,
  case: /[a-z]/.test(new_password.value) && /[A-Z]/.test(new_password.value),
  digit: /\d/.test(new_password.value),
  special: /[^A-Za-z0-9]/.test(new_password.value),
}))

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
  <div v-if="user" class="right-dashboard space-y-4 text-left">

    <!-- Settings tab nav -->
    <div class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-1 inline-flex flex-wrap gap-1">
      <button type="button" @click="activeTab = 'profile'"
              class="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[12.5px] font-bold transition"
              :class="activeTab === 'profile' ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-500' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Profil
      </button>
      <button type="button" @click="activeTab = 'password'"
              class="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[12.5px] font-bold transition"
              :class="activeTab === 'password' ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-500' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        Şifrə
      </button>
    </div>

    <!-- ============ PANEL: Profile ============ -->
    <section v-show="activeTab === 'profile'" class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden">
      <div class="px-5 md:px-6 py-4 border-b border-ink-100 dark:border-ink-800 flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-500 grid place-items-center">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </span>
        <div>
          <h2 class="text-[14px] font-black text-ink-900 dark:text-white">Şəxsi məlumatlar</h2>
          <p class="text-[11.5px] text-ink-500 dark:text-ink-400">Hesab profilini idarə et</p>
        </div>
      </div>

      <form @submit.prevent="changeAccount" enctype="multipart/form-data" method="post" class="p-5 md:p-6 space-y-5">
        <!-- Avatar uploader -->
        <div class="flex items-center gap-4 flex-wrap">
          <span class="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-[#FF6A2E] grid place-items-center text-white font-black text-[28px] shadow-pop ring-2 ring-white dark:ring-ink-900 overflow-hidden shrink-0">
            <img v-if="user.avatar" :src="user.avatar" :alt="user.full_name" class="w-full h-full object-cover"/>
            <template v-else>{{ (user.full_name || 'DG').slice(0, 2).toUpperCase() }}</template>
          </span>
          <div class="min-w-0 flex-1">
            <h3 class="text-[13.5px] font-black text-ink-900 dark:text-white">Profil şəkli</h3>
            <p class="text-[11.5px] text-ink-500 dark:text-ink-400 mt-0.5">JPG, PNG və ya WEBP formatında şəkil yüklə.</p>
            <div class="mt-2">
              <input @change.prevent="changeAvatar" name="photo" hidden id="photo" type="file">
              <label for="photo" class="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-[12px] font-bold transition shadow-pop active:scale-95 cursor-pointer">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Şəkil yüklə
              </label>
            </div>
          </div>
        </div>

        <div class="h-px bg-ink-100 dark:bg-ink-800"></div>

        <!-- Form grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11.5px] font-black text-ink-700 dark:text-ink-200 mb-1.5" for="name">Ad</label>
            <input v-model="name" id="name" type="text" class="w-full h-11 px-3.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 focus:ring-2 focus:ring-brand-500/15 transition text-[13px]"/>
          </div>
          <div>
            <label class="block text-[11.5px] font-black text-ink-700 dark:text-ink-200 mb-1.5" for="surname">Soyad</label>
            <input v-model="surname" id="surname" type="text" class="w-full h-11 px-3.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 focus:ring-2 focus:ring-brand-500/15 transition text-[13px]"/>
          </div>
          <div class="md:col-span-2">
            <label class="block text-[11.5px] font-black text-ink-700 dark:text-ink-200 mb-1.5" for="email">E-mail</label>
            <div class="relative">
              <input :readonly="user.email_verified" v-model="email" id="email" type="email"
                     class="w-full h-11 px-3.5 pr-24 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 focus:ring-2 focus:ring-brand-500/15 transition text-[13px]"
                     :class="{'cursor-not-allowed': user.email_verified}"/>
              <span v-if="user.email_verified" class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 h-6 px-2 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-black tracking-wider uppercase ring-1 ring-emerald-500/20">
                <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Təsdiq
              </span>
              <button v-else type="button" @click="sendOtp" class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center h-7 px-2.5 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-[10.5px] font-black transition">Təsdiqlə</button>
            </div>
          </div>
          <div>
            <label class="block text-[11.5px] font-black text-ink-700 dark:text-ink-200 mb-1.5" for="phone">Telefon</label>
            <div class="relative">
              <input :readonly="user.mobile_verified" v-model="phone" v-maska data-maska="(###)-###-##-##" id="phone" type="text"
                     class="w-full h-11 px-3.5 pr-24 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 focus:ring-2 focus:ring-brand-500/15 transition text-[13px] tabular-nums"
                     :class="{'cursor-not-allowed': user.mobile_verified}"/>
              <span v-if="user.mobile_verified" class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 h-6 px-2 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-black tracking-wider uppercase ring-1 ring-emerald-500/20">
                <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Təsdiq
              </span>
              <button v-else type="button" @click="sendSmsOtp" class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center h-7 px-2.5 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-[10.5px] font-black transition">Təsdiqlə</button>
            </div>
          </div>
          <div>
            <label class="block text-[11.5px] font-black text-ink-700 dark:text-ink-200 mb-1.5" for="birthday">Doğum tarixi</label>
            <input id="birthday" v-model="birthday" type="date" class="w-full h-11 px-3.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 focus:ring-2 focus:ring-brand-500/15 transition text-[13px]"/>
          </div>
          <div>
            <label class="block text-[11.5px] font-black text-ink-700 dark:text-ink-200 mb-1.5" for="gender">Cinsiyyət</label>
            <select v-model="gender" id="gender" class="w-full h-11 px-3.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 focus:ring-2 focus:ring-brand-500/15 transition text-[13px]">
              <option value="">-</option>
              <option value="man">Kişi</option>
              <option value="woman">Qadın</option>
            </select>
          </div>
        </div>

        <!-- ID photo (only when not verified) -->
        <div v-if="!user.id_verified" class="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 ring-1 ring-amber-500/20 flex items-center gap-3 flex-wrap">
          <div class="min-w-0 flex-1">
            <h3 class="text-[13px] font-black text-ink-900 dark:text-white">Vəsiqə şəkli</h3>
            <p class="text-[11.5px] text-ink-500 dark:text-ink-400 mt-0.5">Hesabını təsdiqləmək üçün vəsiqə şəklini göndər.</p>
          </div>
          <input @change.prevent="changeIdPhoto" name="id_photo" hidden id="id_photo" type="file">
          <label for="id_photo" class="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-bold transition cursor-pointer shrink-0">Vəsiqə şəklini göndər</label>
        </div>

        <!-- Read-only info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-ink-100 dark:border-ink-800">
          <div class="flex items-center gap-2.5 p-3 rounded-xl bg-ink-50 dark:bg-ink-800/60">
            <span class="w-8 h-8 rounded-lg bg-white dark:bg-ink-900 text-ink-500 dark:text-ink-400 grid place-items-center ring-1 ring-ink-200 dark:ring-ink-700">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </span>
            <div class="min-w-0 flex-1">
              <div class="text-[10.5px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400">Qeydiyyat tarixi</div>
              <div class="text-[12px] font-bold text-ink-900 dark:text-white tabular-nums">{{ user.register_date }}</div>
            </div>
          </div>
          <div class="flex items-center gap-2.5 p-3 rounded-xl bg-ink-50 dark:bg-ink-800/60">
            <span class="w-8 h-8 rounded-lg bg-white dark:bg-ink-900 text-ink-500 dark:text-ink-400 grid place-items-center ring-1 ring-ink-200 dark:ring-ink-700">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <div class="min-w-0 flex-1">
              <div class="text-[10.5px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400">Son giriş</div>
              <div class="text-[12px] font-bold text-ink-900 dark:text-white tabular-nums">{{ user.last_login }}</div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="submit" class="inline-flex items-center gap-1.5 h-10 px-5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-[12.5px] font-black transition shadow-pop active:scale-95">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Yadda saxla
          </button>
        </div>
      </form>
    </section>

    <!-- ============ PANEL: Password ============ -->
    <section v-show="activeTab === 'password'" class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden">
      <div class="px-5 md:px-6 py-4 border-b border-ink-100 dark:border-ink-800 flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 grid place-items-center">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </span>
        <div>
          <h2 class="text-[14px] font-black text-ink-900 dark:text-white">Şifrəni yenilə</h2>
          <p class="text-[11.5px] text-ink-500 dark:text-ink-400">Təhlükəsizlik üçün güclü şifrə seçin</p>
        </div>
      </div>
      <form @submit.prevent="changePassword" method="post" class="p-5 md:p-6 space-y-4">
        <div>
          <label class="block text-[11.5px] font-black text-ink-700 dark:text-ink-200 mb-1.5" for="password">Mövcud şifrə</label>
          <input v-model="old_password" id="password" type="password" class="w-full h-11 px-3.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 focus:ring-2 focus:ring-brand-500/15 transition text-[13px]"/>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11.5px] font-black text-ink-700 dark:text-ink-200 mb-1.5" for="repassword">Yeni şifrə</label>
            <input v-model="new_password" id="repassword" type="password" class="w-full h-11 px-3.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 focus:ring-2 focus:ring-brand-500/15 transition text-[13px]"/>
          </div>
          <div>
            <label class="block text-[11.5px] font-black text-ink-700 dark:text-ink-200 mb-1.5" for="repassword2">Yeni şifrəni təkrarla</label>
            <input v-model="new_password_confirmation" id="repassword2" type="password" class="w-full h-11 px-3.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 focus:ring-2 focus:ring-brand-500/15 transition text-[13px]"/>
          </div>
        </div>

        <!-- Password requirements (live) -->
        <div class="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-800/60">
          <div class="text-[10.5px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2">Şifrə tələbləri</div>
          <ul class="space-y-1 text-[11.5px]">
            <li class="flex items-center gap-1.5" :class="passwordRules.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink-500 dark:text-ink-400'">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="passwordRules.length ? 3 : 2.4" stroke-linecap="round" stroke-linejoin="round"><polyline v-if="passwordRules.length" points="20 6 9 17 4 12"/><circle v-else cx="12" cy="12" r="9"/></svg>
              Ən azı 8 simvol
            </li>
            <li class="flex items-center gap-1.5" :class="passwordRules.case ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink-500 dark:text-ink-400'">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="passwordRules.case ? 3 : 2.4" stroke-linecap="round" stroke-linejoin="round"><polyline v-if="passwordRules.case" points="20 6 9 17 4 12"/><circle v-else cx="12" cy="12" r="9"/></svg>
              Böyük və kiçik hərflər
            </li>
            <li class="flex items-center gap-1.5" :class="passwordRules.digit ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink-500 dark:text-ink-400'">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="passwordRules.digit ? 3 : 2.4" stroke-linecap="round" stroke-linejoin="round"><polyline v-if="passwordRules.digit" points="20 6 9 17 4 12"/><circle v-else cx="12" cy="12" r="9"/></svg>
              Ən azı 1 rəqəm
            </li>
            <li class="flex items-center gap-1.5" :class="passwordRules.special ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink-500 dark:text-ink-400'">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="passwordRules.special ? 3 : 2.4" stroke-linecap="round" stroke-linejoin="round"><polyline v-if="passwordRules.special" points="20 6 9 17 4 12"/><circle v-else cx="12" cy="12" r="9"/></svg>
              Xüsusi simvol (!@#$ və s.)
            </li>
          </ul>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="submit" class="inline-flex items-center gap-1.5 h-10 px-5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-[12.5px] font-black transition shadow-pop active:scale-95">Şifrəni yenilə</button>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>

</style>