<script setup lang="ts">
import { formatDateOnly } from "~/utils/dateFormatter";
const { $api } = useNuxtApp();
const blogs = await $api.get("public/blogs?count=10");
useHead({ title: "Xəbərlər" });
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
    <!-- Header -->
    <div class="flex items-end justify-between gap-3 mb-6">
      <div>
        <span class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Bloq
        </span>
        <h1 class="mt-3 text-2xl md:text-3xl font-black tracking-tight text-ink-900 dark:text-white">Xəbərlər</h1>
        <p class="mt-1 text-sm text-ink-500 dark:text-ink-400">Ən son yeniliklər, kampaniyalar və məqalələr.</p>
      </div>
    </div>

    <!-- Blog grid -->
    <div v-if="blogs.data && blogs.data.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      <nuxt-link
        v-for="blog in blogs.data"
        :key="blog.slug"
        :to="{ name: 'blogs-slug', params: { slug: blog.slug } }"
        class="group flex flex-col rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden hover:ring-brand-500 hover:-translate-y-0.5 hover:shadow-card transition-all duration-300"
      >
        <div class="aspect-[16/10] overflow-hidden bg-ink-100 dark:bg-ink-800">
          <img :src="blog.image" :alt="blog.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        </div>
        <div class="p-4 flex flex-col flex-1">
          <h2 class="text-[15px] font-black text-ink-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-500 transition">{{ blog.title }}</h2>
          <p class="mt-2 text-[13px] text-ink-500 dark:text-ink-400 leading-relaxed line-clamp-3 flex-1">{{ blog.description }}</p>
          <div class="mt-3 pt-3 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 text-[11.5px] text-ink-500 dark:text-ink-400">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              {{ formatDateOnly(blog.created_at) }}
            </span>
            <span class="inline-flex items-center gap-1 text-[12px] font-bold text-brand-500 group-hover:gap-2 transition-all">
              Oxu
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </nuxt-link>
    </div>

    <div v-else class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-12 text-center text-sm text-ink-500 dark:text-ink-400">
      Hələ xəbər yoxdur.
    </div>
  </main>
</template>
