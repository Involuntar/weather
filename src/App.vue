<template>
  <h1>{{ $t("weatherIn") }}
    <select name="City" id="City" @change="changeCoords($event)">
      <option value="RUS">Нижнем Тагиле</option>
      <option value="JPY">Токио</option>
      <option value="CNY">Пекине</option>
      <option value="GBP">Лондоне</option>
      <option value="USD">Вашингтоне</option>
    </select>
    <select name="Grades" id="Grades" @change="changeGrades($event)">
      <option value="metric">{{ $t('tempUM.celsius') }}</option>
      <option value="imperial">{{ $t('tempUM.fahrenheit') }}</option>
    </select>
    <select v-model="$i18n.locale">
      <option value="ru">Ru</option>
      <option value="en">En</option>
    </select>
  </h1>
  <h3 v-if="!weather">{{ $t("loading") }}...</h3>
  <div v-else>
    <img :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`" alt="">
    <h2>{{ weather.weather[0].description }}</h2>
    <h3>{{ $t("time") }}: {{ time }}</h3>
    <h3>{{ $t('now') }} {{ weather.main.temp }}°, {{ $t('feelsLike') }} {{ weather.main.feels_like }}°</h3>
    <h3>{{ $t('pressure') }}: {{ weather.main.pressure }} {{ $t("pressureUM") }}</h3>
    <h3>{{ $t('humidity') }}: {{ weather.main.humidity }}%</h3>
    <h3>{{ $t('wind') }}: {{ weather.wind.speed }} {{ $t('windSpeed') }}, {{ $t('windDirection') }}: {{ weather.wind.deg }}°</h3>
  </div>
  <div class="convert-valutes" v-if="currValute!=='RUS'">
    <label for="RUS">Рубли: </label>
    <input type="number" id="rub" placeholder="RUS" v-model="russianValuteVal" @input="convertRubs">
    <br>
    <label for="another-vaute">{{ currValute }}: </label>
    <input type="number" id="another-valute" :placeholder="currValute" v-model="foreignValuteVal" @input="convertForeign">
  </div>
  <WeatherForeCast :forecast="weatherForeCast" />
</template>

<script>
import WeatherForeCast from './components/WeatherForecast.vue';

export default {
  name: 'App',
  components: {
    WeatherForeCast
  },
  mounted() {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=57.9108371&lon=59.9715384&appid=0b48dc9464e4dd154dc21fd44f9f39b1&units=metric&lang=ru")
    .then(resp => resp.json())
    .then(json => {
      this.weather = json;
      let timestamp = new Date(this.weather.dt * 1000);
      this.time = timestamp.getHours() + ":" + ("0" + timestamp.getMinutes()).substr(-2);
    });
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=57.9108371&lon=59.9715384&appid=0b48dc9464e4dd154dc21fd44f9f39b1&units=metric&lang=ru")
    .then(resp => resp.json())
    .then(json => {
      this.weatherForeCast = json.list;
    });
    fetch('http://127.0.0.1:8081/24/10/2024')
    .then(resp => resp.json())
    .then(json => {
      this.valute = json;
    });
  },
  data() {
    return {
      weather: null,
      weatherForeCast: [],
      valute: null,
      currValute: 'RUS',
      foreignValuteVal: null,
      russianValuteVal: null,
      time: null,
      grades: 'metric',
      coordinates: "RUS"
    }
  },
  methods: {
    changeGrades(grades) {
      this.grades = grades.target.value;
      this.getCity(this.coordinates);
    },
    changeCoords(city) {
      this.coordinates = city.target.value;
      this.getCity(this.coordinates);
    },
    getCity(city) {
      this.russianValuteVal = null;
      this.foreignValuteVal = null;
      switch (city) {
        case "RUS":
          this.changeCity(57.9108371, 59.9715384);
          this.currValute = 'RUS';

          break;
        case "JPY":
          this.changeCity(35.6895, 139.692);
          this.currValute = 'JPY';

          break;
        case "CNY":
          this.changeCity(39.916668, 116.383331);
          this.currValute = 'CNY';

          break;
        case "GBP":
          this.changeCity(51.509865, -0.118092);
          this.currValute = 'GBP';

          break;
        case "USD":
          this.changeCity(38.889805, -77.009056);
          this.currValute = 'USD';

          break;
      }
    },
    changeCity(lat, lon) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0b48dc9464e4dd154dc21fd44f9f39b1&units=${this.grades}&lang=ru`)
      .then(resp => resp.json())
      .then(json => {
        this.weather = json;
        let timestamp = new Date(this.weather.dt * 1000);
        this.time = timestamp.getHours() + ":" + ("0" + timestamp.getMinutes()).substr(-2);
      });
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=0b48dc9464e4dd154dc21fd44f9f39b1&units=${this.grades}&lang=ru`)
      .then(resp => resp.json())
      .then(json => {
        this.weatherForeCast = json.list;
      });
    },
    convertRubs() {
      let value = parseFloat(this.valute[this.currValute].Value);
      let nominal = parseFloat(this.valute[this.currValute].Nominal);
      this.foreignValuteVal = (this.russianValuteVal / (value / nominal)).toFixed(2);
    },
    convertForeign() {
      let value = parseFloat(this.valute[this.currValute].Value);
      let nominal = parseFloat(this.valute[this.currValute].Nominal);
      this.russianValuteVal = (this.foreignValuteVal * (value / nominal)).toFixed(2);
    }
  },
}
</script>

<style>
#app,
select {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

select {
  font-size: xx-large;
}

.convert-valutes {
  display: flex;
  flex-wrap: wrap;
  text-align: left;
  width: min-content;
  margin: 0 auto;
}

.convert-valutes input {
  justify-self: right;
}
</style>
