<template>
  <div class="home-page">
    <LoadingSpinner :show="loading" />
    <div class="container py-5">
      <div class="row">
        <div class="col-md-10 mx-auto">
          <div class="mb-5 banner-container">
            <carousel :autoplay="3000" :wrap-around="true">
              <slide v-for="slide in 3" :key="slide">
                <div class="carousel-item-content">
                  <h2 class="text-white">Khám phá thế giới sách mới</h2>
                  <p class="text-white">
                    Bộ sưu tập mới nhất: Sách **{{ slide }}**
                  </p>
                  <img
                    :src="getImageUrl(slide)"
                    alt="Banner sách"
                    class="banner-image"
                  />
                </div>
              </slide>

              <template #addons>
                <navigation />
                <pagination />
              </template>
            </carousel>
          </div>
          <div class="text-center">
            <h1 class="display-4 mb-4">
              Chào mừng đến với thư viện sách trực tuyến
            </h1>
            <p class="lead mb-5">
              Mỗi cuốn sách là một thế giới đang chờ bạn khám phá
            </p>

            <div class="row mb-5">
              <div class="col-md-3">
                <div class="card mb-3 stat-card">
                  <div class="card-body">
                    <h3 class="card-title text-success">{{ totalBooks }}</h3>
                    <p class="card-text">Số lượng sách</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card mb-3 stat-card">
                  <div class="card-body">
                    <h3 class="card-title text-warning">
                      {{ totalPublishers }}
                    </h3>
                    <p class="card-text">Số nhà xuất bản</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card mb-3 stat-card">
                  <div class="card-body">
                    <h3 class="card-title text-primary">{{ totalAuthors }}</h3>
                    <p class="card-text">Số tác giả</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card mb-3 stat-card">
                  <div class="card-body">
                    <h3 class="card-title text-danger">{{ approvedBooks }}</h3>
                    <p class="card-text">Số sách bạn đã mượn</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="guide-section">
              <h2 class="mb-4">Chức năng của thư viện</h2>
              <div class="row">
                <div class="col-md-6 mb-4">
                  <div class="card h-100 guide-card">
                    <div class="card-body">
                      <h5 class="card-title">
                        <i class="fas fa-search"></i> Tìm sách
                      </h5>
                      <p class="card-text">
                        Tìm sách nhanh chóng theo tên, mã, nhà xuất bản hoặc tác
                        giả
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 mb-4">
                  <div class="card h-100 guide-card">
                    <div class="card-body">
                      <h5 class="card-title">
                        <i class="fas fa-book"></i> Mượn sách
                      </h5>
                      <p class="card-text">
                        Đặt sách nhanh chóng – kiểm tra trạng thái duyệt mọi lúc,
                        mọi nơi
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

// 1. IMPORT CAROUSEL COMPONENTS
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

export default {
  name: "HomePage",
  components: {
    LoadingSpinner,
    // 2. REGISTER CAROUSEL COMPONENTS
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  setup() {
    const store = useStore();
    const totalBooks = computed(() => store.getters["book/allBooks"].length);
    const totalPublishers = computed(
      () => store.getters["publisher/allPublishers"].length
    );
    const totalAuthors = computed(
      () => store.getters["author/allAuthors"].length
    );
    const approvedBooks = computed(() => {
      return store.getters["borrow/borrowHistory"].filter(
        (item) => item.trangThai === "Đã duyệt"
      ).length;
    });

    onMounted(async () => {
      await Promise.all([
        store.dispatch("book/fetchBooks"),
        store.dispatch("publisher/fetchPublishers"),
        store.dispatch("borrow/fetchBorrowHistory"),
        store.dispatch("author/fetchAuthors"),
      ]);
    });

    // Hàm giả lập URL hình ảnh cho banner
    const getImageUrl = (slideNumber) => {
      // Bạn cần thay thế bằng các URL hình ảnh thực tế của bạn
      // Đây là URL giả định để hiển thị
      return `https://picsum.photos/seed/book${slideNumber}/1000/300`;
    };

    return {
      totalBooks,
      totalPublishers,
      approvedBooks,
      totalAuthors,
      getImageUrl, // 3. RETURN HÀM ĐỂ SỬ DỤNG TRONG TEMPLATE
    };
  },
};
</script>

<style scoped>
/* Styling cho thống kê và hướng dẫn */
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #c8e6c9;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.06);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.25);
}

.card-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.card-text {
  font-size: 1rem;
  color: #78909c;
}

.guide-section .card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #388e3c;
}

.guide-section .fas {
  margin-right: 8px;
  color: #2e7d32;
}

/* --- Styling mới cho Carousel/Banner --- */

.banner-container {
  /* Đảm bảo carousel không quá rộng */
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 15px; /* Bo tròn góc cho cả khu vực banner */
  overflow: hidden; /* Cần thiết để bo tròn hình ảnh bên trong */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.carousel-item-content {
  position: relative;
  width: 100%;
  height: 300px; /* Chiều cao cố định của banner */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Đảm bảo hình ảnh phủ hết container */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  filter: brightness(0.5); /* Làm tối hình ảnh để chữ dễ đọc hơn */
}

/* Đảm bảo chữ nằm trên hình ảnh */
.carousel-item-content h2,
.carousel-item-content p {
  z-index: 2;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
  margin: 5px 0;
}

/* Tùy chỉnh thanh điều hướng và phân trang (Nếu dùng vue3-carousel) */
.carousel__slide {
  padding: 0; /* Loại bỏ padding mặc định nếu có */
}

/* Tùy chỉnh nút điều hướng */
:deep(.carousel__prev),
:deep(.carousel__next) {
  background-color: rgba(255, 255, 255, 0.6); /* Nền nút */
  border-radius: 50%;
  color: #4caf50; /* Màu icon */
  opacity: 0.8;
}

:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
  background-color: rgba(255, 255, 255, 0.9);
}

/* Tùy chỉnh chấm phân trang */
:deep(.carousel__indicator--active .carousel__indicator-button) {
  background-color: #4caf50; /* Màu khi active */
}
</style>