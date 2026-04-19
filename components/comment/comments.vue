<script setup lang="ts">
import {authStore, paginateStore} from "#imports";
import Paginate from "~/components/modules/paginate.vue";
const {$api, $toast} = useNuxtApp()
const store = paginateStore()
const {data} = storeToRefs(store)
const auth = authStore()
const {user, headers} = storeToRefs(auth)
const comment = ref('')
const count = 10
const parent_id = ref(null)
const child_comment = ref([])
const disabled = ref(false)
const props = defineProps({
  game: {
    required: true
  }
})
const comments = ref({})
comments.value = await $api.get(`public/comments?game=${props.game}&count=${count}`)
watch(data, value => {
  comments.value = value
})
const addComment = () => {
  disabled.value = true
  $api.post('user/comment', {comment: comment.value, parent_id: null, game: props.game}, headers.value).then(res => {
    $toast.success(res.data)
    comment.value = ''
  }).catch(err => $toast.error(err)).finally(() => disabled.value = false)
}
const addChildComment = (index:any) => {
  disabled.value = true
  $api.post('user/comment', {comment: child_comment.value[index], parent_id: comments.data[index].id, game: props.game}, headers.value).then(res => {
    $toast.success(res.data)
    child_comment.value = []
  }).catch(err => $toast.error(err)).finally(() => disabled.value = false)
}
onMounted(() => {
// Toggle Response Box
  $('.pad-ver span').click(function () {
    $(this).parent('.pad-ver').parent('.media-body').children('.response-box').toggle('slow')
  })


})
</script>

<template>
  <div id="tab_comments" class="container bootdey">
    <div class="row reset-margin">
      <div class="col-md-12 bootstrap snippets">

        <!--Şərh yazılacaq hissə-->
        <div class="panel">
          <form @submit.prevent="addComment" v-if="user"  method="post" enctype="multipart/form-data" class="panel-body">
<!--            <input type="hidden" name="category" value="{{$row->id}}">-->
            <textarea v-model="comment" name="comment" class="form-control" rows="2"
                      placeholder="Zəhmət olmasa fikrinizi bildirin.."></textarea>

            <div class="mar-top clearfix">
<!--              <label for="photo"><i class="fal fa-camera-alt"></i><small-->
<!--                  id="sell-img"></small></label>-->
<!--              <input name="image" hidden type="file" id="photo" accept="image/*">-->
              <button :disabled="disabled" class="pull-right" type="submit"><i class="fas fa-share"></i> Paylaş</button>
            </div>

          </form>
          <div v-else class="alert alert-warning">
            Şərh yaza bilmək üçün giriş etməlisiniz.
          </div>
        </div>

        <!--Şərhlər olan hissə-->
        <div v-if="comments.data.length" class="panel">
          <div class="panel-body">
            <div v-for="(row, index) in comments.data" class="media-block">
              <div class="media-left"><img class="img-circle img-sm" alt="Profile Picture"
                                           :src="row.user.avatar">
              </div>
              <div class="media-body">
                <div class="mar-btm">
                  <strong
                      class="text-semibold media-heading box-inline">{{row.user.name}}</strong>
                </div>
                <p>{{row.comment}}</p>
                <div v-if="user" class="pad-ver">
                  <span><i class="fas fa-reply"></i> Cavabla</span>
                </div>
                <hr v-if="comments[index + 1]">
                <div v-if="row.children">
                  <div v-for="(child, child_index) in row.children" class="media-block">
                    <div class="media-left"><img class="img-circle img-sm"
                                                 alt="Profile Picture"
                                                 :src="child.user.avatar">
                    </div>
                    <div class="media-body">
                      <div class="mar-btm">
                        <strong
                            class="text-semibold media-heading box-inline">{{child.user.name}}</strong>
                      </div>
                      <p>{{child.comment}}</p>
                      <hr v-if="row.children[child_index + 1]">
                    </div>
                  </div>
                </div>
                <div v-if="user" class="response-box">
                  <div class="media-left"><img class="img-circle img-sm"
                                               alt="Profile Picture"
                                               :src="row.user.avatar">
                  </div>
                  <div class="media-body">
                    <form @submit.prevent="addChildComment(index)"  v-if="user" class="response" method="post"
                          enctype="multipart/form-data">
                      <input v-model="child_comment[index]" name="comment" class="form-control" type="text">

                      <!-- Aşağdakı labelin "for"-u və inputun "id"-si dinamik olmalıdır-->
<!--                      <label for="sub-photo-{{$comment->id}}"><i-->
<!--                          class="fal fa-camera-alt"></i></label>-->
<!--                      <input name="image" class="sub-photo" hidden-->
<!--                             id="sub-photo-{{$comment->id}}" type="file">-->
                      <button type="submit"><i class="fas fa-reply"></i></button>
                    </form>
<!--                    <div class="response-photo">-->
<!--                      <img class="uploadPhoto" src="" alt="">-->
<!--                      <span><i class="fas fa-times-circle"></i></span>-->
<!--                    </div>-->
                  </div>
                </div>
                <hr v-if="row.children">
              </div>
            </div>
          </div>
        </div>
      </div>
    <paginate :pagination="comments.meta" :params="{count, game: props.game}" />
    </div>
  </div>
</template>

<style scoped>

</style>