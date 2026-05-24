<script setup lang="ts">
import { authStore } from "~/stores/authStore";
import { storeToRefs } from "pinia";
import { useCookie } from "#app/composables/cookie";
import { useRouter } from "vue-router";
import { userStore } from "~/stores/userStore";
import { basketStore } from "~/stores/basketStore";
import { generalStore } from "~/stores/generalStore";
import { loadingStore } from "~/stores/loadingStore";

const { $api, $toast } = useNuxtApp();
const router = useRouter();
const cookie = useCookie("token");
const categories = ref<any>([]);
const general = generalStore();
const { data } = storeToRefs(general);
const userAuth = authStore();
const { setToken, setUserData } = userAuth;
const { user, headers } = storeToRefs(userAuth);
const userStore1 = userStore();
const basketStore1 = basketStore();
const { notifications, notifications_count } = storeToRefs(userStore1);
const { setNotifications } = userStore1;
const { baskets_count } = storeToRefs(basketStore1);
const { setBaskets } = basketStore1;
const { setLoading } = loadingStore();
const tokenCookie = useCookie("token", { maxAge: 60 * 60 * 24 * 200 });

$api.get("public/categories").then((res: any) => {
  categories.value = res;
});

const logout = () => {
  $api.get("user/logout", headers.value);
  cookie.value = null;
  setToken(null);
  setUserData(null);
  profileOpen.value = false;
  window.location = "/" as any;
};

// ---------------- Search ----------------
const search = ref("");
const searchOpen = ref(false);
const closeSearch = () => {
  search.value = "";
};

// ---------------- Theme (Tailwind class-based dark mode) ----------------
const isDark = ref(true);
const applyTheme = () => {
  if (process.client) isDark.value = document.documentElement.classList.contains("dark");
};
const toggleTheme = () => {
  if (!process.client) return;
  const h = document.documentElement;
  h.classList.toggle("dark");
  isDark.value = h.classList.contains("dark");
  try {
    localStorage.setItem("dolph-theme", isDark.value ? "dark" : "light");
  } catch (e) {}
};

// ---------------- Mega-menus (flow layout) ----------------
// mega: null | 'cat' | 'soc' | 'catdrop'
const mega = ref<string | null>(null);
const activeCatSlug = ref<string | null>(null);
const categorySearch = ref("");

const toggleMega = (key: string) => {
  mega.value = mega.value === key ? null : key;
};
const openCatDrop = (slug: string) => {
  if (mega.value === "catdrop" && activeCatSlug.value === slug) {
    mega.value = null;
    activeCatSlug.value = null;
    return;
  }
  mega.value = "catdrop";
  activeCatSlug.value = slug;
};
const closeMega = () => {
  mega.value = null;
  activeCatSlug.value = null;
};

const categoryList = computed<any[]>(() => categories.value?.data ?? []);

const filteredCategories = computed(() => {
  if (!categoryList.value.length) return [];
  const q = categorySearch.value.trim().toLowerCase();
  if (!q) return categoryList.value;
  return categoryList.value.filter((c: any) => c.name?.toLowerCase().includes(q));
});

const activeCat = computed(() =>
  categoryList.value.find((c: any) => c.slug === activeCatSlug.value) || null
);
const activeCatGames = computed(() => activeCat.value?.games ?? []);

// ---------------- Drawers ----------------
const profileOpen = ref(false);
const notifOpen = ref(false);
const cartOpen = ref(false);
const mobileMenuOpen = ref(false);
const mobileRail = ref<string>("all"); // 'all' | category slug

const openProfile = () => {
  if (!user.value) return openAuth("login");
  profileOpen.value = true;
};
const openNotif = () => {
  notifOpen.value = true;
  profileOpen.value = false;
};
const openCart = () => {
  cartOpen.value = true;
};
const openMobileMenu = () => {
  mobileMenuOpen.value = true;
};

// const mobileRailList = computed(() =>
//   mobileRail.value === "all"
//     ? categoryList.value
//     : activeCat.value?.games ?? []
// );


const mobileRailList = computed(() => {
  if (mobileRail.value === "all") return categoryList.value;
  const cat = categoryList.value.find((c: any) => c.slug === mobileRail.value);
  return cat?.games ?? [];
});

// ---------------- Auth modal (new Tailwind design) ----------------
type AuthTab = "login" | "signup" | "reset" | "newpass";
const authModalOpen = ref(false);
const authTab = ref<AuthTab>("login");

const openAuth = (type: AuthTab = "login") => {
  authTab.value = type === "newpass" ? "login" : type;
  authModalOpen.value = true;
};
const closeAuth = () => {
  authModalOpen.value = false;
};

// Login form
const loginEmail = ref("");
const loginPassword = ref("");
const showLoginPw = ref(false);

// Signup form
const regName = ref("");
const regSurname = ref("");
const regEmail = ref("");
const regPhone = ref("");
const regPassword = ref("");
const showRegPw = ref(false);
const regAccept = ref(true);

// Reset / new-password form
const resetEmail = ref("");
const resetOtp = ref("");
const resetPw = ref("");
const resetPwConfirm = ref("");
const showResetPw = ref(false);

// Shared post-auth bootstrap (load user, notifications, basket, then redirect)
const afterAuth = (token: string) => {
  tokenCookie.value = token;
  setToken(token);
  $api.get("user", headers.value).then((res: any) => {
    setUserData(res.data);
    $api.get("user/notifications?count=5", headers.value).then((r: any) => {
      $api.get("user/notifications/count", headers.value).then((rc: any) => {
        setNotifications(r.data, rc.data);
      });
    });
    $api.get("user/basket", headers.value).then((r: any) => setBaskets(r.data));
    $toast.success("Müvəffəqiyyətlə giriş edildi");
    window.location = "/user/dashboard" as any;
  });
};

const doLogin = () => {
  setLoading(true);
  $api
    .post("login", { email: loginEmail.value, password: loginPassword.value })
    .then((res: any) => {
      closeAuth();
      afterAuth(res.data);
    })
    .catch((err: any) => $toast.error(err))
    .finally(() => setLoading(false));
};

const doRegister = () => {
  setLoading(true);
  $api
    .post(
      "register",
      {
        name: regName.value,
        surname: regSurname.value,
        email: regEmail.value,
        phone: regPhone.value,
        password: regPassword.value,
      },
      headers.value
    )
    .then((res: any) => {
      closeAuth();
      afterAuth(res.data);
    })
    .catch((err: any) => $toast.error(err))
    .finally(() => setLoading(false));
};

const doForgotFirst = () => {
  $api
    .post("forgot-password", { email: resetEmail.value })
    .then((res: any) => {
      $toast.success(res.data);
      authTab.value = "newpass";
    })
    .catch((err: any) => $toast.error(err));
};

const doForgotLast = () => {
  setLoading(true);
  $api
    .post("forgot-password/otp", {
      email: resetEmail.value,
      otp: resetOtp.value,
      password: resetPw.value,
      password_confirmation: resetPwConfirm.value,
    })
    .then((res: any) => {
      closeAuth();
      afterAuth(res.data);
    })
    .catch((err: any) => $toast.error(err))
    .finally(() => setLoading(false));
};

// ---------------- Notifications ----------------
const readNotification = (id: any, type: any) => {
  $api.patch("user/notifications/read", { id }, headers.value).then(() => {
    notifOpen.value = false;
    if (type === "payment") router.push("/user/dashboard/payments");
    else if (type === "order") router.push("/user/dashboard/orders");
    else router.push("/user/dashboard/notifications");
    $api.get("user/notifications?count=5", headers.value).then((res: any) => {
      $api.get("user/notifications/count", headers.value).then((response: any) => {
        setNotifications(res.data, response.data);
      });
    });
  });
};

// ---------------- Scroll lock + global handlers ----------------
const anyOverlayOpen = computed(
  () =>
    profileOpen.value ||
    notifOpen.value ||
    cartOpen.value ||
    mobileMenuOpen.value
);

watch(anyOverlayOpen, (open) => {
  if (!process.client) return;
  document.body.style.overflow = open ? "hidden" : "";
});

const onDocClick = (e: MouseEvent) => {
  const t = e.target as HTMLElement;
  if (!t.closest("[data-dolph-nav]")) closeMega();
  if (searchOpen.value && !t.closest("[data-dolph-search]")) searchOpen.value = false;
};
const onKey = (e: KeyboardEvent) => {
  if (e.key !== "Escape") return;
  closeMega();
  closeAuth();
  searchOpen.value = false;
  profileOpen.value = false;
  notifOpen.value = false;
  cartOpen.value = false;
  mobileMenuOpen.value = false;
};

// Allow other parts of the app (e.g. the auth middleware) to open the modal
const onOpenAuthEvent = (e: any) => openAuth(e?.detail === "signup" ? "signup" : "login");

onMounted(() => {
  applyTheme();
  document.addEventListener("click", onDocClick);
  document.addEventListener("keydown", onKey);
  window.addEventListener("dolph-open-auth", onOpenAuthEvent);
});
onBeforeUnmount(() => {
  if (!process.client) return;
  document.removeEventListener("click", onDocClick);
  document.removeEventListener("keydown", onKey);
  window.removeEventListener("dolph-open-auth", onOpenAuthEvent);
  document.body.style.overflow = "";
});

const go = (path: string) => {
  router.push(path);
  mega.value = null;
  mobileMenuOpen.value = false;
};

// Static social-media mega-menu content (design-only; not part of the API).
const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/dolphdigital/", bg: "linear-gradient(135deg,#fbbf24,#ec4899,#9333ea)", icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.7 0 3 0 4.1.1 1 0 1.8.2 2.5.5a5 5 0 012.8 2.8c.3.7.4 1.4.5 2.5V16c0 1.1-.1 1.8-.5 2.5a5 5 0 01-2.8 2.8c-.7.3-1.4.4-2.5.5H8c-1.1 0-1.8-.2-2.5-.5a5 5 0 01-2.8-2.8c-.3-.7-.4-1.4-.5-2.5V8c0-1.1.1-1.8.5-2.5a5 5 0 012.8-2.8c.7-.3 1.4-.4 2.5-.5H12zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.5a1.2 1.2 0 11-2.3 0 1.2 1.2 0 012.3 0zM12 9a3 3 0 110 6 3 3 0 010-6z"/></svg>' },
  { name: "TikTok", href: "#", bg: "#111827", icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 6.3a5.7 5.7 0 01-3.3-1V15a5 5 0 11-5-5v2.4a2.7 2.7 0 102.7 2.7V2.3h2.4a5.7 5.7 0 003.2 3.2v.8z"/></svg>' },
  { name: "YouTube", href: "https://www.youtube.com/@dolphgamecom", bg: "#dc2626", icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.7-.5-5.4a2.8 2.8 0 00-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.6a2.8 2.8 0 00-2 2C1 8.3 1 12 1 12s0 3.7.5 5.4a2.8 2.8 0 002 2C5.3 20 12 20 12 20s6.7 0 8.5-.6a2.8 2.8 0 002-2C23 15.7 23 12 23 12zM10 15.5v-7l6 3.5-6 3.5z"/></svg>' },
  { name: "X / Twitter", href: "#", bg: "#111827", icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h3l-7 8 8 12h-6l-5-7-6 7H2l8-9L2 2h7l4 6 5-6z"/></svg>' },
  { name: "Facebook", href: "#", bg: "#1877F2", icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.6 9.9v-7H8v-3h2.4V9.5c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3H15c-1.2 0-1.5.7-1.5 1.5V12h2.7l-.4 3h-2.3v7A10 10 0 0022 12z"/></svg>' },
  { name: "Telegram", href: "#", bg: "#229ED9", icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 3L2 10l6 2 2 6 3-4 5 4 4-15z"/></svg>' },
  { name: "Spotify", href: "#", bg: "#1DB954", icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="#1DB954"/><path d="M7 10c3-1 7-1 10 1M8 13c2.5-.8 5.5-.8 8 .8M9 16c2-.6 4.2-.5 6 .6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>' },
  { name: "Discord", href: "#", bg: "#5865F2", icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4a19 19 0 00-5-1.5l-.2.5A14 14 0 0012 2c-1 0-2 0-3 .2L9 2a19 19 0 00-5 1.5A20 20 0 002 17a14 14 0 004 2l1-1a9 9 0 01-2-1l.5-.3c3.8 1.8 7.9 1.8 11.7 0l.5.3a9 9 0 01-2 1l1 1a14 14 0 004-2c.3-4.8-1-9.3-2.7-13zM8.5 14a2 2 0 110-4 2 2 0 010 4zm7 0a2 2 0 110-4 2 2 0 010 4z"/></svg>' },
];
</script>

<template>
  <div>
    <!-- ════════ TIER 1 — TOP UTILITY BAR ════════ -->
    <div class="hidden md:block bg-ink-100 dark:bg-ink-950 border-b border-ink-200 dark:border-ink-800">
      <div class="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between text-xs">
        <div class="flex items-center gap-5">
          <nuxt-link to="/games" class="flex items-center gap-1.5 font-semibold text-ink-600 dark:text-ink-300 hover:text-brand-500 transition">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12a2 2 0 002 2h14v-4"/><path d="M18 12a2 2 0 000 4h4v-4z"/></svg>
            KAMPANİYALAR
          </nuxt-link>
          <nuxt-link to="/blogs" class="flex items-center gap-1.5 font-semibold text-ink-600 dark:text-ink-300 hover:text-brand-500 transition">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            BLOQ
          </nuxt-link>
          <nuxt-link to="/pages/faq" class="flex items-center gap-1.5 font-semibold text-ink-600 dark:text-ink-300 hover:text-brand-500 transition">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
            KÖMƏK
          </nuxt-link>
        </div>

        <div class="flex items-center gap-3">
          <nuxt-link to="/pages/about" class="hidden lg:flex items-center gap-1.5 text-ink-600 dark:text-ink-300 hover:text-brand-500 transition px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-ink-900/50">
            <svg class="w-3.5 h-3.5 text-sky-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span class="font-semibold">DolPh <span class="text-brand-500">Premium</span></span>
          </nuxt-link>
          <span class="w-px h-4 bg-ink-200 dark:bg-ink-800 hidden lg:block"></span>

          <!-- Dark / Light SLIDER toggle -->
          <button @click="toggleTheme" aria-label="Temanı dəyişdir" title="Tema dəyişdir" type="button"
            class="relative flex items-center gap-1.5 w-[68px] h-7 rounded-full bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 transition-all hover:border-brand-500 hover:shadow-sm overflow-hidden">
            <span class="z-10 w-7 grid place-items-center text-amber-500">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            </span>
            <span class="z-10 w-7 grid place-items-center text-sky-400 ml-auto mr-1">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            </span>
            <span class="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 shadow-pop transition-transform duration-300 dark:translate-x-[34px]"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- ════════ TIER 2 — MAIN HEADER ════════ -->
    <header class="sticky top-0 z-40 bg-white/95 dark:bg-ink-900/95 backdrop-blur border-b border-ink-200 dark:border-ink-800" data-dolph-nav>
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-8">
        <!-- Mobile burger -->
        <button @click="openMobileMenu" type="button" aria-label="Menyu" class="md:hidden w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 grid place-items-center hover:bg-ink-200 dark:hover:bg-ink-700 active:scale-95 transition shrink-0">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>

        <!-- Logo -->
        <nuxt-link to="/" title="DolPh Game — Ana səhifə" class="group flex items-center gap-2 md:gap-2.5 shrink-0">
          <span class="relative w-9 h-9 md:w-11 md:h-11 grid place-items-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
            <img :src="data?.logo" alt="DolPh Game" class="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_4px_12px_rgba(255,72,0,0.45)]" />
            <span aria-hidden="true" class="absolute inset-0 anim-glow-breath -z-10 bg-brand-500/40 rounded-xl blur-lg"></span>
          </span>
          <div class="leading-tight">
            <div class="font-black tracking-tight text-base md:text-xl text-ink-900 dark:text-white">DolPh<span class="text-brand-500">Game</span></div>
            <div class="hidden sm:block text-[10px] text-ink-400 dark:text-ink-500 -mt-0.5 tracking-wider uppercase">Oyunçu üçün, oyunçudan</div>
          </div>
        </nuxt-link>

        <!-- BIG SEARCH -->
        <div data-dolph-search class="hidden md:flex flex-1 relative glow-focus rounded-2xl">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 dark:text-ink-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input v-model="search" @focus="searchOpen = true" type="text" placeholder="Oyun, məhsul və ya e-pin axtar…" autocomplete="off"
            class="w-full h-12 pl-11 pr-24 rounded-2xl bg-ink-100 dark:bg-ink-800 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm font-medium transition placeholder:text-ink-400 dark:placeholder:text-ink-500"/>
          <button v-if="search.length" @click="closeSearch" type="button" aria-label="Təmizlə" class="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full grid place-items-center text-ink-400 hover:text-ink-700 dark:hover:text-white hover:bg-ink-200 dark:hover:bg-ink-700 transition">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <kbd class="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 text-[10px] font-mono text-ink-400">⌘ K</kbd>

          <!-- Search dropdown -->
          <div v-show="searchOpen" class="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl shadow-lift z-50 overflow-hidden">
            <!-- Live results -->
            <div v-if="search.length > 0" class="max-h-[60vh] overflow-y-auto">
              <search-box @close-search="closeSearch" :q="search" />
            </div>
            <!-- Default: popular -->
            <div v-else class="p-4">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-3.5 h-3.5 text-brand-500" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14a8 8 0 1016 0C20 9.26 17.73 5.02 13.5.67z"/></svg>
                <span class="text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">Populyar kateqoriyalar</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button v-for="cat in categoryList.slice(0, 8)" :key="cat.id" @click="go('/category/' + cat.slug)" class="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-ink-100 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 hover:bg-brand-500 hover:text-white hover:border-brand-500 text-xs font-semibold text-ink-700 dark:text-ink-200 transition">
                  {{ cat.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right-side auth / user area -->
        <div class="ml-auto flex items-center gap-2 md:gap-3 shrink-0">
          <!-- GUEST -->
          <div v-if="!user" class="flex items-center gap-2 md:gap-3">
            <button @click="openCart" type="button" title="Səbət" class="hidden md:grid relative w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 place-items-center hover:bg-ink-200 dark:hover:bg-ink-700 hover:scale-105 active:scale-95 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              <span v-if="baskets_count > 0" class="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] w-4 h-4 rounded-full grid place-items-center">{{ baskets_count }}</span>
            </button>
            <button @click="openAuth('signup')" type="button" title="Qeydiyyatdan keç" class="hidden md:flex ripple shine-wrap h-11 px-4 md:px-5 rounded-full bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-sm font-bold shadow-pop transition items-center gap-2 cursor-pointer">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
              <span>Qeydiyyat</span>
            </button>
            <button @click="openAuth('login')" type="button" title="Hesabına daxil ol" class="hidden md:flex ripple shine-wrap h-11 px-4 md:px-5 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-bold shadow-pop transition items-center gap-2 cursor-pointer">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><path d="M10 17l5-5-5-5M15 12H3"/></svg>
              <span>Daxil ol</span>
            </button>
            <div class="md:hidden flex items-center gap-1.5">
              <button @click="openAuth('login')" type="button" title="Daxil ol" class="ripple h-9 px-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-[11px] font-bold shadow-pop transition flex items-center gap-1 cursor-pointer">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><path d="M10 17l5-5-5-5M15 12H3"/></svg>
                <span>Daxil ol</span>
              </button>
              <button @click="openAuth('signup')" type="button" title="Qeydiyyatdan keç" class="ripple h-9 px-2.5 rounded-full bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-[11px] font-bold shadow-pop transition flex items-center gap-1 cursor-pointer">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
                <span>Qeydiyyat</span>
              </button>
            </div>
          </div>

          <!-- LOGGED-IN -->
          <div v-else class="flex items-center gap-2">
            <nuxt-link to="/payments/online" title="Balans yüklə"
              class="hidden md:flex relative ripple shine-wrap h-11 pl-3 pr-4 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-sm font-extrabold shadow-pop transition items-center gap-2 whitespace-nowrap">
              <span aria-hidden="true" class="absolute inset-0 rounded-xl bg-brand-500/45 blur-md -z-10 anim-glow-breath"></span>
              <span class="w-7 h-7 rounded-lg bg-white/25 grid place-items-center">
                <svg class="w-4 h-4 gh-wiggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M12 15h4"/></svg>
              </span>
              <span class="hidden md:inline">Balans Yüklə</span>
            </nuxt-link>
            <button @click="openNotif" type="button" title="Bildirişlər" class="relative w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 grid place-items-center hover:bg-ink-200 dark:hover:bg-ink-700 hover:scale-105 active:scale-95 transition">
              <svg class="w-4 h-4 text-ink-700 dark:text-ink-200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span v-if="notifications_count > 0" class="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold w-4 h-4 rounded-full grid place-items-center ring-2 ring-white dark:ring-ink-900">{{ notifications_count }}</span>
            </button>
            <button @click="openCart" type="button" title="Səbət" class="relative w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 grid place-items-center hover:bg-ink-200 dark:hover:bg-ink-700 hover:scale-105 active:scale-95 transition">
              <svg class="w-4 h-4 text-ink-700 dark:text-ink-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              <span v-if="baskets_count > 0" class="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold w-4 h-4 rounded-full grid place-items-center ring-2 ring-white dark:ring-ink-900">{{ baskets_count }}</span>
            </button>
            <button @click="openProfile" type="button" title="Hesabım" class="h-11 flex items-center gap-2 pl-1 pr-2.5 sm:pr-3 rounded-full bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 border border-transparent hover:border-brand-500 transition">
              <span class="relative w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white font-bold text-sm shadow-pop overflow-hidden">
                <img v-if="user.avatar" :src="user.avatar" :alt="user.full_name" class="w-full h-full object-cover" />
                <template v-else>{{ (user.full_name || 'DG').slice(0, 2).toUpperCase() }}</template>
                <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-ink-100 dark:ring-ink-800"></span>
              </span>
              <span class="block text-left leading-tight">
                <span class="hidden sm:block text-[11px] font-semibold text-ink-900 dark:text-white">{{ user.full_name }}</span>
                <span class="block text-[11px] sm:text-[10px] font-bold text-brand-500 whitespace-nowrap">{{ user.balance }} <span class="text-ink-400 dark:text-ink-500 font-medium">AZN</span></span>
              </span>
              <svg class="hidden sm:block w-3 h-3 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- MOBILE SEARCH BAR -->
      <div class="md:hidden px-4 pb-3 pt-1 flex items-center gap-2" data-dolph-search>
        <div class="relative flex-1 min-w-0">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 dark:text-ink-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input v-model="search" @focus="searchOpen = true" type="text" placeholder="Oyun, məhsul və ya e-pin axtar…" class="w-full h-12 pl-11 pr-4 rounded-2xl bg-ink-100 dark:bg-ink-800 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm font-medium transition placeholder:text-ink-400 dark:placeholder:text-ink-500"/>
          <div v-if="search.length > 0" class="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl shadow-lift z-50 overflow-hidden max-h-[60vh] overflow-y-auto">
            <search-box @close-search="closeSearch" :q="search" />
          </div>
        </div>
        <button @click="openCart" type="button" title="Səbət" class="relative w-12 h-12 rounded-2xl bg-ink-100 dark:bg-ink-800 grid place-items-center hover:bg-ink-200 dark:hover:bg-ink-700 active:scale-95 transition shrink-0">
          <svg class="w-5 h-5 text-ink-700 dark:text-ink-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
          <span v-if="baskets_count > 0" class="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold w-4 h-4 rounded-full grid place-items-center ring-2 ring-white dark:ring-ink-900">{{ baskets_count }}</span>
        </button>
      </div>

      <!-- ════════ TIER 3 — GAME PILL NAV (desktop) ════════ -->
      <nav class="hidden md:block relative border-t border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900">
        <div class="max-w-7xl mx-auto px-4 md:px-6 flex items-stretch py-2.5 text-sm">
          <!-- Kateqoriyalar trigger -->
          <div class="flex items-center shrink-0 pr-3 relative bg-white dark:bg-ink-900 z-10">
            <button @click.stop="toggleMega('cat')" type="button" class="group shrink-0 flex items-center gap-2 font-bold text-white px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 transition" aria-haspopup="true" :aria-expanded="mega === 'cat'">
              <svg class="w-4 h-4 gh-scale transition" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
              Kateqoriyalar
              <svg class="w-3 h-3 opacity-80 transition-transform" :class="{ 'rotate-180': mega === 'cat' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <span aria-hidden="true" class="pointer-events-none absolute top-0 bottom-0 left-full w-4 bg-gradient-to-r from-white dark:from-ink-900 to-transparent"></span>
          </div>

          <!-- Scrollable pill rail -->
          <div class="flex-1 min-w-0 overflow-x-auto no-scrollbar">
            <div class="flex items-center gap-2 whitespace-nowrap">
              <!-- Sosial Media (static mega) -->
              <button @click.stop="toggleMega('soc')" type="button" title="Sosial media abunəlikləri" class="group shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition" aria-haspopup="true" :aria-expanded="mega === 'soc'">
                <span class="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-500/15 grid place-items-center text-rose-500 gh-scale transition">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9.5-9.5C.5 7.5 3 4 6.5 4c1.8 0 3.5 1 5.5 3 2-2 3.7-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.5 12 21 12 21z"/></svg>
                </span>
                <span class="font-semibold text-ink-700 dark:text-ink-200">Sosial Media</span>
                <svg class="w-3 h-3 opacity-60 transition-transform" :class="{ 'rotate-180': mega === 'soc' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </button>

              <!-- Real category pills -->
              <button v-for="cat in categoryList" :key="cat.id" @click.stop="openCatDrop(cat.slug)" type="button" :title="cat.name" aria-haspopup="true" :aria-expanded="mega === 'catdrop' && activeCatSlug === cat.slug"
                class="group shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition">
                <span class="w-7 h-7 rounded-lg bg-ink-100 dark:bg-ink-800 grid place-items-center gh-scale transition overflow-hidden" :style="cat.color ? { background: cat.color + ' !important' } : {}">
                  <img :src="cat.image" :alt="cat.name" class="w-5 h-5 object-contain" />
                </span>
                <span class="font-semibold text-ink-700 dark:text-ink-200">{{ cat.name }}</span>
                <svg class="w-3 h-3 opacity-60 transition-transform" :class="{ 'rotate-180': mega === 'catdrop' && activeCatSlug === cat.slug }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- KATEQORİYALAR MEGA-MENU -->
        <div v-show="mega === 'cat'" class="relative bg-white dark:bg-ink-900 border-t border-ink-200 dark:border-ink-800 overflow-hidden">
          <div class="max-w-7xl mx-auto px-4 md:px-6 py-6 anim-fade-down">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-3">
                <span class="w-9 h-9 rounded-xl bg-brand-500 grid place-items-center text-white shadow-pop">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
                </span>
                <div>
                  <div class="text-lg font-extrabold text-ink-900 dark:text-white leading-tight">Kateqoriyalar</div>
                  <div class="text-[11px] text-ink-500 dark:text-ink-400">Bütün oyunlar və məhsullar</div>
                </div>
              </div>
              <div class="hidden md:flex items-center gap-3">
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                  <input v-model="categorySearch" type="text" placeholder="Kateqoriyalarda axtar…" class="h-9 w-64 pl-9 pr-3 rounded-lg bg-ink-100 dark:bg-ink-800 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-xs font-medium transition placeholder:text-ink-400"/>
                </div>
                <nuxt-link to="/games" @click="closeMega" class="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1">
                  Hamısına bax
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </nuxt-link>
                <button @click="closeMega" type="button" aria-label="Bağla" class="w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 grid place-items-center text-ink-500 transition">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              <nuxt-link v-for="cat in filteredCategories" :key="cat.id" :to="'/category/' + cat.slug" @click="closeMega" class="group flex items-center gap-2.5 p-2.5 rounded-xl bg-ink-50 dark:bg-ink-800/60 hover:bg-white dark:hover:bg-ink-800 border border-transparent hover:border-brand-500 hover:-translate-y-0.5 hover:shadow-pop transition">
                <span class="w-10 h-10 rounded-lg bg-white dark:bg-ink-700 grid place-items-center shrink-0 shadow-sm overflow-hidden" :style="cat.color ? { background: cat.color + ' !important' } : {}">
                  <img :src="cat.image" :alt="cat.name" class="w-7 h-7 object-contain" />
                </span>
                <span class="text-sm font-semibold text-ink-800 dark:text-white truncate">{{ cat.name }}</span>
              </nuxt-link>
              <div v-if="categorySearch && !filteredCategories.length" class="col-span-full text-sm text-ink-500 dark:text-ink-400 py-4">
                "{{ categorySearch }}" üzrə heç bir kateqoriya tapılmadı.
              </div>
            </div>

            <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
              <nuxt-link to="/games" @click="closeMega" class="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-pop transition">
                <span class="w-10 h-10 rounded-lg bg-white/20 grid place-items-center"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span>
                <div>
                  <div class="font-bold text-sm">Kampaniyalar</div>
                  <div class="text-[11px] opacity-90">Aktual endirimlər</div>
                </div>
              </nuxt-link>
              <nuxt-link to="/pages/about" @click="closeMega" class="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:shadow-pop transition">
                <span class="w-10 h-10 rounded-lg bg-white/20 grid place-items-center"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>
                <div>
                  <div class="font-bold text-sm">DolPh Premium</div>
                  <div class="text-[11px] opacity-90">Üzvlər üçün bonus</div>
                </div>
              </nuxt-link>
              <nuxt-link to="/blogs" @click="closeMega" class="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-pop transition">
                <span class="w-10 h-10 rounded-lg bg-white/20 grid place-items-center"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.39 7.36H22l-6.31 4.58 2.4 7.41L12 16.77l-6.09 4.58 2.4-7.41L2 9.36h7.61z"/></svg></span>
                <div>
                  <div class="font-bold text-sm">Yeni əlavələr</div>
                  <div class="text-[11px] opacity-90">Ən son kataloq</div>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>

        <!-- SOSİAL MEDİA MEGA-MENU (static design content) -->
        <div v-show="mega === 'soc'" class="relative bg-white dark:bg-ink-900 border-t border-ink-200 dark:border-ink-800 overflow-hidden">
          <div class="max-w-7xl mx-auto px-4 md:px-6 py-6 anim-fade-down">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-3">
                <span class="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 grid place-items-center text-white shadow-pop">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9.5-9.5C.5 7.5 3 4 6.5 4c1.8 0 3.5 1 5.5 3 2-2 3.7-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.5 12 21 12 21z"/></svg>
                </span>
                <div>
                  <div class="text-lg font-extrabold text-ink-900 dark:text-white leading-tight">Sosial Media</div>
                  <div class="text-[11px] text-ink-500 dark:text-ink-400">Abunəliklər və takipçi xidmətləri</div>
                </div>
              </div>
              <button @click="closeMega" type="button" aria-label="Bağla" class="hidden md:grid w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 place-items-center text-ink-500 transition">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
              <a v-for="s in socialLinks" :key="s.name" :href="s.href" target="_blank" class="group flex flex-col items-center gap-2 p-3 rounded-xl bg-ink-50 dark:bg-ink-800/60 hover:bg-white dark:hover:bg-ink-800 border border-transparent hover:border-brand-500 hover:-translate-y-0.5 hover:shadow-pop transition">
                <span class="w-11 h-11 rounded-xl grid place-items-center text-white shadow-sm" :style="{ background: s.bg }" v-html="s.icon"></span>
                <span class="text-[11px] font-semibold text-ink-800 dark:text-white">{{ s.name }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- PER-CATEGORY DROPDOWN -->
        <div v-show="mega === 'catdrop'" class="relative bg-white dark:bg-ink-900 border-t border-ink-200 dark:border-ink-800 overflow-hidden">
          <div class="max-w-7xl mx-auto px-4 md:px-6 py-6 anim-fade-down">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl grid place-items-center shadow-sm bg-ink-100 dark:bg-ink-800 overflow-hidden" :style="activeCat?.color ? { background: activeCat.color + ' !important' } : {}">
                  <img v-if="activeCat?.image" :src="activeCat.image" :alt="activeCat?.name" class="w-7 h-7 object-contain" />
                </span>
                <div>
                  <div class="text-lg font-extrabold text-ink-900 dark:text-white leading-tight">{{ activeCat?.name }}</div>
                  <div class="text-[11px] text-ink-500 dark:text-ink-400">{{ activeCatGames.length }} məhsul</div>
                </div>
              </div>
              <div class="hidden md:flex items-center gap-3">
                <nuxt-link :to="'/category/' + activeCatSlug" @click="closeMega" class="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1 transition">
                  Hamısına bax
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </nuxt-link>
                <button @click="closeMega" type="button" aria-label="Bağla" class="w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 grid place-items-center text-ink-500 transition">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              <nuxt-link v-for="game in activeCatGames" :key="game.id" :to="'/game/' + game.slug" @click="closeMega" class="cat-drop-card group flex items-center gap-2.5 p-2.5 rounded-xl bg-ink-50 dark:bg-ink-800/60 border border-transparent">
                <span class="w-10 h-10 rounded-lg bg-white dark:bg-ink-700 grid place-items-center shrink-0 shadow-sm overflow-hidden">
                  <img :src="game.image" :alt="game.name" class="w-7 h-7 object-contain" />
                </span>
                <span class="text-sm font-semibold text-ink-800 dark:text-white truncate">{{ game.name }}</span>
              </nuxt-link>
              <div v-if="!activeCatGames.length" class="col-span-full text-sm text-ink-500 dark:text-ink-400 py-4">Bu kateqoriyada məhsul yoxdur.</div>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- ════════ AUTH MODAL (new Tailwind design) ════════ -->
    <div v-if="!user && authModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
      <div @click="closeAuth" class="absolute inset-0 bg-ink-900/60 dark:bg-ink-950/80 backdrop-blur-sm"></div>

      <div class="relative w-full max-w-md bg-white dark:bg-ink-900 rounded-3xl shadow-lift border border-ink-200 dark:border-ink-800 overflow-hidden anim-pop">
        <!-- Header -->
        <div class="relative">
          <div class="flex items-center justify-between px-5 pt-5 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-xl bg-brand-500 grid place-items-center text-white shadow-pop">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3l12 9-12 9V3z"/></svg>
              </span>
              <div class="leading-tight">
                <div class="text-sm font-extrabold text-ink-900 dark:text-white">DolPh<span class="text-brand-500">•</span>Game</div>
                <div class="text-[10px] text-ink-400 tracking-wider uppercase">Hesab</div>
              </div>
            </div>
            <button @click="closeAuth" type="button" aria-label="Bağla" class="w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 grid place-items-center text-ink-500 transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Tab switcher (login / signup) -->
          <div v-if="authTab === 'login' || authTab === 'signup'" class="px-5 pb-4">
            <div class="relative grid grid-cols-2 bg-ink-100 dark:bg-ink-800 rounded-xl p-1">
              <button @click="authTab = 'login'" type="button" class="relative z-10 h-10 rounded-lg text-sm font-bold transition" :class="authTab === 'login' ? 'text-ink-900 dark:text-white' : 'text-ink-500 dark:text-ink-400'">Giriş</button>
              <button @click="authTab = 'signup'" type="button" class="relative z-10 h-10 rounded-lg text-sm font-bold transition" :class="authTab === 'signup' ? 'text-ink-900 dark:text-white' : 'text-ink-500 dark:text-ink-400'">Qeydiyyat</button>
              <span class="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-white dark:bg-ink-900 shadow-sm transition-transform" :class="authTab === 'signup' ? 'translate-x-full' : 'translate-x-0'"></span>
            </div>
          </div>
          <!-- Reset header -->
          <div v-else class="px-5 pb-4">
            <div class="flex items-center gap-2">
              <button @click="authTab = 'login'" type="button" class="w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 grid place-items-center text-ink-500 transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <span class="text-sm font-extrabold text-ink-900 dark:text-white">Şifrə bərpası</span>
            </div>
          </div>
        </div>

        <!-- LOGIN PANEL -->
        <form v-show="authTab === 'login'" @submit.prevent="doLogin" class="px-5 pb-5 space-y-3" autocomplete="on">
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">E-mail</label>
            <div class="relative glow-focus rounded-xl">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
              <input v-model="loginEmail" type="email" placeholder="ornek@mail.com" class="w-full h-11 pl-10 pr-3 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm transition placeholder:text-ink-400"/>
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">Şifrə</label>
            <div class="relative glow-focus rounded-xl">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input v-model="loginPassword" :type="showLoginPw ? 'text' : 'password'" placeholder="••••••••" class="w-full h-11 pl-10 pr-10 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm transition placeholder:text-ink-400"/>
              <button @click="showLoginPw = !showLoginPw" type="button" aria-label="Şifrəni göstər" class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700 grid place-items-center text-ink-400 hover:text-ink-700 dark:hover:text-white transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between pt-1">
            <label class="flex items-center gap-2 text-xs text-ink-600 dark:text-ink-300 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 rounded border-ink-300 dark:border-ink-600 text-brand-500 focus:ring-brand-500"/>
              Məni xatırla
            </label>
            <button @click="authTab = 'reset'" type="button" class="text-xs font-semibold text-brand-500 hover:text-brand-600">Şifrəni unutmusan?</button>
          </div>
          <button type="submit" class="ripple shine-wrap w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.98] text-white font-bold shadow-pop transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><path d="M10 17l5-5-5-5M15 12H3"/></svg>
            Daxil ol
          </button>
          <p class="text-[11px] text-center text-ink-500 dark:text-ink-400 pt-1">
            Hesabın yoxdur? <button @click="authTab = 'signup'" type="button" class="font-bold text-brand-500 hover:text-brand-600">Qeydiyyatdan keç</button>
          </p>
        </form>

        <!-- SIGNUP PANEL -->
        <form v-show="authTab === 'signup'" @submit.prevent="doRegister" class="px-5 pb-5 space-y-3" autocomplete="on">
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">Ad</label>
              <input v-model="regName" type="text" placeholder="Adın" class="w-full h-11 px-3 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm transition placeholder:text-ink-400"/>
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">Soyad</label>
              <input v-model="regSurname" type="text" placeholder="Soyadın" class="w-full h-11 px-3 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm transition placeholder:text-ink-400"/>
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">E-mail</label>
            <div class="relative glow-focus rounded-xl">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
              <input v-model="regEmail" type="email" placeholder="ornek@mail.com" class="w-full h-11 pl-10 pr-3 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm transition placeholder:text-ink-400"/>
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">Telefon</label>
            <div class="relative glow-focus rounded-xl">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm font-semibold text-ink-700 dark:text-ink-200 pointer-events-none">
                <span class="text-base">🇦🇿</span>
              </span>
              <input v-model="regPhone" v-maska data-maska="(###)-###-##-##" type="tel" inputmode="numeric" placeholder="(050)-123-45-67" class="w-full h-11 pl-10 pr-3 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm transition placeholder:text-ink-400 tabular-nums tracking-wide"/>
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">Şifrə</label>
            <div class="relative glow-focus rounded-xl">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input v-model="regPassword" :type="showRegPw ? 'text' : 'password'" placeholder="Ən az 8 simvol" class="w-full h-11 pl-10 pr-10 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm transition placeholder:text-ink-400"/>
              <button @click="showRegPw = !showRegPw" type="button" aria-label="Şifrəni göstər" class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700 grid place-items-center text-ink-400 hover:text-ink-700 dark:hover:text-white transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <label class="flex items-start gap-2 text-xs text-ink-600 dark:text-ink-300 cursor-pointer pt-1">
            <input v-model="regAccept" type="checkbox" class="w-4 h-4 mt-0.5 rounded border-ink-300 dark:border-ink-600 text-brand-500 focus:ring-brand-500"/>
            <span><nuxt-link to="/pages/privacy" target="_blank" class="text-brand-500 hover:underline font-semibold">İstifadə şərtləri</nuxt-link> və <nuxt-link to="/pages/privacy" target="_blank" class="text-brand-500 hover:underline font-semibold">məxfilik siyasəti</nuxt-link> ilə razıyam.</span>
          </label>
          <button type="submit" class="ripple shine-wrap w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.98] text-white font-bold shadow-pop transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
            Qeydiyyatdan keç
          </button>
          <p class="text-[11px] text-center text-ink-500 dark:text-ink-400 pt-1">
            Artıq hesabın var? <button @click="authTab = 'login'" type="button" class="font-bold text-brand-500 hover:text-brand-600">Daxil ol</button>
          </p>
        </form>

        <!-- RESET PANEL (request OTP) -->
        <form v-show="authTab === 'reset'" @submit.prevent="doForgotFirst" class="px-5 pb-5 space-y-3" autocomplete="on">
          <p class="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">Şifrənizi unutmusunuz? E-poçt ünvanınızı daxil edin — sizə bərpa kodu göndərəcəyik.</p>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">E-mail</label>
            <div class="relative glow-focus rounded-xl">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
              <input v-model="resetEmail" type="email" placeholder="ornek@mail.com" class="w-full h-11 pl-10 pr-3 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm transition placeholder:text-ink-400"/>
            </div>
          </div>
          <button type="submit" class="ripple shine-wrap w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.98] text-white font-bold shadow-pop transition flex items-center justify-center gap-2">
            Şifrəni yenilə
          </button>
        </form>

        <!-- NEW PASSWORD PANEL (OTP + new password) -->
        <form v-show="authTab === 'newpass'" @submit.prevent="doForgotLast" class="px-5 pb-5 space-y-3" autocomplete="on">
          <p class="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">E-poçtunuza göndərilən OTP kodu və yeni şifrənizi daxil edin.</p>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">OTP kod</label>
            <input v-model="resetOtp" type="text" placeholder="------" class="w-full h-11 px-3 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm transition placeholder:text-ink-400 tracking-[0.4em] text-center font-bold"/>
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">Yeni şifrə</label>
            <div class="relative glow-focus rounded-xl">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input v-model="resetPw" :type="showResetPw ? 'text' : 'password'" placeholder="••••••••" class="w-full h-11 pl-10 pr-10 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm transition placeholder:text-ink-400"/>
              <button @click="showResetPw = !showResetPw" type="button" aria-label="Şifrəni göstər" class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700 grid place-items-center text-ink-400 hover:text-ink-700 dark:hover:text-white transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1.5">Yeni şifrə təkrar</label>
            <div class="relative glow-focus rounded-xl">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input v-model="resetPwConfirm" :type="showResetPw ? 'text' : 'password'" placeholder="••••••••" class="w-full h-11 pl-10 pr-3 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 outline-none text-sm transition placeholder:text-ink-400"/>
            </div>
          </div>
          <button type="submit" class="ripple shine-wrap w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.98] text-white font-bold shadow-pop transition flex items-center justify-center gap-2">
            Şifrəni yenilə
          </button>
        </form>
      </div>
    </div>

    <!-- ════════ PROFILE DRAWER ════════ -->
    <aside class="fixed inset-0 z-[55] transition-opacity" :class="profileOpen ? '' : 'pointer-events-none'">
      <div @click="profileOpen = false" class="absolute inset-0 bg-ink-900/50 dark:bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300" :class="profileOpen ? 'opacity-100' : 'opacity-0'"></div>
      <div class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-ink-900 shadow-lift border-l border-ink-200 dark:border-ink-800 transition-transform duration-300 flex flex-col" :class="profileOpen ? 'translate-x-0' : 'translate-x-full'">
        <div class="flex items-center justify-between px-5 h-16 border-b border-ink-200 dark:border-ink-800">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-brand-500 grid place-items-center text-white">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <h2 class="text-lg font-extrabold text-ink-900 dark:text-white">Hesabım</h2>
          </div>
          <button @click="profileOpen = false" type="button" aria-label="Bağla" class="w-9 h-9 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 grid place-items-center text-ink-500 transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div v-if="user" class="flex-1 overflow-y-auto p-5 space-y-5">
          <!-- User card -->
          <div class="relative flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-pop overflow-hidden">
            <span aria-hidden="true" class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none"></span>
            <span class="relative w-14 h-14 rounded-full bg-white/20 grid place-items-center font-extrabold text-xl backdrop-blur-sm ring-2 ring-white/30 shrink-0 overflow-hidden">
              <img v-if="user.avatar" :src="user.avatar" :alt="user.full_name" class="w-full h-full object-cover" />
              <template v-else>{{ (user.full_name || 'DG').slice(0, 2).toUpperCase() }}</template>
              <span class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-brand-600"></span>
            </span>
            <div class="relative flex-1 min-w-0">
              <div class="font-extrabold truncate leading-tight">{{ user.full_name }}</div>
              <div class="text-[11px] opacity-90 truncate mt-0.5">{{ user.email }}</div>
              <div class="mt-1 inline-flex items-center gap-1 text-[10px] font-bold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md">
                Müştəri kodu: <span class="font-black">{{ user.id }}</span>
              </div>
            </div>
          </div>

          <!-- Balans & Bonus -->
          <div class="grid grid-cols-2 gap-3">
            <div class="relative rounded-2xl bg-white dark:bg-ink-800/60 border border-ink-200 dark:border-ink-800 p-3.5 flex flex-col overflow-hidden lift-card">
              <span aria-hidden="true" class="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-brand-500/10 blur-xl pointer-events-none"></span>
              <div class="relative flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                <span class="w-6 h-6 rounded-lg bg-brand-500/15 text-brand-500 grid place-items-center">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                </span>
                Balans
              </div>
              <div class="relative mt-2 text-[20px] font-black text-ink-900 dark:text-white leading-none">{{ user.balance }} <span class="text-[11px] text-ink-500 dark:text-ink-400 font-bold">AZN</span></div>
              <nuxt-link to="/payments/online" @click="profileOpen = false" class="relative mt-3 h-9 w-full rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-extrabold text-[12px] tracking-wide transition flex items-center justify-center gap-1.5 ripple shine-wrap shadow-pop">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                Yüklə
              </nuxt-link>
            </div>
            <div class="relative rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 p-3.5 flex flex-col overflow-hidden lift-card shadow-pop text-white">
              <span aria-hidden="true" class="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-white/20 blur-2xl pointer-events-none"></span>
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/90">
                  <span class="w-6 h-6 rounded-lg bg-white/25 backdrop-blur-sm grid place-items-center">
                    <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                  </span>
                  Bonus
                </div>
              </div>
              <div class="relative mt-2 text-[20px] font-black leading-none flex items-baseline gap-1">{{ user.bonus }} <span class="text-[11px] font-bold opacity-90">xal</span></div>
              <nuxt-link to="/user/dashboard/bonuses" @click="profileOpen = false" class="relative mt-3 h-9 w-full rounded-xl bg-white text-amber-600 hover:bg-white/90 active:scale-95 font-extrabold text-[12px] tracking-wide transition flex items-center justify-center gap-1.5 ripple shadow-sm">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l10-10M17 7v7M17 7h-7"/></svg>
                Köçür
              </nuxt-link>
            </div>
          </div>

          <!-- Menu -->
          <nav class="bg-ink-50 dark:bg-ink-800/60 border border-ink-200 dark:border-ink-800 rounded-2xl overflow-hidden -mx-1 px-1 p-1">
            <nuxt-link to="/user/dashboard" @click="profileOpen = false" class="group flex items-center gap-3 px-3 h-11 rounded-xl hover:bg-white dark:hover:bg-ink-800 hover:shadow-sm transition">
              <svg class="w-[18px] h-[18px] text-ink-500 dark:text-ink-400 group-hover:text-brand-500 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span class="flex-1 text-sm font-semibold text-ink-800 dark:text-white">Profilim</span>
              <svg class="w-3.5 h-3.5 text-ink-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </nuxt-link>
            <nuxt-link to="/user/dashboard/orders" @click="profileOpen = false" class="group flex items-center gap-3 px-3 h-11 rounded-xl hover:bg-white dark:hover:bg-ink-800 hover:shadow-sm transition">
              <svg class="w-[18px] h-[18px] text-ink-500 dark:text-ink-400 group-hover:text-brand-500 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              <span class="flex-1 text-sm font-semibold text-ink-800 dark:text-white">Sifarişlərim</span>
              <svg class="w-3.5 h-3.5 text-ink-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </nuxt-link>
            <nuxt-link to="/user/dashboard/payments" @click="profileOpen = false" class="group flex items-center gap-3 px-3 h-11 rounded-xl hover:bg-white dark:hover:bg-ink-800 hover:shadow-sm transition">
              <svg class="w-[18px] h-[18px] text-ink-500 dark:text-ink-400 group-hover:text-brand-500 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>
              <span class="flex-1 text-sm font-semibold text-ink-800 dark:text-white">Ödənişlərim</span>
              <svg class="w-3.5 h-3.5 text-ink-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </nuxt-link>
            <nuxt-link to="/user/dashboard/operations" @click="profileOpen = false" class="group flex items-center gap-3 px-3 h-11 rounded-xl hover:bg-white dark:hover:bg-ink-800 hover:shadow-sm transition">
              <svg class="w-[18px] h-[18px] text-ink-500 dark:text-ink-400 group-hover:text-brand-500 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span class="flex-1 text-sm font-semibold text-ink-800 dark:text-white">Əməliyyatlar</span>
              <svg class="w-3.5 h-3.5 text-ink-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </nuxt-link>
            <button @click="openNotif" type="button" class="w-full group flex items-center gap-3 px-3 h-11 rounded-xl hover:bg-white dark:hover:bg-ink-800 hover:shadow-sm transition text-left">
              <svg class="w-[18px] h-[18px] text-ink-500 dark:text-ink-400 group-hover:text-brand-500 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span class="flex-1 text-sm font-semibold text-ink-800 dark:text-white">Bildirişlərim</span>
              <span v-if="notifications_count > 0" class="text-[11px] font-black px-2 h-5 rounded-full bg-brand-500 text-white grid place-items-center min-w-[28px]">{{ notifications_count }}</span>
              <svg class="w-3.5 h-3.5 text-ink-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <nuxt-link to="/user/dashboard/account" @click="profileOpen = false" class="group flex items-center gap-3 px-3 h-11 rounded-xl hover:bg-white dark:hover:bg-ink-800 hover:shadow-sm transition">
              <svg class="w-[18px] h-[18px] text-ink-500 dark:text-ink-400 group-hover:text-brand-500 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1A1.7 1.7 0 009 19.4a1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>
              <span class="flex-1 text-sm font-semibold text-ink-800 dark:text-white">Tənzimləmələr</span>
              <svg class="w-3.5 h-3.5 text-ink-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </nuxt-link>
          </nav>
        </div>

        <div class="p-5 border-t border-ink-200 dark:border-ink-800">
          <button @click.prevent="logout" type="button" class="w-full h-11 rounded-xl border-2 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 font-bold text-sm transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>
            Hesabdan çıx
          </button>
        </div>
      </div>
    </aside>

    <!-- ════════ NOTIFICATION DRAWER ════════ -->
    <aside class="fixed inset-0 z-[60] transition-opacity" :class="notifOpen ? '' : 'pointer-events-none'">
      <div @click="notifOpen = false" class="absolute inset-0 bg-ink-900/50 dark:bg-ink-950/80 backdrop-blur-sm transition-opacity duration-300" :class="notifOpen ? 'opacity-100' : 'opacity-0'"></div>
      <div class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-ink-900 shadow-lift border-l border-ink-200 dark:border-ink-800 transition-transform duration-300 flex flex-col" :class="notifOpen ? 'translate-x-0' : 'translate-x-full'">
        <div class="flex items-center justify-between px-5 h-16 border-b border-ink-200 dark:border-ink-800">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-brand-500 grid place-items-center text-white">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            </span>
            <h2 class="text-lg font-extrabold text-ink-900 dark:text-white">Bildirişlər</h2>
          </div>
          <button @click="notifOpen = false" type="button" aria-label="Bağla" class="w-9 h-9 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 grid place-items-center text-ink-500 transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-5">
          <div class="relative flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-pop overflow-hidden">
            <span aria-hidden="true" class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none"></span>
            <span class="relative w-14 h-14 rounded-full bg-white/20 grid place-items-center backdrop-blur-sm ring-2 ring-white/30 shrink-0">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span v-if="notifications_count > 0" class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-ink-900 text-[10px] font-black grid place-items-center ring-2 ring-brand-600">{{ notifications_count }}</span>
            </span>
            <div class="relative flex-1 min-w-0">
              <div class="font-extrabold truncate leading-tight">Son Bildirişlər</div>
              <div class="text-[11px] opacity-90 mt-0.5">Sizi <span class="font-black">{{ notifications_count }} bildiriş</span> gözləyir</div>
              <div class="mt-1 inline-flex items-center gap-1 text-[10px] font-bold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>Canlı bildirişlər aktiv
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <button v-for="n in notifications" :key="n.id" @click="readNotification(n.id, n.type)" type="button" class="w-full text-left group rounded-xl bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-3.5 hover:border-brand-500/50 transition">
              <div class="flex items-start gap-3">
                <span class="w-9 h-9 rounded-lg bg-brand-500/15 grid place-items-center text-brand-500 shrink-0">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                </span>
                <div class="flex-1 min-w-0">
                  <div class="text-[13px] font-bold text-ink-900 dark:text-white leading-snug">{{ n.message }}</div>
                  <div class="mt-1 text-[11px] text-ink-400 flex items-center gap-1"><i class="fal fa-clock"></i> {{ n.created_at }}</div>
                </div>
              </div>
            </button>
            <div v-if="!notifications || !notifications.length" class="text-center py-10 text-sm text-ink-500 dark:text-ink-400">Bildiriş yoxdur.</div>
          </div>

          <nuxt-link to="/user/dashboard/notifications" @click="notifOpen = false" class="block text-center h-11 rounded-xl bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 font-bold text-sm text-ink-700 dark:text-ink-200 leading-[2.75rem] transition">Hamısına bax</nuxt-link>
        </div>
      </div>
    </aside>

    <!-- ════════ CART DRAWER ════════ -->
    <aside class="fixed inset-0 z-[60] transition-opacity" :class="cartOpen ? '' : 'pointer-events-none'">
      <div @click="cartOpen = false" class="absolute inset-0 bg-ink-900/50 dark:bg-ink-950/80 backdrop-blur-sm transition-opacity duration-300" :class="cartOpen ? 'opacity-100' : 'opacity-0'"></div>
      <div class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-ink-900 shadow-lift border-l border-ink-200 dark:border-ink-800 transition-transform duration-300 flex flex-col" :class="cartOpen ? 'translate-x-0' : 'translate-x-full'">
        <div class="flex items-center justify-between px-5 h-16 border-b border-ink-200 dark:border-ink-800">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-brand-500 grid place-items-center text-white">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
            </span>
            <h2 class="text-lg font-extrabold text-ink-900 dark:text-white tracking-tight">Səbətim</h2>
            <span class="text-[11px] font-bold text-ink-500 dark:text-ink-400">({{ baskets_count }})</span>
          </div>
          <button @click="cartOpen = false" type="button" aria-label="Bağla" class="w-9 h-9 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 grid place-items-center text-ink-400 hover:text-ink-900 dark:hover:text-white transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-5">
          <div class="relative flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-pop overflow-hidden">
            <span class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl"></span>
            <span class="relative w-14 h-14 rounded-full bg-white/20 grid place-items-center ring-2 ring-white/30 shrink-0">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              <span class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-ink-900 text-[10px] font-black grid place-items-center ring-2 ring-brand-600">{{ baskets_count }}</span>
            </span>
            <div class="relative flex-1 min-w-0">
              <div class="font-extrabold truncate">Səbətiniz hazır</div>
              <div class="text-[11px] opacity-90 mt-0.5">Hazırda səbətinizdə <span class="font-black">{{ baskets_count }} məhsul</span> var</div>
              <div class="mt-1 inline-flex items-center gap-1 text-[10px] font-bold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>7/24 aktiv ödəniş
              </div>
            </div>
          </div>

          <div class="text-center py-4">
            <div class="relative w-24 h-24 mx-auto rounded-full bg-brand-500/10 border border-brand-500/20 grid place-items-center">
              <span aria-hidden="true" class="absolute inset-0 rounded-full anim-glow-breath bg-brand-500/20 blur-md -z-10"></span>
              <svg class="w-10 h-10 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
            </div>
            <div class="mt-4 text-[15px] font-extrabold text-ink-900 dark:text-white">{{ baskets_count > 0 ? 'Səbətinizdə məhsul var' : 'Səbətiniz boşdur' }}</div>
            <div class="mt-1 text-[12px] text-ink-500 dark:text-ink-400">Alış-verişə başlayın və sevdiyiniz məhsulları əlavə edin.</div>
            <nuxt-link to="/basket" @click="cartOpen = false" class="mt-4 h-11 w-full rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-extrabold text-[13px] tracking-wide transition flex items-center justify-center gap-2 ripple shine-wrap shadow-pop">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              {{ baskets_count > 0 ? 'Səbətə keç' : 'Alış-verişə başla' }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </aside>

    <!-- ════════ MOBILE MENU DRAWER ════════ -->
    <aside class="fixed inset-0 z-[60] md:hidden transition-opacity" :class="mobileMenuOpen ? '' : 'pointer-events-none'">
      <div @click="mobileMenuOpen = false" class="absolute inset-0 bg-ink-900/50 dark:bg-ink-950/80 backdrop-blur-sm transition-opacity duration-300" :class="mobileMenuOpen ? 'opacity-100' : 'opacity-0'"></div>
      <div class="absolute left-0 top-0 bottom-0 w-[92%] max-w-md bg-white dark:bg-ink-900 shadow-lift transition-transform duration-300 flex flex-col" :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'">
        <div class="flex items-center gap-3 px-3 py-3 border-b border-ink-200 dark:border-ink-800">
          <button @click="mobileMenuOpen = false" type="button" aria-label="Bağla" class="w-10 h-10 rounded-xl bg-brand-500 hover:bg-brand-600 grid place-items-center text-white shrink-0 active:scale-95 transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <nuxt-link to="/" @click="mobileMenuOpen = false" class="flex-1 flex items-center justify-center gap-1.5 min-w-0">
            <img :src="data?.logo" alt="DolPh Game" class="w-7 h-7 object-contain shrink-0"/>
            <span class="font-black tracking-tight text-base text-ink-900 dark:text-white truncate">DolPh<span class="text-brand-500">Game</span></span>
          </nuxt-link>
          <button @click="toggleTheme" type="button" aria-label="Mövzunu dəyişdir" class="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 grid place-items-center text-ink-700 dark:text-amber-400 shrink-0 active:scale-95 transition">
            <svg class="w-4 h-4 hidden dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            <svg class="w-4 h-4 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          </button>
        </div>

        <div class="px-3 py-3">
          <nuxt-link to="/games" @click="mobileMenuOpen = false" class="relative block">
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <div class="w-full h-11 pl-11 pr-4 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center text-sm font-medium text-ink-400">Oyun, e-pin axtar…</div>
            </div>
          </nuxt-link>
        </div>

        <div class="flex-1 flex overflow-hidden border-t border-ink-200 dark:border-ink-800">
          <!-- Left rail: categories -->
          <div class="w-[84px] shrink-0 overflow-y-auto bg-ink-50 dark:bg-ink-950/60 py-1.5 space-y-1 no-scrollbar">
            <button @click="mobileRail = 'all'" type="button" class="mm-rail-btn w-full flex flex-col items-center gap-1 py-2 px-1 transition" :class="{ active: mobileRail === 'all' }">
              <span class="w-11 h-11 rounded-xl bg-brand-500 grid place-items-center text-white shadow-pop">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
              </span>
              <span class="text-[10px] font-bold" :class="mobileRail === 'all' ? 'text-brand-600 dark:text-brand-400' : 'text-ink-700 dark:text-ink-300'">Hamısı</span>
            </button>
            <button v-for="cat in categoryList" :key="cat.id" @click="mobileRail = cat.slug" type="button" class="mm-rail-btn w-full flex flex-col items-center gap-1 py-2 px-1 transition" :class="{ active: mobileRail === cat.slug }">
              <span class="w-11 h-11 rounded-xl bg-ink-100 dark:bg-ink-800 grid place-items-center overflow-hidden">
                <img :src="cat.image" :alt="cat.name" class="w-7 h-7 object-contain" />
              </span>
              <span class="text-[10px] font-semibold text-ink-700 dark:text-ink-300 leading-tight text-center line-clamp-2">{{ cat.name }}</span>
            </button>
          </div>

          <!-- Right column -->
          <div class="flex-1 overflow-y-auto p-3 space-y-2">
            <template v-if="mobileRail === 'all'">
              <nuxt-link v-for="cat in categoryList" :key="cat.id" :to="'/category/' + cat.slug" @click="mobileMenuOpen = false" class="mm-cat-card group flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-ink-800/50 border border-ink-200 dark:border-ink-700 hover:border-brand-500 active:scale-[0.98] transition relative overflow-hidden">
                <span class="ml-1 w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-700 grid place-items-center shrink-0 overflow-hidden">
                  <img :src="cat.image" :alt="cat.name" class="w-7 h-7 object-contain" />
                </span>
                <span class="flex-1 text-sm font-bold text-ink-900 dark:text-white">{{ cat.name }}</span>
                <svg class="w-4 h-4 text-ink-400 group-hover:text-brand-500 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
              </nuxt-link>
            </template>
            <template v-else>
              <nuxt-link v-for="game in mobileRailList" :key="game.id" :to="'/game/' + game.slug" @click="mobileMenuOpen = false" class="mm-cat-card group flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-ink-800/50 border border-ink-200 dark:border-ink-700 hover:border-brand-500 active:scale-[0.98] transition relative overflow-hidden">
                <span class="ml-1 w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-700 grid place-items-center shrink-0 overflow-hidden">
                  <img :src="game.image" :alt="game.name" class="w-7 h-7 object-contain" />
                </span>
                <span class="flex-1 text-sm font-bold text-ink-900 dark:text-white">{{ game.name }}</span>
                <svg class="w-4 h-4 text-ink-400 group-hover:text-brand-500 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
              </nuxt-link>
              <div v-if="!mobileRailList.length" class="text-sm text-ink-500 dark:text-ink-400 py-4 text-center">Məhsul yoxdur.</div>
            </template>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-1 p-2 border-t border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900">
          <nuxt-link to="/games" @click="mobileMenuOpen = false" class="flex flex-col items-center gap-1 py-2.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 active:scale-95 transition">
            <svg class="w-5 h-5 text-ink-700 dark:text-ink-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1-5h16l1 5"/><path d="M5 9v11a1 1 0 001 1h12a1 1 0 001-1V9"/><path d="M9 22V12h6v10"/></svg>
            <span class="text-[10px] font-bold uppercase tracking-wider text-ink-600 dark:text-ink-400">Oyunlar</span>
          </nuxt-link>
          <nuxt-link to="/blogs" @click="mobileMenuOpen = false" class="flex flex-col items-center gap-1 py-2.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 active:scale-95 transition">
            <svg class="w-5 h-5 text-ink-700 dark:text-ink-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            <span class="text-[10px] font-bold uppercase tracking-wider text-ink-600 dark:text-ink-400">Bloq</span>
          </nuxt-link>
          <nuxt-link to="/pages/contact" @click="mobileMenuOpen = false" class="flex flex-col items-center gap-1 py-2.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 active:scale-95 transition">
            <svg class="w-5 h-5 text-ink-700 dark:text-ink-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92V20a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.12 4.18 2 2 0 014.11 2h3.08a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z"/></svg>
            <span class="text-[10px] font-bold uppercase tracking-wider text-ink-600 dark:text-ink-400">Əlaqə</span>
          </nuxt-link>
        </div>
      </div>
    </aside>

    <!-- ════════ MOBILE BOTTOM NAV ════════ -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-ink-900/95 backdrop-blur-xl border-t border-ink-200 dark:border-ink-800 shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.18)]">
      <div class="px-3 pt-3 pb-3 flex items-center justify-around gap-1">
        <nuxt-link to="/" title="Ana səhifə" aria-label="Ana səhifə" class="bn-icon group relative w-12 h-12 rounded-2xl grid place-items-center text-ink-500 dark:text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:scale-90 transition shrink-0">
          <svg class="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>
        </nuxt-link>
        <button @click="openMobileMenu" type="button" title="Menyu" aria-label="Menyu" class="bn-icon group relative w-12 h-12 rounded-2xl grid place-items-center text-ink-500 dark:text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:scale-90 transition shrink-0">
          <svg class="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>

        <!-- Center FAB -->
        <button v-if="!user" @click="openAuth('login')" type="button" title="Daxil ol" aria-label="Daxil ol" class="relative w-14 h-14 -mt-4 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-90 text-white shadow-[0_10px_24px_-6px_rgba(16,185,129,0.65)] ring-4 ring-white dark:ring-ink-900 transition grid place-items-center shrink-0">
          <span aria-hidden="true" class="absolute -inset-1 rounded-full bg-emerald-500/30 blur-xl -z-10 anim-glow-breath"></span>
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><path d="M10 17l5-5-5-5M15 12H3"/></svg>
        </button>
        <nuxt-link v-else to="/payments/online" title="Balans Yüklə" aria-label="Balans Yüklə" class="relative w-14 h-14 -mt-4 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 active:scale-90 text-white shadow-[0_10px_24px_-6px_rgba(255,72,0,0.65)] ring-4 ring-white dark:ring-ink-900 transition grid place-items-center shrink-0">
          <span aria-hidden="true" class="absolute -inset-1 rounded-full bg-brand-500/30 blur-xl -z-10 anim-glow-breath"></span>
          <svg class="w-6 h-6 gh-wiggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M12 15h4"/></svg>
        </nuxt-link>

        <button @click="openCart" type="button" title="Səbət" aria-label="Səbət" class="bn-icon group relative w-12 h-12 rounded-2xl grid place-items-center text-ink-500 dark:text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:scale-90 transition shrink-0">
          <svg class="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
          <span v-if="baskets_count > 0" class="absolute top-1.5 right-1.5 bg-brand-500 text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full grid place-items-center ring-2 ring-white dark:ring-ink-900">{{ baskets_count }}</span>
        </button>
        <button @click="openProfile" type="button" title="Hesab" aria-label="Hesabım" class="bn-icon group relative w-12 h-12 rounded-2xl grid place-items-center text-ink-500 dark:text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:scale-90 transition shrink-0">
          <svg class="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
      </div>
      <div class="h-[env(safe-area-inset-bottom,0px)]"></div>
    </div>
  </div>
</template>
