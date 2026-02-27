<script setup lang="ts">
import { onMounted } from 'vue';
import { spuApi } from '@/api/spu'; // 检查路径别名是否生效
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

onMounted(async () => {
  console.log('当前Token:', userStore.token);
  
  // 模拟请求 (会失败，因为没有真实后端，但可以看到网络请求发出)
  try {
    const list = await spuApi.searchSpu('iPhone');
    console.log('搜索结果:', list);
  } catch (e) {
    console.log('API调用链路通畅，虽然报错:', e);
  }
});
</script>