<template>
  <div class="page-head">
    <p class="page-title">{{ PageHeadTitle }}</p>
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup name="PageHead">
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const PageHeadTitle = computed(() => route.meta.title || "导航栏");

// defineProps({
//   PageHeadTitle: {
//     type: String,
//     default: '默认标题',
//   },
// })
</script>

<style lang="scss" scoped>
.page-head {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .page-title {
    font-size: 24px;
    font-weight: normal;
  }
}
</style>