<script setup lang="ts">
import {loadingStore} from "#imports";

const {$api, $toast} = useNuxtApp()
useHead({
  title: 'Bizimlə əlaqə'
})
const loading = loadingStore()
const {setLoading} = loading
const row = await $api.get('public/general')
const name = ref(null)
const surname = ref(null)
const email = ref(null)
const phone = ref(null)
const message = ref(null)
const sendMessage = () => {
  setLoading(true)
  $api.post('public/contact', {
    name: name.value,
    surname: surname.value,
    email: email.value,
    phone: phone.value,
    message: message.value,
  }).then(res => {
    name.value = null
    surname.value = null
    email.value = null
    phone.value = null
    message.value = null
    $toast.success(res.data)
  }).catch(err => $toast.error(err)).finally(() => setLoading(false))
}
</script>

<template>
  <main>

    <!-- PC and Mobile title -->
    <div class="container back-orange set-size">
      <div class="row">
        <div class="col-md-12">
          <div class="main-title">
            <h5> Əlaqə </h5>
          </div>
        </div>
      </div>
    </div>

    <!-- PC and Mobile all-information -->
    <div class="container">
      <div class="row reset-margin mb-10">

        <!-- PC and Mobile inform -->
        <div class="col-md-4 d-none d-md-block">
          <div class="inform-blog">
            <div><i class="fal fa-map"></i></div>
            <span>Adres</span>
            <p>{{row.data.address}}</p>
          </div>
        </div>
        <div class="col-md-4 col-6">
          <div class="inform-blog">
            <div><i class="fal fa-envelope"></i></div>
            <span>Email Adres</span>
            <p>{{row.data.email}}</p>
          </div>
        </div>
        <div class="col-md-4  col-6">
          <div class="inform-blog">
            <div><i class="fal fa-phone-alt"></i></div>
            <span>Telefon</span>
            <p>{{row.data.phone}}</p>
          </div>
        </div>

        <!-- PC and Mobile send message and map -->
        <div class="col-lg-6">
          <div class="heading_s1">
            <h2 class="mb-3"> Bizimlə Əlaqə </h2>
          </div>
          <div class="field_form">
            <form @submit.prevent="sendMessage" method="post" name="enq">
              <div class="row">
                <div class="form-group col-md-6">
                  <input v-model="name" placeholder="Adınız" id="first-name" class="form-control" name="name"
                         type="text">
                </div>
                <div class="form-group col-md-6">
                  <input v-model="surname" placeholder="Soyadınız" id="email" class="form-control" name="surname"
                         type="text">
                </div>
                <div class="form-group col-md-6">
                  <input v-model="email" placeholder="Email" id="phone" class="form-control" name="email"
                         type="email">
                </div>
                <div class="form-group col-md-6">
                  <input v-model="phone" placeholder="Telefon" id="subject" class="form-control" name="phone"
                         type="tel">
                </div>
                <div class="form-group col-md-12">
                                <textarea v-model="message" placeholder="Mesajınız" id="description" class="form-control"
                                          name="message" rows="7"></textarea>
                </div>
                <div class="col-md-12">
                  <button type="submit" class="btn btn-fill-out" id="submitButton" name="submit"
                          value="Submit">Göndər
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="col-lg-6">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d97236.43465759905!2d49.78491998266335!3d40.39470211181718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1599482144539!5m2!1sen!2s"
                  width="600" height="450" frameborder="0" style="border:0;" allowfullscreen=""
                  aria-hidden="false" tabindex="0"></iframe>
        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>

</style>