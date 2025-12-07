<template>
  <div class="publisher-list container py-5">
    <LoadingSpinner :show="loading" />

    <div class="header-section text-center mb-5">
      <h2 class="display-4 fw-bold text-primary-blue mb-2">Danh sách Nhà Xuất Bản 📚</h2>
      <p class="lead text-muted">Tìm kiếm thông tin và các đầu sách được phát hành.</p>
    </div>

    <div
      v-if="error"
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      <i class="fas fa-exclamation-triangle me-2"></i> {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <div class="row mb-5 justify-content-center">
      <div class="col-lg-8">
        <div class="input-group search-box shadow-sm">
          <input
            type="text"
            class="form-control search-input"
            v-model="searchTerm"
            placeholder="Tìm kiếm NXB theo tên hoặc mã NXB"
          />
          <span class="input-group-text search-icon">
            <i class="fas fa-search text-primary-blue"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div class="col" v-for="publisher in publishers" :key="publisher._id">
        <div class="card h-100 publisher-card shadow-sm border-0">
          <div class="card-body d-flex flex-column p-4 text-center">
            <i class="fas fa-building publisher-icon mb-3"></i>
            <h5 class="card-title fw-bold mb-1">{{ publisher.tenNXB }}</h5>
            
            <p class="card-text small mb-3 text-muted">
              {{ publisher.maNXB }}
            </p>
            <p class="card-text small mb-3">
              <strong>Địa chỉ:</strong> 
              <span class="text-secondary">{{ publisher.diaChi || "N/A" }}</span>
            </p>

            <div class="mt-auto">
                <p class="card-text small mb-3">
                    <strong>Tổng số sách: </strong>
                    <span class="badge bg-primary-blue publisher-book-count">{{
                      getPublisherBookCount(publisher._id)
                    }}</span>
                </p>
                <button
                    class="btn btn-primary-blue btn-sm w-100"
                    @click="showPublisherBooks(publisher)"
                >
                    <i class="fas fa-book me-1"></i>
                    Xem danh sách sách
                </button>
            </div>
          </div>
        </div>
      </div>
       <div v-if="!loading && publishers.length === 0 && searchTerm" class="col-12 text-center py-5">
        <div class="alert alert-info">
          <i class="fas fa-exclamation-circle me-2"></i> Không tìm thấy NXB nào với từ khóa: <strong>{{ searchTerm }}</strong>
        </div>
      </div>
    </div>

    <div class="modal" tabindex="-1" :class="{ 'd-block': showBooksModal }">
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-primary-blue text-white">
            <h5 class="modal-title">
              <i class="fas fa-building me-2"></i>
              Sách của {{ selectedPublisher?.tenNXB }}
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeBooksModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover book-table">
                <thead>
                  <tr>
                    <th>Mã sách</th>
                    <th>Tên sách</th>
                    <th>Năm XB</th>
                    <th>Số quyển</th>
                    <th>Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in publisherBooks" :key="book._id">
                    <td>{{ book.maSach }}</td>
                    <td class="book-name-cell">{{ book.tenSach }}</td>
                    <td>{{ book.namXuatBan }}</td>
                    <td>
                      <span
                        :class="{
                          'text-danger fw-bold': book.soQuyen === 0,
                          'text-warning fw-bold':
                            book.soQuyen > 0 && book.soQuyen < 3,
                          'text-success': book.soQuyen >= 3,
                        }"
                        >{{ book.soQuyen }}</span
                      >
                      <br />
                      <small class="status-modal-text" v-if="book.soQuyen < 3">
                        {{ book.soQuyen === 0 ? "Hết sách" : "Sắp hết" }}
                      </small>
                    </td>
                    <td>{{ formatCurrency(book.donGia) }}</td>
                  </tr>
                  <tr v-if="publisherBooks.length === 0">
                    <td colspan="5" class="text-center py-3">
                        <i class="fas fa-info-circle me-1"></i>
                        Không có sách nào được tìm thấy từ NXB này.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button
                type="button"
                class="btn btn-secondary"
                @click="closeBooksModal"
              >
                Đóng
              </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showBooksModal"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { showError } from "@/utils/notifications";

export default {
  name: "PublisherList",
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const searchTerm = ref("");
    const showBooksModal = ref(false);
    const selectedPublisher = ref(null);

    const loading = computed(() => store.getters["publisher/isLoading"]);
    const error = computed(() => store.getters["publisher/error"]);
    const allPublishers = computed(
      () => store.getters["publisher/allPublishers"]
    );
    const allBooks = computed(() => store.getters["book/allBooks"]);

    const publishers = computed(() => {
      if (!searchTerm.value) return allPublishers.value;
      const search = searchTerm.value.toLowerCase();
      return allPublishers.value.filter(
        (pub) =>
          pub.tenNXB.toLowerCase().includes(search) ||
          pub.maNXB.toLowerCase().includes(search)
      );
    });

    const publisherBooks = computed(() => {
      if (!selectedPublisher.value) return [];
      return allBooks.value.filter(
        (book) => book.maNXB?._id === selectedPublisher.value._id
      );
    });

    const getPublisherBookCount = (publisherId) => {
      return allBooks.value.filter((book) => book.maNXB?._id === publisherId)
        .length;
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    };

    const showPublisherBooks = (publisher) => {
      selectedPublisher.value = publisher;
      showBooksModal.value = true;
    };

    const closeBooksModal = () => {
      showBooksModal.value = false;
      selectedPublisher.value = null;
    };

    const clearError = () => {
      store.commit("publisher/SET_ERROR", null);
    };

    onMounted(async () => {
      try {
        await Promise.all([
          store.dispatch("publisher/fetchPublishers"),
          store.dispatch("book/fetchBooks"),
        ]);
      } catch (error) {
        showError(error);
      }
    });

    return {
      publishers,
      loading,
      error,
      searchTerm,
      showBooksModal,
      selectedPublisher,
      publisherBooks,
      clearError,
      showPublisherBooks,
      closeBooksModal,
      getPublisherBookCount,
      formatCurrency,
    };
  },
};
</script>

<style scoped>
/* === GENERAL STYLES - BLUE TONE === */
.text-primary-blue {
    color: #0d6efd !important; /* Blue Bootstrap Default */
}
.bg-primary-blue {
    background-color: #0d6efd !important;
}

/* --- HEADER --- */
.header-section {
    padding-bottom: 20px;
    border-bottom: 2px solid #e0e0e0;
}

/* --- SEARCH INPUT --- */
.search-box {
    border-radius: 50px; 
    overflow: hidden;
    background-color: white;
}
.search-input {
    border: none;
    box-shadow: none !important;
    padding-left: 20px;
    height: 45px;
}
.search-icon {
    background-color: white;
    border: none;
    padding-right: 20px;
}

/* --- PUBLISHER CARD --- */
.publisher-card {
    border-radius: 12px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #e3f2fd;
    display: flex; 
}

.publisher-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(13, 110, 253, 0.2); 
}

.publisher-icon {
    font-size: 2.5rem;
    color: #0d6efd;
    margin-bottom: 0.5rem;
}

.card-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #0d6efd; 
}

.publisher-book-count {
    font-weight: 700;
    font-size: 0.85rem;
    padding: 6px 10px;
    border-radius: 50px;
}

/* --- BUTTON PRIMARY: BLUE --- */
.btn-primary-blue {
  background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
  border: none;
  font-weight: 600;
  transition: all 0.2s ease;
  border-radius: 8px;
  font-size: 0.95rem;
  padding: 10px 16px;
}

.btn-primary-blue:hover:not(:disabled) {
  background: linear-gradient(135deg, #0b5ed7 0%, #0a58ca 100%);
  transform: translateY(-1px);
}

.btn-primary-blue:disabled {
  opacity: 0.6;
}


/* --- MODAL STYLES --- */
.modal-header.bg-primary-blue {
    background-color: #0d6efd !important;
}
.btn-close-white {
    filter: invert(1);
}
.book-table th {
    background-color: #f0f8ff; /* Nền xanh nhạt cho header bảng */
    color: #0d6efd;
}
.book-name-cell {
    max-width: 250px; 
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.status-modal-text {
    font-size: 0.75rem;
    font-style: italic;
    color: #6c757d !important;
}

/* Status Colors (Keep standard for book status) */
.text-danger {
  color: #dc3545 !important;
}
.text-warning {
  color: #ffc107 !important;
}
.text-success {
  color: #28a745 !important;
}
</style>
