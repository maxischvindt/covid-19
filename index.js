console.clear();

// Theme for highchart
Highcharts.setOptions({
        colors: ["#F92672", "#66D9EF", "#A6E22E", "#f1c40f", "#e74c3c", "#34495e", "#3498db", "#1abc9c", "#f39c12", "#d35400"],
        chart: {
            backgroundColor: "rgba(0,0,0,0)", marginTop: 25,
            style: {fontFamily: 'Roboto Condensed', color: "#A2A39C"}
        },
        credits: {
            enabled: false
        },
        title: {
            style: {color: "#A2A39C"},
            y: 10,x: 0,align: "right"
        },
        tooltip: {
            crosshairs: true,
            shared: false,
            split: true,
        },
        subtitle: {
            style: {color: "#A2A39C"},
            align: "left"
        },
        legend: {
            align: 'center', verticalAlign: 'bottom', x: 0, y: 0,
            itemStyle: {fontWeight: "normal", color: "#A2A39C"}
        },
        xAxis: {
            gridLineDashStyle: "Dot",
            gridLineWidth: 0,
            gridLineColor: "#A2A39C",
            lineColor: "#A2A39C",
            minorGridLineColor: "#A2A39C",
            tickColor: "#A2A39C",
            tickWidth: 1,
            tickmarkPlacement: 'on',
        },
        yAxis: {
            gridLineDashStyle: "Dot",
            gridLineWidth: 1,
            gridLineColor: "#A2A39C",
            lineColor: "#A2A39C",
            minorGridLineColor: "#A2A39C",
            tickColor: "#A2A39C",
            tickWidth: 1,
            min: 1
        },
        plotOptions: {
            area: {
                stacking: undefined,
            },
            series: {
                fillColor: {
                    linearGradient: {x1: 0, y1: 0, x2: .8, y2: .9},
                },
                marker: {
                    symbol: 'circle'
                }
            }
        },
        responsive: {
            rules: [{
                condition: {maxWidth: 500},
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    }
);

let [chart1,chart2,chart3,chart4,chart5,chart6,chart7,chart8,chart9] = [null,null,null,null,null,null,null,null,null];
let type = "lineal";
let totalTests = 0;
let totalDeaths = 0;

//let sheetUrl = 'https://gist.githubusercontent.com/Cuchu/95bc6f743842f1315f716627f2610d4c/raw/covid-19-arg.csv'
let sheetUrl = 'https://gist.githubusercontent.com/Cuchu/910e86a20622be42b7ab7fc86914f2f8/raw/covid-19-arg-temp.csv'
let sheetCountriesUrl = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';

const renderChart1 = (categories, series, container, title) => {

    chart1 = Highcharts.chart(container, {
        chart: {type: 'area'},
        title: {text: title},
        yAxis: {title: {text: 'Personas'}},
        xAxis: {categories: categories},
        series: series,
    });
}

const renderChart2 = (categories, series, container, title) => {

    chart2 = Highcharts.chart(container, {
        chart: {type: 'column'},
        title: {text: title},
        yAxis: {title: {text: 'Personas'},min: 0},
        xAxis: {categories: categories},
        series: series,
    });
}

const renderChart3 = (categories, series, container, title) => {

    chart3 = Highcharts.chart(container, {
        plotOptions: {column: {stacking: 'normal'}},
        chart: {type: 'line'},
        title: {text: title},
        yAxis: [{title: {text: 'Tests'},min: 1},{title: {text: '% de Positivos'},min: 1, opposite: true, gridLineWidth: 0}],
        xAxis: {categories: categories},
        series: series,
    });
}

const renderChart = (categories, series, container, title, yTitle) => {

    return Highcharts.chart(container, {
        plotOptions: {column: {stacking: 'normal'}},
        chart: {type: 'line'},
        title: {text: title},
        yAxis: {title: {text: yTitle},min: 1},
        xAxis: {categories},
        series: series,
    });
}

const renderTotalScores = (series, container) => {
    const cases = series[0].data[series[0].data.length - 1];
    const casesIncrement = cases - series[0].data[series[0].data.length - 2];

    let recovered = series[1].data[series[1].data.length - 1];
    if (recovered <= 0) recovered = series[1].data[series[1].data.length - 2];
    const recoveredIncrement = recovered - series[1].data[series[1].data.length - 2];

    const deaths = series[2].data[series[2].data.length - 1];
    totalDeaths = deaths;
    const deathsIncrement = deaths - series[2].data[series[2].data.length - 2];

    const pendings = cases - recovered - deaths;

    completeScore("score0", "Confirmadas", cases, "rgba(102, 207, 239, .9)", casesIncrement, false, container);
    completeScore("score1", "Recuperadas", recovered, "rgba(166, 226, 46, .9)", recoveredIncrement, false, container);
    completeScore("score2", "Fallecidas", deaths, "rgba(231,76,60,0.9)", deathsIncrement, false, container);
    completeScore("score3", "En tratamiento", pendings, "#f39c12", 'resultado de conf - rec - fall', true, container);

}

const renderTestsScores = (series, container) => {
    const infected = parseFloat(series[3].data[series[3].data.length - 1].toFixed(2));

    const millon = parseFloat((series[2].data[series[2].data.length - 1] / 44.5).toFixed(2));

    const deathsTests = parseFloat((totalDeaths / series[2].data[series[2].data.length - 1] * 100).toFixed(2));
    const deathsCases = parseFloat((totalDeaths / series[0].data[series[0].data.length - 1] * 100).toFixed(2));

    completeScore("score5", "Infectados", infected, "rgba(102, 207, 239, .9)", "% de los testeos", true, container);
    completeScore("score6", "Letalidad", deathsTests, "rgba(231,76,60,0.9)", "% de los testeos", true, container);
    completeScore("score7", "Letalidad", deathsCases, "rgba(231,76,60,0.9)", "% de los confirmados", true, container);
    completeScore("score8", "C/Millón de Hab", millon, "rgb(243,156,18)", "Tests realizados", true, container);

}

const completeScore = (id, title, score, scoreColor, subscore, scoreAsText = false, container) => {
    return $("<div/>").attr("id", id).addClass("scoreContainer").append(
        $("<div/>").addClass("title").text(title)
    ).append(
        $("<div/>").addClass("score").text(score.toLocaleString("it-IT")).css({color: scoreColor})
    ).append(
        scoreAsText &&
        $("<div/>").addClass("scoreInc text").html(subscore) ||
        $("<div/>").addClass("scoreInc").text((subscore >= 0 ? "+" : "-") + subscore.toLocaleString("it-IT")).append($("<i/>").addClass(`fas fa-angle-double-up ${subscore >= 0 ? "red" : "green"}`))
    ).appendTo("#" + container);
};

// Argentina parsing data
Papa.parse(
    sheetUrl
    , {
        download: true,
        complete: function (results, file) {
            //console.log(results);
            handleResults(results);

        },
        error: function (err, file, inputElem, reason) {
            alert('Se modificó la fuente de datos, cuando adapte el modo de obtenerlos volverá a funcionar');
        },
    });

// World parsing data
Papa.parse(
    sheetCountriesUrl
    , {
        download: true,
        complete: function (results, file) {
            handleCountriesResults(results);

        },
        error: function (err, file, inputElem, reason) {
            console.log(err);
        },
    });

const handleResults = results => {

    let categories1 = [];
    let series1 = [];
    let categories2 = [];
    let series2 = [];
    let provinces = {};
    let categories3 = [];
    let series3 = [];

    /* Chart 1 */
    series1.push(
        {
            name: 'Confirmadas', data: [],
            fillColor: {stops: [[0, 'rgba(102, 207, 239, 1)'],[1, 'rgba(102, 207, 239, .1)']]},
            lineColor: 'rgba(102, 207, 239, .8)',color: 'rgba(102, 207, 239, .8)'
        },
        {
            name: 'Recuperadas', data: [],
            fillColor: {stops: [[0, 'rgba(166, 226, 46, 1)'],[1, 'rgba(166, 226, 46, .1)']]},
            lineColor: 'rgba(166, 226, 46, .8)',color: 'rgba(166,226,46,0.8)'
        },
        {
            name: 'Fallecidas', data: [],
            fillColor: {stops: [[0, 'rgba(231, 76, 60, .9)'],[1, 'rgba(231, 76, 60, .1)']]},
            lineColor: 'rgba(231, 76, 60, .8)',color: 'rgba(231, 76, 60, .8)'
        }
    );

    /* Chart 2 */
    series2.push(
        {
            name: 'Confirmadas', data: [],
            fillColor: {stops: [[0, 'rgba(102, 207, 239, 1)'],[1, 'rgba(102, 207, 239, .1)']]},
            lineColor: 'rgba(102,207,239,0.8)',color: 'rgba(102, 207, 239, .8)'
        },
        {
            name: 'Fallecidas', data: [],
            fillColor: {stops: [[0, 'rgba(231, 76, 60, .9)'],[1, 'rgba(231, 76, 60, .1)']]},
            lineColor: 'rgba(231, 76, 60, .8)',color: 'rgba(231, 76, 60, .8)'
        }
    );

    /* Chart 3 */
    series3.push(
        {
            name: 'Positivos', data: [], type: 'column',
            lineColor: 'rgba(231, 76, 60, .8)',color: 'rgba(231, 76, 60, .8)'
        },
        {
            name: 'Negativos', data: [], type: 'column',
            lineColor: 'rgba(166, 226, 46, .8)',color: 'rgba(166, 226, 46, .8)'
        },
        {
            name: 'Total', data: [],
            lineColor: 'rgb(243,156,18)',color: 'rgb(243,156,18)'
        },
        {
            name: '% de Positivos', data: [],yAxis:1,
            lineColor: 'rgba(102, 207, 239, .9)',color: 'rgba(102, 207, 239, .9)'
        }
    );

    results.data.forEach((line, index) => {
        if(line.length == 1) return

        if (index == 0) {
            return;

            /* Chart 1 & Chart 3 */
        } else if (line[0] && line[4] === 'Indeterminado' && parseInt(line[6]) >= 1) {
            let d = moment(line[0], "DD-MM-YYYY");
            categories1.push(d.format("DD/MM"));

            series1[0].data.push(line[6] && parseInt(line[6]) || 0);
            series1[1].data.push(line[10] && parseInt(line[10]) || 0);
            series1[2].data.push(line[8] && parseInt(line[8]) || 0);

            if(parseInt(line[12]) >= 1 && parseInt(line[13]) >= 1) {
                categories3.push(d.format("DD/MM"));

                //totalTests = parseInt(line[6]) + parseInt(line[12]);
                totalTests = parseInt(line[13]);
                positives = parseInt(line[13]) - parseInt(line[12]);
                series3[0].data.push(positives);
                series3[1].data.push(parseInt(line[12]));
                series3[2].data.push(totalTests);


                series3[3].data.push(parseFloat(((positives / totalTests) * 100).toFixed(2)));
            }

            /* Chart 2 */
        } else if (line[4] !== 'Indeterminado') {
            let prov = toTitleCase(line[4].toLowerCase());
            if (provinces[prov] === undefined) {
                provinces[prov] = {prov, cases: parseInt(line[7]), deaths: parseInt(line[9])}
                categories2.push(prov)
            } else {
                provinces[prov].cases += parseInt(line[7]);
                provinces[prov].deaths += parseInt(line[9]);
            }
        }
    });

    categories2.forEach((province) => {
        series2[0].data.push(provinces[province].cases);
        series2[1].data.push(provinces[province].deaths);
    });

    renderChart1(categories1, series1, "container2", "Evolución diaria de personas");
    renderChart2(categories2, series2, "container3", "");
    renderChart3(categories3, series3, "container5", "Evolución diaria de testeos");
    renderTotalScores(series1, "container1");
    renderTestsScores(series3, "container4");

}

const handleCountriesResults = results => {
    const countries = ['USA','ARG','URY','BRA','CHL'];

    let categoriesUnix = [];
    let categoriesDate = [];
    let [series1,series2,series3,series4,series5,series6] = [[],[],[],[],[],[]];
    let data = [{},{},{},{},{},{},{},{},{}];

    countries.forEach((country, index) => {
        series1.push({name: country, data: []}); //Cases
        series2.push({name: country, data: []}); //Deaths
        series3.push({name: country, data: []}); //CasesxM
        series4.push({name: country, data: []}); //DeathsxM
        series5.push({name: country, data: []}); //Tests
        series6.push({name: country, data: []}); //TestsxM
    });


    let countryIndex = null;
    let d = null;
    results.data.forEach((line, index) => {
        countryIndex = countries.indexOf(line[0]);
        d = moment(line[3], "YYYY-MM-DD").format("DD/MM");
        d1 = moment(line[3], "YYYY-MM-DD").unix();

        if (index == 0 || countryIndex === -1) {
            return;

        } else {

            if(categoriesUnix.indexOf(d1) === -1) categoriesUnix.push(d1);

            if(data[countryIndex][d] === undefined) data[countryIndex][d] = {cases:0,deaths:0,casesxM:0,deathsxM:0,tests:0,testsxM:0}

            data[countryIndex][d].cases = line[4] && parseInt(line[4]) || 0;
            data[countryIndex][d].deaths = line[6] && parseInt(line[6]) || 0;
            data[countryIndex][d].casesxM = line[8] && parseInt(line[8]) || 0;
            data[countryIndex][d].deathsxM = line[10] && parseInt(line[10]) || 0;
            data[countryIndex][d].tests = line[12] && parseInt(line[12]) || 0;
            data[countryIndex][d].testsxM = line[14] && parseInt(line[14] * 1000) || 0;
        }
    });

    categoriesUnix.sort();

    let [day,cases,deaths,casesxM,deathsxM,tests,testsxM] = [0,0,0,0,0,0,0];
    categoriesUnix.forEach((value, index) => {
        day = moment(value * 1000).format("DD/MM");
        categoriesDate.push(day);

        countries.forEach((value1, countryIndex) => {
            if(data[countryIndex][day] === undefined) {
                series1[countryIndex].data.push([day,0]);
                series2[countryIndex].data.push([day,0]);
                series3[countryIndex].data.push([day,0]);
                series4[countryIndex].data.push([day,0]);
                series5[countryIndex].data.push([day,0]);
                series6[countryIndex].data.push([day,0]);
            } else {
                series1[countryIndex].data.push([day,data[countryIndex][day].cases]);
                series2[countryIndex].data.push([day,data[countryIndex][day].deaths]);
                series3[countryIndex].data.push([day,data[countryIndex][day].casesxM]);
                series4[countryIndex].data.push([day,data[countryIndex][day].deathsxM]);
                series5[countryIndex].data.push([day,data[countryIndex][day].tests]);
                series6[countryIndex].data.push([day,data[countryIndex][day].testsxM]);
            }
        })

    })

    chart4 = renderChart(categoriesDate, series1, "container6", "Casos", 'Casos');
    chart5 = renderChart(categoriesDate, series3, "container7", "Casos cada Millón de habitantes", 'Casos');

    chart6 = renderChart(categoriesDate, series2, "container8", "Fallecidas", 'Personas');
    chart7 = renderChart(categoriesDate, series4, "container9", "Fallecidas cada Millón de habitantes", 'Personas');

    chart8 = renderChart(categoriesDate, series5, "container10", "Tests", 'Tests');
    chart9 = renderChart(categoriesDate, series6, "container11", "Tests cada Millón de habitantes", 'Tests');

}

$(document).ready(function() {
    $("#toggle_checkbox").click( function(){
        $(".scale-type").removeClass("scale-type-active");

        ($(this).is(':checked'))? type = "logarithmic" : type = "lineal";

        chart1.update({yAxis:{type}},true,true)
        chart3.update({yAxis:[{type},{type}]},true,true)
        chart4.update({yAxis:{type}},true,true)
        chart5.update({yAxis:{type}},true,true)
        chart6.update({yAxis:{type}},true,true)
        chart7.update({yAxis:{type}},true,true)
        chart8.update({yAxis:{type}},true,true)
        chart9.update({yAxis:{type}},true,true)
        $("#scale-type-"+type).addClass("scale-type-active");
    });
})

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}