/**
 * SkyCast PRO - Weather Intelligence JavaScript Engine
 * Features: Dynamic data simulation, Interactive Chart.js integration, Smooth UI transitions
 */

const cityData = {
    "Mumbai": {
        state: "Maharashtra", temp: 31, condition: "Partly Cloudy", icon: "cloud-sun", humidity: 64, wind: 14, visibility: 8, pressure: 1012,
        aqi: 84, aqiStatus: "Moderate", uv: 6, sunrise: "06:42 AM", sunset: "06:38 PM", rain: 12,
        tempTrend: [28, 27, 26, 26, 29, 31, 32, 30],
        humidityTrend: [60, 62, 64, 65, 63, 62, 61, 60],
        hourlyPrecip: [0, 0, 0.2, 0.5, 1.2, 2.1, 3.4, 2.8, 1.5, 0.8, 0.3, 0.1, 0, 0, 0.2, 0.6, 1.1, 1.8, 2.5, 1.9, 1.2, 0.5, 0.2, 0],
        alerts: ["Heatwave alert in low-lying areas.", "High humidity may cause discomfort."],
        forecast: [
            { day: "Tue", max: "32°", min: "26°", icon: "sun" },
            { day: "Wed", max: "31°", min: "25°", icon: "cloud-sun" },
            { day: "Thu", max: "30°", min: "24°", icon: "cloud-showers-heavy" },
            { day: "Fri", max: "33°", min: "26°", icon: "sun" },
            { day: "Sat", max: "34°", min: "27°", icon: "sun" }
        ]
    },
    "Delhi": {
        state: "National Capital Region", temp: 24, condition: "Hazy", icon: "smog", humidity: 45, wind: 10, visibility: 2, pressure: 1015,
        aqi: 245, aqiStatus: "Poor", uv: 4, sunrise: "07:05 AM", sunset: "06:12 PM", rain: 0,
        tempTrend: [18, 16, 15, 17, 20, 24, 25, 22],
        humidityTrend: [40, 42, 45, 48, 46, 44, 42, 40],
        hourlyPrecip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        alerts: ["Severe air quality warning: Use N95 masks.", "Low visibility during late night."],
        forecast: [
            { day: "Tue", max: "25°", min: "16°", icon: "smog" },
            { day: "Wed", max: "26°", min: "17°", icon: "cloud" },
            { day: "Thu", max: "28°", min: "18°", icon: "sun" },
            { day: "Fri", max: "27°", min: "17°", icon: "sun" },
            { day: "Sat", max: "26°", min: "16°", icon: "cloud-sun" }
        ]
    },
    "Bangalore": {
        state: "Karnataka", temp: 28, condition: "Mostly Sunny", icon: "sun", humidity: 40, wind: 18, visibility: 10, pressure: 1010,
        aqi: 42, aqiStatus: "Excellent", uv: 8, sunrise: "06:33 AM", sunset: "06:22 PM", rain: 5,
        tempTrend: [22, 21, 20, 22, 25, 28, 29, 26],
        humidityTrend: [35, 38, 40, 42, 41, 40, 39, 37],
        hourlyPrecip: [0, 0, 0, 0, 0.1, 0.3, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.4, 0.6, 0.3, 0, 0, 0, 0],
        alerts: ["Pleasant evening expected.", "UV index high: Wear sunscreen."],
        forecast: [
            { day: "Tue", max: "29°", min: "21°", icon: "sun" },
            { day: "Wed", max: "28°", min: "20°", icon: "sun" },
            { day: "Thu", max: "27°", min: "21°", icon: "cloud-sun" },
            { day: "Fri", max: "30°", min: "22°", icon: "sun" },
            { day: "Sat", max: "29°", min: "21°", icon: "cloud" }
        ]
    },
    "Chennai": {
        state: "Tamil Nadu", temp: 32, condition: "Humid", icon: "cloud", humidity: 78, wind: 12, visibility: 10, pressure: 1011,
        aqi: 65, aqiStatus: "Fair", uv: 7, sunrise: "06:20 AM", sunset: "06:14 PM", rain: 20,
        tempTrend: [28, 28, 27, 29, 31, 32, 33, 31],
        humidityTrend: [75, 77, 78, 80, 79, 78, 77, 76],
        hourlyPrecip: [0.5, 0.8, 1.2, 2.0, 3.5, 4.2, 5.0, 4.8, 3.2, 2.5, 1.8, 1.0, 0.5, 0.3, 0.8, 1.5, 2.8, 3.6, 4.1, 3.0, 2.0, 1.2, 0.6, 0.3],
        alerts: ["High humidity warning.", "Isolated rainfall expected in coastal stretches."],
        forecast: [
            { day: "Tue", max: "33°", min: "28°", icon: "cloud" },
            { day: "Wed", max: "32°", min: "28°", icon: "cloud-rain" },
            { day: "Thu", max: "31°", min: "27°", icon: "cloud-showers-heavy" },
            { day: "Fri", max: "33°", min: "28°", icon: "sun" },
            { day: "Sat", max: "34°", min: "29°", icon: "sun" }
        ]
    },
    "Kolkata": {
        state: "West Bengal", temp: 29, condition: "Clear Sky", icon: "sun", humidity: 55, wind: 8, visibility: 6, pressure: 1014,
        aqi: 120, aqiStatus: "Moderate", uv: 5, sunrise: "06:08 AM", sunset: "05:35 PM", rain: 0,
        tempTrend: [22, 21, 20, 23, 27, 29, 30, 27],
        humidityTrend: [50, 52, 55, 57, 56, 55, 54, 53],
        hourlyPrecip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        alerts: ["Clear skies for stargazing.", "Moderate AQI: Outdoor exercise is safe."],
        forecast: [
            { day: "Tue", max: "30°", min: "22°", icon: "sun" },
            { day: "Wed", max: "31°", min: "21°", icon: "sun" },
            { day: "Thu", max: "30°", min: "22°", icon: "cloud-sun" },
            { day: "Fri", max: "29°", min: "21°", icon: "cloud" },
            { day: "Sat", max: "31°", min: "22°", icon: "sun" }
        ]
    },
    "Hyderabad": {
        state: "Telangana", temp: 30, condition: "Sunny", icon: "sun", humidity: 35, wind: 15, visibility: 9, pressure: 1011,
        aqi: 58, aqiStatus: "Good", uv: 9, sunrise: "06:38 AM", sunset: "06:18 PM", rain: 2,
        tempTrend: [24, 22, 21, 25, 28, 30, 31, 29],
        humidityTrend: [30, 32, 35, 38, 37, 35, 33, 32],
        hourlyPrecip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.2, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        alerts: ["Intense heat at noon.", "Dry winds from the north-west."],
        forecast: [
            { day: "Tue", max: "31°", min: "24°", icon: "sun" },
            { day: "Wed", max: "32°", min: "25°", icon: "sun" },
            { day: "Thu", max: "30°", min: "24°", icon: "cloud-sun" },
            { day: "Fri", max: "29°", min: "23°", icon: "cloud" },
            { day: "Sat", max: "32°", min: "25°", icon: "sun" }
        ]
    },
    "Pune": {
        state: "Maharashtra", temp: 29, condition: "Clear Sky", icon: "sun", humidity: 30, wind: 10, visibility: 12, pressure: 1010,
        aqi: 52, aqiStatus: "Good", uv: 7, sunrise: "06:45 AM", sunset: "06:35 PM", rain: 0,
        tempTrend: [22, 20, 19, 23, 27, 29, 31, 28],
        humidityTrend: [25, 28, 30, 32, 31, 30, 29, 27],
        hourlyPrecip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        alerts: ["Pleasant weather throughout the week.", "UV Index high: Protection recommended."],
        forecast: [
            { day: "Tue", max: "30°", min: "19°", icon: "sun" },
            { day: "Wed", max: "31°", min: "18°", icon: "sun" },
            { day: "Thu", max: "30°", min: "19°", icon: "cloud-sun" },
            { day: "Fri", max: "29°", min: "20°", icon: "cloud" },
            { day: "Sat", max: "30°", min: "19°", icon: "sun" }
        ]
    },
    "Ahmedabad": {
        state: "Gujarat", temp: 33, condition: "Mostly Sunny", icon: "sun", humidity: 25, wind: 12, visibility: 10, pressure: 1009,
        aqi: 110, aqiStatus: "Moderate", uv: 9, sunrise: "06:55 AM", sunset: "06:42 PM", rain: 0,
        tempTrend: [25, 23, 22, 28, 31, 33, 34, 31],
        humidityTrend: [20, 22, 25, 27, 26, 25, 24, 22],
        hourlyPrecip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        alerts: ["Dry weather advisory.", "Stay hydrated: Temperature rising above 33°C."],
        forecast: [
            { day: "Tue", max: "34°", min: "22°", icon: "sun" },
            { day: "Wed", max: "35°", min: "23°", icon: "sun" },
            { day: "Thu", max: "34°", min: "22°", icon: "sun" },
            { day: "Fri", max: "33°", min: "21°", icon: "cloud-sun" },
            { day: "Sat", max: "34°", min: "22°", icon: "sun" }
        ]
    },
    "Jaipur": {
        state: "Rajasthan", temp: 26, condition: "Sunny", icon: "sun", humidity: 35, wind: 8, visibility: 8, pressure: 1012,
        aqi: 95, aqiStatus: "Moderate", uv: 6, sunrise: "07:02 AM", sunset: "06:15 PM", rain: 0,
        tempTrend: [18, 16, 15, 20, 24, 26, 27, 24],
        humidityTrend: [30, 32, 35, 37, 36, 35, 34, 32],
        hourlyPrecip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        alerts: ["Mild winter evening expected.", "Good visibility in urban areas."],
        forecast: [
            { day: "Tue", max: "27°", min: "15°", icon: "sun" },
            { day: "Wed", max: "28°", min: "16°", icon: "sun" },
            { day: "Thu", max: "27°", min: "15°", icon: "sun" },
            { day: "Fri", max: "26°", min: "14°", icon: "cloud-sun" },
            { day: "Sat", max: "27°", min: "15°", icon: "sun" }
        ]
    },
    "Lucknow": {
        state: "Uttar Pradesh", temp: 23, condition: "Hazy", icon: "smog", humidity: 50, wind: 6, visibility: 3, pressure: 1014,
        aqi: 180, aqiStatus: "Poor", uv: 4, sunrise: "06:50 AM", sunset: "05:45 PM", rain: 2,
        tempTrend: [16, 14, 13, 17, 21, 23, 24, 21],
        humidityTrend: [45, 48, 50, 52, 51, 50, 49, 47],
        hourlyPrecip: [0, 0, 0, 0, 0.1, 0.3, 0.5, 0.4, 0.2, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        alerts: ["Shallow fog in morning hours.", "Poor AQI: Avoid prolonged outdoor activities."],
        forecast: [
            { day: "Tue", max: "24°", min: "14°", icon: "smog" },
            { day: "Wed", max: "25°", min: "13°", icon: "cloud" },
            { day: "Thu", max: "24°", min: "14°", icon: "cloud-showers-heavy" },
            { day: "Fri", max: "23°", min: "13°", icon: "cloud" },
            { day: "Sat", max: "24°", min: "14°", icon: "sun" }
        ]
    },
    "Chandigarh": {
        state: "Punjab/Haryana", temp: 21, condition: "Partly Cloudy", icon: "cloud-sun", humidity: 45, wind: 10, visibility: 5, pressure: 1016,
        aqi: 155, aqiStatus: "Poor", uv: 3, sunrise: "07:15 AM", sunset: "05:58 PM", rain: 5,
        tempTrend: [14, 12, 11, 15, 19, 21, 22, 19],
        humidityTrend: [40, 42, 45, 47, 46, 45, 44, 42],
        hourlyPrecip: [0, 0, 0, 0.2, 0.5, 0.8, 1.0, 0.7, 0.4, 0.2, 0.1, 0, 0, 0, 0, 0, 0.1, 0.3, 0.6, 0.9, 1.2, 0.8, 0.4, 0.1],
        alerts: ["Light drizzle possible in late evening.", "Strong breeze from the north."],
        forecast: [
            { day: "Tue", max: "22°", min: "12°", icon: "cloud" },
            { day: "Wed", max: "21°", min: "11°", icon: "cloud-rain" },
            { day: "Thu", max: "20°", min: "12°", icon: "cloud" },
            { day: "Fri", max: "22°", min: "11°", icon: "sun" },
            { day: "Sat", max: "23°", min: "12°", icon: "sun" }
        ]
    },
    "Patna": {
        state: "Bihar", temp: 22, condition: "Hazy", icon: "smog", humidity: 55, wind: 5, visibility: 4, pressure: 1013,
        aqi: 195, aqiStatus: "Unhealthy", uv: 4, sunrise: "06:40 AM", sunset: "05:38 PM", rain: 0,
        tempTrend: [15, 13, 12, 16, 20, 22, 23, 20],
        humidityTrend: [50, 52, 55, 58, 56, 55, 53, 52],
        hourlyPrecip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        alerts: ["Morning haze expected.", "AQI nearing critical levels: Limit outdoor exposure."],
        forecast: [
            { day: "Tue", max: "23°", min: "13°", icon: "smog" },
            { day: "Wed", max: "24°", min: "12°", icon: "sun" },
            { day: "Thu", max: "23°", min: "13°", icon: "cloud-sun" },
            { day: "Fri", max: "22°", min: "12°", icon: "cloud" },
            { day: "Sat", max: "23°", min: "13°", icon: "sun" }
        ]
    },
    "Kochi": {
        state: "Kerala", temp: 30, condition: "Mostly Cloudy", icon: "cloud", humidity: 82, wind: 10, visibility: 8, pressure: 1009,
        aqi: 45, aqiStatus: "Good", uv: 7, sunrise: "06:35 AM", sunset: "06:28 PM", rain: 35,
        tempTrend: [27, 26, 26, 28, 29, 30, 31, 29],
        humidityTrend: [80, 81, 82, 85, 84, 82, 81, 80],
        hourlyPrecip: [1.2, 1.5, 2.0, 2.8, 3.5, 4.0, 5.2, 4.8, 4.0, 3.2, 2.5, 2.0, 1.8, 1.5, 2.0, 2.8, 3.5, 4.2, 5.0, 4.5, 3.8, 3.0, 2.2, 1.5],
        alerts: ["High humidity warning.", "Occasional light showers throughout the day."],
        forecast: [
            { day: "Tue", max: "31°", min: "26°", icon: "cloud-rain" },
            { day: "Wed", max: "30°", min: "25°", icon: "cloud-showers-heavy" },
            { day: "Thu", max: "29°", min: "25°", icon: "cloud-rain" },
            { day: "Fri", max: "31°", min: "26°", icon: "cloud-sun" },
            { day: "Sat", max: "32°", min: "27°", icon: "sun" }
        ]
    },
    "Indore": {
        state: "Madhya Pradesh", temp: 27, condition: "Sunny", icon: "sun", humidity: 28, wind: 14, visibility: 10, pressure: 1011,
        aqi: 72, aqiStatus: "Moderate", uv: 8, sunrise: "06:58 AM", sunset: "06:22 PM", rain: 0,
        tempTrend: [20, 18, 17, 22, 25, 27, 28, 25],
        humidityTrend: [25, 26, 28, 30, 29, 28, 27, 26],
        hourlyPrecip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        alerts: ["Dry and sunny weather continues.", "UV levels high in late afternoon."],
        forecast: [
            { day: "Tue", max: "28°", min: "17°", icon: "sun" },
            { day: "Wed", max: "29°", min: "16°", icon: "sun" },
            { day: "Thu", max: "28°", min: "17°", icon: "sun" },
            { day: "Fri", max: "27°", min: "16°", icon: "cloud-sun" },
            { day: "Sat", max: "28°", min: "17°", icon: "sun" }
        ]
    },
    "Bhopal": {
        state: "Madhya Pradesh", temp: 26, condition: "Clear Sky", icon: "sun", humidity: 32, wind: 12, visibility: 9, pressure: 1012,
        aqi: 88, aqiStatus: "Moderate", uv: 7, sunrise: "07:02 AM", sunset: "06:18 PM", rain: 0,
        tempTrend: [19, 17, 16, 21, 24, 26, 27, 24],
        humidityTrend: [30, 31, 32, 35, 33, 32, 31, 30],
        hourlyPrecip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        alerts: ["Mild wind chill in the evening.", "Ideal conditions for outdoor events."],
        forecast: [
            { day: "Tue", max: "27°", min: "16°", icon: "sun" },
            { day: "Wed", max: "28°", min: "15°", icon: "sun" },
            { day: "Thu", max: "27°", min: "16°", icon: "sun" },
            { day: "Fri", max: "26°", min: "15°", icon: "cloud-sun" },
            { day: "Sat", max: "27°", min: "16°", icon: "sun" }
        ]
    },
    "Vishakhapatnam": {
        state: "Andhra Pradesh", temp: 28, condition: "Mostly Sunny", icon: "sun", humidity: 72, wind: 16, visibility: 10, pressure: 1010,
        aqi: 48, aqiStatus: "Excellent", uv: 8, sunrise: "06:15 AM", sunset: "06:02 PM", rain: 5,
        tempTrend: [25, 24, 24, 26, 27, 28, 29, 27],
        humidityTrend: [70, 71, 72, 75, 73, 72, 71, 70],
        hourlyPrecip: [0, 0, 0, 0.1, 0.3, 0.5, 0.4, 0.2, 0.1, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.3, 0.5, 0.4, 0.2, 0.1, 0, 0],
        alerts: ["Strong sea breeze expected.", "High UV index: Protect your skin."],
        forecast: [
            { day: "Tue", max: "29°", min: "24°", icon: "sun" },
            { day: "Wed", max: "30°", min: "24°", icon: "sun" },
            { day: "Thu", max: "29°", min: "23°", icon: "cloud-sun" },
            { day: "Fri", max: "28°", min: "23°", icon: "cloud" },
            { day: "Sat", max: "29°", min: "24°", icon: "sun" }
        ]
    }
};

let mainChart;
let precipChart;
let humidityDonut;
let currentChartMode = 'temp'; // 'temp' or 'humidity'
let currentCity = "Mumbai";

const HOURS_LABELS = [
    '12AM','1AM','2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM',
    '12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM','11PM'
];

function initPrecipChart(precipData) {
    const ctx = document.getElementById('precipChart').getContext('2d');
    const barGrad = ctx.createLinearGradient(0, 0, 0, 220);
    barGrad.addColorStop(0, 'rgba(59, 130, 246, 0.9)');
    barGrad.addColorStop(1, 'rgba(99, 102, 241, 0.3)');

    precipChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: HOURS_LABELS,
            datasets: [{
                label: 'Precipitation (mm)',
                data: precipData,
                backgroundColor: barGrad,
                borderColor: 'rgba(99,102,241,0.8)',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(9,12,18,0.9)',
                    titleFont: { family: 'Outfit', size: 13 },
                    bodyFont: { family: 'Outfit', size: 13 },
                    padding: 10,
                    cornerRadius: 10,
                    displayColors: false,
                    callbacks: {
                        label: ctx => `${ctx.parsed.y} mm`
                    }
                }
            },
            scales: {
                y: {
                    display: true,
                    grid: { color: 'rgba(148,163,184,0.07)' },
                    ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 11 }, callback: v => v + 'mm' }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'Outfit', size: 10 },
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

function initHumidityDonut(humidity) {
    const ctx = document.getElementById('humidityDonutChart').getContext('2d');
    const dry = 100 - humidity;
    humidityDonut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Humid', 'Dry'],
            datasets: [{
                data: [humidity, dry],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.85)',
                    'rgba(148, 163, 184, 0.15)'
                ],
                borderColor: [
                    'rgba(99,102,241,1)',
                    'rgba(148,163,184,0.2)'
                ],
                borderWidth: 2,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(9,12,18,0.9)',
                    bodyFont: { family: 'Outfit', size: 13 },
                    padding: 10,
                    cornerRadius: 10,
                    callbacks: {
                        label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
                    }
                }
            }
        }
    });
}

function updatePrecipChart(precipData) {
    if (!precipChart) return;
    precipChart.data.datasets[0].data = precipData;
    precipChart.update('active');
    const total = precipData.reduce((a, b) => a + b, 0).toFixed(1);
    const el = document.getElementById('precip-total-val');
    if (el) el.textContent = total;
}

function updateHumidityDonut(humidity) {
    if (!humidityDonut) return;
    const dry = 100 - humidity;
    humidityDonut.data.datasets[0].data = [humidity, dry];
    humidityDonut.update('active');
    const el = document.getElementById('donut-value');
    if (el) el.textContent = humidity;
    // Update legend
    const legend = document.getElementById('donut-legend');
    if (legend) {
        legend.innerHTML = `
            <div class="donut-legend-item">
                <span class="legend-dot" style="background:#3b82f6"></span>
                <span>Humid</span>
                <strong>${humidity}%</strong>
            </div>
            <div class="donut-legend-item">
                <span class="legend-dot" style="background:rgba(148,163,184,0.4)"></span>
                <span>Dry</span>
                <strong>${dry}%</strong>
            </div>
        `;
    }
}

function initMainChart(data) {
    const ctx = document.getElementById('tempDynamicChart').getContext('2d');

    // Create Premium Gradients
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['06AM', '09AM', '12PM', '03PM', '06PM', '09PM', '12AM', '03AM'],
            datasets: [{
                label: 'Temperature',
                data: data,
                borderColor: '#6366f1',
                borderWidth: 3,
                backgroundColor: gradient,
                fill: true,
                tension: 0.5,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#6366f1',
                pointHoverBorderWidth: 3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(9, 12, 18, 0.9)',
                    titleFont: { family: 'Outfit', size: 14 },
                    bodyFont: { family: 'Outfit', size: 14 },
                    padding: 12,
                    cornerRadius: 10,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return currentChartMode === 'temp' ? context.parsed.y + '°C' : context.parsed.y + '% Humidity';
                        }
                    }
                }
            },
            scales: {
                y: {
                    display: false,
                    grid: { display: false }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8', font: { family: 'Outfit' } }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function updateAQIUI(aqi) {
    const aqiBar = document.querySelector('.aqi-progress-bar .progress');
    const aqiStatus = document.getElementById('aqi-status');
    const aqiVal = document.getElementById('aqi-val');

    if (!aqiVal || !aqiBar || !aqiStatus) return;

    aqiVal.textContent = aqi;
    let color = "#10b981"; // Good
    let statusText = "Good";
    let width = (aqi / 300) * 100;

    if (aqi > 200) { color = "#ef4444"; statusText = "Very Poor"; }
    else if (aqi > 150) { color = "#f97316"; statusText = "Unhealthy"; }
    else if (aqi > 100) { color = "#fbbf24"; statusText = "Sensitive"; }
    else if (aqi > 50) { color = "#fbbf24"; statusText = "Moderate"; }

    aqiBar.style.width = `${width}%`;
    aqiBar.style.backgroundColor = color;
    aqiStatus.textContent = statusText;
    aqiStatus.style.color = color;
    aqiStatus.style.background = `${color}20`;
}

function updateDashboard(cityName) {
    currentCity = cityName;
    const data = cityData[cityName];
    if (!data) return;

    // Update Text Content
    const cityEl = document.getElementById('hero-city');
    const tempEl = document.getElementById('hero-temp');
    const condEl = document.getElementById('hero-condition');
    const iconEl = document.getElementById('hero-icon');

    if (cityEl) cityEl.textContent = `${cityName}, ${data.state}`;
    if (tempEl) tempEl.textContent = data.temp;
    if (condEl) condEl.textContent = data.condition;
    if (iconEl) iconEl.className = `fas fa-${data.icon} yellow-glow`;

    const humEl = document.getElementById('hero-humidity');
    const windEl = document.getElementById('hero-wind');
    const visEl = document.getElementById('hero-visibility');
    const prsEl = document.getElementById('hero-pressure');

    if (humEl) humEl.textContent = `${data.humidity}%`;
    if (windEl) windEl.textContent = `${data.wind} km/h`;
    if (visEl) visEl.textContent = `${data.visibility} km`;
    if (prsEl) prsEl.textContent = `${data.pressure} hPa`;

    const uvEl = document.getElementById('uv-index');
    const sunrEl = document.getElementById('sunrise-time');
    const sunsEl = document.getElementById('sunset-time');
    const rainEl = document.getElementById('rain-chance');

    if (uvEl) uvEl.textContent = `${data.uv} | ${data.uv > 7 ? 'High' : 'Moderate'}`;
    if (sunrEl) sunrEl.textContent = data.sunrise;
    if (sunsEl) sunsEl.textContent = data.sunset;
    if (rainEl) rainEl.textContent = `${data.rain}%`;

    // Update AQI
    updateAQIUI(data.aqi);

    // Update Chart based on mode
    if (mainChart) {
        const trendData = currentChartMode === 'temp' ? data.tempTrend : data.humidityTrend;
        mainChart.data.datasets[0].data = trendData;
        mainChart.data.datasets[0].label = currentChartMode === 'temp' ? 'Temperature' : 'Humidity';
        mainChart.update('active');
    }

    // Update Precipitation Bar Chart
    if (data.hourlyPrecip) updatePrecipChart(data.hourlyPrecip);

    // Update Humidity Doughnut
    updateHumidityDonut(data.humidity);

    // Update Forecast
    const forecastScroll = document.getElementById('forecast-scroll');
    if (forecastScroll && data.forecast) {
        forecastScroll.innerHTML = '';
        data.forecast.forEach(day => {
            const row = document.createElement('div');
            row.className = 'forecast-row';
            row.innerHTML = `
                <span class="forecast-day">${day.day}</span>
                <span class="forecast-icon"><i class="fas fa-${day.icon}"></i></span>
                <div class="forecast-temp-range">
                    <span class="temp-max">${day.max}</span>
                    <span class="temp-min">${day.min}</span>
                </div>
            `;
            forecastScroll.appendChild(row);
        });
    }

    // Update Hero Animation with Blur and Scale
    const hero = document.querySelector('.weather-main-card');
    if (hero) {
        hero.style.filter = 'blur(10px)';
        hero.style.transform = 'scale(0.95) translateY(10px)';
        hero.style.opacity = '0';

        setTimeout(() => {
            hero.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            hero.style.filter = 'blur(0)';
            hero.style.transform = 'scale(1) translateY(0)';
            hero.style.opacity = '1';
        }, 50);
    }
}

// Sidebar Navigation & Interactivity
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-menu li');
    const alertsModal = document.getElementById('alerts-modal');
    const closeModal = document.getElementById('close-modal');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(ni => ni.classList.remove('active'));
            item.classList.add('active');

            const view = item.dataset.view;

            if (view === 'dashboard') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                currentChartMode = 'temp';
                updateDashboard(currentCity);
            }
            else if (view === 'analytics') {
                currentChartMode = currentChartMode === 'temp' ? 'humidity' : 'temp';
                updateDashboard(currentCity);
                const vizGrid = document.querySelector('.viz-grid');
                if (vizGrid) vizGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            else if (view === 'aqi') {
                const aqiCard = document.querySelector('.aqi-card');
                if (aqiCard) {
                    aqiCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    aqiCard.classList.add('highlight-section');
                    setTimeout(() => aqiCard.classList.remove('highlight-section'), 2000);
                }
            }
            else if (view === 'alerts') {
                showAlerts();
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (alertsModal) alertsModal.classList.remove('active');
            const alertsNav = document.getElementById('nav-alerts');
            if (alertsNav) alertsNav.classList.remove('active');
            const dashNav = document.getElementById('nav-dashboard');
            if (dashNav) dashNav.classList.add('active');
        });
    }
}

function showAlerts() {
    const alertsModal = document.getElementById('alerts-modal');
    const modalContent = document.getElementById('modal-content');
    const data = cityData[currentCity];

    if (!alertsModal || !modalContent) return;

    modalContent.innerHTML = '';

    if (data.alerts && data.alerts.length > 0) {
        data.alerts.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert-item';
            alertDiv.innerHTML = `
                <h4><i class="fas fa-circle-exclamation"></i> Official Advisory</h4>
                <p><strong>${currentCity}:</strong> ${alert}</p>
            `;
            modalContent.appendChild(alertDiv);
        });
    } else {
        modalContent.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No active weather alerts for this region.</p>';
    }

    alertsModal.classList.add('active');
}

// Search Functionality
function setupSearch() {
    const searchInput = document.getElementById('city-search');
    if (!searchInput) return;

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim().toLowerCase();
            const foundCity = Object.keys(cityData).find(city => city.toLowerCase() === query);

            if (foundCity) {
                updateDashboard(foundCity);
                document.querySelectorAll('.city-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.city === foundCity);
                });
                searchInput.value = '';
                searchInput.blur();
                const dashNav = document.getElementById('nav-dashboard');
                if (dashNav) dashNav.click();
            } else {
                const originalPlaceholder = searchInput.placeholder;
                searchInput.classList.add('search-error');
                searchInput.value = '';
                searchInput.placeholder = 'City not found in database...';

                setTimeout(() => {
                    searchInput.classList.remove('search-error');
                    searchInput.placeholder = originalPlaceholder;
                }, 2000);
            }
        }
    });

    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

const setupCityButtons = () => {
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateDashboard(btn.dataset.city);
        });
    });
};

function updateClock() {
    const now = new Date();
    const options = { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateEl = document.getElementById('hero-date');
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-IN', options);
}

// Real-time Data Simulation (Extra Dynamism)
function startDataSimulation() {
    setInterval(() => {
        const data = cityData[currentCity];
        if (!data) return;

        const tempChange = (Math.random() - 0.5) * 0.4;
        const humChange = (Math.random() - 0.5) * 2;

        const newTemp = (data.temp + tempChange).toFixed(1);
        const newHum = Math.round(data.humidity + humChange);

        const tempEl = document.getElementById('hero-temp');
        const humEl = document.getElementById('hero-humidity');

        if (tempEl) {
            tempEl.style.transition = 'color 0.5s ease';
            tempEl.textContent = newTemp;
            tempEl.style.color = '#fff';
            setTimeout(() => { tempEl.style.color = 'var(--text-main)'; }, 500);
        }

        if (humEl) humEl.textContent = `${newHum}%`;
    }, 5000);
}

// Theme Toggling
function setupTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    if (!themeToggle || !themeIcon) return;

    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'far fa-moon';
        }
    }
}

// Initialization
window.onload = () => {
    initMainChart(cityData["Mumbai"].tempTrend);
    initPrecipChart(cityData["Mumbai"].hourlyPrecip);
    initHumidityDonut(cityData["Mumbai"].humidity);
    updateDashboard("Mumbai");
    setupNavigation();
    setupSearch();
    setupCityButtons();
    setupTheme();
    startDataSimulation();
    setInterval(updateClock, 1000);
    updateClock();
};
