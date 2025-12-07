<template>
  <div class="admin-home-page">
    <LoadingSpinner v-if="loading" show />

    <h2 class="mb-4">Tổng quan thư viện</h2>

    <div v-if="error" class="alert alert-danger alert-dismissible fade show">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <div class="row mb-5">
      <div class="col-md-3">
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper primary-blue-bg me-3">
                <i class="fas fa-book text-white"></i>
              </div>
              <div>
                <h3 class="card-title text-primary mb-0">{{ totalBooks }}</h3>
                <p class="card-text mb-0">Tổng số sách</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper secondary-blue-bg me-3">
                <i class="fas fa-user-edit text-white"></i>
              </div>
              <div>
                <h3 class="card-title text-secondary mb-0">{{ totalAuthors }}</h3>
                <p class="card-text mb-0">Tổng số tác giả</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper tertiary-blue-bg me-3">
                <i class="fas fa-building text-white"></i>
              </div>
              <div>
                <h3 class="card-title text-info mb-0">
                  {{ totalPublishers }}
                </h3>
                <p class="card-text mb-0">Nhà xuất bản</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper fourth-blue-bg me-3">
                <i class="fas fa-hand-holding text-white"></i>
              </div>
              <div>
                <h3 class="card-title text-success mb-0">
                  {{ totalBorrowedBooks }}
                </h3>
                <p class="card-text mb-0">Đang được mượn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h3 class="mb-3">Thống kê mượn trả</h3>
    <div class="row mb-5">
      <div class="col-md-3">
        <div class="card mb-3 border-danger">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper bg-danger bg-opacity-10 me-3">
                <i class="fas fa-exclamation-triangle text-danger"></i>
              </div>
              <div>
                <h3 class="card-title text-danger mb-0">
                  {{ currentOverdueCount }}
                </h3>
                <p class="card-text mb-0">Sách quá hạn</p>
                <small class="text-muted">Chưa trả</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-3 border-warning">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper bg-warning bg-opacity-10 me-3">
                <i class="fas fa-clock text-warning"></i>
              </div>
              <div>
                <h3 class="card-title text-warning mb-0">
                  {{ totalOverdueReturns }}
                </h3>
                <p class="card-text mb-0">Lần trả trễ</p>
                <small class="text-muted">Tổng cộng</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-3 border-success">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper bg-success bg-opacity-10 me-3">
                <i class="fas fa-money-bill-wave text-success"></i>
              </div>
              <div>
                <h3 class="card-title text-success mb-0">
                  {{ formatCurrency(totalPenalty) }}
                </h3>
                <p class="card-text mb-0">Tổng tiền phạt</p>
                <small class="text-muted">Đã thu</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-3 border-secondary">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper bg-secondary bg-opacity-10 me-3">
                <i class="fas fa-check-circle text-secondary"></i>
              </div>
              <div>
                <h3 class="card-title text-secondary mb-0">
                  {{ totalReturned }}
                </h3>
                <p class="card-text mb-0">Sách đã trả</p>
                <small class="text-muted">Hoàn thành</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Tỷ lệ trả sách</h5>
          </div>
          <div class="card-body">
            <div class="progress-container">
              <div class="progress-item">
                <div class="d-flex justify-content-between">
                  <span class="text-primary">Trả đúng hạn</span>
                  <span class="fw-bold text-primary"
                    >{{ onTimeReturnRate }}%</span
                  >
                </div>
                <div class="progress mt-1">
                  <div
                    class="progress-bar bg-primary"
                    :style="{ width: onTimeReturnRate + '%' }"
                  ></div>
                </div>
              </div>
              <div class="progress-item mt-3">
                <div class="d-flex justify-content-between">
                  <span class="text-danger">Trả trễ</span>
                  <span class="fw-bold text-danger">{{ lateReturnRate }}%</span>
                </div>
                <div class="progress mt-1">
                  <div
                    class="progress-bar bg-danger"
                    :style="{ width: lateReturnRate + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Thống kê nhanh</h5>
          </div>
          <div class="card-body">
            <div
              class="stat-item d-flex justify-content-between align-items-center py-2"
            >
              <span class="text-muted">Trung bình phạt/lần:</span>
              <span class="fw-bold">{{ formatCurrency(averagePenalty) }}</span>
            </div>
            <hr class="my-2" />
            <div
              class="stat-item d-flex justify-content-between align-items-center py-2"
            >
              <span class="text-muted">Tổng độc giả:</span>
              <span class="fw-bold">{{ totalReaders }}</span>
            </div>
            <hr class="my-2" />
            <div
              class="stat-item d-flex justify-content-between align-items-center py-2"
            >
              <span class="text-muted">Sách có sẵn:</span>
              <span class="fw-bold text-success">{{ availableBooks }}</span>
            </div>
            <hr class="my-2" />
            <div
              class="stat-item d-flex justify-content-between align-items-center py-2"
            >
              <span class="text-muted">Yêu cầu chờ duyệt:</span>
              <span class="fw-bold text-warning">{{ pendingRequests }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5">
      <h3 class="mb-3">Danh sách sách đang quá hạn</h3>
      <OverdueBook />
    </div>
  </div>
</template>

<script>
// ... (Phần script giữ nguyên như ban đầu)
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { showError } from "@/utils/notifications";
import OverdueBook from "@/components/admin/OverdueBook.vue";

export default {
  name: "AdminHomePage",
  components: {
    LoadingSpinner,
    OverdueBook,
  },
  setup() {
    const store = useStore();

    // Computed properties từ Vuex
    const totalBooks = computed(
      () => store.getters["book/allBooks"]?.length || 0
    );
    const totalAuthors = computed(
      () => store.getters["author/allAuthors"]?.length || 0
    );
    const totalPublishers = computed(
      () => store.getters["publisher/allPublishers"]?.length || 0
    );
    const totalBorrowedBooks = computed(
      () =>
        store.getters["borrow/allBorrowRequests"]?.filter(
          (req) => req.trangThai === "Đã duyệt"
        ).length || 0
    );

    // Thống kê phạt và quá hạn
    const libraryStats = computed(
      () => store.getters["borrow/libraryStatistics"]
    );
    const currentOverdueCount = computed(
      () => libraryStats.value?.soSachDangQuaHan || 0
    );
    const totalOverdueReturns = computed(
      () => libraryStats.value?.tongSoLanTraTre || 0
    );
    const totalPenalty = computed(() => libraryStats.value?.tongTienPhat || 0);
    const totalReturned = computed(
      () => libraryStats.value?.tongSoSachDaTra || 0
    );

    // Thống kê bổ sung
    const totalReaders = computed(() => {
      const requests = store.getters["borrow/allBorrowRequests"];
      const readerIds = new Set(
        requests.map((req) => req.maDocGia?._id).filter(Boolean)
      );
      return readerIds.size;
    });

    const availableBooks = computed(() => {
      const books = store.getters["book/allBooks"];
      return books.reduce((sum, book) => sum + (book.soQuyen || 0), 0);
    });

    const pendingRequests = computed(
      () =>
        store.getters["borrow/allBorrowRequests"]?.filter(
          (req) => req.trangThai === "Chờ duyệt"
        ).length || 0
    );

    // Tỷ lệ trả đúng hạn
    const onTimeReturnRate = computed(() => {
      const totalReturns = totalReturned.value;
      if (totalReturns === 0) return 100;
      const onTimeReturns = totalReturns - totalOverdueReturns.value;
      return Math.round((onTimeReturns / totalReturns) * 100);
    });

    const lateReturnRate = computed(() => {
      return 100 - onTimeReturnRate.value;
    });

    // Trung bình phạt mỗi lần
    const averagePenalty = computed(() => {
      if (totalOverdueReturns.value === 0) return 0;
      return totalPenalty.value / totalOverdueReturns.value;
    });

    const loading = computed(
      () =>
        store.getters["book/isLoading"] ||
        store.getters["author/isLoading"] ||
        store.getters["publisher/isLoading"] ||
        store.getters["borrow/isLoading"]
    );

    const error = computed(
      () =>
        store.getters["book/error"] ||
        store.getters["author/error"] ||
        store.getters["publisher/error"] ||
        store.getters["borrow/error"]
    );

    // Lấy tất cả dữ liệu cần thiết
    const fetchData = async () => {
      try {
        await Promise.all([
          store.dispatch("book/fetchBooks"),
          store.dispatch("author/fetchAuthors"),
          store.dispatch("publisher/fetchPublishers"),
          store.dispatch("borrow/fetchBorrowRequests"),
          store.dispatch("borrow/fetchLibraryStatistics"),
        ]);
      } catch (error) {
        showError(error.message);
      }
    };

    const formatCurrency = (value) => {
      if (!value) return "0 ₫";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    };

    const clearError = () => {
      store.commit("book/SET_ERROR", null);
      store.commit("author/SET_ERROR", null);
      store.commit("publisher/SET_ERROR", null);
      store.commit("borrow/SET_ERROR", null);
    };

    onMounted(fetchData);

    return {
      totalBooks,
      totalAuthors,
      totalPublishers,
      totalBorrowedBooks,
      currentOverdueCount,
      totalOverdueReturns,
      totalPenalty,
      totalReturned,
      totalReaders,
      availableBooks,
      pendingRequests,
      onTimeReturnRate,
      lateReturnRate,
      averagePenalty,
      loading,
      error,
      formatCurrency,
      clearError,
    };
  },
};
</script>

<style scoped>
/* Định nghĩa biến màu Xanh Navy/Indigo (Đồng bộ với AdminDashboard) */
:root {
  --primary-blue-dark: #1A237E; /* Xanh Indigo đậm (cho text/header) */
  --primary-blue: #3949AB;     /* Xanh Indigo (cho card, progress) */
  --primary-blue-light: #C5CAE9; /* Xanh Indigo nhạt (cho nền/viền card) */
  --primary-blue-text: #1976D2; /* Xanh tươi hơn cho tiêu đề thống kê */
}

/* Các màu phụ cho các ô thống kê */
.primary-blue-bg { background-color: var(--primary-blue) !important; }
.secondary-blue-bg { background-color: #64B5F6 !important; } /* Light Blue */
.tertiary-blue-bg { background-color: #00BCD4 !important; } /* Cyan */
.fourth-blue-bg { background-color: #4DB6AC !important; } /* Teal */

/* Điều chỉnh màu sắc trong template */
.text-primary { color: var(--primary-blue-text) !important; }
.text-secondary { color: #64B5F6 !important; }
.text-info { color: #00BCD4 !important; }
.text-success { color: #4DB6AC !important; } /* Giữ xanh tươi hơn cho sách mượn */
.bg-primary { background-color: var(--primary-blue-text) !important; }

/* Card chung */
.card {
  background: white;
  border-radius: 12px;
  /* Viền card nhạt */
  border: 1px solid var(--primary-blue-light); 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* Icon trên thẻ */
.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  /* Giữ màu nền icon là màu trắng/màu nhạt tùy theo style mới */
  /* Thay đổi: Đặt màu nền bằng class CSS để dùng các sắc thái xanh khác nhau */
  /* Màu chữ icon được đặt là text-white để nổi bật trên nền đậm */
}

.card-title {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.card-text {
  font-size: 0.95rem;
  color: #6c757d;
  font-weight: 500;
}

/* Header thẻ */
.card-header {
  /* Xanh Indigo rất nhạt */
  background-color: #EEF1F8; 
  border-bottom: 1px solid var(--primary-blue-light);
  padding: 16px 20px;
  border-radius: 12px 12px 0 0;
}

.card-header h5 {
  color: var(--primary-blue-dark); /* Xanh Indigo đậm */
  font-weight: 600;
}

/* Progress */
.progress {
  height: 8px;
  border-radius: 4px;
  background-color: var(--primary-blue-light);
}

.progress-bar {
  border-radius: 4px;
  /* Thanh tiến trình dùng màu xanh chính */
  background-color: var(--primary-blue) !important; 
}

/* Các tiêu đề chính */
h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--primary-blue-dark); 
  margin-bottom: 30px;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-blue-text);
}

/* Các card thống kê giữ nguyên màu danger, warning, success của Bootstrap */
/* và đã được thêm border để nổi bật */

</style>