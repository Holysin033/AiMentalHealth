<template>
  <div class="articleDetail-container">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="header-content">
        <el-image :src="iconUrl" style="width: 60px; height: 60px" alt="知识详情图标" />
        <h1>{{ route.meta.title }}</h1>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="content" v-loading="loading">
      <div class="diary-card" v-if="article.id">
        <div class="sub-title">
          <el-tag class="category-tag">{{ article.categoryName }}</el-tag>
          <div class="flex-box">
            <div class="item">
              <el-icon><User /></el-icon>
              <span>{{ article.authorName }}</span>
            </div>
            <div class="item">
              <el-icon><Clock /></el-icon>
              <span>{{ article.publishedAt }}</span>
            </div>
            <div class="item">
              <el-icon><View /></el-icon>
              <span>{{ article.readCount }} 阅读</span>
            </div>
          </div>
        </div>
        <div class="article-title">{{ article.title }}</div>
        <div class="summary-content">{{ article.summary }}</div>
        <div class="content-wrapper" v-html="formatContent(article.content)"></div>
        <div class="tags-content" v-if="article.tagArray.length > 0">
          <div class="tags-title">文章标签</div>
          <div class="tags-list">
            <el-tag v-for="tag in article.tagArray" :key="tag" type="info" effect="plain">{{ tag }}</el-tag>
          </div>
        </div>
      </div>
      <el-empty v-else-if="!loading" description="文章不存在或已下架" />
    </div>
  </div>
</template>

<script setup name="KnowledgeDetail">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Clock, View } from '@element-plus/icons-vue';
import { getKnowledgeArticleDetail } from '@/api/frontend';
import { formatContent } from '@/utils/others';

const route = useRoute();
const iconUrl = new URL('@/assets/images/book.png', import.meta.url).href;
const loading = ref(false);
const article = ref({ tagArray: [] });

// 加载文章详情
const loadDetail = async () => {
  loading.value = true;
  try {
    const res = await getKnowledgeArticleDetail(route.params.id);
    article.value = {
      ...res,
      tagArray: Array.isArray(res?.tagArray) ? res.tagArray : [],
    };
  } catch (err) {
    ElMessage.error(err?.message || '获取文章详情失败');
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  loadDetail();
});
</script>

<style lang="scss" scoped>
.articleDetail-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .flex-box {
        display: flex;
        align-items: center;
        .item {
            margin-right: 20px;
            span {
                margin-left: 5px;
            }
        }
    }
    .header-section {
        background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
        color: white;
        padding: 48px;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        margin: 0 auto;
        width: 980px;
        padding: 20px;
        .diary-card {
            margin-bottom: 20px;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            .title {
                margin-bottom: 15px;
                font-size: 20px;
                font-weight: 600;
                color: #374151;
            }
            .sub-title {
                margin-top: 20px;
                display: flex;
                align-items: center;
                .category-tag {
                    margin-right: 20px;
                }
            }
            .article-title {
                font-size: 28px;
                font-weight: bold;
                color: #111827;
                margin-top: 30px;
                margin-bottom: 10px;
            }
            .summary-content {
                background: rgba(126, 211, 33, 0.1);
                border-left: 4px solid #7ED321;
                padding: 10px 15px;
                border-radius: 0 8px 8px 0;
                position: relative;
            }
            .content-wrapper {
                font-size: 15px;
                color: #374151;
                :deep(p) {
                    margin-bottom: 10px;
                }
                :deep(h1),
                :deep(h2),
                :deep(h3),
                :deep(h4),
                :deep(h5),
                :deep(h6) {
                    margin: 15px 0 10px;
                    color: #111827;
                    font-weight: 600;
                }
                :deep(h2) {
                    font-size: 15px;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 5px;
                }
                :deep(h3) {
                    font-size: 13px;
                }
                :deep(ul),
                :deep(ol) {
                    padding-left: 15px;
                    margin-bottom: 10px;
                }
                :deep(li) {
                    margin-bottom: 5px;
                }
            }
            .tags-content {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #e5e7eb;
                .tags-title {
                    margin-bottom: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                }
                .tags-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
            }
        }
    }
}
</style>