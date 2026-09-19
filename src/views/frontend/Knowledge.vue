<template>
  <div class="knowledge-container">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="header-content">
        <el-image :src="iconUrl" style="width: 60px; height: 60px" alt="知识库图标" />
        <h1>心理知识库</h1>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="content">
      <!-- 左侧推荐栏 -->
      <div class="recommend-section">
        <div class="section-title">
          <el-icon>
            <StarFilled />
          </el-icon>
          <span>热门推荐</span>
        </div>
        <div class="recommend-list">
          <div class="recommend_empty" v-if="recommendList.length === 0">
            <el-empty description="暂无热门推荐" />
          </div>
          <div v-for="item in recommendList" :key="item.id" class="recommend-item" @click="goDetail(item.id)" v-else>
            <h4>{{ item.title }}</h4>
            <p class="read-count">
              <el-icon>
                <Histogram />
              </el-icon>阅读量 {{ item.readCount }}
              <!-- <el-icon>
                <Calendar />
              </el-icon>
              {{ item.updatedAt.toString().substring(0, 10) }} -->
            </p>
          </div>
        </div>
      </div>
      <!-- 右侧文章列表 -->
      <div class="article-list">
        <div class="article_empty" v-if="articleList.length === 0">
          <el-empty description="暂无文章" />
        </div>
        <div v-for="article in articleList" :key="article.id" class="article-item" @click="goDetail(article.id)">
          <el-image :src="getImageSrc(article.coverImage)" style="width: 240px; height: 150px; border-radius: 10px"
            fit="cover" lazy/>
          <div class="info">
            <div class="title">
              <h3>{{ article.title }}</h3>
              <el-tag size="small">{{ article.categoryName }}</el-tag>
            </div>
            <div :style="{ marginTop: '10px' }">
              <div class="flex-box">
                <el-icon>
                  <Avatar />
                </el-icon>
                <span>{{ article.authorName }}</span>
              </div>
              <div class="flex-box">
                <el-icon>
                  <List />
                </el-icon>
                <span>{{ dayjs(article.publishedAt).format('YYYY-MM-DD') }}</span>
              </div>
            </div>
              <div :style="{ marginTop: '10px' }">
              <div class="flex-box">
                <el-icon>
                  <Platform />
                </el-icon>
                <span>观看人数 {{ article.readCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.size"
        :total="pagination.total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" background
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup name="Knowledge">
import { reactive, ref, onMounted } from 'vue'
import { Histogram, List, StarFilled, Avatar, Platform } from '@element-plus/icons-vue'
import { dayjs, ElMessage } from 'element-plus'
import { getKnowledgeArticleList } from '@/api/frontend'
import { useRouter } from 'vue-router'

const router = useRouter()
const iconUrl = new URL('@/assets/images/book.png', import.meta.url).href


// 文章列表
const articleList = ref([])
// 推荐列表（
const recommendList = ref([])

const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
})

// 加载文章列表
const loadList = async () => {
  const params = {
    sortField: 'publishedAt',
    sortDirection: 'desc',
    ...pagination,
  }
  try {
    const res = await getKnowledgeArticleList(params)
    const { records = [], total: totalNum = 0 } = res
    if (records?.length > 0) {
      articleList.value = records
      pagination.total = totalNum
      // 推荐栏取前 5 篇热门文章

      recommendList.value = [...articleList.value].sort((a, b) => b.readCount - a.readCount).slice(0, 5)
    }
    else {
      articleList.value = []
      total.value = 0
    }
  } catch (err) {
    ElMessage.error(err?.message || '获取文章列表失败')
  }
}

// 获取文章封面图片路径
const getImageSrc = (url) => {
  if (url) {
    return 'http://159.75.169.224:1235' + url
  }
  return 'https://file.itndedu.com/psychology_ai.png'
}

// 分页大小改变时触发
const handleSizeChange = (val) => {
  pagination.size = val
  // console.log(val);
  loadList()
}

// 分页当前页改变时触发
const handleCurrentChange = (val) => {
  pagination.currentPage = val
    // console.log(val);
  loadList()
}

// 跳转文章详情
const goDetail = (id) => {
  router.push(`/front/knowledge/article/${id}`)
}

onMounted(() => {
  loadList()
})
</script>

<style lang="scss" scoped>
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.knowledge-container {
  background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);

  .flex-box {
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
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
    display: flex;
    gap: 20px;
    margin: 0 auto;
    width: 1200px;
    padding: 20px;

    .recommend-section {
      width: 280px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      padding: 15px;
      height: 400px;

      .section-title {
        font-size: 12;
        font-weight: 600;
        color: #374151;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .recommend-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .recommend-item {
          border-left: 4px solid #f59e0b;
          padding-left: 10px;
          cursor: pointer;

          .read-count {
            margin-top: 15px;
            font-size: 12px;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }

    .article-list {
      flex: 1;

      .article-item {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        padding: 15px;
        margin-bottom: 20px;
        display: flex;

        .info {
          margin-left: 20px;

          .title {
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
  }
}
</style>