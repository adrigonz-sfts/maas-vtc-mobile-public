<template>
    <main class="home">
        <div class="home__safe-area">
            <header class="home__header">
                <span class="home__bus-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4 16c0 .55.45 1 1 1h1.5l1-2h7l1 2H17c.55 0 1-.45 1-1V8H4v8zm2.5 2c.83 0 1.5-.67 1.5-1.5S7.33 15 6.5 15 5 15.67 5 16.5 5.67 18 6.5 18zm9 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM6 10h12v2H6v-2z"
                            fill="currentColor"
                        />
                        <path
                            d="M18 6H6L5 4h14l-1 2z"
                            fill="currentColor"
                            opacity="0.45"
                        />
                    </svg>
                </span>
                <span class="home__brand">MAAS · Mobile</span>
            </header>

            <section class="home__content">
                <span class="home__badge">Placeholder</span>
                <h1 class="home__title">Mobile Project</h1>
                <p class="home__lead">
                    You are signed in. This screen is a mobile-first placeholder until
                    product features ship.
                </p>
                <button type="button" class="home__logout" @click="onLogout">
                    Sign out
                </button>
            </section>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useLogin } from '@softour/maas-users-micro-front-private';

const { logout } = useLogin();

const onLogout = (): void => {
    void logout();
};
</script>

<style scoped lang="scss" src="./Home.scss"></style>
