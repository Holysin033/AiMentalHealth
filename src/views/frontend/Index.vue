<template>
  <div>
    首页
  </div>
</template>

<script setup name="Index">

</script>

<style lang="scss" scoped>
.home-container {
    background: linear-gradient(90deg, rgb(74, 156, 140) 0%, rgb(61, 138, 122) 100%) rgba(74, 156, 140, 0.95);
    color: white;
    padding: 5rem 0;
    height: calc(100vh - 285px);
    display: flex;
    align-items: center;
    justify-content: center;
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 30px;
        .text {
            width: 500px;
            .title {
                font-size: 45px;
                font-weight: bold;
                // line-height: 1.2;
                margin-bottom: 15px;
                .highlight-text {
                    color: #ffd700;
                }
            }
            .hero-actions {
                margin-top: 30px;
            }
        }
        .robot {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 260px;
            height: 260px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.2);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1),inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
    }
}
</style>