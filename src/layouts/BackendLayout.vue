<template>
  <div class="backend-layout">
    <el-container>
      <side-bar></side-bar>
      <el-container>
        <el-header><nav-bar></nav-bar></el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>
  </div>
</template>

<script setup name="BackendLayout">
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;

  .el-header {
    height: 74px !important;
  }

  .main-container {
    height: 100%;
  }

  .navbar {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background: white;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    border-bottom: 1px solid #e5e7eb;
  }

  .main-content {
    flex: 1;

    .content-container {
      padding: 20px;
      background-color: #fff;
      min-height: calc(100% - 74px);
    }
  }
}
</style>