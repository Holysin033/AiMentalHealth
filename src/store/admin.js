import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAdminStore = defineStore('admin', () => {
  // 展开状态
  const isCollapse = ref(false)
  const toggleCollapse = () => {
    // 切换展开状态
    isCollapse.value = !isCollapse.value
    // console.log(isCollapse.value);

  }
  return {
    isCollapse,
    toggleCollapse
  }
}, { persist: true })
