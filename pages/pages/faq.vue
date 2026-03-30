<script setup lang="ts">
useHead({
  title: 'Yardım'
})
const {$api} = useNuxtApp()
const rows = await $api.get('public/faqs')
</script>

<template>
  <main>

    <!-- Mobile and PC title -->
    <div class="container back-orange set-size">
      <div class="row">
        <div class="col-md-12">
          <div class="main-title">
            <h5>Yardım</h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile and PC FAQ contents -->
    <div class="container about">
      <div class="row reset-margin">
        <div class="col-md-12">
          <section class="faq-section">
            <div class="container">
              <div class="row">

                <!-- PC and Mobile FAQ title -->
                <div class="col-12">
                  <div class="faq-title text-center pb-3">
                    <h2>Suallar və cavablar</h2>
                  </div>
                </div>

                <!-- PC and Mobile FAQ contents -->
                <div class="col-12">
                  <div class="faq" id="accordion">
                    <div v-for="(row, key) in rows.data" class="card">
                      <div class="card-header" :id="'faqHeading-'+ key">
                        <div class="mb-0">
                          <h5 class="faq-title" data-toggle="collapse" :data-target="'#faqCollapse-' + key"
                              data-aria-expanded="true" :data-aria-controls="'faqCollapse-' + key">
                            <span class="badge">{{key + 1}}</span> {{row.title}}
                          </h5>
                        </div>
                      </div>
                      <div :id="'faqCollapse-' + key" class="collapse" :aria-labelledby="'faqHeading-' + key" data-parent="#accordion">
                        <div class="card-body">
                          <div v-html="row.description"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>

</style>