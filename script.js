$.get("https://api.thingspeak.com/channels/676492/feeds.json?results=288", function(data) {

    var tempData = [];
    var tempLabels = [];

    var humData = [];
    var humLabels = [];

    var dataLength = data["feeds"].length

    for (let i = 0; i < dataLength; i++) {
        const element = data["feeds"][i]
        if (element["field1"] > 13) {
            tempData.push({
                y: element["field1"],
                x: new Date(element["created_at"])
            });
        }


    }

    for (let i = 0; i < dataLength; i++) {
        const element = data["feeds"][i]
        if (element["field2"]) {
            humData.push({
                y: element["field2"],
                x: new Date(element["created_at"])
            });
        }


    }



    console.log(humData)

    var ctx = document.getElementById('myChart').getContext('2d');


    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                    fontColor: 'red',
                    label: 'Temperature',
                    data: tempData,
                    yAxisID: 'A',
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                },
                {
                    fontColor: 'blue',
                    label: 'Humidity',
                    data: humData,
                    yAxisID: 'B',
                    backgroundColor: [
                        'rgba(132, 99, 255, 0.1)'
                    ],
                    borderColor: [
                        'rgba(132, 99, 255, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
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
    });



    document.getElementById("number-points").innerHTML = dataLength;

    setInterval(function() {
        document.getElementById("last-measurement").innerHTML = Math.round((new Date() - new Date(data["feeds"][dataLength - 1]["created_at"])) / 1000);
    }, 600);
});

console.log(window.innerWidth)

if (1410 < window.innerWidth) {
    $("#chart-scroll").css('overflow-x', 'hidden')
    $("#chart-container").css("width", window.innerWidth - 20 + "px")

} else {
    $("#chart-container").css("width", "3020px")
}


// Not my code
function dateToNiceString(myDate) {
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    var hours = myDate.getHours();
    var minutes = myDate.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ampm;
    return month[myDate.getMonth()] + " " + myDate.getDate() + " " + myDate.getFullYear() + " " + strTime;
}