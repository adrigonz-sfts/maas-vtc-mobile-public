<template>
    <router-view class="app-view" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUsersStore } from '@softour/maas-users-micro-front-private';

onMounted(() => {
    useUsersStore().setApiBaseUrl(import.meta.env.VITE_AUTH_API_BASE_URL);
    void useUsersStore().fetchCurrentUser();
});
</script>

<style src="./App.scss" lang="scss"></style>
