<template>
  <div class="home-background">
    <div class="home-container">
      <div class="home-left">
        <div class="home-content">
          <div class="home-title">
            <h1>Hệ thống quản lý thư viện</h1>
            <p class="home-subtitle">
              Chào mừng bạn đến với thư viện trực tuyến
            </p>
          </div>
          <div class="home-description">
            <p>
              Khám phá kho tàng tri thức phong phú với hàng ngàn đầu sách đa
              dạng. Đăng nhập tài khoản để dễ dàng tìm kiếm, mượn và quản lý
              sách yêu thích của bạn.
            </p>
          </div>
          <div class="home-actions">
            <router-link to="/login" class="btn-primary">
              <i class="fas fa-user"></i>
              Đăng nhập
            </router-link>
            <router-link to="/register" class="btn-secondary">
              <i class="fas fa-user-plus"></i>
              Đăng ký
            </router-link>
          </div>
        </div>
      </div>
      <div class="home-right">
        <div class="image-wrapper">
          <img src="../assets/Bibliophile-rafiki.png" class="home-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* === BLUE PALETTE DEFINITIONS === */
:root {
  --primary-blue-dark: #1565c0; /* Darker Blue */
  --primary-blue: #2196f3; /* Main Blue */
  --primary-blue-light: #64b5f6; /* Light Blue */
  --background-light: #e3f2fd; /* Very light blue background */
  --text-dark: #0d47a1; /* Deep blue text */
  --text-muted: #42a5f5; /* Muted blue text */
}

/* ==== BACKGROUND ==== */
.home-background {
  min-height: 100vh;
  /* Thay đổi gradient nền sang tông xanh biển */
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;
}

/* ==== WRAPPER ==== */
.home-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  background: white;
  border-radius: 20px;
  /* Thay đổi shadow sang màu xanh biển */
  box-shadow: 0 20px 60px rgba(33, 150, 243, 0.15);
  overflow: hidden;
  position: relative;
  z-index: 2;
}

/* ==== LEFT CONTENT ==== */
.home-left {
  flex: 1;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Thay đổi gradient nền sang tông xanh biển nhạt */
  background: linear-gradient(135deg, #ffffff 0%, #f7fbff 100%);
}

.home-content {
  max-width: 500px;
}

/* ==== TITLE ==== */
.home-title {
  margin-bottom: 30px;
}

.home-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.2;
  /* Thay đổi gradient text sang tông xanh biển */
  background: linear-gradient(135deg, var(--primary-blue-dark) 0%, var(--primary-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.home-subtitle {
  font-size: 1.2rem;
  /* Thay đổi màu phụ đề */
  color: var(--text-dark);
  font-weight: 400;
  margin: 0;
}

/* ==== DESCRIPTION ==== */
.home-description {
  margin-bottom: 35px;
}
.home-description p {
  font-size: 1rem;
  /* Thay đổi màu mô tả */
  color: #546e7a;
  line-height: 1.6;
  margin: 0;
}

/* ==== BUTTONS ==== */
.home-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Primary button BLUE */
.btn-primary {
  /* Thay đổi gradient nút primary sang tông xanh biển */
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  color: white;
  background: linear-gradient(135deg, var(--primary-blue-dark) 0%, #0d47a1 100%);
}

/* Secondary outline BLUE */
.btn-secondary {
  background: transparent;
  /* Thay đổi màu border và text sang tông xanh biển */
  color: var(--primary-blue);
  border: 2px solid var(--primary-blue);
}

.btn-secondary:hover {
  background: var(--primary-blue);
  color: white;
  transform: translateY(-2px);
}

/* ==== RIGHT IMAGE ==== */
.home-right {
  flex: 1;
  /* Thay đổi gradient nền hình ảnh sang tông xanh biển */
  background: linear-gradient(135deg, var(--primary-blue-light) 0%, var(--primary-blue) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.image-wrapper {
  max-width: 85%;
  z-index: 2;
  position: relative;
}

.home-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
}

/* ==== RESPONSIVE DESIGN ==== */
@media (max-width: 992px) {
  .home-container {
    flex-direction: column;
    min-height: auto;
  }
  .home-right {
    padding: 30px;
    height: 350px; /* Cố định chiều cao cho màn hình nhỏ */
  }
  .home-left {
    padding: 40px 30px;
    text-align: center;
  }
  .home-content {
    max-width: 100%;
  }
  .home-title h1 {
    font-size: 2rem;
  }
  .home-actions {
    justify-content: center;
  }
}
</style>