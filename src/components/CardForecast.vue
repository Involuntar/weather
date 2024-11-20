<template>
    <div class="forecast-elem">
            <img :src="`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`" alt="">
            <p>{{ forecast.main.temp }}°C, ощущается как {{ forecast.main.feels_like }}°C</p>
            <p>Давление: {{ forecast.main.pressure }} мм рт. ст.</p>
            <p>Влажность: {{ forecast.main.humidity }}%</p>
            <p>Ветер: {{ forecast.wind.speed }} м/с, направление: {{ forecast.wind.deg }}°</p>
            <p> {{ forecast.dt_txt.slice(8, 10) }}.{{ forecast.dt_txt.slice(5, 7) }} {{ forecast.dt_txt.slice(-8, -3) }}</p>
    </div>
</template>

<script>
export default {
    name: 'CardForecast',
    props: {
        forecast: Object
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
    }
}
</script>

<style>
.forecast {
    display: flex;
    margin: 0 auto;
    justify-content: center;
}
.forecast-elem {
    width: 300px;
    background-color: lightgray;
    border-radius: 10px;
    border: 2px dotted;
    background-clip: padding-box;
    margin: 0 5px;
    font-size: 10px;
}
</style>