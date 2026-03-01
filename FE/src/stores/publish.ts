import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface PublishStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface PublishState {
  step: number;
  spuId: string | null;
  selectedSkuId: string | null;
  condition: number; // 成色 99, 95, 80
  isPackageSale: boolean;
  packageList: Array<{ id: string; name: string; price: number }>;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  isAgreementSigned: boolean;
  isSubmitting: boolean;
  draftId: string | null;
}

export const usePublishStore = defineStore('publish', () => {
  // State
  const state = ref<PublishState>({
    step: 1,
    spuId: null,
    selectedSkuId: null,
    condition: 99,
    isPackageSale: false,
    packageList: [],
    price: 0,
    originalPrice: 0,
    description: '',
    images: [],
    isAgreementSigned: false,
    isSubmitting: false,
    draftId: null
  });

  // Getters
  const isFormValid = computed(() => {
    return (
      state.value.spuId !== null &&
      state.value.selectedSkuId !== null &&
      state.value.price > 0 &&
      state.value.images.length > 0 &&
      state.value.isAgreementSigned
    );
  });

  const canNextStep = computed(() => {
    switch (state.value.step) {
      case 1: return state.value.spuId !== null;
      case 2: return state.value.selectedSkuId !== null;
      case 3: return state.value.price > 0;
      case 4: return state.value.images.length > 0;
      case 5: return isFormValid.value;
      default: return false;
    }
  });

  const packageTotalPrice = computed(() => 
    state.value.packageList.reduce((sum, item) => sum + item.price, 0)
  );

  const finalPrice = computed(() => 
    state.value.price + packageTotalPrice.value
  );

  // Actions
  const setStep = (step: number) => {
    state.value.step = step;
  };

  const updateSpu = (spuId: string) => {
    state.value.spuId = spuId;
  };

  const updateSku = (skuId: string) => {
    state.value.selectedSkuId = skuId;
  };

  const updateCondition = (condition: number) => {
    state.value.condition = condition;
  };

  const togglePackageSale = (enabled: boolean) => {
    state.value.isPackageSale = enabled;
  };

  const addPackageItem = (item: { id: string; name: string; price: number }) => {
    if (!state.value.packageList.find(i => i.id === item.id)) {
      state.value.packageList.push(item);
    }
  };

  const removePackageItem = (id: string) => {
    state.value.packageList = state.value.packageList.filter(i => i.id !== id);
  };

  const updatePrice = (price: number) => {
    state.value.price = price;
  };

  const updateDescription = (description: string) => {
    state.value.description = description;
  };

  const addImage = (url: string) => {
    if (state.value.images.length < 9) {
      state.value.images.push(url);
    }
  };

  const removeImage = (index: number) => {
    state.value.images.splice(index, 1);
  };

  const toggleAgreement = (signed: boolean) => {
    state.value.isAgreementSigned = signed;
  };

  const setSubmitting = (submitting: boolean) => {
    state.value.isSubmitting = submitting;
  };

  const saveDraft = () => {
    if (state.value.spuId) {
      state.value.draftId = `draft-${state.value.spuId}-${Date.now()}`;
      uni.setStorageSync(state.value.draftId, state.value);
    }
  };

  const loadDraft = (draftId: string) => {
    const draft = uni.getStorageSync(draftId);
    if (draft) {
      state.value = { ...state.value, ...draft };
    }
  };

  const clearDraft = () => {
    if (state.value.draftId) {
      uni.removeStorageSync(state.value.draftId);
    }
    reset();
  };

  const reset = () => {
    state.value = {
      step: 1,
      spuId: null,
      selectedSkuId: null,
      condition: 99,
      isPackageSale: false,
      packageList: [],
      price: 0,
      originalPrice: 0,
      description: '',
      images: [],
      isAgreementSigned: false,
      isSubmitting: false,
      draftId: null
    };
  };

  return {
    // State
    state,

    // Getters
    isFormValid,
    canNextStep,
    packageTotalPrice,
    finalPrice,

    // Actions
    setStep,
    updateSpu,
    updateSku,
    updateCondition,
    togglePackageSale,
    addPackageItem,
    removePackageItem,
    updatePrice,
    updateDescription,
    addImage,
    removeImage,
    toggleAgreement,
    setSubmitting,
    saveDraft,
    loadDraft,
    clearDraft,
    reset
  };
});