var lastPointTime = null;
var tempData = [];
var humData = [];
var initialPointFetch = 400

window.onload = function() {
    var ctx = document.getElementById("myChart").getContext("2d");
    window.myLine = getNewChart(ctx, config);
};

function getNewChart(canvas, config) {
    return new Chart(canvas, config);
}


var config = {
    type: 'line',
    data: {
        datasets: [{
                fontColor: 'red',
                label: 'Temperature',
                data: tempData,
                yAxisID: 'A',
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1
            },
            {
                fontColor: 'blue',
                label: 'Humidity',
                data: humData,
                yAxisID: 'B',
                backgroundColor: ['rgba(132, 99, 255, 0.1)'],
                borderColor: ['rgba(132, 99, 255, 1)'],
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                id: 'A',
                type: 'linear',
                position: 'left',
                ticks: {
                    beginAtZero: false,
                    fontColor: "#999",
                    fontSize: 10
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Temp (*C)',
                    fontColor: '#999',
                    fontSize: 10
                }
            }, {
                id: 'B',
                type: 'linear',
                position: 'right',

                ticks: {
                    beginAtZero: true,
                    fontColor: "#999",
                    fontSize: 10,
                    max: 100,
                    min: 0
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Hum (%)',
                    fontColor: '#999',
                    fontSize: 10
                }
            }],
            xAxes: [{
                type: 'time',
                distribution: 'linear',
                ticks: {
                    beginAtZero: false,
                    fontColor: "#999",
                    fontSize: 10
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Time (hh:mm)',
                    fontColor: '#999',
                    fontSize: 10
                }
            }]
        },
        legend: {
            display: true,
            position: 'top',
            labels: {
                fontColor: '#aaa'
            }
        }

    }
}


// Initial data fetch
$.get(`https://api.thingspeak.com/channels/676492/feeds.json?results=${initialPointFetch}`, function(data) {

    for (let i = 0; i < data["feeds"].length; i++) {
        const pointTime = data["feeds"][i]["created_at"];
        const pointTemp = data["feeds"][i]["field1"];
        const pointHum = data["feeds"][i]["field2"];

        if (((new Date() - new Date(pointTime)) / 1000) < 86400) {
            if (pointTemp > 13) {
                tempData.push({
                    y: pointTemp,
                    x: new Date(pointTime)
                });
            }
            if (pointHum) {
                humData.push({
                    y: pointHum,
                    x: new Date(pointTime)
                });
            }
        }
    }

    lastPointTime = data["feeds"][data["feeds"].length - 1]["created_at"];

    window.myLine.update();

    document.getElementById("number-points").innerHTML = tempData.length;

});

// Last update indicator
setInterval(function() {
    document.getElementById("last-measurement").innerHTML = Math.round((new Date() - new Date(lastPointTime)) / 1000);
}, 0);

// Fetching any new points
setInterval(function() {

    $.get("https://api.thingspeak.com/channels/676492/feeds.json?results=1", function(data) {

        const pointTime = data["feeds"][0]["created_at"];
        const pointTemp = data["feeds"][0]["field1"];
        const pointHum = data["feeds"][0]["field2"];

        if (pointTime > lastPointTime) {

            config.data.datasets[0].data.push({
                y: pointTemp,
                x: new Date(pointTime)
            });
            config.data.datasets[1].data.push({
                y: pointHum,
                x: new Date(pointTime)
            });

            config.data.datasets[0].data.splice(0, 1);
            config.data.datasets[1].data.splice(0, 1);

            window.myLine.update();
            console.log("new point found and added")
            lastPointTime = pointTime;
        }
    });


}, 20000);


// Phone stuff
if (1410 < window.innerWidth) {
    $("#chart-scroll").css('overflow-x', 'hidden')
    $("#chart-container").css("width", window.innerWidth - 20 + "px")
    $("#chart-container").css("height", "100%");
} else {
    $("#chart-container").css("width", "1520px");
    $("#chart-container").css("height", "90%");
}


// Not my code
function dateToNiceString(myDate) {
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var hours = myDate.getHours();
    var minutes = myDate.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ampm;
    return month[myDate.getMonth()] + " " + myDate.getDate() + " " + myDate.getFullYear() + " " + strTime;
}