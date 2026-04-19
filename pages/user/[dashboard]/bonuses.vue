<script setup lang="ts">
import {authStore} from "~/stores/authStore";
import Paginate from "~/components/modules/paginate.vue";
import {paginateStore} from "~/stores/paginateStore";
import {storeToRefs} from "pinia";
import {useHead} from "@unhead/vue";
import {loadingStore} from "~/stores/loadingStore";
import {formatDateTime} from "~/utils/dateFormatter";
const store = paginateStore()
const loading = loadingStore()
const {setLoading} = loading
const {data} = storeToRefs(store)
const bonuses = ref({})
const bonus = ref(100)
const {$api, $toast} = useNuxtApp()
const count = 4
const userAuth = authStore()
const {setUserData} = userAuth
const {headers, user} = storeToRefs(userAuth)
const convertBonus = () => {
  setLoading(true)
  $api.post('user/convert-bonus', {bonus: bonus.value}, headers.value).then(res => {
    $toast.success(res.data)
    $api.get('user',  headers.value).then(res => {
      setUserData(res.data)
    })
     $api.get('user/moneys?count=' + count, headers.value).then(res => {
       bonuses.value = res
     })
  }).catch(err => {
    $toast.error(err)
  }).finally(() => setLoading(false))
}
useHead({
  title: 'Bonuslarım'
})
bonuses.value = await $api.get('user/moneys?count=' + count, headers.value)
watch(data, value => {
  bonuses.value = value
})
</script>

<template>
  <div class="right-dashboard">
    <div class="row">

      <!-- PC and Mobile title and transfer bonus -->
      <div class="col-md-12 text-center">
        <h5 class="tab-title"> Bonuslarım</h5>
      </div>  <!-- Bu Qalsın !!! -->
      <div class="col-md-12">
        <div class="alert-grey">
          <div class="row">
            <div class="col-md-6">
              <div class="total-bonus">
                <h5>Toplam Bonus: <span><i class="fas fa-star"></i> {{user.bonus}}</span>
                </h5>
              </div>
            </div>
            <div class="col-md-6">
              <form @submit.prevent="convertBonus" method="post" class="getBonus">
                <input :disabled="user.bonus < 100" name="bonus" v-model="bonus" type="number">
                <button :disabled="user.bonus < 100" type="submit">Tələb et</button>
                <small v-if="user.bonus < 100" class="text-danger d-block mt-2">Bonus 100 ən azı olmalıdır</small>
              </form>
            </div>
          </div>
        </div>
      </div>  <!-- Bu Qalsın !!! -->

      <!-- PC and Mobile all transfers -->
      <div v-if="bonuses.data.length" class="col-md-12 payments">
        <div class="table-responsive-sm text-center">
          <div class="dashboard-tabs all-payments">
            <table>
              <thead>
              <tr>
                <th scope="col">Bonus</th>
                <th scope="col">Qiymət</th>
                <th scope="col">Tarix</th>
                <th scope="col">Status</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="bonus in bonuses.data">
                <td data-label="Bonus">{{bonus.bonus}}</td>
                <td data-label="Qiymət">{{bonus.amount}} Azn</td>
                <td data-label="Tarix">{{formatDateTime(bonus.created_at)}}</td>
                <td data-label="Status">
                  <div class="status-okey">
                    <i class="fas fa-check-circle"></i>
                    Təsdiqləndi
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else class="col-md-12">
        <div class="user-cart dashboard-empty">
          <div class="card-body2 card2">
            <div class="text-center"><img src="/img/transfer.svg" width="110"
                                          height="110" class="mb-2">
              <h3><strong>Transfer yoxdur</strong></h3>
              <h4>Bizi seçdiyiniz üçün təşəkkür edirik ! 😊</h4>
              <nuxt-link to="/games" class="goo"><i
                  class="fas fa-arrow-alt-left"></i> Elə indi bonus qazan</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>