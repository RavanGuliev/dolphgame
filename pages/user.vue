<script setup lang="ts">
import {authStore} from "~/stores/authStore";
import {storeToRefs} from "pinia";
import {useCookie} from "#app/composables/cookie";
import {useRouter} from "vue-router";
const {$api} = useNuxtApp()
const cookie = useCookie('token')
definePageMeta({
  middleware: 'auth'
})
const router = useRouter()
const userAuth = authStore()
const {setToken, setUserData} = userAuth
const {user, headers} = storeToRefs(userAuth)
console.log(user)
const logout = () => {
  $api.get('user/logout', headers.value)
  cookie.value = null
  setToken(null)
  setUserData(null)
  window.location = '/'
}
onMounted(async () => {
  $('.single-sub-menu').click(function () {
    var getIcon = $(this).children('i').attr('class')
    if (getIcon === 'fal fa-angle-down') {
      $('.mobile-sub-menu').show(300)
      $(this).children('i').attr('class', 'fal fa-angle-up')
    } else {
      $('.mobile-sub-menu').hide(300)
      $(this).children('i').attr('class', 'fal fa-angle-down')
    }
  })
  if ($('div').hasClass('statistic-carousel')) {
    $('.statistic-carousel').owlCarousel({
      loop:true,
      margin:10,
      responsiveClass:true,
      responsive:{
        0:{
          items:1,
          nav:false
        },
        600:{
          items:2,
          nav:false
        },
        1000:{
          items:5,
          nav:true,
          loop:false
        }
      }
    })
  }
})
const closeHover = () => {
  $('.user-hover').hide(200)
  $('.notifications').hide(200)
  $('.sub-menu').hide(200)
  $('.mobile-sub-menu').hide(200)
  $('i.fa-angle-up').attr('class', 'fal fa-angle-down')
  return false;
}
</script>

<template>
  <main>

    <!-- Mobile and PC title -->
    <div class="container back-orange set-size">
      <div class="row">
        <div class="col-md-12">
          <div class="main-title">
            <h5> Şəxsi kabinet </h5>
            <div class="single-sub-menu">
              <i class="fal fa-angle-down"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container mobile-sub-menu">
      <div class="row reset-margin">
        <div class="col-md-12 mt-20">
          <div @click="closeHover" class="single-menu">
            <nuxt-link to="/user/dashboard" class="media">
              <div class="media-body">
                <h5 class="mt-0">Profilim</h5>
              </div>
            </nuxt-link>
            <nuxt-link to="/user/dashboard/orders" class="media">
              <div class="media-body">
                <h5 class="mt-0">Sifarişlərim</h5>
              </div>
            </nuxt-link>
            <nuxt-link to="/user/dashboard/payments" class="media">
              <div class="media-body">
                <h5 class="mt-0">Ödənişlərim</h5>
              </div>
            </nuxt-link>
            <nuxt-link to="/user/dashboard/operations" class="media">
              <div class="media-body">
                <h5 class="mt-0">Əməliyyatlar</h5>
              </div>
            </nuxt-link>
            <nuxt-link to="/user/dashboard/notifications" class="media">
              <div class="media-body">
                <h5 class="mt-0">Bildirişlərim</h5>
              </div>
            </nuxt-link>
            <nuxt-link to="/user/dashboard/account" class="media">
              <div class="media-body">
                <h5 class="mt-0">Tənzimləmələr</h5>
              </div>
            </nuxt-link>
            <a @click="logout" class="media">
              <div class="media-body">
                <h5 class="mt-0">Hesabdan çıx</h5>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- Mobile and PC contents section -->
    <div class="container">
      <div class="row">

        <!-- PC left menus -->
        <div v-if="user" class="col-lg-3 d-n-992">
          <div class="row">
            <div class="col-md-12 left-dasboard">
              <div class="row">
                <div class="col-4 profil-photo">
                  <img :src="user.avatar"
                       :alt="user.name">
                </div>
                <div class="col-8 profil-name">
                  <h6>{{ user.full_name }}</h6>
                  <span>{{ user.email }}</span>
                  <span>Müştəri kodu {{ user.id }}</span>
                  <p>
                                        <span
                                            class="d-inline-block text-warning t-warning">Balans: {{
                                            user.balance
                                          }} </span>

                    <span class="mr-2 d-inline-block text-warning t-warning"> <i
                        class="fas fa-dot-circle"></i> </span>
                    <span
                        class="mr-2 d-inline-block text-warning t-warning"> Bonus : {{ user.bonus }} </span>
                  </p>
                </div>
              </div>
            </div>

            <!-- PC Dashboard tabs title -->
            <div class="col-md-12 dashboard-titles">
              <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                   aria-orientation="vertical">
                <nuxt-link class="nav-link"
                           to="/user/dashboard" exact-active-class="active"
                >
                  <div class="chapters">
                    <p><i class="fal fa-user"></i> Profilim</p>
                  </div>
                </nuxt-link>
                <nuxt-link class="nav-link" exact-active-class="active"
                           to="/user/dashboard/orders"
                           aria-controls="v-pills-orders" aria-selected="false">
                  <div class="chapters">
                    <p><i class="fal fa-shopping-bag"></i> Sifarişlərim</p>
                  </div>
                </nuxt-link>
                <nuxt-link class="nav-link" to="/user/dashboard/payments"
                           exact-active-class="active">
                  <div class="chapters">
                    <p><i class="fal fa-wallet"></i> Ödənişlərim</p>
                  </div>
                </nuxt-link>
                <nuxt-link class="nav-link" to="/user/dashboard/operations"
                           exact-active-class="active">
                  <div class="chapters">
                    <p><i class="fal fa-history"></i> Əməliyyatlar</p>
                  </div>
                </nuxt-link>
                <nuxt-link class="nav-link" to="/user/dashboard/bonuses"
                           exact-active-class="active"
                >
                  <div class="chapters">
                    <p><i class="fal fa-star"></i> Bonuslarım</p>
                  </div>
                </nuxt-link>
                <nuxt-link class="nav-link" exact-active-class="active"
                   to="/user/dashboard/notifications">
                  <div class="chapters">
                    <p><i class="fal fa-bell"></i> Bildirişlər</p>
                  </div>
                </nuxt-link>
                <nuxt-link class="nav-link"
                   to="/user/dashboard/account"
                   >
                  <div class="chapters">
                    <p><i class="fal fa-cog"></i> Tənzimləmələr</p>
                  </div>
                </nuxt-link>
                <div style="cursor: pointer" @click.prevent="logout" class="nav-link" aria-selected="false">
                  <div class="chapters">
                    <p><i class="fal fa-sign-out"></i> Hesabdan çıx</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PC and Mobile right contents -->
        <div class="col-lg-9 pr-0 pl-0-992">
          <nuxt-page/>
        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>

</style>