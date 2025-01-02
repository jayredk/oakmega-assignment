<script setup>
import GoogleIcon from '@/icons/GoogleIcon.vue'
import FacebookIcon from '@/icons/FacebookIcon.vue'

const props = defineProps({
  provider: String,
  onClick: Function
})

const getProviderColor = (provider) => {
  return provider === 'Google' 
    ? 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700' 
    : 'bg-[#1877F2] hover:bg-[#1864D9] text-white border-transparent'
}
</script>

<template>
  <button
    :class="[
      'flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md',
      getProviderColor(provider)
    ]"
    @click="onClick"
  >
    <span class="mr-2">
      <GoogleIcon v-if="provider === 'Google'" />
      <FacebookIcon v-else />
    </span>
    使用 {{ provider }} 登入
  </button>
</template>