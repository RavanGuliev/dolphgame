<script setup lang="ts">
import { loadingStore } from "#imports";

const { $api, $toast } = useNuxtApp();
useHead({ title: "Bizimlə əlaqə" });

const loading = loadingStore();
const { setLoading } = loading;
const row = await $api.get("public/general");

const name    = ref("");
const surname = ref("");
const email   = ref("");
const phone   = ref("");
const message = ref("");

const sendMessage = () => {
  setLoading(true);
  ($api as any).post("public/contact", {
    name: name.value,
    surname: surname.value,
    email: email.value,
    phone: phone.value,
    message: message.value,
  }).then((res: any) => {
    name.value = surname.value = email.value = phone.value = message.value = "";
    ($toast as any).success(res.data);
  }).catch((err: any) => ($toast as any).error(err))
    .finally(() => setLoading(false));
};
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">

    <!-- Breadcrumb -->
    <nav class="flex items-center gap-1.5 text-[12px] text-ink-500 dark:text-ink-400 mb-6">
      <nuxt-link to="/" class="hover:text-brand-500 transition">Ana səhifə</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <span class="font-semibold text-ink-900 dark:text-white">Əlaqə</span>
    </nav>

    <!-- Info cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
      <div class="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800">
        <span class="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 grid place-items-center shrink-0">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </span>
        <div class="min-w-0">
          <div class="text-[11px] font-black uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-0.5">Ünvan</div>
          <div class="text-[13.5px] font-semibold text-ink-900 dark:text-white">{{ row.data.address }}</div>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800">
        <span class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-500 grid place-items-center shrink-0">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </span>
        <div class="min-w-0">
          <div class="text-[11px] font-black uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-0.5">E-mail</div>
          <div class="text-[13.5px] font-semibold text-ink-900 dark:text-white break-all">{{ row.data.email }}</div>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800">
        <span class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 grid place-items-center shrink-0">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.08 1.18 2 2 0 012.07 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
        </span>
        <div class="min-w-0">
          <div class="text-[11px] font-black uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-0.5">Telefon</div>
          <div class="text-[13.5px] font-semibold text-ink-900 dark:text-white">{{ row.data.phone }}</div>
        </div>
      </div>
    </div>

    <!-- Form + Map -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Form -->
      <div class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-5 md:p-7">
        <h2 class="text-[20px] font-black text-ink-900 dark:text-white mb-1">Bizimlə əlaqə</h2>
        <p class="text-[13px] text-ink-500 dark:text-ink-400 mb-6">Sualınızı və ya təklifinizi bizə göndərin.</p>

        <form @submit.prevent="sendMessage" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">Ad</label>
              <input v-model="name" type="text" placeholder="Adınız" required
                class="w-full h-10 px-3.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none text-[13px] text-ink-900 dark:text-white placeholder:text-ink-400 transition" />
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">Soyad</label>
              <input v-model="surname" type="text" placeholder="Soyadınız" required
                class="w-full h-10 px-3.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none text-[13px] text-ink-900 dark:text-white placeholder:text-ink-400 transition" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">E-mail</label>
              <input v-model="email" type="email" placeholder="email@example.com" required
                class="w-full h-10 px-3.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none text-[13px] text-ink-900 dark:text-white placeholder:text-ink-400 transition" />
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">Telefon</label>
              <input v-model="phone" type="tel" placeholder="+994 XX XXX XX XX"
                class="w-full h-10 px-3.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none text-[13px] text-ink-900 dark:text-white placeholder:text-ink-400 transition" />
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">Mesaj</label>
            <textarea v-model="message" rows="6" placeholder="Mesajınızı buraya yazın…" required
              class="w-full px-3.5 py-3 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none text-[13px] text-ink-900 dark:text-white placeholder:text-ink-400 resize-none transition"></textarea>
          </div>
          <button type="submit"
            class="w-full h-11 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.99] text-white font-bold text-[14px] transition shadow-pop flex items-center justify-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Göndər
          </button>
        </form>
      </div>

      <!-- Map -->
      <div class="rounded-2xl overflow-hidden ring-1 ring-ink-200 dark:ring-ink-800 min-h-[400px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d97236.43465759905!2d49.78491998266335!3d40.39470211181718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1599482144539!5m2!1sen!2s"
          width="100%" height="100%" style="border:0; min-height:400px; display:block;"
          allowfullscreen aria-hidden="false" tabindex="0" loading="lazy"
        ></iframe>
      </div>

    </div>
  </main>
</template>
