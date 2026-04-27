import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAdminStore = defineStore('admin', () => {
  // 展开状态
  const isCollapse = ref(false)
  // 文章弹窗状态
  const articleDialogVisible = ref(false)
  // 切换展开状态
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
    // console.log(isCollapse.value);
  }
  // 切换文章弹窗状态
  const toggleArticleDialogVisible = () => {
    articleDialogVisible.value = !articleDialogVisible.value
    // console.log(articleDialogVisible.value);
  }
  return {
    isCollapse,
    toggleCollapse,
    articleDialogVisible,
    toggleArticleDialogVisible
  }
}, { persist: true })
