$.get("https://api.thingspeak.com/channels/676492/fields/1.json?results=288", function(data) {

    var tempData = [];
    var tempLabels = [];

    var prevTemp = undefined;
    for (let i = 1; i < data["feeds"].length - 1; i++) {
        const element = data["feeds"][i]
        if (element["field1"] > 13) {
            /*
                                const prevElement = data["feeds"][i - 1] || undefined;

                                const nextElement = data["feeds"][i + 1] || undefined;

                                let dif1 = element["field1"] - prevElement["field1"]
                                let dif2 = element["field1"] - nextElement["field1"]

                                let spread = Math.abs(dif1 - dif2)

                                if (spread > 0.2) {*/
            tempData.push({
                y: element["field1"],
                x: new Date(element["created_at"])
            });
        }

        /*}*/
    }
    /*
    data["feeds"].forEach(element => {

        if (element["field1"] > 13) {
            if (Math.abs(element["field1"] - prevTemp) < 0.5 || prevTemp == undefined) {
                tempData.push({
                    y: element["field1"],
                    x: new Date(element["created_at"])
                });
                tempLabels.push("dsfsd" + (new Date(element["created_at"])))
                prevTemp = element["field1"]
            }

        }

    });*/

    console.log(tempData)

    var ctx = document.getElementById('myChart').getContext('2d');


    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tempLabels,
            datasets: [{
                fontColor: 'white',
                label: 'Room temp at time',
                data: tempData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                yAxes: [{
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
                display: false,
                position: 'top',
                labels: {
                    fontColor: '#aaa'
                }
            }

        }
    });
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