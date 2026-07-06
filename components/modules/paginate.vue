<script setup lang="ts">
import { paginateStore } from "~/stores/paginateStore";
import { computed } from "vue";
import { loadingStore } from "~/stores/loadingStore";

const loadStore = loadingStore();
const { setLoading } = loadStore;
const store = paginateStore();
const { $api } = useNuxtApp();

const props = defineProps({
  pagination: { type: Object },
  params:     { type: Object },
  forWhat:    { type: String },
  headers:    { default: () => ({}) },
});

const { pagination, params, forWhat, headers } = props;
const current_page = computed(() => props.pagination?.current_page ?? 1);
const last_page    = computed(() => props.pagination?.last_page ?? 1);

const pages = computed(() => {
  const cur  = pagination?.current_page ?? 1;
  const last = pagination?.last_page ?? 1;
  const max  = 7;
  let start = Math.max(1, cur - Math.floor(max / 2));
  let end   = Math.min(last, start + max - 1);
  if (end - start + 1 < max) start = Math.max(1, end - max + 1);
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
});

const removeUrlParameter = (url: string, paramKey: string) => {
  const r = new URL(url);
  r.searchParams.delete(paramKey);
  return r.href;
};

const objectToQueryString = () => {
  if (!params) return "";
  return "&" + Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent((params as any)[k]))
    .join("&");
};

const changePage = (page: number) => {
  const url = removeUrlParameter(pagination!.links[1].url, "page");
  setLoading(true);
  ($api as any).get(url + `?page=${page}` + objectToQueryString(), headers)
    .then((res: any) => store.setPaginateData(res))
    .finally(() => {
      setLoading(false);
      if (process.client) window.scrollTo({ top: 0, behavior: "smooth" });
    });
};
</script>

<template>
  <div v-if="last_page > 1" class="flex items-center justify-center gap-1.5 mt-8 flex-wrap">

    <!-- Əvvəlki -->
    <button
      :disabled="current_page <= 1"
      @click="changePage(current_page - 1)"
      class="h-9 px-3 rounded-xl flex items-center gap-1.5 text-[12.5px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 text-ink-600 dark:text-ink-300 hover:ring-brand-500 hover:text-brand-500 disabled:hover:ring-ink-200 disabled:hover:text-ink-600"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      Əvvəlki
    </button>

    <!-- Səhifə nömrələri -->
    <button
      v-for="page in pages"
      :key="page"
      @click="changePage(page)"
      class="h-9 min-w-[36px] px-2 rounded-xl text-[13px] font-bold transition ring-1"
      :class="page === current_page
        ? 'bg-brand-500 text-white ring-brand-500 shadow-pop'
        : 'bg-white dark:bg-ink-900 ring-ink-200 dark:ring-ink-800 text-ink-700 dark:text-ink-300 hover:ring-brand-500 hover:text-brand-500'"
    >
      {{ page }}
    </button>

    <!-- Sonrakı -->
    <button
      :disabled="current_page >= last_page"
      @click="changePage(current_page + 1)"
      class="h-9 px-3 rounded-xl flex items-center gap-1.5 text-[12.5px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 text-ink-600 dark:text-ink-300 hover:ring-brand-500 hover:text-brand-500 disabled:hover:ring-ink-200 disabled:hover:text-ink-600"
    >
      Sonrakı
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>

  </div>
</template>
