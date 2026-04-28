import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAdminStore = defineStore('admin', () => {
  // 展开状态
  const isCollapse = ref(false)
  // 文章弹窗状态
  const articleDialogVisible = ref(false)
  // 切换sidebar的展开状态
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
  // 文章弹窗状态-打开
  const openArticleDialog = () => {
    articleDialogVisible.value = true
  }
  // 文章弹窗状态-关闭
  const closeArticleDialog = () => {
    articleDialogVisible.value = false
  }
  return {
    isCollapse,
    toggleCollapse,
    articleDialogVisible,
    openArticleDialog,
    closeArticleDialog
  }
}, { persist: true })
