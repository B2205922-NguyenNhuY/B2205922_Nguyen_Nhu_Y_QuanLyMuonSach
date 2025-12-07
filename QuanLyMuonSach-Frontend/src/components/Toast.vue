<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast show shadow-lg border-0"
      :class="toast.type"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="toast-header">
        <i :class="toast.iconClass" class="me-2"></i>
        <strong class="me-auto fw-bold">{{ toast.title }}</strong>
        <small class="text-muted-custom">Vừa xong</small>
        <button
          type="button"
          class="btn-close"
          @click="removeToast(toast.id)"
          aria-label="Close"
        ></button>
      </div>
      <div class="toast-body">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Toast",
  setup() {
    const toasts = ref([]); // Mảng chứa các toast đang hiển thị
    let nextId = 1; // Dùng để tạo ID duy nhất cho mỗi toast

    /**
     * Thêm toast mới
     * @param {string} message - Nội dung thông báo
     * @param {string} type - Loại thông báo: success, danger, warning, info
     * @param {number} timeout - Thời gian hiển thị (ms)
     */
    const addToast = (message, type = "success", timeout = 5000) => {
      const id = nextId++;
      const toast = {
        id,
        message,
        type: `toast-${type}`, // Custom class for styling
        title: getTitleByType(type),
        iconClass: getIconByType(type),
      };
      toasts.value.push(toast);

      // Tự động xóa toast sau timeout
      setTimeout(() => removeToast(id), timeout);
    };

    // Xác định tiêu đề hiển thị theo loại thông báo
    const getTitleByType = (type) => {
      switch (type) {
        case "success":
          return "Thành công";
        case "danger":
          return "Lỗi";
        case "warning":
          return "Cảnh báo";
        case "info":
          return "Thông báo";
        default:
          return "Thông báo";
      }
    };
    
    // Xác định icon hiển thị theo loại thông báo
    const getIconByType = (type) => {
      switch (type) {
        case "success":
          return "fas fa-check-circle text-success";
        case "danger":
          return "fas fa-times-circle text-danger";
        case "warning":
          return "fas fa-exclamation-triangle text-warning";
        case "info":
          return "fas fa-info-circle text-info-custom";
        default:
          return "fas fa-info-circle text-info-custom";
      }
    };

    // Xóa toast theo ID
    const removeToast = (id) => {
      const index = toasts.value.findIndex((t) => t.id === id);
      if (index > -1) {
        toasts.value.splice(index, 1);
      }
    };

    return {
      toasts,
      addToast,
      removeToast,
    };
  },
};
</script>

<style scoped>
/* Ensure toast is on top of everything */
.toast-container {
  z-index: 1056; 
}

.toast {
  min-width: 300px;
  max-width: 350px;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-header {
  padding: 0.75rem 1rem;
  color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.toast-body {
  padding: 1rem;
  background-color: #ffffff;
  color: #212529; /* Dark text */
}

.btn-close {
  filter: invert(1); /* Ensure close button is visible on colored header */
  opacity: 0.8;
}

/* Custom Text Colors */
.text-success {
    color: #198754 !important;
}
.text-danger {
    color: #dc3545 !important;
}
.text-warning {
    color: #ffc107 !important;
}
.text-info-custom {
    color: #0d6efd !important; /* Xanh biển */
}
.text-muted-custom {
    color: rgba(255, 255, 255, 0.7) !important;
    font-size: 0.75rem;
}


/* === CUSTOM TOAST STYLES (HEADER COLORS) - BLUE THEME === */

/* SUCCESS: Use a vibrant blue header */
.toast-success .toast-header {
  background-color: #0d6efd; /* Primary Blue */
}

/* DANGER: Use red header */
.toast-danger .toast-header {
  background-color: #dc3545; /* Red */
}

/* WARNING: Use orange/yellow header */
.toast-warning .toast-header {
  background-color: #ffc107; /* Orange/Yellow */
  color: #212529; /* Dark text on light background */
}
.toast-warning .toast-header .btn-close {
    filter: none; /* Black close button on light header */
}
.toast-warning .toast-header .text-muted-custom {
    color: rgba(0, 0, 0, 0.5) !important;
}

/* INFO: Use a softer blue header */
.toast-info .toast-header {
  background-color: #17a2b8; /* Cyan/Info Blue */
}

/* Default/Fallback */
.toast-default .toast-header {
  background-color: #6c757d; /* Secondary Gray */
}
</style>