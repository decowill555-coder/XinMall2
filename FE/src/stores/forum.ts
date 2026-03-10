import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { forumApi, type ForumDetail, type ForumPost, type ModelForum, type UserForum } from '@/api/community';

export const useForumStore = defineStore('forum', () => {
  const currentForum = ref<ForumDetail | null>(null);
  const modelForums = ref<Map<string, ModelForum>>(new Map());
  const userForums = ref<UserForum[]>([]);
  const forumPosts = ref<ForumPost[]>([]);
  const loading = ref(false);
  const postsLoading = ref(false);
  const hasMorePosts = ref(true);
  const currentPostPage = ref(1);

  const isJoined = computed(() => currentForum.value?.isJoined ?? false);

  const fetchForumDetail = async (id: string) => {
    loading.value = true;
    try {
      const res = await forumApi.getForumDetail(id);
      currentForum.value = res;
      return res;
    } finally {
      loading.value = false;
    }
  };

  const fetchModelForum = async (modelId: string) => {
    try {
      const res = await forumApi.getModelForum(modelId);
      modelForums.value.set(modelId, res);
      return res;
    } catch (e) {
      return null;
    }
  };

  const fetchUserForums = async (userId?: string) => {
    loading.value = true;
    try {
      const res = await forumApi.getUserForums(userId);
      userForums.value = res.list;
      return res;
    } finally {
      loading.value = false;
    }
  };

  const fetchForumPosts = async (forumId: string, refresh: boolean = false) => {
    if (postsLoading.value) return;
    
    if (refresh) {
      currentPostPage.value = 1;
      hasMorePosts.value = true;
      forumPosts.value = [];
    }

    postsLoading.value = true;
    try {
      const res = await forumApi.getForumPosts(forumId, currentPostPage.value);
      
      if (refresh) {
        forumPosts.value = res.list;
      } else {
        forumPosts.value = [...forumPosts.value, ...res.list];
      }
      
      hasMorePosts.value = res.list.length >= 20;
      currentPostPage.value++;
      return res;
    } finally {
      postsLoading.value = false;
    }
  };

  const joinForum = async (forumId: string) => {
    const res = await forumApi.joinForum(forumId);
    if (res.success && currentForum.value) {
      currentForum.value.isJoined = true;
      currentForum.value.memberCount++;
    }
    return res;
  };

  const leaveForum = async (forumId: string) => {
    const res = await forumApi.leaveForum(forumId);
    if (res.success && currentForum.value) {
      currentForum.value.isJoined = false;
      currentForum.value.memberCount--;
    }
    return res;
  };

  const clearCurrentForum = () => {
    currentForum.value = null;
    forumPosts.value = [];
    currentPostPage.value = 1;
    hasMorePosts.value = true;
  };

  return {
    currentForum,
    modelForums,
    userForums,
    forumPosts,
    loading,
    postsLoading,
    hasMorePosts,
    isJoined,
    fetchForumDetail,
    fetchModelForum,
    fetchUserForums,
    fetchForumPosts,
    joinForum,
    leaveForum,
    clearCurrentForum
  };
});
