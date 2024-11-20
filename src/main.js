import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    locale: 'ru',
    fallbackLocale: 'ru',
    messages: {
        ru: {
            weatherIn: 'Погода в',
            loading: "Загрузка",
            time: "Время",
            now: "Сейчас",
            feelsLike: "ощущается как",
            pressure: "Давление:",
            pressureUM: "мм рт. ст.",
            humidity: "Влажность",
            wind: "Ветер",
            windSpeed: "м/с",
            windDirection: "направление",
            tempUM: {
                celsius: "Цельсии",
                fahrenheit: "Фаренгейты"
            }
        },
        en: {
            weatherIn: 'Weather in',
            loading: "Loading",
            time: "Time",
            now: "Now",
            feelsLike: "feels like",
            pressure: "Pressure:",
            pressureUM: "mmHg",
            humidity: "Humidity",
            wind: "Wind",
            windSpeed: "m/s",
            windDirection: "direction",
            tempUM: {
                celsius: "Celsius",
                fahrenheit: "Fahrenheit"
            }
        }
    }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
