<template>
  <div class="admin-dashboard">
    <nav class="navbar navbar-expand-lg custom-navbar">
      <div class="container">
        <a
          class="navbar-brand fs-5"
          href="#"
          @click.prevent="currentComponent = 'AdminHomePage'"
        >
          <i class="fas fa-book-reader me-2"></i>Quản lý thư viện
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" v-for="(item, index) in navItems" :key="index">
              <a
                class="nav-link fs-6 text-white"
                :class="{ active: currentComponent === item.component }"
                @click.prevent="currentComponent = item.component"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item me-3">
              <span class="nav-link text-white fs-6 user-info">
                Xin chào, {{ currentUser?.hoTenNV || "Nhân viên" }}
              </span>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white fs-6" href="#" @click="handleLogout"
                >Đăng xuất</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import BookManagement from "@/components/admin/BookManagement.vue";
import PublisherManagement from "@/components/admin/PublisherManagement.vue";
import StaffManagement from "@/components/admin/StaffManagement.vue";
import ReaderManagement from "@/components/admin/ReaderManagement.vue";
import BorrowManagement from "@/components/admin/BorrowManagement.vue";
import AuthorManagement from "@/components/admin/AuthorManagement.vue";
import AdminHomePage from "@/components/admin/AdminHomePage.vue";
import OverdueBook from "@/components/admin/OverdueBook.vue";

const navItems = [
  { label: "Quản lý sách", component: "BookManagement" },
  { label: "Quản lý NXB", component: "PublisherManagement" },
  { label: "Quản lý tác giả", component: "AuthorManagement" },
  { label: "Quản lý nhân viên", component: "StaffManagement" },
  { label: "Quản lý độc giả", component: "ReaderManagement" },
  { label: "Quản lý mượn sách", component: "BorrowManagement" },
];

export default {
  name: "AdminDashboard",
  components: {
    BookManagement,
    PublisherManagement,
    StaffManagement,
    ReaderManagement,
    BorrowManagement,
    AuthorManagement,
    AdminHomePage,
    OverdueBook,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const currentComponent = ref(
      localStorage.getItem("adminCurrentComponent") || "AdminHomePage"
    );

    watch(currentComponent, (newValue) => {
      localStorage.setItem("adminCurrentComponent", newValue);
    });

    const currentUser = computed(() => store.getters["auth/currentUser"]);

    const handleLogout = async () => {
      await store.dispatch("auth/logout");
      localStorage.removeItem("adminCurrentComponent");
      router.push("/login");
    };

    return {
      currentComponent,
      currentUser,
      handleLogout,
      navItems,
    };
  },
};
</script>

<style scoped>
/* Định nghĩa biến màu Xanh Navy/Indigo */
:root {
  --primary-blue-dark: #1A237E; /* Xanh Indigo đậm (Màu chính) */
  --primary-blue: #3949AB;     /* Xanh Indigo (Màu nền Navbar) */
  --primary-blue-light: #C5CAE9; /* Xanh Indigo nhạt (Màu hover/active) */
}

.custom-navbar {
  /* Thay đổi màu nền chính sang Xanh Indigo */
  background-color: rgb(0, 89, 255); 
  padding: 0.8rem 1rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Link */
.nav-link {
  color: white !important;
  font-size: 1.05rem;
  font-weight: 500;
  transition: color 0.2s ease, border-bottom 0.2s ease;
  cursor: pointer;
}

/* Hover */
.nav-link:hover {
  /* Màu hover nhạt hơn, dễ đọc trên nền đậm */
  color: var(--primary-blue-light) !important; 
}

/* Brand logo */
.navbar-brand {
  font-weight: bold;
  font-size: 1.4rem;
  color: #ffffff !important;
}

/* Active link */
.navbar-nav .nav-link.active {
  font-weight: 700;
  /* Đường viền dưới màu xanh nhạt nổi bật */
  border-bottom: 2px solid var(--primary-blue-light); 
  padding-bottom: 2px;
}

.user-info {
  opacity: 0.9;
}
</style>