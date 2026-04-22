<template>
  <el-aside :width="isCollapse ? '64px' : '264px'">
    <el-menu default-active="1" class="menu-style" @open="handleOpen" :collapse="isCollapse"
      :collapse-transition="false">
      <div class="brand">
        <el-image :src="logoUrl" alt="logo" :class="{'brand-logo': !isCollapse}" />
        <div class="info-card" v-show="!isCollapse">
          <h1 class="brand-title">AI心理健康助手</h1>
          <p class="brand-subtitle">后台管理</p>
        </div>
      </div>
      <el-menu-item v-for="item in backendMenuItem" :key="item.path" :index="item.path" @click="selectMenu">
        <el-icon>
          <component :is="getMenuIcon(item.meta.icon)" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup name="SideBar">
import { useRouter } from "vue-router";
import * as ElIcons from "@element-plus/icons-vue";
import { useAdminStore } from '@/store/admin'
import { storeToRefs } from "pinia";

const router = useRouter();
const adminStore = useAdminStore();
const { isCollapse } = storeToRefs(adminStore);
const backendMenuItem = router.options.routes[0]?.children; //获取后台路由

//获取logo路径,需要在import.meta.url中添加路径，这么做是为了在开发环境下使用相对路径，而在生产环境下使用绝对路径
const logoUrl = new URL("/src/assets/images/机器人.png", import.meta.url).href;

//自动导入图标组件无法循环渲染图标，要不全局导入，要不手动导入图标组件
const getMenuIcon = (iconName) => ElIcons[iconName] || ElIcons.Menu;

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath); //key是点击的菜单项的路径，keyPath是点击的菜单项的路径数组
};
const selectMenu = (key) => {
  // router.push(item.path)
  // console.log(key);
  const currentRoute = router.options.routes[0];
  router.push(`${currentRoute.path}/${key.index}`);
  // 为什么要这么复杂,而不直接使用item.path,
  // 因为item.path是相对于后台路由的，而router.push需要的是相对于根路由的路径
};
</script>

<style lang="scss" scoped>
.menu-style {
  height: 100%;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #e5e7eb;

    .el-image.brand-logo {
      width: 50px;
      margin-right: 10px
    }

    .info-card {
      .brand-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #1f2937;
      }

      .brand-subtitle {
        font-size: 14px;
        color: #6b7280;
      }
    }
  }
}
</style>
