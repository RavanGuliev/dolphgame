<script setup lang="ts">
import { computed, ref, watch } from "#imports";
const { $api } = useNuxtApp();

const props = defineProps({
  q: { required: true }
});

const emit = defineEmits(["close-search"]);

const rows = ref<any[]>([]);
const loading = ref(false);

const fetchSearch = async (query: string) => {
  if (!query.length) return;
  loading.value = true;
  try {
    const response = await $api.get("public/search?q=" + query);
    rows.value = response.data || [];
  } finally {
    loading.value = false;
  }
};

fetchSearch(props.q as string);

watch(() => props.q, (q: any) => fetchSearch(q as string));

const products   = computed(() => rows.value.filter((x: any) => x.type === "product"));
const games      = computed(() => rows.value.filter((x: any) => x.type === "game"));
const categories = computed(() => rows.value.filter((x: any) => x.type === "category"));
const total      = computed(() => rows.value.length);
</script>

<template>
  <div class="py-2">

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center gap-2 py-8 text-ink-400 dark:text-ink-500">
      <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.22-8.56"/></svg>
      <span class="text-[13px] font-medium">Axtarılır…</span>
    </div>

    <!-- Results -->
    <template v-else-if="total > 0">

      <!-- Categories -->
      <template v-if="categories.length">
        <div class="px-4 pt-2 pb-1">
          <span class="text-[10px] font-black uppercase tracking-widest text-ink-400 dark:text-ink-500">Kateqoriyalar</span>
        </div>
        <nuxt-link
          v-for="item in categories"
          :key="item.slug"
          :to="{ name: 'category-slug', params: { slug: item.slug } }"
          @click="emit('close-search')"
          class="flex items-center gap-3 px-4 py-2.5 hover:bg-ink-50 dark:hover:bg-ink-800/70 transition group"
        >
          <span class="w-9 h-9 rounded-xl bg-ink-100 dark:bg-ink-800 grid place-items-center overflow-hidden shrink-0 ring-1 ring-ink-200 dark:ring-ink-700">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
            <svg v-else class="w-4 h-4 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="9" height="9" rx="1.5"/><rect x="13" y="7" width="9" height="9" rx="1.5"/><rect x="2" y="2" width="9" height="4" rx="1"/><rect x="13" y="2" width="9" height="4" rx="1"/></svg>
          </span>
          <div class="flex-1 min-w-0">
            <div class="text-[13.5px] font-bold text-ink-900 dark:text-white truncate group-hover:text-brand-500 transition">{{ item.name }}</div>
          </div>
          <svg class="w-3.5 h-3.5 text-ink-300 dark:text-ink-600 group-hover:text-brand-500 transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </nuxt-link>
      </template>

      <!-- Games -->
      <template v-if="games.length">
        <div class="px-4 pt-3 pb-1">
          <span class="text-[10px] font-black uppercase tracking-widest text-ink-400 dark:text-ink-500">Oyunlar</span>
        </div>
        <nuxt-link
          v-for="item in games"
          :key="item.slug"
          :to="{ name: 'game-slug', params: { slug: item.slug } }"
          @click="emit('close-search')"
          class="flex items-center gap-3 px-4 py-2.5 hover:bg-ink-50 dark:hover:bg-ink-800/70 transition group"
        >
          <span class="w-9 h-9 rounded-xl bg-ink-100 dark:bg-ink-800 grid place-items-center overflow-hidden shrink-0 ring-1 ring-ink-200 dark:ring-ink-700">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
          </span>
          <div class="flex-1 min-w-0">
            <div class="text-[13.5px] font-bold text-ink-900 dark:text-white truncate group-hover:text-brand-500 transition">{{ item.name }}</div>
            <div v-if="item.category?.name" class="text-[11px] text-ink-400 dark:text-ink-500 truncate mt-0.5">{{ item.category.name }}</div>
          </div>
          <svg class="w-3.5 h-3.5 text-ink-300 dark:text-ink-600 group-hover:text-brand-500 transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </nuxt-link>
      </template>

      <!-- Products -->
      <template v-if="products.length">
        <div class="px-4 pt-3 pb-1">
          <span class="text-[10px] font-black uppercase tracking-widest text-ink-400 dark:text-ink-500">Məhsullar</span>
        </div>
        <nuxt-link
          v-for="item in products"
          :key="item.slug"
          :to="{ name: 'game-product-slug', params: { slug: item.slug } }"
          @click="emit('close-search')"
          class="flex items-center gap-3 px-4 py-2.5 hover:bg-ink-50 dark:hover:bg-ink-800/70 transition group"
        >
          <span class="w-9 h-9 rounded-xl bg-ink-100 dark:bg-ink-800 grid place-items-center overflow-hidden shrink-0 ring-1 ring-ink-200 dark:ring-ink-700">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-contain p-1" loading="lazy" />
          </span>
          <div class="flex-1 min-w-0">
            <div class="text-[13.5px] font-bold text-ink-900 dark:text-white truncate group-hover:text-brand-500 transition">{{ item.name }}</div>
            <div v-if="item.price" class="text-[11.5px] font-black text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">{{ Number(item.price).toFixed(2) }} AZN</div>
          </div>
          <svg class="w-3.5 h-3.5 text-ink-300 dark:text-ink-600 group-hover:text-brand-500 transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </nuxt-link>
      </template>

      <!-- Footer -->
      <div class="px-4 py-2.5 mt-1 border-t border-ink-100 dark:border-ink-800">
        <span class="text-[11.5px] text-ink-400 dark:text-ink-500">
          <span class="font-bold text-ink-700 dark:text-ink-300">{{ total }}</span> nəticə tapıldı
        </span>
      </div>
    </template>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center gap-2 py-10 px-4 text-center">
      <span class="w-12 h-12 rounded-2xl bg-ink-100 dark:bg-ink-800 grid place-items-center text-ink-400">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M8 11h6M11 8v6" opacity=".4"/></svg>
      </span>
      <div class="text-[14px] font-extrabold text-ink-900 dark:text-white">"{{ q }}" tapılmadı</div>
      <div class="text-[12px] text-ink-500 dark:text-ink-400">Başqa açar söz yoxlayın</div>
    </div>

  </div>
</template>
