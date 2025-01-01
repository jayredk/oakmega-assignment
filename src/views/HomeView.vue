<script setup>
import LocationMap from '@/components/LocationMap.vue';
</script>

<template>
  <main>
    <LocationMap @location-update="handleLocationUpdate" />
    
  </main>
</template>
