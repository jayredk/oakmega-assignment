<script setup>
import { ref, computed } from 'vue';

import LocationMap from '@/components/LocationMap.vue';

const locationList = ref([]);

const searchQuery = ref('');

const filteredLocationList = computed(() => {
  return locationList.value.filter((locaiton) => locaiton.stop_name.includes(searchQuery.value));
})

const getUniqueLocations = (locations) => {
  const locationMap = new Map();

  locations.forEach(location => {
    const existing = locationMap.get(location.stop_name);
    if (!existing || location.distance < existing.distance) {
      locationMap.set(location.stop_name, location);
    }
  });
  
  return Array.from(locationMap).map((location) => location[1]);
}


const fetchLocationData = async (location) => {
  try {
    const locationData = {
      lat: location.latitude,
      lng: location.longitude
    };

    const res = await fetch('https://enterprise.oakmega.ai/api/v1/server/xinbei/calc-distance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationData)
    })
    const data = await res.json();
    
    const locations = getUniqueLocations(data.result);
    locationList.value = locations;

  } catch (error) {
    console.error('Error: fetchLocationData', error);
  }
}

const handleLocationUpdate = (location) => {
  fetchLocationData(location);
}

</script>

<template>
  <main>
    <LocationMap @location-update="handleLocationUpdate" />
    
    <div class="bg-gray-200 py-5 min-h-80">
      <div class="container mx-auto">
        <div class="flex flex-col items-center space-y-6">
          <div class="relative w-full max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="請輸入您要查詢的地址"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div v-if="filteredLocationList.length > 0" class="w-full max-w-md space-y-2">
            <div
              v-for="location in filteredLocationList"
              :key="location.stop_name"
              class="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h5 class="text-gray-800">{{ location.stop_name }}</h5>
              <span class="text-blue-600 text-xl">
                {{ location.distance }}<span class="text-sm ml-1">km</span>
              </span>
            </div>
          </div>

          <p v-else>尚未取得當前位置</p>

        </div>
      </div>
    </div>
  </main>
</template>
