import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAdminStore = defineStore('admin', () => {
  // 展开状态
  const isCollaspe = ref(false)
  const toggleCollapse = () => {
    // 切换展开状态
    isCollaspe.value = !isCollaspe.value
    console.log(isCollaspe.value);
    
  }
  return {
    isCollaspe,
    toggleCollapse
  }
}, { persist: true })
