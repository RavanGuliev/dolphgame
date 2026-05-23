<script setup lang="ts">
import { authStore, paginateStore } from "#imports";
import Paginate from "~/components/modules/paginate.vue";
const { $api, $toast } = useNuxtApp();
const store = paginateStore();
const { data } = storeToRefs(store);
const auth = authStore();
const { user, headers } = storeToRefs(auth);
const comment = ref("");
const count = 10;
const child_comment = ref<any[]>([]);
const disabled = ref(false);
const replyIndex = ref<number | null>(null);
const props = defineProps({
  game: { required: true },
});
const comments = ref<any>({});
comments.value = await $api.get(`public/comments?game=${props.game}&count=${count}`);
watch(data, (value) => {
  comments.value = value;
});

const toggleReply = (index: number) => {
  replyIndex.value = replyIndex.value === index ? null : index;
};

const addComment = () => {
  disabled.value = true;
  $api
    .post("user/comment", { comment: comment.value, parent_id: null, game: props.game }, headers.value)
    .then((res) => {
      $toast.success(res.data);
      comment.value = "";
    })
    .catch((err) => $toast.error(err))
    .finally(() => (disabled.value = false));
};
const addChildComment = (index: any) => {
  disabled.value = true;
  $api
    .post("user/comment", { comment: child_comment.value[index], parent_id: comments.value.data[index].id, game: props.game }, headers.value)
    .then((res) => {
      $toast.success(res.data);
      child_comment.value = [];
      replyIndex.value = null;
    })
    .catch((err) => $toast.error(err))
    .finally(() => (disabled.value = false));
};
</script>

<template>
  <div>
    <!-- Comment form -->
    <form v-if="user" @submit.prevent="addComment" class="mb-5">
      <div class="flex gap-3">
        <img :src="user.avatar" :alt="user.full_name || user.name" class="w-10 h-10 rounded-full object-cover ring-1 ring-ink-200 dark:ring-ink-700 shrink-0" />
        <div class="flex-1 min-w-0">
          <textarea v-model="comment" rows="2" placeholder="Zəhmət olmasa fikrinizi bildirin.." class="w-full rounded-xl bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 focus:ring-brand-500 outline-none p-3 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 transition resize-y"></textarea>
          <div class="mt-2 flex justify-end">
            <button :disabled="disabled" type="submit" class="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-[13px] font-bold shadow-pop transition disabled:opacity-50">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Paylaş
            </button>
          </div>
        </div>
      </div>
    </form>
    <div v-else class="mb-5 flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 ring-1 ring-amber-500/30 text-amber-700 dark:text-amber-400 text-[13px] font-semibold p-3.5">
      <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
      Şərh yaza bilmək üçün giriş etməlisiniz.
    </div>

    <!-- Comments list -->
    <div v-if="comments.data && comments.data.length" class="space-y-4">
      <div v-for="(row, index) in comments.data" :key="row.id" class="flex gap-3">
        <img :src="row.user.avatar" :alt="row.user.name" class="w-10 h-10 rounded-full object-cover ring-1 ring-ink-200 dark:ring-ink-700 shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="rounded-2xl bg-ink-50 dark:bg-ink-800/60 ring-1 ring-ink-200 dark:ring-ink-800 p-3.5">
            <div class="text-[13px] font-bold text-ink-900 dark:text-white">{{ row.user.name }}</div>
            <p class="mt-1 text-[13.5px] text-ink-700 dark:text-ink-300 leading-relaxed break-words">{{ row.comment }}</p>
          </div>
          <div v-if="user" class="mt-1.5 px-1">
            <button @click="toggleReply(index)" type="button" class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-500 dark:text-ink-400 hover:text-brand-500 transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>
              Cavabla
            </button>
          </div>

          <!-- Children -->
          <div v-if="row.children && row.children.length" class="mt-3 space-y-3 pl-4 border-l-2 border-ink-100 dark:border-ink-800">
            <div v-for="child in row.children" :key="child.id" class="flex gap-3">
              <img :src="child.user.avatar" :alt="child.user.name" class="w-8 h-8 rounded-full object-cover ring-1 ring-ink-200 dark:ring-ink-700 shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="rounded-2xl bg-ink-50 dark:bg-ink-800/60 ring-1 ring-ink-200 dark:ring-ink-800 p-3">
                  <div class="text-[12.5px] font-bold text-ink-900 dark:text-white">{{ child.user.name }}</div>
                  <p class="mt-1 text-[13px] text-ink-700 dark:text-ink-300 leading-relaxed break-words">{{ child.comment }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Reply form -->
          <form v-if="user && replyIndex === index" @submit.prevent="addChildComment(index)" class="mt-3 flex items-center gap-2 pl-4">
            <input v-model="child_comment[index]" type="text" placeholder="Cavab yaz…" class="flex-1 h-10 rounded-xl bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 focus:ring-brand-500 outline-none px-3 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 transition" />
            <button type="submit" :disabled="disabled" class="w-10 h-10 shrink-0 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white grid place-items-center shadow-pop transition disabled:opacity-50">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-8 text-[13px] text-ink-500 dark:text-ink-400">
      Hələ şərh yoxdur. İlk şərhi sən yaz!
    </div>

    <div class="mt-5">
      <paginate :pagination="comments.meta" :params="{ count, game: props.game }" />
    </div>
  </div>
</template>
