<template>
    <q-inner-loading :showing="this.$store.state.appLoading">
        <q-spinner-gears size="80px" :color="this.$store.state.darkMode ? 'white' : 'dark'" />
    </q-inner-loading>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Loading',
})
</script>