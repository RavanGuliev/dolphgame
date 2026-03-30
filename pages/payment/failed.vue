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
  errorCode: '',
  errorMessage: 'Ödəniş zamanı xəta baş verdi'
});

const isLoading = ref(true);

onMounted(async () => {
  setLoading(true);

  try {
    // Get transaction details from URL parameters
    const amount = route.query.amount || 0;
    const reference = route.query.reference || '';
    const errorCode = route.query.error_code || '';
    const errorMessage = route.query.error_message || 'Ödəniş zamanı xəta baş verdi';

    transactionDetails.value = {
      amount: Number(amount),
      date: new Date().toLocaleString(),
      reference: String(reference),
      errorCode: String(errorCode),
      errorMessage: String(errorMessage)
    };

  } catch (error) {
    console.error('Error processing payment failure:', error);
  } finally {
    isLoading.value = false;
    setLoading(false);
  }
});

const tryAgain = () => {
  router.push('/payments/online');
};

const contactSupport = () => {
  router.push('/pages/contact');
};

const goToDashboard = () => {
  router.push('/user/dashboard/payments');
};
</script>

<template>
  <div class="payment-failed-container">
    <div class="failed-card">
      <div class="failed-header">
        <div class="failed-icon">
          <i class="fas fa-times-circle"></i>
        </div>
        <h1>Ödəniş Uğursuz Oldu</h1>
        <p>Təəssüf ki, ödənişiniz tamamlanmadı. Zəhmət olmasa yenidən cəhd edin və ya dəstək xidməti ilə əlaqə saxlayın.</p>
      </div>

      <div class="error-message">
        <p>{{ transactionDetails.errorMessage }}</p>
        <span v-if="transactionDetails.errorCode" class="error-code">Xəta kodu: {{ transactionDetails.errorCode }}</span>
      </div>


      <div class="possible-reasons">
        <h3>Ödənişin uğursuz olmasının mümkün səbəbləri:</h3>
        <ul>
          <li>Kartınızda kifayət qədər vəsait olmaya bilər</li>
          <li>Kart məlumatları səhv daxil edilmiş ola bilər</li>
          <li>Bankınız tərəfindən əməliyyat rədd edilmiş ola bilər</li>
          <li>İnternet bağlantısında problem yaranmış ola bilər</li>
          <li>Ödəniş sistemi müvəqqəti olaraq işləməyə bilər</li>
        </ul>
      </div>

      <div class="failed-actions">
        <button @click="tryAgain" class="btn-try-again">
          <i class="fas fa-redo"></i> Yenidən Cəhd Et
        </button>
        <button @click="contactSupport" class="btn-contact">
          <i class="fas fa-headset"></i> Dəstək Xidməti
        </button>
        <button @click="goToDashboard" class="btn-dashboard">
          <i class="fas fa-user-circle"></i> Hesabıma Get
        </button>
      </div>

      <div class="failed-footer">
        <p>Əgər hesabınızdan pul çıxılıbsa, lakin balansınız artmayıbsa, narahat olmayın. Belə hallarda vəsait 24 saat ərzində geri qaytarılır.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-failed-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background-color: #f8f9fa;
}

.failed-card {
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

.failed-header {
  margin-bottom: 1.5rem;
}

.failed-icon {
  font-size: 5rem;
  color: #dc3545;
  margin-bottom: 1rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.failed-header h1 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.failed-header p {
  color: #666;
  font-size: 1rem;
}

.error-message {
  background-color: #fff8f8;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #dc3545;
}

.error-code {
  display: block;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #6c757d;
}

.transaction-details {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
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

.status-failed {
  color: #dc3545;
  font-weight: 600;
}

.possible-reasons {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.possible-reasons h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.possible-reasons ul {
  padding-left: 1.5rem;
  margin: 0;
}

.possible-reasons li {
  margin-bottom: 0.5rem;
  color: #555;
}

.possible-reasons li:last-child {
  margin-bottom: 0;
}

.failed-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-try-again, .btn-contact, .btn-dashboard {
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

.btn-try-again {
  background-color: #28a745;
  color: white;
  border: none;
}

.btn-try-again:hover {
  background-color: #218838;
}

.btn-contact {
  background-color: #17a2b8;
  color: white;
  border: none;
}

.btn-contact:hover {
  background-color: #138496;
}

.btn-dashboard {
  background-color: #6c757d;
  color: white;
  border: none;
}

.btn-dashboard:hover {
  background-color: #5a6268;
}

.failed-footer {
  color: #777;
  font-size: 0.9rem;
  background-color: #fff8f8;
  border-radius: 8px;
  padding: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .payment-failed-container {
    padding: 1rem;
  }

  .failed-card {
    padding: 1.5rem;
  }

  .failed-actions {
    flex-direction: column;
  }

  .btn-try-again, .btn-contact, .btn-dashboard {
    width: 100%;
  }
}
</style>