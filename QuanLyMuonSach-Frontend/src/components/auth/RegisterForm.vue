<template>
  <div class="register-background">
    <div class="register-box">
      <div class="register-left">
    <transition name="fade" mode="out-in">
        <div 
            v-if="currentSlide" 
            :key="currentSlideIndex" 
            class="slide-content-wrapper"
        >
            <h2 class="welcome-title">{{ currentSlide.title }}</h2>
            <p class="slide-text">{{ currentSlide.text }}</p>
            <div class="image-wrapper">
                <img :src="currentSlide.url" class="register-image" :alt="currentSlide.title" />
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

      <!-- Form đăng ký. -->
      <div class="register-right">
        <LoadingSpinner :show="loading" />

        <div class="register-title">
          <h1>Đăng ký tài khoản độc giả</h1>
          <p>Tạo tài khoản để dễ dàng mượn và trả sách</p>
        </div>

        <form @submit.prevent="handleSubmit" novalidate class="register-form">
          <!-- Thông báo lỗi -->
          <div v-if="error" class="alert alert-error">
            {{ error }}
            <button type="button" class="alert-close" @click="clearError">
              ×
            </button>
          </div>

          <!-- Mã độc giả -->
          <div class="form-group">
            <label>Mã độc giả <span class="required">*</span></label>
            <input
              v-model="formData.maDocGia"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.maDocGia }"
              placeholder="Nhập mã độc giả"
              required
              @input="validateField('maDocGia')"
            />
            <div class="error-message" v-if="errors.maDocGia">
              {{ errors.maDocGia }}
            </div>
          </div>

          <!-- Họ và Tên -->
          <div class="form-row">
            <div class="form-group">
              <label>Họ <span class="required">*</span></label>
              <input
                v-model="formData.hoLot"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.hoLot }"
                placeholder="Nhập họ"
                required
                @input="validateField('hoLot')"
              />
              <div class="error-message" v-if="errors.hoLot">
                {{ errors.hoLot }}
              </div>
            </div>
            <div class="form-group">
              <label>Tên <span class="required">*</span></label>
              <input
                v-model="formData.ten"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.ten }"
                placeholder="Nhập tên"
                required
                @input="validateField('ten')"
              />
              <div class="error-message" v-if="errors.ten">
                {{ errors.ten }}
              </div>
            </div>
          </div>

          <!-- Ngày sinh -->
          <div class="form-group">
            <label>Ngày sinh <span class="required">*</span></label>
            <input
              v-model="formData.ngaySinh"
              type="date"
              class="form-control"
              :class="{ 'is-invalid': errors.ngaySinh }"
              required
              @input="validateField('ngaySinh')"
            />
            <div class="error-message" v-if="errors.ngaySinh">
              {{ errors.ngaySinh }}
            </div>
          </div>

          <!-- Giới tính và SĐT -->
          <div class="form-row">
            <div class="form-group">
              <label>Giới tính <span class="required">*</span></label>
              <select
                v-model="formData.phai"
                class="form-control"
                :class="{ 'is-invalid': errors.phai }"
                required
                @change="validateField('phai')"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              <div class="error-message" v-if="errors.phai">
                {{ errors.phai }}
              </div>
            </div>
            <div class="form-group">
              <label>Điện thoại <span class="required">*</span></label>
              <input
                v-model="formData.dienThoai"
                type="tel"
                class="form-control"
                :class="{ 'is-invalid': errors.dienThoai }"
                placeholder="Số điện thoại"
                required
                @input="validateField('dienThoai')"
              />
              <div class="error-message" v-if="errors.dienThoai">
                {{ errors.dienThoai }}
              </div>
            </div>
          </div>

          <!-- Địa chỉ -->
          <div class="form-group">
            <label>Địa chỉ <span class="required">*</span></label>
            <input
              v-model="formData.diaChi"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.diaChi }"
              placeholder="Nhập địa chỉ"
              required
              @input="validateField('diaChi')"
            />
            <div class="error-message" v-if="errors.diaChi">
              {{ errors.diaChi }}
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <input
              v-model="formData.email"
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

          <!-- Mật khẩu và Xác nhận -->
          <div class="form-row">
            <div class="form-group password-group">
              <label>Mật khẩu <span class="required">*</span></label>
              <div class="password-input-wrapper">
                <input
                  v-model="formData.password"
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
            <div class="form-group password-group">
              <label>Xác nhận mật khẩu <span class="required">*</span></label>
              <div class="password-input-wrapper">
                <input
                  v-model="formData.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                  placeholder="Nhập lại mật khẩu"
                  required
                  @input="validateField('confirmPassword')"
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
              <div class="error-message" v-if="errors.confirmPassword">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <button type="submit" class="btn-register" :disabled="loading">
            {{ loading ? "Đang xử lý..." : "Đăng ký" }}
          </button>

          <p class="login-link">
            Đã có tài khoản?
            <router-link to="/login" class="text-decoration-none fw-bold">
              Đăng nhập
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
import { showError, showSuccess } from "@/utils/notifications";

import LibraryAmico from "@/assets/Library-amico.png"; // Ảnh 1 (Ví dụ)
import BooksCuate from "@/assets/Books-cuate.png";     // Ảnh 2 (Ví dụ)
import ELearningCuate from "@/assets/E-learning-cuate.png"; // Ảnh 3 (Ví dụ)
export default {
  name: "RegisterForm",
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const router = useRouter();

    const slides = ref([
        { 
            url: LibraryAmico, 
            title: "Trở thành Độc giả của Thư viện số", 
            text: "Đăng ký nhanh chóng để truy cập vào kho tài liệu khổng lồ." 
        },
        { 
            url: BooksCuate, 
            title: "Khám phá tri thức không giới hạn", 
            text: "Hàng ngàn đầu sách thuộc mọi lĩnh vực chờ đợi bạn." 
        },
        { 
            url: ELearningCuate, 
            title: "Tạo tài khoản học tập tiện lợi", 
            text: "Quản lý sách đang mượn và lịch sử đọc của bạn." 
        },
    ]);
    const currentSlideIndex = ref(0);
    let slideInterval = null;

    const currentSlide = computed(() => slides.value[currentSlideIndex.value]);

    const startSlideShow = () => {
        slideInterval = setInterval(() => {
            currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.value.length;
        }, 5000); // 5 giây/slide
    };
    
    // SỬ DỤNG onMounted VÀ onUnmounted
    onMounted(() => {
        startSlideShow();
    });

    onUnmounted(() => {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    });

    const formData = ref({
      maDocGia: "",
      hoLot: "",
      ten: "",
      ngaySinh: "",
      phai: "Nam",
      diaChi: "",
      dienThoai: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    const errors = ref({});
    const loading = computed(() => store.state.auth.loading);
    const error = computed(() => store.state.auth.error);
    const showPassword = ref(false);

    const validateField = (field) => {
      const newErrors = { ...errors.value };

      if (field === "maDocGia") {
        if (!formData.value.maDocGia) {
          newErrors.maDocGia = "Mã độc giả là bắt buộc";
        } else {
          delete newErrors.maDocGia;
        }
      }

      if (field === "hoLot") {
        if (!formData.value.hoLot) {
          newErrors.hoLot = "Họ là bắt buộc";
        } else {
          delete newErrors.hoLot;
        }
      }

      if (field === "ten") {
        if (!formData.value.ten) {
          newErrors.ten = "Tên là bắt buộc";
        } else {
          delete newErrors.ten;
        }
      }

      if (field === "ngaySinh") {
        if (!formData.value.ngaySinh) {
          newErrors.ngaySinh = "Ngày sinh là bắt buộc";
        } else {
          delete newErrors.ngaySinh;
        }
      }

      if (field === "phai") {
        if (!formData.value.phai) {
          newErrors.phai = "Giới tính là bắt buộc";
        } else {
          delete newErrors.phai;
        }
      }

      if (field === "diaChi") {
        if (!formData.value.diaChi) {
          newErrors.diaChi = "Địa chỉ là bắt buộc";
        } else {
          delete newErrors.diaChi;
        }
      }

      if (field === "dienThoai") {
        if (!formData.value.dienThoai) {
          newErrors.dienThoai = "Số điện thoại là bắt buộc";
        } else if (!/^[0][0-9]{9}$/.test(formData.value.dienThoai)) {
          newErrors.dienThoai =
            "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số";
        } else {
          delete newErrors.dienThoai;
        }
      }

      if (field === "email") {
        if (!formData.value.email) {
          newErrors.email = "Email là bắt buộc";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
          newErrors.email = "Email không hợp lệ";
        } else {
          delete newErrors.email;
        }
      }

      if (field === "password") {
        if (!formData.value.password) {
          newErrors.password = "Mật khẩu là bắt buộc";
        } else if (formData.value.password.length < 5) {
          newErrors.password = "Mật khẩu phải có ít nhất 5 ký tự";
        } else if (!/(?=.*[A-Za-z])(?=.*\d).+/.test(formData.value.password)) {
          newErrors.password = "Mật khẩu phải chứa cả chữ và số";
        } else {
          delete newErrors.password;
        }
        // Kiểm tra lại confirmPassword khi password thay đổi
        if (
          formData.value.confirmPassword &&
          formData.value.confirmPassword !== formData.value.password
        ) {
          newErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu phải khớp";
        } else if (formData.value.confirmPassword) {
          delete newErrors.confirmPassword;
        }
      }

      if (field === "confirmPassword") {
        if (!formData.value.confirmPassword) {
          newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
        } else if (formData.value.confirmPassword !== formData.value.password) {
          newErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu phải khớp";
        } else {
          delete newErrors.confirmPassword;
        }
      }

      errors.value = newErrors;
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.value.maDocGia) {
        newErrors.maDocGia = "Mã độc giả là bắt buộc";
      }
      if (!formData.value.hoLot) {
        newErrors.hoLot = "Họ là bắt buộc";
      }
      if (!formData.value.ten) {
        newErrors.ten = "Tên là bắt buộc";
      }
      if (!formData.value.ngaySinh) {
        newErrors.ngaySinh = "Ngày sinh là bắt buộc";
      }
      if (!formData.value.phai) {
        newErrors.phai = "Giới tính là bắt buộc";
      }
      if (!formData.value.diaChi) {
        newErrors.diaChi = "Địa chỉ là bắt buộc";
      }
      if (!formData.value.dienThoai) {
        newErrors.dienThoai = "Số điện thoại là bắt buộc";
      } else if (!/^[0][0-9]{9}$/.test(formData.value.dienThoai)) {
        newErrors.dienThoai =
          "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số";
      }
      if (!formData.value.email) {
        newErrors.email = "Email là bắt buộc";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        newErrors.email = "Email không hợp lệ";
      }
      if (!formData.value.password) {
        newErrors.password = "Mật khẩu là bắt buộc";
      } else if (formData.value.password.length < 5) {
        newErrors.password = "Mật khẩu phải có ít nhất 5 ký tự";
      } else if (!/(?=.*[A-Za-z])(?=.*\d).+/.test(formData.value.password)) {
        newErrors.password = "Mật khẩu phải chứa cả chữ và số";
      }
      if (!formData.value.confirmPassword) {
        newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
      } else if (formData.value.confirmPassword !== formData.value.password) {
        newErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu phải khớp";
      }
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        return;
      }

      try {
        await store.dispatch("auth/registerReader", formData.value);
        showSuccess("Đăng ký thành công");
        errors.value = {};
        router.push("/reader");
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
      formData,
      loading,
      error,
      errors,
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
/* --- GIAO DIỆN MỚI: XANH NHẠT - VÀNG CAM --- */
* {
  box-sizing: border-box;
}

/* 1. Nền & Hộp chính */
.register-background {
  min-height: 100vh;
  /* Nền Xám Xanh Nhạt */
  background-color: #f0f3f8;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.register-box {
  display: flex;
  width: 100%;
  max-width: 950px; /* Thu hẹp lại tương tự LoginForm */
  height: 650px; 
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 2. Phần ảnh & Slide (Gam Xanh/Tím Nhạt) */
.register-left {
  flex: 1;
  /* Nền Gradient Xanh/Tím Nhạt - Giống LoginForm */
  background: linear-gradient(135deg, #e0e7ff 0%, #c3dafe 100%);
   display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative; /* Quan trọng cho slide */
}

/* SLIDE CONTENT */
.slide-content-wrapper {
    text-align: center;
    /* Vị trí tuyệt đối cho transition hoạt động */
    position: absolute; 
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
}

.welcome-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #3b5998; /* Màu xanh đậm */
    margin-bottom: 8px;
}

.slide-text {
    color: #3b5998;
    font-size: 0.95rem;
    margin-bottom: 25px;
    opacity: 0.8;
}

.image-wrapper {
  max-width: 85%;
   margin: 0 auto;
}

.register-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* Indicators */
.slide-indicators {
  position: absolute;
   bottom: -50px; /* Điều chỉnh vị trí so với container */
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
  transition: opacity 0.8s ease; 
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


/* 3. Phần Form */
.register-right {
  flex: 1.1;
  padding: 25px 50px; /* Tăng padding để form không quá sát lề */
  display: flex;
   flex-direction: column;
  justify-content: flex-start;
  background: white;
  overflow-y: auto; /* Giữ scroll cho form dài */
}

.register-title {
  text-align: center;
  margin-bottom: 20px;
}

.register-title h1 {
  font-size: 1.8rem;
  font-weight: 800; 
  color: #3b5998; /* Màu Xanh Navy Sáng (Giống LoginForm) */
  margin-bottom: 5px;
}

.register-title p {
  font-size: 0.95rem;
  color: #7f8c9a;
}

/* 4. Form Controls */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Giãn cách giữa các form-group */
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px; /* Giãn cách giữa các cột */
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 700; 
  color: #3b5998;
  margin-bottom: 4px;
  display: block;
}

.required {
  color: #f39c12; /* Màu Vàng Cam (Giống LoginForm) */
}

.form-control {
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
   border-radius: 8px;
  font-size: 0.9rem;
  color: #333;
  transition: border-color 0.3s, box-shadow 0.3s;
  background: white;
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

/* 5. Mật khẩu - KHẮC PHỤC LỖI CON MẮT (Giống LoginForm) */
.password-group {
    position: relative;
}
.password-input-wrapper {
  display: flex; 
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  transition: border-color 0.3s, box-shadow 0.3s;
   padding-right: 12px; 
}
.password-input-wrapper:focus-within {
  border-color: #c3dafe;
  box-shadow: 0 0 0 3px rgba(195, 218, 254, 0.4);
}
.password-input-wrapper input {
    /* Đặt style input bên trong wrapper để loại bỏ border và chỉ lấy padding trái */
    border: none;
    padding-right: 0;
    flex-grow: 1;
    /* Dùng lại form-control style */
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #333;
}
.password-input-wrapper input:focus {
    box-shadow: none;
}
.password-toggle {
   background: none;
  border: none;
  cursor: pointer;
  color: #7f8c9a;
    font-size: 0.9rem;
  padding: 0;
}
.password-toggle:hover {
  color: #3b5998;
}


/* 6. Nút Đăng ký (Vàng Cam - Giống nút Đăng nhập) */
.btn-register {
  /* Màu Nút Vàng Cam Tương Phản */
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 15px;
  box-shadow: 0 8px 15px rgba(243, 156, 18, 0.3);
  transition: all 0.3s ease;
  width: 100%;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(243, 156, 18, 0.5);
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 7. Link Đăng nhập (Vàng Cam - Giống LoginForm) */
.login-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.95rem;
  color: #7f8c9a;
}

.login-link a {
  color: #f39c12; /* Link màu Vàng Cam */
  font-weight: 700;
   text-decoration: none;
}

.login-link a:hover {
  color: #e67e22;
}


/* 8. Responsive Design */
@media (max-width: 900px) {
    .register-box {
        flex-direction: column;
        height: auto;
        max-width: 450px;
    }
    .register-left {
        display: none; /* Ẩn slide ảnh trên mobile */
    }
    .register-right {
        padding: 30px;
    }
    .form-row {
        grid-template-columns: 1fr; /* Stack các trường trong form-row */
        gap: 15px;
    }
}
</style>
