<template>
  <div class="login-background">
    <div class="login-box">
      <div class="login-left">
        <transition name="fade" mode="out-in">
          <div :key="currentSlideIndex" class="slide-content-wrapper">
            <h2 class="welcome-title">{{ currentSlide.title }}</h2>
            <p class="slide-text">{{ currentSlide.text }}</p>
            <div class="image-wrapper">
              <img :src="currentSlide.url" class="login-image" :alt="currentSlide.title" />
            </div>
            <div class="slide-indicators">
              <span
                v-for="(slide, index) in slides"
                :key="index"
                class="dot"
                :class="{ active: index === currentSlideIndex }"
              ></span>
            </div>
          </div>
        </transition>
      </div>

      <!-- Form đăng nhập -->
      <div class="login-right">
        <LoadingSpinner :show="loading" />

        <div class="login-title">
          <h1>Đăng nhập</h1>
          <p>Đăng nhập để truy cập tài khoản của bạn</p>
        </div>

        <!-- Tab chọn loại người dùng -->
        <div class="user-type-tabs">
          <button
            class="tab-button"
            :class="{ active: userType === 'reader' }"
            @click="userType = 'reader'"
          >
            Độc giả
          </button>
          <button
            class="tab-button"
            :class="{ active: userType === 'staff' }"
            @click="userType = 'staff'"
          >
            Nhân viên
          </button>
        </div>

        <form @submit.prevent="handleSubmit" novalidate class="login-form">
          <!-- Thông báo lỗi -->
          <div v-if="error" class="alert alert-error">
            {{ error }}
            <button type="button" class="alert-close" @click="clearError">
              ×
            </button>
          </div>

          <!-- MSNV cho nhân viên -->
          <div class="form-group" v-if="userType === 'staff'">
            <label>MSNV <span class="required">*</span></label>
            <input
              v-model="credentials.MSNV"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.MSNV }"
              placeholder="Nhập MSNV"
              required
              @input="validateField('MSNV')"
            />
            <div class="error-message" v-if="errors.MSNV">
              {{ errors.MSNV }}
            </div>
          </div>

          <!-- Email cho độc giả -->
          <div class="form-group" v-if="userType === 'reader'">
            <label>Email <span class="required">*</span></label>
            <input
              v-model="credentials.email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              placeholder="Nhập email"
              required
              @input="validateField('email')"
            />
            <div class="error-message" v-if="errors.email">
              {{ errors.email }}
            </div>
          </div>

          <!-- Mật khẩu -->
          <div class="form-group password-group">
            <label>Mật khẩu <span class="required">*</span></label>
            <div class="password-input-wrapper">
              <input
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': errors.password }"
                placeholder="Nhập mật khẩu"
                required
                @input="validateField('password')"
              />
              <button
                type="button"
                class="password-toggle"
                @click="togglePasswordVisibility"
              >
                <i
                  :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                ></i>
              </button>
            </div>
            <div class="error-message" v-if="errors.password">
              {{ errors.password }}
            </div>
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            {{ loading ? "Đang xử lý..." : "Đăng nhập" }}
          </button>

          <p class="register-link">
            Chưa có tài khoản?
            <router-link to="/register" class="text-decoration-none fw-bold">
              Đăng ký ngay
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { showError } from "@/utils/notifications";

import LibraryAmico from "@/assets/Library-amico.png";
import BooksCuate from "@/assets/Books-cuate.png";
import ELearningCuate from "@/assets/E-learning-cuate.png";

export default {
  name: "LoginForm",
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const router = useRouter();

    // --- LOGIC SLIDE ẢNH BỔ SUNG ---
    const slides = ref([
      { 
        url: LibraryAmico ,
        title: "Chào mừng bạn đến với Thư viện số", 
        text: "Tìm kiếm sách, tài liệu và tri thức không giới hạn." 
      },
      { 
        url: BooksCuate, 
        title: "Khám phá bộ sưu tập đa dạng", 
        text: "Hàng ngàn đầu sách thuộc mọi lĩnh vực chờ đợi bạn." 
      },
      { 
        url: ELearningCuate,
        title: "Học tập mọi lúc, mọi nơi", 
        text: "Truy cập tài liệu trực tuyến dễ dàng và tiện lợi." 
      },
    ]);
    const currentSlideIndex = ref(0);
    let slideInterval = null;

    const currentSlide = computed(() => slides.value[currentSlideIndex.value]);

    const startSlideShow = () => {
      slideInterval = setInterval(() => {
        currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.value.length;
      }, 5000); // Tự động chuyển slide sau 5 giây
    };

    onMounted(() => {
      startSlideShow();
    });

    onUnmounted(() => {
      // Dọn dẹp interval khi component bị hủy
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    });

    const userType = ref("reader");
    const credentials = ref({
      MSNV: "",
      email: "",
      password: "",
    });
    const errors = ref({});
    const loginAttempts = ref(0);
    const showPassword = ref(false);

    const loading = computed(() => store.state.auth.loading);
    const error = computed(() => store.state.auth.error);

    const validateField = (field) => {
      const newErrors = { ...errors.value };

      if (field === "MSNV" && userType.value === "staff") {
        if (!credentials.value.MSNV) {
          newErrors.MSNV = "MSNV là bắt buộc";
        } else {
          delete newErrors.MSNV;
        }
      }

      if (field === "email" && userType.value === "reader") {
        if (!credentials.value.email) {
          newErrors.email = "Email là bắt buộc";
        } else if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.value.email)
        ) {
          newErrors.email = "Email không hợp lệ";
        } else {
          delete newErrors.email;
        }
      }

      if (field === "password") {
        if (!credentials.value.password) {
          newErrors.password = "Mật khẩu là bắt buộc";
        } else if (credentials.value.password.length < 5) {
          newErrors.password = "Mật khẩu phải có ít nhất 5 ký tự";
        } else if (
          !/(?=.*[A-Za-z])(?=.*\d).+/.test(credentials.value.password)
        ) {
          newErrors.password = "Mật khẩu phải chứa cả chữ và số";
        } else {
          delete newErrors.password;
        }
      }

      errors.value = newErrors;
    };

    const validateForm = () => {
      const newErrors = {};
      if (userType.value === "staff" && !credentials.value.MSNV) {
        newErrors.MSNV = "MSNV là bắt buộc";
      }
      if (userType.value === "reader" && !credentials.value.email) {
        newErrors.email = "Email là bắt buộc";
      } else if (
        userType.value === "reader" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.value.email)
      ) {
        newErrors.email = "Email không hợp lệ";
      }
      if (!credentials.value.password) {
        newErrors.password = "Mật khẩu là bắt buộc";
      } else if (credentials.value.password.length < 5) {
        newErrors.password = "Mật khẩu phải có ít nhất 5 ký tự";
      } else if (!/(?=.*[A-Za-z])(?=.*\d).+/.test(credentials.value.password)) {
        newErrors.password = "Mật khẩu phải chứa cả chữ và số";
      }
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        return;
      }

      try {
        loginAttempts.value += 1;
        if (userType.value === "staff") {
          await store.dispatch("auth/loginStaff", {
            MSNV: credentials.value.MSNV,
            password: credentials.value.password,
          });
          router.push("/admin");
        } else {
          await store.dispatch("auth/loginReader", {
            email: credentials.value.email,
            password: credentials.value.password,
          });
          router.push("/reader");
        }
        loginAttempts.value = 0;
        errors.value = {};
      } catch (err) {
        showError(err);
      }
    };

    const clearError = () => {
      store.commit("auth/SET_ERROR", null);
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      userType,
      credentials,
      loading,
      error,
      errors,
      loginAttempts,
      showPassword,
      togglePasswordVisibility,
      handleSubmit,
      clearError,
      validateField,
      currentSlide,
      slides,
      currentSlideIndex
    };
  },
};
</script>

<style scoped>
/* --- GIAO DIỆN MỚI: TỐI GIẢN - XANH DƯƠNG NHẠT --- */
* {
  box-sizing: border-box;
}

/* 1. Nền & Hộp chính */
.login-background {
  min-height: 100vh;
  /* Nền Xám Xanh Nhạt */
  background-color: #f0f3f8;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.login-box {
  display: flex;
  width: 100%;
  max-width: 950px;
  height: 600px; /* Chiều cao cố định tương tự như hình mẫu */
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 2. Phần ảnh & Slide (Gam Xanh/Tím Nhạt) */
.login-left {
  flex: 1;
  /* Nền Gradient Xanh/Tím Nhạt - Tạo không khí nhẹ nhàng */
  background: linear-gradient(135deg, #e0e7ff 0%, #c3dafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.slide-content-wrapper {
    text-align: center;
}

.welcome-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #3b5998; /* Màu xanh đậm */
    margin-bottom: 20px;
}

.image-wrapper {
  max-width: 85%;
  margin: 0 auto;
}

.login-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* 3. Phần Form (Sạch & Tối Giản) */
.login-right {
  flex: 1.1;
  padding: 50px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
}

.login-title {
  text-align: left;
  margin-bottom: 30px;
}

.login-title h1 {
  font-size: 2.5rem;
  font-weight: 800; /* Rất đậm */
  color: #3b5998; /* Màu Xanh Navy Sáng */
  margin-bottom: 8px;
}

.login-title p {
  font-size: 1rem;
  color: #7f8c9a;
}

/* 4. Tab Chọn Loại Người Dùng */
.user-type-tabs {
  display: flex;
  margin-bottom: 30px;
  background-color: #f0f3f8; /* Nền xám nhạt */
  border-radius: 10px;
  padding: 4px;
}

.tab-button {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #7f8c9a;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.tab-button.active {
  background: #c3dafe; /* Nền Xanh Nhạt */
  color: #3b5998; /* Chữ Xanh đậm */
  box-shadow: 0 4px 8px rgba(195, 218, 254, 0.6);
}

.tab-button:hover:not(.active) {
  background: #e6e9ef;
}

/* 5. Form Controls */
.login-form {
  gap: 20px;
}

.form-group label {
  font-size: 1rem;
  font-weight: 700; /* Đậm hơn */
  color: #3b5998;
  margin-bottom: 6px;
  display: block;
}

.required {
  color: #f39c12; /* Màu Vàng Cam (Gold Accent) */
}

.form-control {
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #c3dafe;
  box-shadow: 0 0 0 3px rgba(195, 218, 254, 0.4);
}

.form-control.is-invalid {
  border-color: #e74c3c !important;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 5px;
}

/* 6. Mật khẩu - KHẮC PHỤC LỖI CON MẮT */
.password-input-wrapper {
  display: flex; /* Quan trọng: Đảm bảo input và button cùng dòng */
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  transition: border-color 0.3s, box-shadow 0.3s;
  padding-right: 12px; /* Khoảng trống cho button */
}

/* Hiệu ứng Focus cho Wrapper */
.password-input-wrapper:focus-within {
  border-color: #c3dafe;
  box-shadow: 0 0 0 3px rgba(195, 218, 254, 0.4);
}

.password-input-wrapper.is-invalid-wrapper {
  border-color: #e74c3c !important;
}

.password-input {
  flex-grow: 1;
  border: none; /* Bỏ border riêng của input */
  padding-right: 0; /* Loại bỏ padding phải */
}

.password-input:focus {
    box-shadow: none; /* Tránh double shadow */
}

.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: #7f8c9a;
  font-size: 1rem;
  padding: 0;
  margin-left: -5px; /* Điều chỉnh vị trí icon */
}

.password-toggle:hover {
  color: #3b5998;
}

/* 7. Nút Đăng nhập */
.btn-login {
  /* Màu Nút Vàng Cam Tương Phản */
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
  border: none;
  padding: 15px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 25px;
  box-shadow: 0 8px 15px rgba(243, 156, 18, 0.3);
  transition: all 0.3s ease;
  width: 100%; /* Đảm bảo nút chiếm toàn bộ chiều rộng */
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(243, 156, 18, 0.5);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 8. Thông báo Lỗi */
.alert-error {
  background: #fef1f1;
  color: #c0392b;
  border: 1px solid #e74c3c;
  border-left: 4px solid #e74c3c;
  border-radius: 8px;
  padding: 12px 15px;
  margin-bottom: 20px;
  font-weight: 500;
}

/* 9. Liên kết Đăng ký */
.register-link {
  text-align: center;
  margin-top: 25px;
  font-size: 0.95rem;
  color: #7f8c9a;
}

.register-link a {
  color: #f39c12; /* Link màu Vàng Cam */
  font-weight: 700;
  text-decoration: none;
}

.register-link a:hover {
  color: #e67e22;
}

/* 10. Responsive Design */
@media (max-width: 900px) {
  .login-box {
    flex-direction: column;
    min-height: auto;
    max-width: 400px;
    height: auto;
  }

  .login-left {
    display: none;
  }

  .login-right {
    padding: 30px;
  }

  .login-title h1 {
    font-size: 2rem;
  }
}

.slide-content-wrapper {
  text-align: center;
  /* Quan trọng: Cần vị trí tương đối cho animation */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
}

.slide-text {
    color: #3b5998;
    font-size: 0.95rem;
    margin-bottom: 25px;
    opacity: 0.8;
}

/* Indicators */
.slide-indicators {
  position: absolute;
  bottom: -30px; /* Đặt dưới hình ảnh */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dot {
  height: 8px;
  width: 8px;
  background-color: #a0aec0; /* Màu xám */
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.dot.active {
  background-color: #3b5998; /* Màu xanh đậm khi active */
  transform: scale(1.2);
}

/* Hiệu ứng chuyển cảnh (Fade Transition) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease; /* Tăng thời gian chuyển đổi để mượt mà hơn */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
