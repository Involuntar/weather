<template>
    <button class="prevDay" @click="prevPage">{{ "<<" }}</button>
    <button class="nextDay" @click="nextPage">{{ ">>" }}</button>
    <div class="forecast">
        <CardForecast v-for="(item, key) in forecast.slice(sliceStart, sliceEnd)" :key="key" :forecast="item"/>
    </div>
</template>

<script>
import CardForecast from './CardForecast.vue';

export default {
    name: 'WeatherForeCast',
    props: {
        forecast: Array
    },
    data() {
        return {
            sliceStart: 0,
            sliceEnd: 8
        }
    },
    methods: {
        prevPage() {
            this.sliceStart -= 8;
            this.sliceEnd -= 8;
        },
        nextPage() {
            this.sliceStart += 8;
            this.sliceEnd += 8;
        }
    },
    components: {
        CardForecast
    }
}
</script>

<style>

</style>