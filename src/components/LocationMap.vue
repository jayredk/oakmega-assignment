<script setup>
import { ref, onMounted } from 'vue';
import { map, tileLayer, marker } from 'leaflet';

const mapContainer = ref(null);
const mapInstance = ref(null);

const initMap = () => {
  mapInstance.value = map(mapContainer.value).setView([25.0374, 121.5167], 13)

  tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance.value);
}

const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        mapInstance.value.setView([latitude, longitude], 15)
        marker([latitude, longitude]).addTo(mapInstance.value)
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
  }
}

onMounted(() => {
  initMap();

  getCurrentLocation();

});

</script>

<template>
  <div ref="mapContainer" class="w-full h-[500px]"></div>
</template>

<style lang="scss" scoped>

</style>