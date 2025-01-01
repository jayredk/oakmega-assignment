<script setup>
import { ref, onMounted } from 'vue';
import { map, tileLayer, marker, geoJSON } from 'leaflet';

const emit = defineEmits(['location-update']);

const mapContainer = ref(null);
const mapInstance = ref(null);

const polygonData = ref([]);

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

        emit('location-update', {
          latitude,
          longitude
        })
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
  }
}

const fetchPolygonData = async () => {
  try {
    const response = await fetch(
      'https://enterprise.oakmega.ai/api/v1/server/xinbei/geolocation-json?directory=tucheng.json'
    )
    const data = await response.json()
    polygonData.value = data.result.features;

    drawPolygon(polygonData.value)
    
  } catch (error) {
    console.error('Error fetching polygon data:', error)
  }
}

const drawPolygon = (polygonData) => {
  if (!mapInstance.value) return;
  
  geoJSON(polygonData, {
    color: '#5C98F1',
    fillOpacity: 0.3,
    weight: 2
  }).addTo(mapInstance.value)
}

onMounted(() => {
  initMap();

  getCurrentLocation();
  fetchPolygonData();
});

</script>

<template>
  <div ref="mapContainer" class="w-full h-[500px]"></div>
</template>

<style lang="scss" scoped>

</style>