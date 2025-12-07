<template>
  <div class="book-list container py-5">
    <LoadingSpinner :show="loading" />

    <div class="header-section text-center mb-5">
      <h2 class="display-4 fw-bold text-success mb-2">Kho Sách Điện Tử 📚</h2>
      <p class="lead text-muted">Khám phá và mượn ngay các đầu sách bạn yêu thích.</p>
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
            placeholder="Tìm kiếm theo tên sách, mã sách, NXB, tác giả..."
          />
          <span class="input-group-text search-icon">
            <i class="fas fa-search text-success"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div class="col" v-for="book in books" :key="book._id">
        <div class="card h-100 book-card shadow-sm border-0">

          <div class="card-img-container">
            <img
              :src="getBookImage(book)"
              class="card-img-top book-cover"
              :alt="'Bìa sách ' + book.tenSach"
              @error="handleImageError"
            />
            <span 
                class="badge book-count-badge"
                :class="{
                    'bg-danger': book.soQuyen === 0,
                    'bg-warning text-dark': book.soQuyen > 0 && book.soQuyen < 3,
                    'bg-success': book.soQuyen >= 3,
                }"
            >
                Còn: {{ book.soQuyen }}
            </span>
          </div>

          <div class="card-body d-flex flex-column p-3">
            <h5 class="card-title fw-bold text-truncate-2 mb-2" :title="book.tenSach">{{ book.tenSach }}</h5>

            <ul class="list-unstyled book-details mb-3 small">
                <li><strong>Mã sách:</strong> <span class="text-muted">{{ book.maSach }}</span></li>
                <li><strong>NXB:</strong> {{ book.maNXB?.tenNXB || "N/A" }}</li>
                <li><strong>Tác giả:</strong> {{ book.maTacGia?.tenTacGia || "Chưa có" }}</li>
            </ul>

            <div class="mt-auto">
                <p class="status-text mb-2" v-if="book.soQuyen < 3">
                    <i class="fas fa-info-circle me-1" :class="book.soQuyen === 0 ? 'text-danger' : 'text-warning'"></i> 
                    <small :class="book.soQuyen === 0 ? 'text-danger fw-bold' : 'text-warning fw-bold'">
                        {{ book.soQuyen === 0 ? "Đã hết sách" : "Chỉ còn vài cuốn!" }}
                    </small>
                </p>

                <button
                    class="btn btn-primary w-100 mt-2"
                    @click="borrowBook(book._id)"
                    :disabled="book.soQuyen === 0 || loading"
                >
                    <i class="fas fa-shopping-basket me-2"></i>
                    {{ loading ? "Đang xử lý..." : (book.soQuyen === 0 ? "Hết sách" : "Mượn sách") }}
                </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && books.length === 0" class="col-12 text-center py-5">
        <div class="alert alert-info">
          <i class="fas fa-exclamation-circle me-2"></i> Không tìm thấy sách phù hợp với từ khóa: <strong>{{ searchTerm }}</strong>
        </div>
      </div>
    </div>

    <div class="modal" tabindex="-1" :class="{ 'd-block': showConfirmModal }">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Xác nhận mượn</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeConfirmModal"
            ></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">Bạn muốn gửi yêu cầu mượn sách **'{{ selectedBook?.tenSach }}'**?</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeConfirmModal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="handleConfirmBorrow"
              :disabled="loading"
            >
              {{ loading ? "Đang xử lý..." : "Mượn ngay" }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showConfirmModal"></div>

  </div>
</template>

<script>
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  name: "BookList",
  components: { LoadingSpinner },
  setup() {
    const { proxy } = getCurrentInstance();
    const error = ref(null);
    const loading = ref(false);
    const searchTerm = ref("");
    const selectedBook = ref(null);
    const selectedBookId = ref(null);
    const showConfirmModal = ref(false);
    const store = useStore();

    const API_URL = import.meta.env.VITE_API_IMAGE_URL;

    const allBooks = computed(() => store.getters["book/allBooks"]);

    const books = computed(() => {
      if (!searchTerm.value) return allBooks.value;

      const search = searchTerm.value.toLowerCase().trim();
      return allBooks.value.filter(
        (book) =>
          book.tenSach.toLowerCase().includes(search) ||
          book.maSach.toLowerCase().includes(search) ||
          book.maNXB?.tenNXB.toLowerCase().includes(search) ||
          book.nguonGoc.toLowerCase().includes(search) ||
          (book.maTacGia?.tenTacGia &&
            book.maTacGia.tenTacGia.toLowerCase().includes(search))
      );
    });

    const fetchBooks = async () => {
      try {
        loading.value = true;
        await store.dispatch("book/fetchBooks");
      } catch (err) {
        error.value = err.message;
        console.error("Error fetching books:", err);
      } finally {
        loading.value = false;
      }
    };

    const getBookImage = (book) => {
      if (book.imagePath) {
        if (book.imagePath.startsWith("http")) {
          return book.imagePath;
        }
        if (book.imagePath.startsWith("uploads/")) {
          return `${API_URL}/${book.imagePath}`;
        }
        return `${API_URL}/uploads/${book.imagePath}`;
      }
      return `${API_URL}/uploads/default-book.jpg`;
    };

    const borrowBook = (bookId) => {
      selectedBook.value = books.value.find((book) => book._id === bookId);
      selectedBookId.value = bookId;
      showConfirmModal.value = true;
    };

    const closeConfirmModal = () => {
      showConfirmModal.value = false;
      selectedBookId.value = null;
      selectedBook.value = null;
    };

    const handleConfirmBorrow = async () => {
      try {
        loading.value = true;
        await store.dispatch(
          "borrow/createBorrowRequest",
          selectedBookId.value
        );
        proxy.$toast.show(
          "Yêu cầu mượn sách đã được gửi. Vui lòng chờ quản lý duyệt!",
          "success"
        );
        closeConfirmModal();
        await fetchBooks();
      } catch (error) {
        proxy.$toast.show(
          error.response?.data?.message || "Có lỗi xảy ra",
          "danger"
        );
      } finally {
        loading.value = false;
      }
    };

    const clearError = () => {
      error.value = null;
      store.commit("book/SET_ERROR", null);
    };

    const handleImageError = (event) => {
      event.target.src = `${API_URL}/uploads/default-book.jpg`;
    };

    onMounted(fetchBooks);

    return {
      books,
      loading,
      error,
      searchTerm,
      borrowBook,
      showConfirmModal,
      closeConfirmModal,
      handleConfirmBorrow,
      selectedBook,
      clearError,
      handleImageError,
      API_URL,
      getBookImage,
    };
  },
};
</script>

<style scoped>
.book-list {
    min-height: 80vh;
}

/* HEADER */
.header-section {
    padding-bottom: 20px;
    border-bottom: 2px solid #e0e0e0;
}

/* SEARCH BOX */
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
.search-input:focus {
    border-color: transparent !important;
}
.search-icon {
    background-color: white;
    border: none;
    padding-right: 20px;
}

/* BOOK CARD */
.book-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(30, 136, 229, 0.25); /* blue shadow */
}

/* IMAGE WRAPPER */
.card-img-container {
    height: 250px;
    overflow: hidden;
    background-color: #f8f9fa;
    position: relative;
    border-bottom: 1px solid #eee;
}

.book-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.3s ease;
}
.book-card:hover .book-cover {
    transform: scale(1.08);
}

/* BADGE */
.book-count-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 0.8rem;
    padding: 5px 10px;
    border-radius: 50px;
    font-weight: 700;
    background: #1E88E5;
    color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* TITLE */
.card-title {
    font-size: 1.1rem;
    line-height: 1.4;
    color: #1565C0; /* darker blue */
    height: 2.8em;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* MULTI-LINE TRUNCATE */
.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* DETAILS */
.book-details li {
    margin-bottom: 3px;
    color: #6c757d;
}
.book-details strong {
    color: #333;
    font-weight: 600;
    margin-right: 5px;
    font-size: 0.85rem;
}

/* STATUS COLORS */
.status-text {
    font-size: 0.8rem;
    font-weight: 500;
}

.text-danger {
    color: #dc3545 !important;
}
.text-warning {
    color: #ffc107 !important;
}
.text-success {
    color: #1E88E5 !important; /* đổi xanh biển */
}

/* BUTTONS */
.btn-primary, .btn-success {
    background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%); /* blue gradient */
    border: none;
    font-weight: 600;
    transition: all 0.2s ease;
    border-radius: 6px;
    font-size: 0.95rem;
    padding: 10px 16px;
}

.btn-primary:hover:not(:disabled), 
.btn-success:hover:not(:disabled) {
    background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%); /* darker hover */
    transform: translateY(-1px);
}

.btn-primary:disabled, .btn-success:disabled {
    opacity: 0.6;
}

/* MODAL */
.modal-header.bg-success {
    background-color: #1E88E5 !important; /* blue header */
}

.btn-close-white {
    filter: invert(1);
}
</style>

