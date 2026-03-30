<script setup lang="ts">
import {authStore} from "~/stores/authStore";
import Paginate from "~/components/modules/paginate.vue";
import {paginateStore} from "~/stores/paginateStore";
import {storeToRefs} from "pinia";
import {useHead} from "@unhead/vue";
import {loadingStore} from "~/stores/loadingStore";
const store = paginateStore()
const {data} = storeToRefs(store)
const notifications = ref({})
const {$api} = useNuxtApp()
const count = 5
const userAuth = authStore()
const {headers} = storeToRefs(userAuth)

useHead({
  title: 'Bildirişlər'
})
notifications.value = await $api.get('user/notifications?count=' + count, headers.value)
watch(data, value => {
  notifications.value = value
})
</script>

<template>
  <div class="right-dashboard">
    <div class="row">

      <!-- PC and Mobile all notifications and title -->
      <div class="col-md-12 text-center">
        <h5 class="tab-title"> Bildirişlər</h5>
      </div>
      <div v-if="notifications.data.length" class="col-md-12 chg-mt">
        <div class="row">

          <!-- PC and Mobile all notifications -->

          <div v-for="notification in notifications.data" class="col-md-12">
            <div class="single-not">
              <div class="row">
                <div class="col-12">
                  <div class="not-item">
                    <p>
                   {{notification.message}}
                    </p>
                    <div class="messageinfo"><i
                        class="fal fa-clock"></i>
                      {{notification.created_at}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <paginate :params="{count}" :pagination="notifications.meta" :headers="{headers}" />

        </div>
      </div>
      <div v-else class="col-md-12">
        <div class="user-cart dashboard-empty">
          <div class="card-body2 card2">
            <div class="text-center"><img src="/img/bell.svg" width="110"
                                          height="110" class="mb-2">
              <h3><strong>Bildiriş yoxdur</strong></h3>
              <h4>Bizi seçdiyiniz üçün təşəkkür edirik ! 😊</h4>
              <nuxt-link to="/" class="goo"><i
                  class="fas fa-arrow-alt-left"></i> Ana
                səhifəyə geri dön</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>