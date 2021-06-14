
// global variables
let selectedKorpus = []; // every selected korpus
let knames = []; // every selected korpus name
let filter = document.querySelector("#filterBy").value; // current filter

// On page load
$(document).ready(async function () {
    // initial fetchers on page load, to display stats

    // main stats
    updateKorpusCheckboxes();
    await fetchMiniStats();

    // pie chart
    let langData = await fetchLanguagePercentage();
    loadLanguagePercentage(langData);

    // event listeners
    document.querySelectorAll('input[name=korpus]')
        .forEach(el => el
            .addEventListener('click', updateKorpusCheckboxes));
    document.querySelector("#selectAllKorpus").addEventListener("click", selectKorpus);
    document.querySelector("#unselectAllKorpus").addEventListener("click", deselectKorpus);
    document.querySelector("#filterBy").addEventListener("change", updateFilter);
});

// AJAX for fetching mini stats
async function fetchMiniStats() {
    filter = document.querySelector("#filterBy").value;
    let result;
    try {
        result = await $.ajax({
            url: "db/server.php",
            type: "POST",
            data: { fetchMiniStats: selectedKorpus, fetchValue: filter },
            dataType: 'JSON',
        });
        console.log(selectedKorpus)
        console.log("AJAX: Fetching selected korpus mini stats... " + JSON.stringify(result));
        loadMiniStats(result);
    } catch (error) {
        console.error(error);
    }
}

// Loading the mini stats
function loadMiniStats(results) {
    document.querySelector("#documents").innerHTML = numberWithCommas(results[0].sum);
    document.querySelector("#sentences").innerHTML = numberWithCommas(results[0].lauseid);
    document.querySelector("#words").innerHTML = numberWithCommas(results[0].sonu);
}

// Number beautifier. For example: '123456789' into '123,456,789'
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// updates the stats title, beautifies them, then executes checkbox updater
function updateFilter() {
    filter = document.querySelector("#filterBy").value;
    let beautify;
    switch (filter) {
        case "vanus":
            beautify = "vanuse";
            break;
        case "haridus":
            beautify = "hariduse";
            break;
        case "sugu":
            beautify = "soo";
            break;
        case "elukoht":
            beautify = "elukoha";
            break;
        case "kodukeel":
            beautify = "kodukeele";
            break;
        case "emakeel":
            beautify = "emakeele";
            break;
        case "tekstikeel":
            beautify = "tekstikeele";
            break;
        case "abivahendid":
            beautify = "abivahendite";
            break;
        case "taust":
            beautify = "sotsiaalse tausta";
            break;
        case "keeletase":
            beautify = "keeletaseme";
            break;
        case "tekstikeel":
            beautify = "tekstikeele";
            break;
        case "tekstityyp":
            beautify = "tekstitüübi";
            break;
    }
    document.querySelector(".stats h2").innerHTML = `Tekstid ${beautify} järgi`;
    updateKorpusCheckboxes();
}

// Checkbox style manipulation (checks everything), then fetches all stats
async function selectKorpus() {
    let checkboxes = document.querySelectorAll('input[name=korpus]');
    for (i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
        let next = checkboxes[i].nextElementSibling.firstChild;
        next.classList.remove("hidden");
        next.classList.remove("add");
        console.log("added " + next);
    }
    await fetchAll();
    await fetchMiniStats();
}

// Checkbox style manipulation (unchecks everything)
function deselectKorpus() {
    let checkboxes = document.querySelectorAll('input[name=korpus]');
    for (i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        let next = checkboxes[i].nextElementSibling.firstChild;
        next.classList.add("hidden");
        console.log("removed " + next);
    }
}

// Collects every selected korpus checkbox, styles them and then fetches appropriate stats
async function updateKorpusCheckboxes() {
    filter = document.querySelector("#filterBy").value;
    selectedKorpus = [];
    let checkboxes = document.querySelectorAll('input[name=korpus]:checked');
    let allCheckboxes = document.querySelectorAll('input[name=korpus]');
    for (let i = 0; i < allCheckboxes.length; i++) {
        let next = allCheckboxes[i].nextElementSibling.firstChild;
        next.classList.add("hidden");
    }
    if (checkboxes.length == 0) {
        knames = [];
        for (i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
            let next = checkboxes[i].nextElementSibling.firstChild;
            next.classList.remove("hidden");
        }
        //get data for all
        await fetchAll();
    } else {
        for (let i = 0; i < checkboxes.length; i++) {
            selectedKorpus.push(checkboxes[i].defaultValue);
            let next = checkboxes[i].nextElementSibling.firstChild;
            next.classList.remove("hidden");
        }
        knames = await fetchKorpusNames(selectedKorpus);
        await fetchSome();
    }
    await fetchMiniStats();
}

// fetches Korpus names, used in updateKorpusCheckboxes()
async function fetchKorpusNames(korpusCodes) {
    let result;
    try {
        result = await $.ajax({
            url: "db/server.php",
            type: "POST",
            data: { fetchKorpusName: true, selectedKorpus: korpusCodes },
            dataType: 'JSON',
        });
        console.log("AJAX: Fetching names...: " + result);
        return result;
    } catch (error) {
        console.error(error);
    }
}

// AJAX for fetching data from ALL korpuses
async function fetchAll() {
    let result;
    try {
        result = await $.ajax({
            url: "db/server.php",
            type: "POST",
            data: { fetchAll: true, fetchValue: filter },
            dataType: 'JSON',
        });
        loadStats(result);
        console.log("AJAX: Fetching all korpus data... " + JSON.stringify(result));
    } catch (error) {
        console.error(error);
    }
}

// AJAX for fetching data from SELECTED korpuses
async function fetchSome() {
    let result;
    try {
        result = await $.ajax({
            url: "db/server.php",
            type: "POST",
            data: { fetchSome: selectedKorpus, fetchValue: filter },
            dataType: 'JSON',
        });
        loadStats(result);
        console.log("AJAX: Fetching selected korpus data...");
    } catch (error) {
        console.error(error);
    }
}

// AJAX for fetching data for the pie chart
async function fetchLanguagePercentage() {
    let result;
    try {
        result = await $.ajax({
            url: "db/server.php",
            type: "POST",
            data: { fetchLanguagePercentage: true },
            dataType: 'JSON',
        });
        return result;
    } catch (error) {
        console.error(error);
    }
}

// AJAX boxplot test
async function fetchWordType() {
    let result;
    try {
        result = await $.ajax({
            url: "db/server.php",
            type: "POST",
            data: { fetchWordType: true },
            dataType: 'JSON',
        });
        return result;
    } catch (error) {
        console.error(error);
    }
}

// Echarts code
function loadStats(data) {

    let ages = []
    let filterData = data;

    // filter gained data
    filterData.forEach((e) => {
        if (e[filter] == null) {
            ages.push("TUNDMATU");
        } else {
            ages.push(e[filter]
                .replace(/y/g, "ü")
                .toUpperCase());
        }
    });

    // set categories for chart
    let percent = [];
    let texts = [];
    let words = [];
    let sentences = [];
    let errors = [];
    let errorTypes = [];
    filterData.forEach((e) => {
        percent.push(parseFloat(e.protsent).toFixed(2));
        texts.push(e.tekste);
        words.push(e.sonu);
        sentences.push(e.lauseid);
        errors.push(e.vigu);
        errorTypes.push(e.veatyype);
    });

    // initialize chart
    let chartDom = document.getElementById('alamkorpused');
    let myChart = echarts.init(chartDom);
    let option;

    // colors
    let colors = ['#5470C6', '#0e6e21', '#EE6666', '#411561',
        '#61154a', '#8a3c0c'];

    // responsive width
    $(window).on('resize', function () {
        myChart.resize();
    });

    // chart settings
    option = {
        color: colors,

        title: {
            text: "Keelekorpus",
            show: false
        },
        calculatable: true,

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
            containLabel: true,
            width: "auto",
        },
        toolbox: {
            show: true,
            left: "center",
            bottom: "bottom",
            color: '#333',
            itemSize: 30,
            itemGap: 35,
            feature: {
                dataView: { show: true, readOnly: true, title: "Andmed" },
                saveAsImage: { show: true, title: "Laadi alla", color: "red" },
                magicType: {
                    show: true,
                    type: ['line', 'bar'],
                },
            }
        },
        legend: {
            data: ['Protsent', 'Tekste', 'Sõnu', 'Lauseid', 'Vigu'],
            selected: {
                'Protsent': true, 'Tekste': false, 'Sõnu': false,
                'Lauseid': false, 'Vigu': false, 'Veatüüpe': false
            },
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data: ages,
                axisLabel: {
                    color: '#333',
                    interval: 0,
                    rotate: 45,
                },
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                // show: false,
                type: 'value',
                name: 'Protsent',
                position: 'right',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[0],
                        fontSize: 18
                    }
                },
                axisLabel: {
                    // containLabel: true,
                    formatter: '{value} %'
                }
            },
            {
                // show: false,
                type: 'value',
                name: 'Tekste',
                position: 'right',
                offset: 45,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisLabel: {
                    // containLabel: true,
                    formatter: '{value}'
                }
            },
            {
                // show: false,
                type: 'value',
                name: 'Sõnu',
                position: 'right',
                offset: 105,
                axisLine: {
                    show: true,
                    lineStyle: {
                        containLabel: true,
                        color: colors[2]
                    }
                },
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                // show: false,
                type: 'value',
                name: 'Lauseid',
                position: 'left',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[3]
                    }
                },
                // axisLabel: {
                //     containLabel: true,
                //     formatter: '{value}'
                // }
            },
            {
                // show: false,
                type: 'value',
                name: 'Vigu',
                position: 'left',
                offset: 75,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[4]
                    }
                },
                axisLabel: {
                    containLabel: true,
                    formatter: '{value}'
                }
            },
            {
                // show: false,
                type: 'value',
                name: 'Veatüüpe',
                position: 'left',
                offset: 145,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[5]
                    }
                },
                axisLabel: {
                    containLabel: true,
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: 'Protsent',
                type: 'bar',
                data: percent,
            },
            {
                name: 'Tekste',
                type: 'bar',
                yAxisIndex: 1,
                data: texts
            },
            {
                name: 'Sõnu',
                type: 'bar',
                yAxisIndex: 2,
                data: words
            },
            {
                name: 'Lauseid',
                type: 'bar',
                yAxisIndex: 3,
                data: sentences
            },
            {
                name: 'Vigu',
                type: 'bar',
                yAxisIndex: 4,
                data: errors
            },
            {
                name: 'Veatüüpe',
                type: 'bar',
                yAxisIndex: 5,
                data: errorTypes
            }
        ]
    };
    option && myChart.setOption(option);
}


// Echarts pie chart
function loadLanguagePercentage(data) {
    var chartDom = document.getElementById('languagePercentage');
    var myChart = echarts.init(chartDom);
    var option;

    //responsive width
    $(window).on('resize', function () {
        myChart.resize();
    });

    // get data
    let pieData = [];
    data.forEach((e) => {
        if (e.tekstikeel == null) {
            pieData.push({ value: e.protsent, name: "TUNDMATU" });
        } else {
            pieData.push({ value: e.protsent, name: e.tekstikeel.toUpperCase() });
        }
    });

    // chart settings
    option = {
        tooltip: {
            trigger: 'item',
        },
        toolbox: {
            show: true,
            left: "center",
            bottom: "bottom",
            color: '#333',
            itemSize: 30,
            itemGap: 100,
            feature: {
                dataView: { show: true, readOnly: true, title: "Andmed" },
                saveAsImage: { show: true, title: "Laadi alla", color: "red" }
            }
        },
        legend: {
            orient: 'horizontal',
            left: "center",
            top: 0
        },
        series: [
            {
                name: 'Test',
                type: 'pie',
                radius: '70%',
                data: pieData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    option && myChart.setOption(option);
}

loadBoxplot();

function loadBoxplot() {

    var chartDom = document.getElementById('boxplot');
    var myChart = echarts.init(chartDom);
    var option;


    let rawData = [
        [
            "Income",
            "Life Expectancy",
            "Population",
            "Country",
            "Year"
        ],
        [
            815,
            34.05,
            351014,
            "Australia",
            1800
        ],
        [
            1314,
            39,
            645526,
            "Canada",
            1800
        ],
        [
            985,
            32,
            321675013,
            "China",
            1800
        ],
        [
            864,
            32.2,
            345043,
            "Cuba",
            1800
        ],
        [
            1244,
            36.5731262,
            977662,
            "Finland",
            1800
        ],
        [
            1803,
            33.96717024,
            29355111,
            "France",
            1800
        ]
    ];


    echarts.registerTransform(window.ecSimpleTransform.aggregate);

    option = {
        dataset: [{
            id: 'raw',
            source: rawData
        }, {
            id: 'since_year',
            fromDatasetId: 'raw',
            transform: [{
                type: 'filter',
                config: {
                    dimension: 'Year', gte: 1950
                }
            }]
        }, {
            id: 'income_aggregate',
            fromDatasetId: 'since_year',
            transform: [{
                type: 'ecSimpleTransform:aggregate',
                config: {
                    resultDimensions: [
                        { name: 'min', from: 'Income', method: 'min' },
                        { name: 'Q1', from: 'Income', method: 'Q1' },
                        { name: 'median', from: 'Income', method: 'median' },
                        { name: 'Q3', from: 'Income', method: 'Q3' },
                        { name: 'max', from: 'Income', method: 'max' },
                        { name: 'Country', from: 'Country' }
                    ],
                    groupBy: 'Country'
                }
            }, {
                type: 'sort',
                config: {
                    dimension: 'Q3',
                    order: 'asc'
                }
            }]
        }],
        title: {
            text: 'Income since 1950'
        },
        tooltip: {
            trigger: 'axis',
            confine: true
        },
        xAxis: {
            name: 'Income',
            nameLocation: 'middle',
            nameGap: 30,
            scale: true,
        },
        yAxis: {
            type: 'category'
        },
        grid: {
            bottom: 100
        },
        legend: {
            selected: { detail: false }
        },
        dataZoom: [{
            type: 'inside'
        }, {
            type: 'slider',
            height: 20,
        }],
        series: [{
            name: 'boxplot',
            type: 'boxplot',
            datasetId: 'income_aggregate',
            itemStyle: {
                color: '#b8c5f2'
            },
            encode: {
                x: ['min', 'Q1', 'median', 'Q3', 'max'],
                y: 'Country',
                itemName: ['Country'],
                tooltip: ['min', 'Q1', 'median', 'Q3', 'max']
            }
        }, {
            name: 'detail',
            type: 'scatter',
            datasetId: 'since_year',
            symbolSize: 6,
            tooltip: {
                trigger: 'item'
            },
            label: {
                show: true,
                position: 'top',
                align: 'left',
                verticalAlign: 'middle',
                rotate: 90,
                fontSize: 12
            },
            itemStyle: {
                color: '#d00000'
            },
            encode: {
                x: 'Income',
                y: 'Country',
                label: 'Year',
                itemName: 'Year',
                tooltip: ['Country', 'Year', 'Income']
            }
        }]
    };

    myChart.setOption(option);

    option && myChart.setOption(option);

}

