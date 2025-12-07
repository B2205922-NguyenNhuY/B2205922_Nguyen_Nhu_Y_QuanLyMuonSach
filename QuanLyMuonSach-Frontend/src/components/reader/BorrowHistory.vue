<template>
  <div class="borrow-history container py-5">
    <LoadingSpinner :show="loading" />

    <div class="header-section text-center mb-4">
      <h2 class="display-5 fw-bold text-primary-blue mb-3">
        <i class="fas fa-history me-2"></i> Lịch sử Mượn Sách
      </h2>
      <p class="text-muted">Theo dõi tất cả các yêu cầu mượn và trả sách của bạn.</p>
    </div>

    <div
      v-if="error"
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      <i class="fas fa-exclamation-triangle me-2"></i> {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <div class="row mb-4" v-if="penaltySummary.totalPenalty > 0">
      <div class="col-md-12">
        <div class="alert alert-danger-blue shadow-sm">
          <h5 class="fw-bold">
            <i class="fas fa-bell me-2"></i> Tổng tiền phạt:
          </h5>
          <p class="mb-0">
            <strong class="text-danger">{{ formatCurrency(penaltySummary.totalPenalty) }}</strong>
            <span class="text-muted ms-3"
              >({{ penaltySummary.totalOverdueReturns }} lần trả trễ, trung bình
              {{ penaltySummary.avgLateDays.toFixed(1) }} ngày/lần)</span
            >
          </p>
        </div>
      </div>
    </div>

    <div class="row mb-4 justify-content-center">
      <div class="col-lg-8">
        <div class="input-group search-box shadow-sm">
          <input
            type="text"
            class="form-control search-input"
            v-model="searchTerm"
            placeholder="Tìm kiếm theo tên sách, mã sách"
          />
          <span class="input-group-text search-icon">
            <i class="fas fa-search text-primary-blue"></i>
          </span>
        </div>
      </div>
    </div>

    <ul class="nav nav-tabs history-tabs mb-4">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: currentTab === 'all' }"
          @click="currentTab = 'all'"
          ><i class="fas fa-list-alt me-1"></i> Tất cả</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: currentTab === 'pending' }"
          @click="currentTab = 'pending'"
          ><i class="fas fa-clock me-1"></i> Chờ duyệt</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: currentTab === 'approved' }"
          @click="currentTab = 'approved'"
          ><i class="fas fa-check-circle me-1"></i> Đã duyệt</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: currentTab === 'rejected' }"
          @click="currentTab = 'rejected'"
          ><i class="fas fa-times-circle me-1"></i> Bị từ chối</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: currentTab === 'returned' }"
          @click="currentTab = 'returned'"
          ><i class="fas fa-undo me-1"></i> Đã trả</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: currentTab === 'overdue' }"
          @click="currentTab = 'overdue'"
        >
          <i class="fas fa-calendar-times me-1"></i> Trả trễ
          <span class="badge bg-danger ms-1" v-if="overdueCount > 0">{{
            overdueCount
          }}</span>
        </a>
      </li>
    </ul>

    <div class="table-responsive">
      <table class="table table-striped table-hover history-table shadow-sm">
        <thead>
          <tr>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Ngày hẹn trả</th>
            <th
              v-if="
                currentTab === 'all' ||
                currentTab === 'returned' ||
                currentTab === 'overdue'
              "
            >
              Ngày trả
            </th>
            <th>Trạng thái</th>
            <th
              v-if="
                currentTab === 'all' ||
                currentTab === 'returned' ||
                currentTab === 'overdue'
              "
            >
              Phạt
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in filteredRequests" :key="request._id">
            <td>
              <span class="fw-medium">{{ request.maSach?.tenSach || "N/A" }}</span
              ><br />
              <small class="text-muted"
                >Mã sách: {{ request.maSach?.maSach || "N/A" }}</small
              >
            </td>
            <td>{{ formatDate(request.ngayMuon) }}</td>
            <td>
              {{ formatDate(request.ngayHenTra) }}
              <span
                v-if="isOverdue(request) && request.trangThai === 'Đã duyệt'"
                class="badge bg-warning-blue ms-1"
                >Quá hạn</span
              >
            </td>
            <td
              v-if="
                currentTab === 'all' ||
                currentTab === 'returned' ||
                currentTab === 'overdue'
              "
            >
              {{ request.ngayTra ? formatDate(request.ngayTra) : "-" }}
            </td>
            <td>
              <span :class="getStatusBadgeClass(request.trangThai)">{{
                request.trangThai
              }}</span>
            </td>
            <td
              v-if="
                currentTab === 'all' ||
                currentTab === 'returned' ||
                currentTab === 'overdue'
              "
            >
              <div v-if="request.tienPhat && request.tienPhat > 0">
                <span class="text-danger fw-bold">{{
                  formatCurrency(request.tienPhat)
                }}</span
                ><br />
                <small class="text-muted"
                  >{{ request.soNgayTre }} ngày trễ</small
                >
              </div>
              <span v-else class="text-success-blue fw-medium">-</span>
            </td>
          </tr>
          <tr v-if="filteredRequests.length === 0">
            <td :colspan="getColspan" class="text-center py-3">
                <i class="fas fa-info-circle me-1"></i> Không có lịch sử mượn sách nào trong mục này.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { showError } from "@/utils/notifications";

export default {
  name: "BorrowHistory",
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const currentTab = ref("all");
    const loading = ref(false);
    const error = ref(null);
    const searchTerm = ref("");

    const borrowHistory = computed(() => store.getters["borrow/borrowHistory"]);

    // Tính toán tổng quan phạt
    const penaltySummary = computed(() => {
      const overdueReturns = borrowHistory.value.filter(
        (request) => request.trangThai === "Đã trả" && request.tienPhat > 0
      );

      const totalPenalty = overdueReturns.reduce(
        (sum, request) => sum + (request.tienPhat || 0),
        0
      );
      const totalOverdueReturns = overdueReturns.length;
      const avgLateDays =
        totalOverdueReturns > 0
          ? overdueReturns.reduce(
              (sum, request) => sum + (request.soNgayTre || 0),
              0
            ) / totalOverdueReturns
          : 0;

      return {
        totalPenalty,
        totalOverdueReturns,
        avgLateDays,
      };
    });

    // Đếm số lần trả trễ (có phạt)
    const overdueCount = computed(() => {
      return borrowHistory.value.filter(
        (request) => request.trangThai === "Đã trả" && request.tienPhat > 0
      ).length;
    });

    const filteredRequests = computed(() => {
      let results = borrowHistory.value;

      if (currentTab.value !== "all") {
        const statusMap = {
          pending: "Chờ duyệt",
          approved: "Đã duyệt",
          rejected: "Từ chối",
          returned: "Đã trả",
        };

        if (currentTab.value === "overdue") {
          results = results.filter(
            // Trả trễ là những yêu cầu Đã trả VÀ có tiền phạt > 0
            (request) => request.trangThai === "Đã trả" && request.tienPhat > 0
          );
        } else {
          results = results.filter(
            (request) => request.trangThai === statusMap[currentTab.value]
          );
        }
      }

      if (searchTerm.value.trim()) {
        const search = searchTerm.value.toLowerCase().trim();
        results = results.filter(
          (request) =>
            request.maSach?.tenSach?.toLowerCase().includes(search) ||
            request.maSach?.maSach?.toLowerCase().includes(search)
        );
      }

      return results;
    });

    const formatDate = (date) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("vi-VN");
    };

    const formatCurrency = (value) => {
      if (!value) return "0 ₫";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    };

    const isOverdue = (request) => {
      // Kiểm tra xem một yêu cầu ĐÃ DUYỆT có bị QUÁ HẠN so với ngày hiện tại không
      if (!request.ngayHenTra || request.trangThai !== "Đã duyệt") return false;
      // So sánh ngày hiện tại với ngày hẹn trả
      return new Date() > new Date(request.ngayHenTra);
    };

    const getStatusBadgeClass = (status) => {
      const classes = {
        "Chờ duyệt": "badge bg-warning-blue",
        "Đã duyệt": "badge bg-success-blue",
        "Từ chối": "badge bg-danger",
        "Đã trả": "badge bg-info-blue",
      };
      return classes[status] || "badge bg-secondary-blue";
    };

    const fetchHistory = async () => {
      loading.value = true;
      try {
        await store.dispatch("borrow/fetchBorrowHistory");
      } catch (err) {
        error.value = err.message;
        showError(err);
      } finally {
        loading.value = false;
      }
    };

    const clearError = () => {
      error.value = null;
      store.commit("borrow/SET_ERROR", null);
    };

    const getColspan = computed(() => {
      // Số cột hiển thị trong bảng
      return currentTab.value === "all" ||
        currentTab.value === "returned" ||
        currentTab.value === "overdue"
        ? 6
        : 4;
    });

    onMounted(fetchHistory);

    return {
      currentTab,
      filteredRequests,
      loading,
      error,
      searchTerm,
      penaltySummary,
      overdueCount,
      formatDate,
      formatCurrency,
      isOverdue,
      getStatusBadgeClass,
      clearError,
      getColspan,
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
    border-bottom: 2px solid #e9ecef;
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

/* --- TABS --- */
.history-tabs .nav-link {
    color: #6c757d;
    font-weight: 500;
    border: none;
    border-bottom: 3px solid transparent;
    padding: 10px 15px;
    transition: all 0.3s ease;
}

.history-tabs .nav-link.active {
    color: #0d6efd; 
    border-bottom: 3px solid #0d6efd; 
    background-color: #f8f9fa;
}

.history-tabs .nav-link:hover {
    color: #0b5ed7;
}

/* --- TABLE --- */
.history-table thead th {
    background-color: #e3f2fd; /* Light blue header */
    color: #0d6efd;
    font-weight: 700;
    vertical-align: middle;
    padding: 12px;
}

.history-table .table-striped > tbody > tr:nth-child(odd) {
    background-color: #f5faff; /* Very light blue stripe */
}

/* --- BADGE COLORS (Adapted to Blue Palette) --- */
.badge {
  font-size: 0.8em;
  padding: 0.4em 0.6em;
  border-radius: 6px;
  text-transform: capitalize;
}

/* Chờ duyệt (Pending) */
.badge.bg-warning-blue {
  background-color: #fff3cd; /* Vàng nhạt */
  color: #ffc107; /* Vàng đậm */
}

/* Đã duyệt (Approved) */
.badge.bg-success-blue {
  background-color: #d1e7dd; /* Xanh lá nhạt */
  color: #198754; /* Xanh lá đậm */
}

/* Từ chối (Rejected) */
.badge.bg-danger {
  background-color: #f8d7da;
  color: #dc3545;
}

/* Đã trả (Returned) */
.badge.bg-info-blue {
  background-color: #cfe2ff; /* Xanh biển nhạt */
  color: #0d6efd; /* Xanh biển đậm */
}

/* Mặc định */
.badge.bg-secondary-blue {
  background-color: #e9ecef;
  color: #6c757d;
}

/* --- PENALTY ALERT --- */
.alert-danger-blue {
    background-color: #f8d7da; /* Mềm hóa từ alert-danger */
    border-color: #f5c6cb;
    color: #842029;
    font-size: 0.95rem;
}
.alert-danger-blue h5 {
    color: #842029;
}

/* --- TEXT COLORS --- */
.text-danger {
  font-weight: bold;
  color: #dc3545 !important;
}
.text-success-blue {
  font-weight: bold;
  color: #198754 !important; /* Dùng màu success chuẩn */
}
.text-muted {
  font-size: 0.85em;
  font-style: italic;
  color: #78909c !important;
}

/* Fix for general form control styling */
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
  outline: none;
}
.input-group-text {
    border: 1px solid #ced4da;
    border-left: none;
    border-radius: 0 50px 50px 0;
}
.search-box .form-control {
    border-radius: 50px 0 0 50px;
    border: 1px solid #ced4da;
    border-right: none;
}
</style>
