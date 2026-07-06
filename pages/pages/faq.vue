<script setup lang="ts">
import { ref, computed } from "vue";
import { generalStore } from "~/stores/generalStore";
import { storeToRefs } from "pinia";

useHead({ title: "Yardım" });
const general = generalStore();
const { data } = storeToRefs(general);

const waLink = computed(() => {
  const p = (data.value?.phone || "994503345616").replace(/[^0-9]/g, "");
  return "https://wa.me/" + p;
});

const categories = [
  { slug: "all", name: "Hamısı" },
  { slug: "account", name: "Hesab & qeydiyyat" },
  { slug: "order", name: "Sifariş & ödəniş" },
  { slug: "delivery", name: "Çatdırılma" },
  { slug: "refund", name: "Geri qaytarma" },
  { slug: "bonus", name: "Bonus & endirim" },
  { slug: "digital", name: "DolPh Digital" },
  { slug: "tech", name: "Texniki dəstək" },
];

const faqs = [
  {
    id: 1,
    category: "account",
    title: "İş qrafikiniz necədir?",
    description: `<p><strong class="text-ink-900 dark:text-white">İş saatlarımız:</strong> Hər gün <strong class="text-ink-900 dark:text-white">11:00 — 00:00</strong> arasıdır.</p>
      <p>Bu saatlardan kənarda olsa da, <strong class="text-brand-500">online ödəniş edə</strong> və <strong class="text-brand-500">7/24 avtomatik sifariş verə bilərsiniz.</strong></p>
      <p><strong class="text-ink-900 dark:text-white">Qeyd:</strong> Hesab daxilində olan bəzi məhsullar istisna olmaqla, digər bütün sifarişlər avtomatik şəkildə dərhal həyata keçirilir.</p>`,
  },
  {
    id: 2,
    category: "account",
    title: "Telefon nömrəsi təsdiqi vacibdir?",
    description: `<p>Bəli, telefon nömrəsi təsdiqi <strong class="text-ink-900 dark:text-white">vacibdir</strong>. Bu, hesabınızın təhlükəsizliyini artırır və geri qaytarma proseslərində istifadə olunur.</p>
      <p>Təsdiq SMS vasitəsilə həyata keçirilir və yalnız 1 dəqiqə vaxt aparır.</p>`,
  },
  {
    id: 3,
    category: "order",
    title: "Sifariş necə verilir?",
    description: `<p>3 sadə addım:</p>
      <ol class="list-decimal pl-4 space-y-1 marker:text-brand-500 marker:font-bold">
        <li>İstədiyiniz məhsulu seçin (UC, Diamond, abunəlik və s.)</li>
        <li>Player ID və ya hesab məlumatlarını daxil edin</li>
        <li>Ödəniş üsulunu seçib ödənişi tamamlayın</li>
      </ol>
      <p>Sifarişiniz <strong class="text-brand-500">saniyələr içində</strong> hesabınızda olacaq.</p>`,
  },
  {
    id: 4,
    category: "order",
    title: "Hansı ödəniş üsulları qəbul edilir?",
    description: `<p>Bütün əsas yerli ödəniş üsulları:</p>
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="inline-flex items-center h-6 px-2 rounded-md bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[10.5px] font-black tracking-wider text-ink-700 dark:text-ink-200">VISA</span>
        <span class="inline-flex items-center h-6 px-2 rounded-md bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[10.5px] font-black tracking-wider text-ink-700 dark:text-ink-200">MASTERCARD</span>
        <span class="inline-flex items-center h-6 px-2 rounded-md bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[10.5px] font-black tracking-wider text-ink-700 dark:text-ink-200">m10</span>
        <span class="inline-flex items-center h-6 px-2 rounded-md bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[10.5px] font-black tracking-wider text-ink-700 dark:text-ink-200">MilliÖN</span>
        <span class="inline-flex items-center h-6 px-2 rounded-md bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[10.5px] font-black tracking-wider text-ink-700 dark:text-ink-200">BirBank</span>
        <span class="inline-flex items-center h-6 px-2 rounded-md bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[10.5px] font-black tracking-wider text-ink-700 dark:text-ink-200">eManat</span>
      </div>
      <p>Hesab balansı ilə ödəniş etsən, komissiya <strong class="text-emerald-600 dark:text-emerald-400">0%</strong>-dir. Kart ilə ödənişdə 3% komissiya tətbiq olunur.</p>`,
  },
  {
    id: 5,
    category: "delivery",
    title: "Çatdırılma nə qədər çəkir?",
    description: `<p>Avtomatik məhsullar (UC, Diamond, abunə və s.) <strong class="text-brand-500">~30 saniyə</strong> içində hesabınıza çatdırılır.</p>
      <p>Manuel xidmətlər (boost, klan reytinq və s.) növbəyə görə 1-24 saat arasında həyata keçirilir.</p>`,
  },
  {
    id: 6,
    category: "delivery",
    title: "UC çatmadı, nə etməliyəm?",
    description: `<p>Əvvəla 2-3 dəqiqə gözləyin və oyundan çıxıb yenidən daxil olun. Əgər UC yenə görünmürsə:</p>
      <ul class="list-disc pl-4 space-y-1 marker:text-brand-500">
        <li>Daxil etdiyiniz Player ID-nin doğru olduğunu yoxlayın</li>
        <li>Sifariş tarixçəsində statusu yoxlayın</li>
        <li>WhatsApp dəstək ilə əlaqə saxlayın (sifariş № ilə)</li>
      </ul>
      <p>Komandamız <strong class="text-emerald-600 dark:text-emerald-400">5 dəqiqə ərzində</strong> problemi həll edir və ya pulu geri qaytarır.</p>`,
  },
  {
    id: 7,
    category: "refund",
    title: "Geri qaytarma necə işləyir?",
    description: `<p>Texniki problem səbəbindən sifariş tamamlanmazsa — <strong class="text-emerald-600 dark:text-emerald-400">100% geri qaytarma</strong>.</p>
      <ul class="list-disc pl-4 space-y-1 marker:text-brand-500">
        <li>Minimum geri qaytarma məbləği: 10 AZN</li>
        <li>1 il ərzində maksimum 3 dəfə balans geri istənilə bilər</li>
        <li>Ödəniş kartla edilibsə, geri qaytarma həmin kartla edilir (5-10 iş günü)</li>
        <li>Geri qaytarma zamanı 5% komissiya tutulur (min 5 AZN)</li>
      </ul>`,
  },
  {
    id: 8,
    category: "bonus",
    title: "Bonus xal necə qazanılır?",
    description: `<p>Hər <strong class="text-ink-900 dark:text-white">1 AZN alışda 1 bonus xal</strong> qazanırsınız. Balans yükləməsində isə hər 10 AZN-ə 2 xal.</p>
      <p><strong class="text-amber-600 dark:text-amber-400">100 xal = 1 AZN endirim</strong>. Növbəti alışınızda endirim olaraq istifadə edə bilərsiniz. Bonus xallar <strong class="text-emerald-600 dark:text-emerald-400">heç vaxt sönmür</strong>.</p>
      <p>Dost dəvət etsən — qeydiyyatdan keçəndə hər ikiniz <strong class="text-ink-900 dark:text-white">50 bonus xal</strong> alırsız.</p>`,
  },
  {
    id: 9,
    category: "digital",
    title: "Netflix/Spotify abunəliyi orijinaldırmı?",
    description: `<p>Bəli, bütün DolPh Digital abunələri <strong class="text-emerald-600 dark:text-emerald-400">100% orijinaldır</strong> və xidmət sahibinin rəsmi platformasında işləyir.</p>
      <p>Ödənişdən sonra hesab məlumatları (e-poçt + şifrə) e-poçtunuza göndərilir. Hesab tamamilə sizə keçir — şifrəni dəyişə bilərsiniz.</p>`,
  },
  {
    id: 10,
    category: "tech",
    title: "Hesabımı necə təhlükəsiz saxlayım?",
    description: `<ul class="list-disc pl-4 space-y-1 marker:text-brand-500">
        <li>Güclü şifrə seçin (min 8 simvol, böyük/kiçik hərf, rəqəm, xüsusi simvol)</li>
        <li><strong class="text-ink-900 dark:text-white">2FA</strong> (iki amili doğrulama) aktivləşdirin — Tənzimləmələr → Təhlükəsizlik</li>
        <li>Şifrəni heç kimlə paylaşmayın</li>
        <li>Şübhəli linklərə klikləmə, rəsmi DolPhGame.com saytından istifadə edin</li>
      </ul>`,
  },
];

const search = ref("");
const activeCategory = ref("all");
const openIndex = ref<number | null>(0);
const toggle = (i: number) => (openIndex.value = openIndex.value === i ? null : i);

const filteredFaqs = computed(() => {
  let list = faqs;
  if (activeCategory.value !== "all") {
    list = list.filter((f) => f.category === activeCategory.value);
  }
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase();
    list = list.filter((f) => f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
  }
  return list;
});
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">

    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px] text-ink-500 dark:text-ink-400 mb-4">
      <nuxt-link to="/" class="hover:text-brand-500 transition">Ana səhifə</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <span class="font-semibold text-ink-900 dark:text-white">Yardım mərkəzi</span>
    </nav>

    <!-- Page title -->
    <div class="flex items-center justify-between gap-4 mb-5 flex-wrap">
      <div>
        <h1 class="text-[22px] md:text-[26px] font-black tracking-tight text-ink-900 dark:text-white leading-tight">Yardım mərkəzi</h1>
        <p class="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400">Ən çox verilən sualların cavablarını burada tapın.</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <span class="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11.5px] font-bold ring-1 ring-emerald-500/20">
          <span class="relative w-1.5 h-1.5 shrink-0">
            <span class="absolute inset-0 rounded-full bg-emerald-500"></span>
            <span class="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60"></span>
          </span>
          Dəstək 7/24 aktiv
        </span>
        <a :href="waLink" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11.5px] font-bold transition shadow-soft">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A8 8 0 006.5 17.4L5 22l4.7-1.5a8 8 0 1011.9-10.2 7.92 7.92 0 00-4 2zM12 4a8 8 0 11-8 8 8 8 0 018-8z"/></svg>
          WhatsApp
        </a>
      </div>
    </div>

    <!-- Search bar -->
    <div class="relative mb-5">
      <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input v-model="search" type="text" placeholder="Sualını axtar... (məs: çatdırılma, geri qaytarma, bonus)" class="w-full h-12 pl-11 pr-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 placeholder:text-ink-400 text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 transition text-[13.5px]" />
    </div>

    <!-- Two-column layout: category nav + FAQ list -->
    <div class="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5 mb-10">

      <!-- LEFT — Categories (sticky) -->
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <div class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-3">
          <div class="px-2 mb-2 text-[10.5px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400">Kateqoriyalar</div>
          <nav class="space-y-0.5">
            <button v-for="cat in categories" :key="cat.slug" type="button" @click="activeCategory = cat.slug"
                    class="w-full text-left flex items-center gap-2 px-3 h-10 rounded-xl text-[12.5px] transition"
                    :class="activeCategory === cat.slug ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-500 font-bold' : 'text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-white font-semibold'">
              {{ cat.name }}
            </button>
          </nav>
        </div>

        <!-- Contact CTA -->
        <div class="mt-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-emerald-500/10 dark:to-sky-500/10 ring-1 ring-ink-200 dark:ring-ink-800">
          <div class="text-[10.5px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A8 8 0 006.5 17.4L5 22l4.7-1.5a8 8 0 1011.9-10.2 7.92 7.92 0 00-4 2zM12 4a8 8 0 11-8 8 8 8 0 018-8z"/></svg>
            Cavab tapmadın?
          </div>
          <p class="text-[11.5px] text-ink-700 dark:text-ink-200 leading-snug mb-2.5">Dəstək komandamız 7/24 cavabdadır.</p>
          <a :href="waLink" target="_blank" rel="noopener" class="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold transition shadow-soft">
            WhatsApp ilə yaz
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
        </div>
      </aside>

      <!-- RIGHT — FAQ accordions -->
      <div class="space-y-3">
        <div v-if="filteredFaqs.length" class="space-y-3">
          <div
            v-for="(row, key) in filteredFaqs"
            :key="row.id"
            class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden transition"
            :class="{ 'ring-brand-500/40 shadow-card': openIndex === key }"
          >
            <button @click="toggle(key)" type="button" class="w-full flex items-center gap-3 p-4 md:p-5 text-left">
              <span class="shrink-0 w-8 h-8 rounded-xl grid place-items-center text-[12px] font-black tabular-nums transition shadow-soft" :class="openIndex === key ? 'bg-brand-500 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200'">{{ key + 1 }}</span>
              <span class="flex-1 text-[13.5px] md:text-[14px] font-black text-ink-900 dark:text-white">{{ row.title }}</span>
              <svg class="w-4 h-4 shrink-0 text-ink-400 transition-transform" :class="{ 'rotate-180 text-brand-500': openIndex === key }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div v-show="openIndex === key" class="px-4 md:px-5 pb-4 md:pb-5 pl-[60px] md:pl-[68px] -mt-1 text-[13px] text-ink-700 dark:text-ink-200 leading-relaxed space-y-2" v-html="row.description"></div>
          </div>
        </div>
        <div v-else class="text-center py-12 rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-ink-100 dark:bg-ink-800 grid place-items-center mb-3">
            <svg class="w-5 h-5 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          </div>
          <h3 class="text-[13.5px] font-black text-ink-900 dark:text-white">Sual tapılmadı</h3>
          <p class="mt-1 text-[12px] text-ink-500 dark:text-ink-400">Başqa söz axtar və ya dəstək ilə əlaqə saxla.</p>
        </div>
      </div>
    </div>
  </main>
</template>
