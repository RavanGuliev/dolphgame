<script setup lang="ts">
import Login from "~/components/modals/login.vue";
import Register from "~/components/modals/register.vue";
import PasswordReminder from "~/components/modals/passwordReminder.vue";
import { authStore } from "~/stores/authStore";
import { storeToRefs } from "pinia";
import { useCookie } from "#app/composables/cookie";
import { useRouter } from "vue-router";
import { userStore } from "~/stores/userStore";
import { basketStore } from "~/stores/basketStore";
import { generalStore } from "~/stores/generalStore";

const { $api } = useNuxtApp();
const router = useRouter();
const cookie = useCookie("token");
const categories = ref([]);
const general = generalStore();
const { data } = storeToRefs(general);
const { setMod } = general;
const userAuth = authStore();
const { setToken, setUserData } = userAuth;
const { user, headers } = storeToRefs(userAuth);
const userStore1 = userStore();
const basketStore1 = basketStore();
const { notifications, notifications_count } = storeToRefs(userStore1);
const { setNotifications } = userStore1;
const { baskets_count } = storeToRefs(basketStore1);
const mod = ref(useCookie("mode").value ?? "style");

$api.get("public/categories").then((res) => {
  categories.value = res;
});
const logout = () => {
  $api.get("user/logout", headers.value);
  cookie.value = null;
  setToken(null);
  setUserData(null);
  window.location = "/";
};
const search = ref("");
const closeSearch = () => {
  search.value = "";
};

type ModeType = "dark" | "style";

const setMode = (mode: ModeType): void => {
  const cookie = useCookie("mode", { maxAge: 60 * 60 * 24 * 200 });
  cookie.value = mode;
  setMod(mode);
};
const closeHover = () => {
  $(".user-hover").hide(200);
  $(".notifications").hide(200);
  $(".sub-menu").hide(200);
  return false;
};
onMounted(() => {
  // Show and Hide Mobile Menu
  $(".mobile-icon .fa-align-left").click(function () {
    $(".mobile-hide-menu").addClass("show-menu");
    $(".mobile-hide-menu").removeClass("hide-menu");
    $(".bg-mode").show();
    if ($("div").hasClass("show-mode")) {
      $(".dark-light").removeClass("show-mode");
    }
    if ($("div").hasClass("show-category")) {
      $(".mobile-hide-category").removeClass("show-category");
      $(".mobile-hide-category").addClass("hide-category");
    }
  });
  $(".close-btn i").click(function () {
    $(".mobile-hide-menu").addClass("hide-menu");
    $(".mobile-hide-menu").removeClass("show-menu");
    $(".bg-mode").hide();
  });

  // Auto-close burger menu when any link is clicked
  $(".mobile-hide-menu .mobile-menu a").click(function () {
    $(".mobile-hide-menu").addClass("hide-menu");
    $(".mobile-hide-menu").removeClass("show-menu");
    $(".bg-mode").hide();
  });

  // Auto-close category menu when any link is clicked (using event delegation for dynamic content)
  $(document).on("click", ".mobile-hide-category .mobile-menu a", function () {
    $(".mobile-hide-category").removeClass("show-category");
    $(".mobile-hide-category").addClass("hide-category");
    $(".bg-mode").hide();
  });

  // Notifications
  $(".notificationicon").click(function () {
    $(".notifications").toggle(200);
    $(".user-hover").hide(200);
  });
  // User Name Toggle
  $(".customer").click(function () {
    $(".user-hover").toggle(200);
    $(".notifications").hide(200);
    return false;
  });
  $(".mobile-user img").click(function () {
    $(".mobile-hover").toggle(200);
    $(".notifications").hide(200);
  });
  $(document).click(function (e) {
    var $sender = $(e.target);
    if ($sender.closest(".mobile-user-inform").length) {
      return;
    } else {
      $(".mobile-hover").hide(200);
    }
  });

  $(".mobile-user i").click(function () {
    if ($("div").hasClass("show-menu")) {
      $(".mobile-hide-menu").removeClass("show-menu");
      $(".mobile-hide-menu").addClass("hide-menu");
    }
    if ($("div").hasClass("show-mode")) {
      $(".dark-light").removeClass("show-mode");
    }
    if ($("div").hasClass("show-category")) {
      $(".mobile-hide-category").removeClass("show-category");
      $(".mobile-hide-category").addClass("hide-category");
    }
  });
});

const readNotification = (id: any, type: any) => {
  $api.patch("user/notifications/read", { id }, headers.value).then(() => {
    $(".notifications").hide();
    if (type === "payment") {
      router.push("/user/dashboard/payments");
    } else if (type === "order") {
      router.push("/user/dashboard/orders");
    } else {
      router.push("/user/dashboard/notifications");
    }
    $api.get("user/notifications?count=5", headers.value).then((res) => {
      $api.get("user/notifications/count", headers.value).then((response) => {
        setNotifications(res.data, response.data);
      });
    });
  });
};

// --- Statuslar (Refs) ---
const isMenuOpen = ref(false);
const isPubgMenuOpen = ref(false);
const isSupercellMenuOpen = ref(false);
const isValorantMenuOpen = ref(false); // Valorant üçün status
const categorySearch = ref("");

// --- Menyu İdarəetmə Funksiyaları ---

// Bütün menyuları bir anda bağlamaq üçün (Linkə klikləyəndə istifadə olunur)
const handleLinkClick = () => {
  isMenuOpen.value = false;
  isPubgMenuOpen.value = false;
  isSupercellMenuOpen.value = false;
  isValorantMenuOpen.value = false;
  if (process.client) {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
};

const toggleMenu = () => {
  isPubgMenuOpen.value = false;
  isSupercellMenuOpen.value = false;
  isValorantMenuOpen.value = false;
  isMenuOpen.value = !isMenuOpen.value;
};

const togglePubgMenu = () => {
  isMenuOpen.value = false;
  isSupercellMenuOpen.value = false;
  isValorantMenuOpen.value = false;
  isPubgMenuOpen.value = !isPubgMenuOpen.value;
};

const toggleSupercellMenu = () => {
  isMenuOpen.value = false;
  isPubgMenuOpen.value = false;
  isValorantMenuOpen.value = false;
  isSupercellMenuOpen.value = !isSupercellMenuOpen.value;
};

const toggleValorantMenu = () => {
  isMenuOpen.value = false;
  isPubgMenuOpen.value = false;
  isSupercellMenuOpen.value = false;
  isValorantMenuOpen.value = !isValorantMenuOpen.value;
};

// --- Computed Məntiqləri (Data Mapping) ---

const filteredCategories = computed(() => {
  if (!categories.value || !categories.value.data) return [];
  if (!categorySearch.value.trim()) return categories.value.data;
  const query = categorySearch.value.toLowerCase();
  return categories.value.data.filter((cat) => cat.name.toLowerCase().includes(query));
});

const getPubgGames = computed(() => {
  if (!categories.value || !categories.value.data) return [];
  const main = categories.value.data.find((cat) => cat.slug === "pubg");
  return main && main.games ? main.games : [];
});

const getSupercellGames = computed(() => {
  if (!categories.value || !categories.value.data) return [];
  const main = categories.value.data.find((cat) => cat.slug === "supercell");
  return main && main.games ? main.games : [];
});

const getValorantGames = computed(() => {
  if (!categories.value || !categories.value.data) return [];
  const main = categories.value.data.find((cat) => cat.slug === "valorant");
  return main && main.games ? main.games : [];
});

// --- Scroll Dondurma Məntiqi ---
watch(
  [
    () => isMenuOpen.value,
    () => isPubgMenuOpen.value,
    () => isSupercellMenuOpen.value,
    () => isValorantMenuOpen.value
  ],
  ([m, p, s, v]) => {
    if (process.client) {
      const anyOpen = m || p || s || v;
      if (anyOpen) {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = "15px";
      } else {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    }
  }
);

// Tab-a qayıdışda header itməməsi üçün
if (process.client) {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (!isMenuOpen.value && !isPubgMenuOpen.value && !isSupercellMenuOpen.value && !isValorantMenuOpen.value) {
        document.body.style.position = "";
        document.body.style.overflow = "";
        document.body.style.top = "";
      }
    }
  });
}
</script>

<template>
  <header class="mobile-sticky-header">
    <!-- PC page top part -->
    <div class="container-fluid grey d-n-992">
      <div class="container back-grey pt-0">
        <div class="row reset-margin top-header-align">
          <div class="col-lg-6 col-md-6">
            <div :class="{ 'p-set': user }" class="header__top__left">
              <ul @click="closeHover" class="mb-0 pl-0">
                <!-- <li>
                  <nuxt-link to="/blogs"><i class="fal fa-newspaper"></i> Xəbərlər</nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/payments"><i class="fal fa-wallet"></i> Bank Hesab Nömrələri</nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/pages/faq"><i class="fal fa-question"></i> Yardım</nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/pages/about"><i class="fal fa-info-circle"></i> Haqqımızda</nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/pages/contact"><i class="fal fa-phone-alt"></i> Əlaqə</nuxt-link>
                </li> -->
                <li><i class="fa-brands fa-facebook"></i></li>
                <li>
                  <a href="https://www.instagram.com/dolphdigital/" target="_blank">
                    <i class="fab fa-instagram"></i>
                  </a>
                </li>
                <li><i class="fa-brands fa-linkedin"></i></li>
                <li><i class="fa-brands fa-telegram"></i></li>
                <li>
                  <a href="https://www.youtube.com/@dolphgamecom" target="_blank">
                    <i class="fa-brands fa-youtube"></i>
                  </a>
                </li>
                <li>Bizi sosial media hesablarından izlə</li>
              </ul>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div :class="{ 'pb-0': user }" class="header__top__right">
              <div class="header__top__right__social d-inline-block">
                <div class="modes">
                  <span @click="setMode('dark')"><i class="fad fa-moon"></i></span>
                  <span @click="setMode('style')"><i class="fas fa-sun"></i></span>
                </div>
              </div>
              <div class="header__top__right__social d-inline-block sign-part js-signin-modal-trigger">
                <!-- <a onclick="return false" data-signin="signup" style="cursor: pointer"> <img src="../../public/img/icons/registr.png"/>  Qeydiyyat</a> -->
                <ul class="rightlist">
                  <li @click="$router.push('pages/faq'); handleLinkClick()">FAQ</li>
                  <li @click="$router.push('/blogs'); handleLinkClick()">Blog</li>
                  <li @click="$router.push('pages/about'); handleLinkClick()">Haqqımızda</li>
                  <li @click="$router.push('pages/privacy'); handleLinkClick()">Qaydalar</li>
                </ul>
              </div>
              <!-- <div v-else class="after-login"> -->
              <!-- <ul class="list-unstyled list-inline"> -->
              <!-- <li class="list-inline-item notific">
                    <a
                      class="customer-not notificationicon"
                      style="cursor: pointer"
                      ><i class="fas fa-bell"></i>
                      <small>{{ notifications_count }}</small></a
                    >
                    <ul id="notificationMenu" class="notifications">
                      <li class="titlebar">
                        <span class="title">Bildirişlər</span>
                        <span class="settings"><i class="icon-cog"></i></span>
                      </li> -->
              <!-- <div v-if="notifications" class="notifbox">
                        <li
                          @click="
                            readNotification(notification.id, notification.type)
                          "
                          v-for="notification in notifications"
                          class="notif"
                        >
                          <a style="cursor: pointer">
                            <div class="messageblock">
                              <div class="message">
                                {{ notification.message }}
                              </div>
                              <div class="messageinfo">
                                <i class="fal fa-clock"></i
                                >{{ notification.created_at }}
                              </div>
                            </div>
                          </a>
                        </li>
                      </div> -->
              <!-- <li class="seeall">
                        <nuxt-link to="/user/notifications"
                          >Hamısına bax</nuxt-link
                        >
                      </li> -->
              <!-- </ul> -->
              <!-- </li> -->
              <!-- <li class="list-inline-item">
                    <nuxt-link class="customer-bag" to="/basket"
                      ><i class="fal fa-shopping-bag"></i> Səbətim
                      <small>{{ baskets_count }}</small></nuxt-link
                    >
                  </li> -->
              <!-- <li class="list-inline-item user-name">
                    <a class="customer" style="cursor: pointer"
                      ><i class="fal fa-user"></i>{{ user.full_name }} (
                      {{ user.balance }} Azn )</a
                    >
                    <div class="user-hover my-profil">
                      <p></p>
                      <div class="row">
                        <div class="col-3 profil-photo">
                          <img :src="user.avatar" :alt="user.name" />
                        </div>
                        <div class="col-9 profil-name">
                          <h6>{{ user.full_name }}</h6>
                          <span>Müştəri kodu: {{ user.id }}</span>
                          <span>{{ user.email }}</span>
                        </div>
                      </div>
                      <hr />
                      <div class="flex-50">
                        <div @click="closeHover" class="my-cash">
                          <strong>Balans</strong>
                          <h5>{{ user.balance }} Azn</h5>
                          <nuxt-link to="/payments/online">Yüklə</nuxt-link>
                        </div>
                        <div @click="closeHover" class="my-cash my-bonus">
                          <strong>Bonus</strong>
                          <h5><i class="fas fa-star"></i> {{ user.bonus }}</h5>
                          <nuxt-link to="/user/dashboard/bonuses"
                            >Köçür</nuxt-link
                          >
                        </div>
                      </div>
                      <hr />
                      <div class="profil-inform">
                        <ul @click="closeHover" class="list-unstyled m-0">
                          <li>
                            <nuxt-link to="/user/dashboard"
                              ><i class="fal fa-user"></i>
                              Profilim
                            </nuxt-link>
                          </li>
                          <li>
                            <nuxt-link to="/user/dashboard/orders"
                              ><i class="fal fa-shopping-bag"></i>
                              Sifarişlərim
                            </nuxt-link>
                          </li>
                          <li>
                            <nuxt-link to="/user/dashboard/payments"
                              ><i class="fal fa-wallet"></i>
                              Ödənişlərim
                            </nuxt-link>
                          </li>
                          <li>
                            <nuxt-link to="/user/dashboard/operations"
                              ><i class="fal fa-history"></i>
                              Əməliyyatlar
                            </nuxt-link>
                          </li>
                          <li>
                            <nuxt-link to="/user/dashboard/notifications"
                              ><i class="fal fa-bell"></i> Bildirişlərim
                              <span
                                >({{ notifications_count }})</span
                              ></nuxt-link
                            >
                          </li>
                          <li>
                            <nuxt-link to="/user/dashboard/account"
                              ><i class="fal fa-cog"></i>
                              Tənzimləmələr
                            </nuxt-link>
                          </li>
                          <hr />
                          <li>
                            <a style="cursor: pointer" @click.prevent="logout"
                              ><i class="fal fa-sign-out-alt"></i> Hesabdan
                              çıx</a
                            >
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li> -->
              <!-- </ul> -->
              <!-- </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile and PC logo and icons -->
    <div class="container pl-0 pr-0 mt-3 mb-3 mt-0-992">
      <div class="row">
        <!-- Mobile Category icon -->
        <div class="col-2 no-in-pc header-mobile__burger-icon">
          <div class="mobile-icon">
            <i class="fal fa-align-left"></i>
          </div>
        </div>

        <!-- Mobile and PC logo -->
        <div :class="{ 'col-4': user, 'col-4': !user, 'logo-auth': user }" class="col-xl-2 col-lg-3 logo-for-mobile">
          <div class="text-lg-center">
            <nuxt-link to="/">
              <img :src="data?.logo" alt="logo" class="w-100 header-logo" />
            </nuxt-link>
          </div>
        </div>
        <!-- Mobile User icon -->
        <div v-if="!user" class="col-6 no-in-pc js-signin-modal-trigger header-mobile__signin-modal-trigger">
          <div class="header__top__right__social sign-part js-signin-modal-trigger">
            <a onclick="return false" data-signin="login" style="cursor: pointer">
              <img src="../../public/img/icons/login.png" /> Daxil ol</a>
            <a onclick="return false" data-signin="signup" style="cursor: pointer">
              <img src="../../public/img/icons/registr.png" /> Qeydiyyat</a>
          </div>
        </div>
        <div v-else class="col-4 no-in-pc mobile-user-inform">
          <a onclick="return false" style="cursor: pointer" class="mobile-user">
            <img :src="user.avatar" :alt="user.name" />
          </a>
          <div class="user-hover my-profil mobile-hover">
            <p></p>
            <div class="row">
              <div class="col-3 profil-photo">
                <img :src="user.avatar" :alt="user.name" />
              </div>
              <div class="col-9 profil-name">
                <h6>{{ user.full_name }}</h6>
                <span>{{ user.email }}</span>
                <span>Müştəri kodu: {{ user.id }}</span>
              </div>
            </div>
            <hr />
            <div class="flex-50">
              <div @click="closeHover" class="my-cash">
                <strong>Balans</strong>
                <h5>{{ user.balance }} Azn</h5>
                <nuxt-link to="/payments/online">Yüklə</nuxt-link>
              </div>
              <div @click="closeHover" class="my-cash my-bonus">
                <strong>Bonus</strong>
                <h5><i class="fas fa-star"></i> {{ user.bonus }}</h5>
                <nuxt-link to="/user/dashboard/bonuses">Köçür</nuxt-link>
              </div>
            </div>
            <hr />
            <div class="profil-inform">
              <ul @click="closeHover" class="list-unstyled m-0">
                <li>
                  <nuxt-link to="/user/dashboard"><i class="fal fa-user"></i> Profilim</nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/user/dashboard/orders"><i class="fal fa-shopping-bag"></i>
                    Sifarişlərim
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/user/dashboard/payments"><i class="fal fa-wallet"></i>
                    Ödənişlərim
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/user/dashboard/notifications"><i class="fal fa-bell"></i> Bildirişlərim
                    <span>({{ notifications_count }})</span></nuxt-link>
                </li>
                <li>
                  <nuxt-link href="/user/dashboard/account"><i class="fal fa-cog"></i>
                    Tənzimləmələr
                  </nuxt-link>
                </li>
                <hr />
                <li>
                  <a @click="logout" style="cursor: pointer"><i class="fal fa-sign-out-alt"></i> Hesabdan çıx</a>
                </li>
              </ul>
            </div>
          </div>
          <a class="customer-not notificationicon mobile-bell" style="cursor: pointer"><i class="fas fa-bell"></i>
            <small>{{ notifications_count }}</small></a>
          <ul v-if="notifications" id="notificationMenu" class="notifications">
            <li class="titlebar">
              <span class="title">Bildirişlər</span>
              <span class="settings"><i class="icon-cog"></i></span>
            </li>
            <div class="notifbox">
              <li @click="readNotification(notification.id, notification.type)" v-for="notification in notifications">
                <a style="cursor: pointer">
                  <div class="messageblock">
                    <div class="message">
                      {{ notification.message }}
                    </div>
                    <div class="messageinfo">
                      <i class="fal fa-clock"></i>{{ notification.created_at }}
                    </div>
                  </div>
                </a>
              </li>
            </div>
            <li class="seeall">
              <nuxt-link to="/user/dashboard/notifications">Hamısına bax</nuxt-link>
            </li>
          </ul>
        </div>

        <!-- Mobile and PC search -->
        <div class="col-xl-6 col-lg-5">
          <form id="search" action="/" class="search-wrapper cf">
            <input v-model="search" class="search-part" type="text" placeholder="Oyun axtar.." />
            <button type="submit"><i class="fal fa-search"></i></button>
            <div v-if="search.length > 0" class="search-box">
              <div id="search-box">
                <search-box @close-search="closeSearch" :q="search" />
              </div>
            </div>
          </form>
        </div>

        <!-- PC search right parts -->
        <div v-if="!user" class="col-md-4 no-in-mobile upbtn">
          <!-- <div class="basket-balance">
            <nuxt-link to="/user/dashboard/orders">
              <i class="fal fa-plus-circle"></i>
              <span>Sifarişlərim</span>
            </nuxt-link>
          </div>  !-->

          <!-- <div class="basket-balance">
            <nuxt-link to="/payments/online">
              <i class="fal fa-wallet"></i>
              <span>Balans Yüklə</span> 
            </nuxt-link>
          </div> -->
          <a id="btnsign" class="js-signin-modal-trigger" onclick="return false" data-signin="signup"
            style="cursor: pointer">
            <img src="../../public/img/icons/registr.png" /> Qeydiyyat</a>
          <a onclick="return false" class="js-signin-modal-trigger" data-signin="login" style="cursor: pointer">
            <i class="fa-solid fa-arrow-right-to-bracket"></i> Daxil ol</a>
        </div>
        <div v-if="!user" class="col-md-4 no-in-mobile upbtn">
          <!-- <div class="basket-balance">
            <nuxt-link to="/user/dashboard/orders">
              <i class="fal fa-plus-circle"></i>
              <span>Sifarişlərim</span>
            </nuxt-link>
          </div>  !-->

          <!-- <div class="basket-balance">
            <nuxt-link to="/payments/online">
              <i class="fal fa-wallet"></i>
              <span>Balans Yüklə</span> 
            </nuxt-link>
          </div> -->
        </div>

        <div v-else class="col-md-4 no-in-mobile header-actions-wrapper">
          <div class="basket-balance">
            <nuxt-link to="/payments/online">
              <span>Balans Yüklə</span>
            </nuxt-link>
          </div>

          <div class="header-right-actions">
            <div class="basket-container">
              <nuxt-link to="/basket" class="notif-square">
                <i class="fal fa-shopping-bag notif-square__icon"></i>
                <span v-if="baskets_count > 0" class="notif-square__badge">{{
                  baskets_count
                }}</span>
              </nuxt-link>
            </div>

            <div class="notification-container">
              <nuxt-link to="/user/notifications" class="notif-square">
                <i class="fas fa-bell notif-square__icon"></i>
                <span v-if="notifications_count > 0" class="notif-square__badge">{{ notifications_count }}</span>
              </nuxt-link>
            </div>

            <div class="user-profile-container">
              <div class="notif-square customer" style="cursor: pointer">
                <i class="fal fa-user notif-square__icon"></i>
              </div>

              <div class="user-hover my-profil">
                <p></p>
                <div class="row">
                  <div class="col-3 profil-photo">
                    <img :src="user.avatar" :alt="user.name" />
                  </div>
                  <div class="col-9 profil-name">
                    <h6>{{ user.full_name }}</h6>
                    <span>Müştəri kodu: {{ user.id }}</span>
                    <span>{{ user.email }}</span>
                  </div>
                </div>
                <hr />
                <div class="flex-50">
                  <div @click="closeHover" class="my-cash">
                    <strong>Balans</strong>
                    <h5>{{ user.balance }} Azn</h5>
                    <nuxt-link to="/payments/online">Yüklə</nuxt-link>
                  </div>
                  <div @click="closeHover" class="my-cash my-bonus">
                    <strong>Bonus</strong>
                    <h5><i class="fas fa-star"></i> {{ user.bonus }}</h5>
                    <nuxt-link to="/user/dashboard/bonuses">Köçür</nuxt-link>
                  </div>
                </div>
                <hr />
                <div class="profil-inform">
                  <ul @click="closeHover" class="list-unstyled m-0">
                    <li>
                      <nuxt-link to="/user/dashboard"><i class="fal fa-user"></i> Profilim</nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/user/dashboard/orders"><i class="fal fa-shopping-bag"></i>
                        Sifarişlərim</nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/user/dashboard/payments"><i class="fal fa-wallet"></i> Ödənişlərim</nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/user/dashboard/operations"><i class="fal fa-history"></i> Əməliyyatlar</nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/user/dashboard/notifications">
                        <i class="fal fa-bell"></i> Bildirişlərim
                        <span>({{ notifications_count }})</span>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/user/dashboard/account"><i class="fal fa-cog"></i> Tənzimləmələr</nuxt-link>
                    </li>
                    <hr />
                    <li>
                      <a style="cursor: pointer" @click.prevent="logout"><i class="fal fa-sign-out-alt"></i> Hesabdan
                        çıx</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PC navigation -->
    <!-- <nav class="no-in-mobile">
      <div class="container pr-0 pl-0">
        <div class="row">
          <div class="col-md-12">
            <ul class="list-unstyled list-inline mb-0 category new-category">
              <li class="list-inline-item"><a><i class="fal fa-bars"></i> Kateqoriyalar</a>
                <div v-if="categories" class="sub-menu">
                  <ol class="list-unstyled mb-0">
                    <li v-for="category in categories.data">
                      <nuxt-link :to="{name: 'category-slug', params: {slug: category.slug}}"><i
                          class="fas fa-circle"></i>
                        <span>{{ category.name }}</span></nuxt-link>
                    </li>
                  </ol>
                </div>
              </li>
              <li class="list-inline-item">
                <nuxt-link exact-active-class="active" to="/">Ana səhifə</nuxt-link>
              </li>
              <li class="list-inline-item">
                <nuxt-link exact-active-class="active" to="/games">Oyunlar</nuxt-link>
              </li>
              <li class="list-inline-item">
                <nuxt-link exact-active-class="active" to="/payments">Ödəniş üsulları</nuxt-link>
              </li>
              <li class="list-inline-item">
                <nuxt-link exact-active-class="active" to="/pages/privacy">Qaydalar</nuxt-link>
              </li>
              <li class="list-inline-item">
                <nuxt-link exact-active-class="active" to="/pages/about">Haqqımızda</nuxt-link>
              </li>
              <li class="list-inline-item">
                <nuxt-link exact-active-class="active" to="/pages/contact">Əlaqə</nuxt-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav> -->
    <!-- Category section -->

    <div class="quick-nav-section no-in-mobile">
      <div class="container">
        <div class="quick-nav-wrapper">
          <div class="nav-item-box category-trigger" @click.stop="toggleMenu">
            <div class="icon-bg orange-light">
              <i class="fal fa-bars"></i>
            </div>
            <span class="nav-text">Kateqoriyalar</span>
            <i class="fal fa-chevron-down arrow-icon" :class="{ 'rotate-180': isMenuOpen }"></i>

            <div v-if="isMenuOpen" class="mega-menu-panel full-width-panel" @click.stop>
              <div class="mega-menu-inner">
                <div class="mega-top-bar">
                  <h3>Kateqoriyalar</h3>
                  <div class="mega-search">
                    <input type="text" v-model="categorySearch" placeholder="Axtarış edin..." />
                    <i class="fal fa-search"></i>
                  </div>
                </div>

                <div class="mega-grid-wrapper">
                  <div class="mega-grid">
                    <template v-if="filteredCategories && filteredCategories.length">
                      <div v-for="cat in filteredCategories" :key="cat.id" class="mega-item">
                        <nuxt-link :to="'/category/' + cat.slug" class="mega-item-link" @click.native="handleLinkClick">
                          <div class="mega-item-icon" :style="{ background: cat.color || '#fdfaf3' }">
                            <img :src="cat.image" :alt="cat.name" />
                          </div>
                          <span class="mega-item-name">{{ cat.name }}</span>
                        </nuxt-link>
                      </div>
                    </template>

                    <div v-else-if="categorySearch" class="no-results">
                      "{{ categorySearch }}" üzrə heç bir kateqoriya tapılmadı.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="nav-item-box group">
            <div class="icon-bg red-light">
              <i class="fas fa-heart"></i>
            </div>
            <span class="nav-text">Sosial Media</span>
            <i class="fal fa-chevron-down arrow-icon"></i>
          </div>

          <div class="nav-item-box category-trigger" @click.stop="togglePubgMenu">
            <div class="icon-bg gold-light">
              <img src="../../public/img/icons/pubg-icon.png" alt="PUBG" class="nav-img-icon" />
            </div>
            <span class="nav-text">PUBG</span>
            <i class="fal fa-chevron-down arrow-icon" :class="{ 'rotate-180': isPubgMenuOpen }"></i>

            <div v-if="isPubgMenuOpen" class="mega-menu-panel full-width-panel" @click.stop>
              <div class="mega-menu-inner">
                <div class="mega-top-bar">
                  <h3>PUBG Məhsulları</h3>
                </div>

                <div class="mega-grid-wrapper">
                  <div class="mega-grid">
                    <template v-if="getPubgGames && getPubgGames.length">
                      <div v-for="item in getPubgGames" :key="item.id" class="mega-item">
                        <nuxt-link :to="'/game/' + item.slug" class="mega-item-link"
                          @click.native.stop="isPubgMenuOpen = false">
                          <div class="mega-item-icon" style="background: #fdfaf3">
                            <img :src="item.image" :alt="item.name" />
                          </div>
                          <span class="mega-item-name">{{ item.name }}</span>
                        </nuxt-link>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="nav-item-box category-trigger" @click.stop="toggleSupercellMenu">
            <div class="icon-bg grey-light">
              <img src="../../public/img/icons/supercell.png" alt="Supercell" class="nav-img-icon" />
            </div>
            <span class="nav-text">Supercell</span>
            <i class="fal fa-chevron-down arrow-icon" :class="{ 'rotate-180': isSupercellMenuOpen }"></i>

            <div v-if="isSupercellMenuOpen" class="mega-menu-panel full-width-panel" @click.stop>
              <div class="mega-menu-inner">
                <div class="mega-top-bar">
                  <h3>Supercell Oyunları</h3>
                </div>

                <div class="mega-grid-wrapper">
                  <div class="mega-grid">
                    <template v-if="getSupercellGames && getSupercellGames.length">
                      <div v-for="item in getSupercellGames" :key="item.id" class="mega-item">
                        <nuxt-link :to="'/game/' + item.slug" class="mega-item-link" @click.native="handleLinkClick">
                          <div class="mega-item-icon" style="background: #f4f4f4">
                            <img :src="item.image" :alt="item.name" />
                          </div>
                          <span class="mega-item-name">{{ item.name }}</span>
                        </nuxt-link>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="nav-item-box category-trigger" @click.stop="toggleValorantMenu">
            <div class="icon-bg pink-light">
              <img src="../../public/img/icons/valorant.png" alt="Valorant" class="nav-img-icon" />
            </div>
            <span class="nav-text">Valorant</span>
            <i class="fal fa-chevron-down arrow-icon" :class="{ 'rotate-180': isValorantMenuOpen }"></i>

            <div v-if="isValorantMenuOpen" class="mega-menu-panel full-width-panel" @click.stop>
              <div class="mega-menu-inner">
                <div class="mega-top-bar">
                  <h3>Valorant Məhsulları</h3>
                </div>
                <div class="mega-grid-wrapper">
                  <div class="mega-grid">
                    <template v-if="getValorantGames && getValorantGames.length">
                      <div v-for="item in getValorantGames" :key="item.id" class="mega-item">
                        <nuxt-link :to="'/game/' + item.slug" class="mega-item-link" @click.native="handleLinkClick">
                          <div class="mega-item-icon" style="background: #fff5f5">
                            <img :src="item.image" :alt="item.name" />
                          </div>
                          <span class="mega-item-name">{{ item.name }}</span>
                        </nuxt-link>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nuxt-link to="/blogs" class="nav-item-box link">
            <div class="icon-bg orange-deep">
              <i class="fal fa-file-alt"></i>
            </div>
            <span class="nav-text">Blog</span>
          </nuxt-link>

          <nuxt-link to="/pages/faq" class="nav-item-box link">
            <div class="icon-bg orange-deep">
              <i class="fal fa-question-circle"></i>
            </div>
            <span class="nav-text">FAQ</span>
          </nuxt-link>

          <nuxt-link to="/pages/contact" class="nav-item-box link">
            <div class="icon-bg orange-deep">
              <i class="fal fa-headset"></i>
            </div>
            <span class="nav-text">Əlaqə</span>
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- Mobile and PC sign part -->
    <div v-if="!user" class="cd-signin-modal js-signin-modal">
      <div class="cd-signin-modal__container">
        <ul class="cd-signin-modal__switcher js-signin-modal-switcher js-signin-modal-trigger list-unstyled">
          <li>
            <a style="cursor: pointer" data-signin="login" data-type="login">Giriş</a>
          </li>
          <li>
            <a style="cursor: pointer" data-signin="signup" data-type="signup">
              Qeydiyyat</a>
          </li>
        </ul>

        <!-- log in form -->
        <login />

        <!-- sign up form -->
        <register />

        <!-- reset password form -->
        <password-reminder />
      </div>
    </div>

    <!-- Mobile Menu section -->
    <div class="mobile-hide-menu new-scroll">
      <div class="close-btn"><i class="fal fa-times"></i></div>

      <div class="mobile-menu">
        <nuxt-link href="/">
          <i class="fal fa-home-alt"></i>
          Ana Səhifə
        </nuxt-link>
      </div>

      <div class="mobile-menu">
        <nuxt-link href="/games">
          <i class="fal fa-gamepad-alt"></i>
          Oyunlar
        </nuxt-link>
      </div>

      <div class="mobile-menu">
        <nuxt-link href="/blogs">
          <i class="fal fa-newspaper"></i>
          Xəbərlər
        </nuxt-link>
      </div>

      <div class="mobile-menu">
        <nuxt-link href="/payments">
          <i class="fal fa-wallet"></i>
          Bank Hesab Nömrələri
        </nuxt-link>
      </div>

      <div class="mobile-menu">
        <nuxt-link href="/pages/privacy">
          <i class="fal fa-file-exclamation"></i>
          Qaydalar
        </nuxt-link>
      </div>

      <div class="mobile-menu">
        <nuxt-link to="/pages/faq">
          <i class="fal fa-question"></i>
          Yardım
        </nuxt-link>
      </div>

      <div class="mobile-menu">
        <nuxt-link to="/pages/about">
          <i class="fal fa-info-circle"></i> Haqqımızda
        </nuxt-link>
      </div>

      <div class="mobile-menu">
        <nuxt-link to="/pages/contact">
          <i class="fal fa-phone-alt"></i> Əlaqə
        </nuxt-link>
      </div>
    </div>

    <div v-if="categories" class="mobile-hide-category new-scroll">
      <div class="close-btn"><i class="fal fa-times"></i></div>
      <div v-for="category in categories.data" class="mobile-menu">
        <nuxt-link :to="{ name: 'category-slug', params: { slug: category.slug } }">
          <img :src="category.image" :alt="category.name" />
          <span> {{ category.name }}</span>
        </nuxt-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Mobile sticky header - only on screens smaller than 992px */
</style>