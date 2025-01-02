<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import SocialLoginButton from '@/components/SocialLoginButton.vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();

const authStore = useAuthStore();
const { googleProfile, facebookProfile } = storeToRefs(authStore);
const { loginWithFacebook, loadFacebookSDK, initGoogleSDK } = authStore;

const handleGoogleLogin = () => {
  google.accounts.id.prompt();
}

const handleFacebookLogin = async () => {
  try {
    await loginWithFacebook();
  } catch (error) {
    console.error(error)
  }
}

const handleNextStep = () => {
  router.push('/home');
}

onMounted(() => {
  Promise.all[loadFacebookSDK(), initGoogleSDK()];
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        新北市都更地點查詢
      </h2>
      <p class="mt-6 text-center text-sm text-gray-600 max-w">
        請先登入
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">

        <div class="space-y-4">
          <SocialLoginButton
            v-if="googleProfile === null"
            provider="Google"
            :onClick="handleGoogleLogin"
          />
          <p v-else class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-lg bg-green-50 text-green-700 border-2 border-green-200 shadow-sm">已完成 Google 登入</p>
          <SocialLoginButton
            v-if="facebookProfile === null"
            provider="Facebook"
            :onClick="handleFacebookLogin"
          />
          <p v-else class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm">已完成 Facebook 登入</p>
        </div>

        <button
          @click="handleNextStep"
          :disabled="!googleProfile && !facebookProfile"
          type="button"
          class="w-full mt-6 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200"
          :class="[
            (googleProfile && facebookProfile) 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          ]"
        >
          下一步
        </button>
      </div>
    </div>
  </div>
</template>