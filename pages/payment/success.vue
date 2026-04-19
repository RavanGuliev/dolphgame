<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';


const router = useRouter();
const route = useRoute();
const { setLoading } = loadingStore;

const transactionDetails = ref({
  amount: 0,
  date: '',
  reference: '',
  status: 'success'
});

const isLoading = ref(true);

onMounted(async () => {
  setLoading(true);

  try {
    // Get transaction details from URL parameters
    const amount = route.query.amount || 0;
    const reference = route.query.reference || '';

    transactionDetails.value = {
      amount: Number(amount),
      date: new Date().toLocaleString(),
      reference: String(reference),
      status: 'success'
    };

    // Play success sound
    if (typeof window !== 'undefined') {
      const audio = new Audio('/audio/notification.mp3');
      audio.play();
    }

    // You can also verify the payment with your backend if needed
    // await $api.post('user/payment/verify', { reference: reference }, authStore.headers);

  } catch (error) {
    console.error('Error processing payment success:', error);
  } finally {
    isLoading.value = false;
    setLoading(false);
  }
});

const goToDashboard = () => {
  router.push('/user/dashboard/payments');
};

const goToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="payment-success-container">
    <div class="success-card">
      <div class="success-header">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h1>Ödəniş Uğurla Tamamlandı!</h1>
      </div>



      <div class="success-actions">
        <button @click="goToDashboard" class="btn-dashboard">
          <i class="fas fa-user-circle"></i> Hesabıma Get
        </button>
        <button @click="goToHome" class="btn-home">
          <i class="fas fa-home"></i> Ana Səhifəyə Qayıt
        </button>
      </div>

      <div class="success-footer">
        <p>Hər hansı bir sualınız varsa, <nuxt-link to="/pages/contact">bizimlə əlaqə</nuxt-link> saxlayın.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background-color: #f8f9fa;
}

.success-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  padding: 2.5rem;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.success-header {
  margin-bottom: 2rem;
}

.success-icon {
  font-size: 5rem;
  color: #28a745;
  margin-bottom: 1rem;
  animation: scaleIn 0.5s ease-in-out;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.success-header h1 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.success-header p {
  color: #666;
  font-size: 1rem;
}

.transaction-details {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.transaction-details h2 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-label {
  font-weight: 600;
  color: #555;
}

.detail-value {
  color: #333;
}

.status-success {
  color: #28a745;
  font-weight: 600;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-dashboard, .btn-home {
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-dashboard {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-dashboard:hover {
  background-color: #0069d9;
}

.btn-home {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
}

.btn-home:hover {
  background-color: #f8f9fa;
}

.success-footer {
  color: #777;
  font-size: 0.9rem;
}

.success-footer a {
  color: #007bff;
  text-decoration: none;
}

.success-footer a:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .payment-success-container {
    padding: 1rem;
  }

  .success-card {
    padding: 1.5rem;
  }

  .success-actions {
    flex-direction: column;
  }

  .btn-dashboard, .btn-home {
    width: 100%;
  }
}
</style>