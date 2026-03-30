<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { authStore } from "#imports";

const route = useRoute();
const router = useRouter();
const { user } = authStore();

// Payment methods with commission info
const paymentMethods = [
  {
    id: 'online',
    path: '/payments/online',
    image: '/img/payments/bank-karti.png',
    name: 'Bank kartı',
    commission: '3%',
    commissionType: 'paid',
    isPriority: true,
    requiresNormal: true,
  },
  // {
  //   id: 'm10',
  //   path: '/payments/m10',
  //   image: '/img/payments/m10-logo.png',
  //   name: 'M10 QR',
  //   commission: '1,5%',
  //   commissionType: 'paid',
  //   isPriority: false,
  //   requiresNormal: true,
  // },
  {
    id: 'birbank',
    path: '/payments/birbank',
    image: '/img/payments/birbank-logo.png',
    name: 'Birbank QR',
    commission: '1,5%',
    commissionType: 'paid',
    isPriority: false,
    requiresNormal: true,
  },
  {
    id: 'receipt',
    path: '/payments',
    image: '/img/payments/qebz.png',
    name: 'Qəbz',
    commission: '0%',
    commissionType: 'free',
    isPriority: false,
    requiresNormal: false,
  },
  {
    id: 'million',
    path: '/payments/million',
    image: '/img/payments/million-logo-new.png',
    name: 'MilliÖN Terminal',
    commission: '3%',
    commissionType: 'paid',
    isPriority: false,
    requiresNormal: false,
  },
  {
    id: 'emanat',
    path: '/payments/emanat',
    image: '/img/payments/emanat-logo-new.png',
    name: 'eManat Terminal',
    commission: '3%',
    commissionType: 'paid',
    isPriority: false,
    requiresNormal: false,
  },
  {
    id: 'expresspay',
    path: '/payments/expresspay',
    image: '/img/payments/expresspay-logo-new.png',
    name: 'Expresspay Terminal',
    commission: '3%',
    commissionType: 'paid',
    isPriority: false,
    requiresNormal: false,
  },
];

const isActive = (path: string) => route.path === path;

// Get currently active method
const activeMethod = computed(() => {
  return paymentMethods.find(method => isActive(method.path)) || paymentMethods[0];
});

// Custom dropdown state
const isDropdownOpen = ref(false);

// Toggle dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Close dropdown when clicking outside
const closeDropdown = () => {
  isDropdownOpen.value = false;
};

// Handle method selection
const selectMethod = (path: string) => {
  closeDropdown();
  handleTabClick(path);
};

// Close dropdown on click outside
onMounted(() => {
  if (typeof document !== 'undefined') {
    const handleClickOutside = (e: MouseEvent) => {
      const dropdown = document.querySelector('.mobile-payment-dropdown');
      if (dropdown && !dropdown.contains(e.target as Node)) {
        isDropdownOpen.value = false;
      }
    };
    
    document.addEventListener('click', handleClickOutside);
  }
});

// Scroll to content on mobile when tab is clicked
const handleTabClick = async (path: string) => {
  // Navigate to the path first
  await router.push(path);
  
  // Check if we're on mobile (window width <= 992px for Bootstrap's lg breakpoint)
  if (typeof window !== 'undefined' && window.innerWidth <= 992) {
    // Wait a bit longer for the page to fully render
    setTimeout(() => {
      // Find the payment wrapper area
      const paymentWrapper = document.querySelector('.online-payment-wrapper');
      if (paymentWrapper) {
        // Scroll to the payment wrapper with smooth behavior
        paymentWrapper.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 300); // 300ms delay to ensure DOM is fully rendered
  }
};
</script>

<template>
  <div class="payment-sidebar">
    <!-- Mobile Custom Dropdown -->
    <div class="mobile-payment-dropdown">
      <div class="dropdown-trigger" @click.stop="toggleDropdown">
        <div class="trigger-content">
          <img :src="activeMethod.image" :alt="activeMethod.name" class="trigger-icon" />
          <div class="trigger-text">
            <span class="trigger-name">{{ activeMethod.name }}</span>
            <span class="trigger-commission">{{ activeMethod.commission }} Komissiya</span>
          </div>
        </div>
        <i class="fas fa-chevron-down dropdown-icon" :class="{ 'open': isDropdownOpen }"></i>
      </div>
      
      <div class="dropdown-menu" :class="{ 'show': isDropdownOpen }" @click.stop>
        <template v-for="method in paymentMethods" :key="method.id">
          <div
            v-if="!method.requiresNormal || (user as any)?.level === 'normal'"
            class="dropdown-item"
            :class="{ 'active': isActive(method.path) }"
            @click="selectMethod(method.path)"
          >
            <img :src="method.image" :alt="method.name" class="item-icon" />
            <div class="item-content">
              <span class="item-name">
                {{ method.name }}
                <span v-if="method.id === 'receipt'" class="item-time">11:00 - 00:00</span>
              </span>
              <span class="item-commission">{{ method.commission }} Komissiya</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Desktop Tabs -->
    <nav class="payment-nav">
      <template v-for="method in paymentMethods" :key="method.id">
        <a
          v-if="!method.requiresNormal || (user as any)?.level === 'normal'"
          @click.prevent="handleTabClick(method.path)"
          :href="method.path"
          class="payment-tab"
          :class="{ 
            'active': isActive(method.path),
            'paid': method.commissionType === 'paid',
            'free': method.commissionType === 'free'
          }"
        >
          <div class="tab-icon">
            <img :src="method.image" :alt="method.name" class="payment-icon-img" />
          </div>
          
          <div class="tab-content">
            <h3 class="tab-name">
              {{ method.name }}
              <span v-if="method.id === 'receipt'" class="qebz-time">11:00 - 00:00</span>
            </h3>
            <p class="tab-commission">{{ method.commission }} Komissiya</p>
          </div>
        </a>
      </template>
    </nav>
  </div>
</template>

<style scoped>
.payment-sidebar {
  background: transparent;
}

/* Mobile Dropdown */
.mobile-payment-dropdown {
  display: none;
  position: relative;
  margin-bottom: 20px;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #F9F9F9;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dropdown-trigger:hover {
  border-color: #FF4800;
}

.trigger-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.trigger-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
  background: white;
  padding: 4px;
}

.trigger-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.trigger-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.trigger-commission {
  font-size: 0.8rem;
  color: #666;
}

.dropdown-icon {
  color: #666;
  font-size: 0.85rem;
  transition: transform 0.3s ease;
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
  display: none;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f9f9f9;
}

.dropdown-item.active {
  background: #FFF5F0;
}

.item-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 6px;
  background: #f9f9f9;
  padding: 4px;
  flex-shrink: 0;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.item-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.item-time {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  margin-left: 6px;
}

.item-commission {
  font-size: 0.75rem;
  color: #666;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.payment-nav {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.payment-tab {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 12px;
  background: #F9F9F9;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  position: relative;
  cursor: pointer;
}

.payment-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.payment-tab.active {
  background: #FF4800;
}

.payment-tab.active .tab-name,
.payment-tab.active .tab-commission {
  color: white;
}

.payment-tab.active .tab-icon {
  background: #FFE4D9;
}

.tab-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.5rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.payment-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.payment-tab.active .tab-icon i {
  color: white;
}

.tab-content {
  flex: 1;
  min-width: 0;
}

.tab-name {
  font-weight: 600;
  font-size: 1.05rem;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.tab-commission {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  line-height: 1.3;
}

/* Qəbz Time */
.qebz-time {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  vertical-align: top;
  line-height: 1;
}

.payment-tab.active .qebz-time {
  color: white;
}

/* Mobile responsive */
@media (max-width: 992px) {
  .mobile-payment-dropdown {
    display: block;
  }
  
  .payment-nav {
    display: none;
  }
}

@media (max-width: 576px) {
  .payment-tab {
    flex: 1 1 100%;
  }
}
</style>
