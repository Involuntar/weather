<template>
  <h1>{{ $t("weatherIn") }}
    <select name="City" id="City" @change="changeCoords($event)">
      <option value="N-Tagil">Нижнем Тагиле</option>
      <option value="Tokyo">Токио</option>
      <option value="Pekin">Пекине</option>
      <option value="London">Лондоне</option>
      <option value="Washington">Вашингтоне</option>
    </select>
    <button class="favourite button" @click="addFav">
      ❤️
    </button>
    <select name="Grades" id="Grades" @change="changeGrades($event)">
      <option value="metric">{{ $t('tempUM.celsius') }}</option>
      <option value="imperial">{{ $t('tempUM.fahrenheit') }}</option>
    </select>
    <select v-model="$i18n.locale">
      <option value="ru">Ru</option>
      <option value="en">En</option>
    </select>
  </h1>
  <ul class="favourites ul">
    <li v-for="(item, key) in favourites" :key="key" @click="getCity(key)">
      {{ key }}
      <button class="remove__city button" @click="removeFav(key)">X</button>
    </li>
  </ul>
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
    this.favourites = this.itemsFromLocalStorage;
  },
  computed: { 
    itemsFromLocalStorage() { 
      return JSON.parse(localStorage.getItem('favCity') || '{}'); 
    }, 
  },
  watch: { 
    favourites(newItems) { 
      localStorage.setItem('favCity', JSON.stringify(newItems)); 
    },  
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
      coordinates: {
        "N-Tagil": [57.9108371, 59.9715384],
        "Tokyo": [35.6895, 139.692],
        "Pekin": [39.916668, 116.383331],
        "London": [51.509865, -0.118092],
        "Washington": [38.889805, -77.009056]
      },
      curCity: 'N-Tagil',
      favourites: {}
    }
  },
  methods: {
    addFav(){
      var key = this.curCity;
      this.favourites[key] = this.coordinates[key];
      localStorage.favCity = JSON.stringify(this.favourites);
    },
    removeFav(key) {
      delete this.favourites[key]; 
    }, 
    changeGrades(grades) {
      this.grades = grades.target.value;
      this.getCity(this.curCity);
    },
    changeCoords(city) {
      this.curCity = city.target.value;
      this.getCity(this.curCity);
    },
    getCity(city) {
      this.russianValuteVal = null;
      this.foreignValuteVal = null;
      switch (city) {
        case "N-Tagil":
          this.changeCity(this.coordinates[city][0], this.coordinates[city][1]);
          this.currValute = 'RUS';

          break;
        case "Tokyo":
          this.changeCity(this.coordinates[city][0], this.coordinates[city][1]);
          this.currValute = 'JPY';

          break;
        case "Pekin":
          this.changeCity(this.coordinates[city][0], this.coordinates[city][1]);
          this.currValute = 'CNY';

          break;
        case "London":
          this.changeCity(this.coordinates[city][0], this.coordinates[city][1]);
          this.currValute = 'GBP';

          break;
        case "Washington":
          this.changeCity(this.coordinates[city][0], this.coordinates[city][1]);
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

.favourite.button {
  width: 45px;
  height: 45px;
}

.favourites.ul {
  padding: 0;
  width: 200px;
  margin: 0 auto;
}

.favourites.ul li {
  display: flex;
  justify-content: space-between;
  background-color: grey;
  margin: 5px 0;
  color: #FFF;
  cursor: pointer;
  list-style: none;
  text-align: left;
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
