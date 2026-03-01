<!-- src/ui-kit/organisms/UiGoodsCard.vue -->
<template>
  <view 
    class="ui-goods-card" 
    :class="[`mode-${mode}`]"
    @click="onClick"
  >
    <!-- === 模式 A: 瀑布�?(社区/逛�? === -->
    <block v-if="mode === 'waterfall'">
      <!-- 图片�?(固定宽度，高度自适应或固定比�? -->
      <view class="card-image-box">
        <ui-image 
          :src="data.cover" 
          width="100%" 
          height="100%" 
          radius="16rpx 16rpx 0 0" 
        />
        <!-- 视频标识 -->
        <view v-if="data.isVideo" class="video-tag">
           <ui-icon name="play" size="20" color="#FFFFFF" />
        </view>
      </view>

      <!-- 内容�?-->
      <view class="card-content">
        <!-- 标题 (双行截断) -->
        <text class="goods-title">{{ data.title }}</text>
        
        <!-- 底部栏：头像 + 价格/点赞 -->
        <view class="card-footer">
          <!-- 用户信息 -->
          <view class="user-info" @click.stop="toUser">
            <ui-avatar :src="data.userAvatar" :size="32" :bordered="false" />
            <text class="user-name">{{ data.userName }}</text>
          </view>
          
          <!-- 右侧：如果是商品显示价格，是帖子显示点赞 -->
          <view class="action-info">
            <ui-price v-if="data.price" :value="data.price" :size="28" :bold="true" />
            <view v-else class="like-box">
              <ui-icon name="heart" size="24" :color="$color-text-sub" />
              <text class="like-count">{{ data.likeCount }}</text>
            </view>
          </view>
        </view>
      </view>
    </block>

    <!-- === 模式 B: 列表 (搜索/分类/订单) === -->
    <block v-else>
      <view class="list-layout">
        <!-- 左图 -->
        <view class="list-image">
          <ui-image :src="data.cover" width="220rpx" height="220rpx" radius="12rpx" />
          <!-- 成色标签 (绝对定位) -->
          <view v-if="data.condition" class="condition-tag">
            {{ data.condition }}
          </view>
        </view>

        <!-- 右文 -->
        <view class="list-info">
          <text class="goods-title">{{ data.title }}</text>
          
          <!-- 规格/参数 (灰色小字) -->
          <view class="goods-specs">
            <text class="spec-text">{{ data.specs || '暂无规格信息' }}</text>
          </view>

          <!-- 标签�?-->
          <view class="goods-tags">
             <ui-tag 
               v-for="tag in data.tags?.slice(0, 3)" 
               :key="tag" 
               :text="tag" 
               type="primary" 
               plain 
               size="mini" 
               class="tag-item"
             />
          </view>

          <!-- 底部价格�?-->
          <view class="list-footer">
            <ui-price :value="data.price" :size="36" color="#FF3D00" />
            <text class="post-time">{{ data.timeStr }}</text>
          </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script setup lang="ts">
interface GoodsData {
  id: string | number;
  cover: string;
  title: string;
  price?: number | string;
  condition?: string; // e.g. "99�?
  specs?: string;     // e.g. "iPhone 13 Pro Max / 256G / 远峰�?
  tags?: string[];    // e.g. ["国行", "在保", "有发�?]
  userAvatar?: string;
  userName?: string;
  likeCount?: number;
  isVideo?: boolean;
  timeStr?: string;   // e.g. "3分钟�?
}

const props = withDefaults(defineProps<{
  data: GoodsData;
  mode?: 'waterfall' | 'list';
}>(), {
  mode: 'list'
});

const emit = defineEmits(['click', 'user-click']);

const onClick = () => {
  emit('click', props.data.id);
};

const toUser = () => {
  emit('user-click', props.data);
};
</script>

<style lang="scss" scoped>



.ui-goods-card {
  position: relative;
  background-color: $glass-white-high; // 高透明度白�?  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-sm;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }

  // === 瀑布流样�?===
  &.mode-waterfall {
    width: 100%; // 由父�?Grid 决定宽度
    display: flex;
    flex-direction: column;
    margin-bottom: $space-sm;

    .card-image-box {
      width: 100%;
      height: 360rpx; // 默认高度，实际开发常配合 css grid
      position: relative;
      
      .video-tag {
        position: absolute;
        top: 10rpx;
        right: 10rpx;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        padding: 8rpx;
        backdrop-filter: blur(4px);
      }
    }

    .card-content {
      padding: $space-sm;
      
      .goods-title {
        font-size: $font-size-md;
        color: $color-text-main;
        line-height: $line-height-normal;
        margin-bottom: $space-sm;
        @include text-ellipsis(2); // 2行截�?        font-weight: $font-weight-medium;
      }

      .card-footer {
        @include flex-between;
        
        .user-info {
          display: flex;
          align-items: center;
          flex: 1;
          overflow: hidden;
          
          .user-name {
            font-size: $font-size-xs;
            color: $color-text-sub;
            margin-left: 8rpx;
            @include text-ellipsis(1);
          }
        }
        
        .like-box {
          display: flex;
          align-items: center;
          .like-count {
            font-size: $font-size-xs;
            color: $color-text-sub;
            margin-left: 4rpx;
          }
        }
      }
    }
  }

  // === 列表样式 ===
  &.mode-list {
    margin-bottom: $space-md;
    border: 1px solid rgba(255,255,255,0.6); // 增加边框增强质感

    .list-layout {
      display: flex;
      padding: $space-md;
    }

    .list-image {
      position: relative;
      margin-right: $space-md;
      flex-shrink: 0;

      .condition-tag {
        position: absolute;
        top: 8rpx;
        left: 8rpx;
        background: rgba(0, 0, 0, 0.6);
        color: $color-white;
        font-size: $font-size-xs;
        padding: 4rpx 8rpx;
        border-radius: $radius-xs;
        backdrop-filter: blur(4px);
      }
    }

    .list-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-title {
        font-size: $font-size-lg; // 列表模式标题大一�?        color: $color-text-main;
        font-weight: $font-weight-bold;
        @include text-ellipsis(2);
      }

      .goods-specs {
        margin-top: 8rpx;
        .spec-text {
          font-size: $font-size-sm;
          color: $color-text-sub;
          background-color: rgba(0,0,0,0.03); // 浅灰背景�?          padding: 4rpx 10rpx;
          border-radius: $radius-sm;
        }
      }

      .goods-tags {
        display: flex;
        flex-wrap: wrap;
        margin-top: 8rpx;
        gap: 8rpx; // flex gap
      }

      .list-footer {
        @include flex-between;
        margin-top: auto; // 底部对齐

        .post-time {
          font-size: $font-size-xs;
          color: $color-text-disabled;
        }
      }
    }
  }
}
</style>