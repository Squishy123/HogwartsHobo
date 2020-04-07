//entry point for the project
import Chart from 'chart.js';
import Game from './sim/sim';

let sctx = document.querySelector('#smart-graph');
let bctx = document.querySelector('#basic-graph');
let octx = document.querySelector('#optimal-graph');
let progress = document.querySelector('#progress');
let start = document.querySelector('#start');
let startOptimal = document.querySelector('#start-optimal');

let smartGraph, basicGraph, optimalGraph;
let hitRate;

//value out of 100
function setProgressValue(value) {
    if (value == 100) {
        progress.style.width = `${value}%`;
        progress.textContent = `Completed!`;
        progress.classList.add("bg-success");
        progress.classList.remove("progress-bar-striped");
        //progress.style.backgroundColor = "green"; 
    } else {
        //delete progress.style.width;
        progress.style.width = `${value}%`;
        progress.textContent = `${value}%`;
        progress.classList.remove("bg-success");
        progress.classList.add("progress-bar-striped");
        //progress.style.backgroundColor = "blue"; 
    }

}

start.addEventListener('click', async () => {
    if (smartGraph)
        smartGraph.destroy();

    if (basicGraph)
        basicGraph.destroy();

    if (hitRate)
        hitRate.destroy();

    startSimulation(Number(document.querySelector('#avg-time-on').value),
        Number(document.querySelector('#avg-time-between').value),
        Number(document.querySelector('#num-tracks').value),
        Number(document.querySelector('#hobohp').value),
        Number(document.querySelector('#num-rounds').value));
})

startOptimal.addEventListener('click', () => {
    if (optimalGraph)
        optimalGraph.destroy();

    startOptimum(
        Number(document.querySelector('#num-tracks').value),
        Number(document.querySelector('#hobohp').value),
        Number(document.querySelector('#num-rounds').value), 5);
})

function startSimulation(avgTimeOnTrack, avgTimesBetween, numTracks, hobohp, numRounds) {
    let smartResults = new Game(60, avgTimeOnTrack, avgTimesBetween, numTracks, hobohp, numRounds).runSmart();
    let basicResults = new Game(60, avgTimeOnTrack, avgTimesBetween, numTracks, hobohp, numRounds).runBasic();


    document.querySelector('#basic-score').innerHTML = `Basic Hobo Final Score: ${basicResults.score}`;
    document.querySelector('#smart-score').innerHTML = `Smart Hobo Final Score: ${smartResults.score}`;
    document.querySelector('#smart-avg-time-on').innerHTML = `Computed Average Time On Track: ${smartResults.computedAvgTimeOnTrack}`;
    document.querySelector('#smart-avg-time-between').innerHTML = `Computed Average Time Between: ${smartResults.computedAvgTimesBetween}`;


    let smartTrainPos = [];
    let basicTrainPos = [];

    for (let i = 0; i < smartResults.trackPos.length; i++) {
        for (let j = 0; j < smartResults.trackPos[i].length; j++) {
            if (!smartTrainPos[j])
                smartTrainPos.push([]);

            if (smartResults.trackPos[i][j].y == 1)
                smartTrainPos[j].push({ x: smartResults.trackPos[i][j].x, y: j + 1 });
        }
    }

    for (let i = 0; i < basicResults.trackPos.length; i++) {
        for (let j = 0; j < basicResults.trackPos[i].length; j++) {
            if (!basicTrainPos[j])
                basicTrainPos.push([]);

            if (basicResults.trackPos[i][j].y == 1)
                basicTrainPos[j].push({ x: basicResults.trackPos[i][j].x, y: j + 1 });
        }
    }


    basicGraph = new Chart(bctx, {
        type: "scatter",
        data: {
            datasets: [
                /*{
                    label: "Hits",
                    backgroundColor: 'rgb(255, 99, 132)',
                    data: smartResults.hits
                },*/
                {
                    label: "Basic Hobo Position",
                    backgroundColor: 'rgba(255, 179, 0, 0.7)',
                    data: basicResults.hoboPos.map((p) => ({ x: p.x, y: p.y + 1 })),
                    pointRadius: 7
                },
                ...basicTrainPos.map((tp, i) => ({
                    label: `Track ${i + 1}`,
                    backgroundColor: "#5b6d85",
                    data: tp,
                    pointRadius: 10
                })),
            ]
        },
        options: {
            legend: {
                padding: 10
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: numTracks + 1,
                        stepSize: 1
                    },
                    scaleLabel: {
                        labelString: "Train Tracks",
                        display: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        suggestedMax: Math.max(basicResults.score, smartResults.score) + 10,
                        stepSize: 1
                    },
                    scaleLabel: {
                        labelString: "Game Ticks",
                        display: true
                    }
                }]
            }
        }
    });

    hitRate = new Chart(document.querySelector('#hit'), {
        type: "line",
        data: {
            labels: [...Array(Math.max(basicResults.score, smartResults.score) + 10).keys()],
            datasets: [
                {
                    label: "Basic Hobo Hit Rate",
                    borderColor: 'rgb(255, 179, 0)',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    data: basicResults.hits,
                    pointRadius: 1,
                },
                {
                    label: "Smart Hobo Hit Rate",
                    borderColor: 'rgb(158, 255, 187)',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    data: smartResults.hits,
                    pointRadius: 1,
                },
            ]
        },
        options: {
            legend: {
                padding: 10
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: numTracks + 1,
                        stepSize: 1
                    },
                    scaleLabel: {
                        labelString: "Hit Rates",
                        display: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        suggestedMax: Math.max(basicResults.score, smartResults.score) + 10,
                        stepSize: 1
                    },
                    scaleLabel: {
                        labelString: "Game Ticks",
                        display: true
                    }
                }]
            }
        }
    })

    smartGraph = new Chart(sctx, {
        type: "scatter",
        data: {
            datasets: [
                /*{
                    label: "Hits",
                    backgroundColor: 'rgb(255, 99, 132)',
                    data: smartResults.hits
                },*/
                {
                    label: "Smart Hobo Position",
                    backgroundColor: 'rgba(158, 255, 187, 0.7)',
                    data: smartResults.hoboPos.map((p) => ({ x: p.x, y: p.y + 1 })),
                    pointRadius: 7
                },
                ...smartTrainPos.map((tp, i) => ({
                    label: `Track ${i + 1}`,
                    backgroundColor: "#5b6d85",
                    data: tp,
                    pointRadius: 10
                })),
            ]
        },
        options: {
            legend: {
                padding: 10
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: numTracks + 1,
                        stepSize: 1
                    },
                    scaleLabel: {
                        labelString: "Train Tracks",
                        display: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        suggestedMax: Math.max(basicResults.score, smartResults.score) + 10,
                        stepSize: 1
                    },
                    scaleLabel: {
                        labelString: "Game Ticks",
                        display: true
                    }
                }]
            }
        }
    });

}

async function startOptimum(numTracks, hobohp, numRounds, numAvgs) {
    let optimalResults = await findOptimum(numTracks, hobohp, numRounds, numAvgs);

    optimalGraph = new Chart(octx, {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "Basic Hobo Optimal",
                    backgroundColor: 'rgb(255, 179, 0)',
                    data: optimalResults.basic,
                    pointRadius: 7
                },
                {
                    label: "Smart Hobo Optimal",
                    backgroundColor: 'rgb(158, 255, 187)',
                    data: optimalResults.smart,
                    pointRadius: 7
                },
            ]
        },
        options: {
            legend: {
                padding: 10
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 11,
                        stepSize: 1
                    },
                    scaleLabel: {
                        labelString: "Average Time Between Trains",
                        display: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 11,
                        stepSize: 1
                    },
                    scaleLabel: {
                        labelString: "Average Time On Tracks",
                        display: true
                    }
                }]
            }
        }
    });
}

//generates a matrix of optimal values for basic and smart algorithms
async function findOptimum(numTracks, hobohp, numRounds, numAvgs) {
    return await new Promise((res, rej) => {
        let basicOptimal = [];
        let smartOptimal = [];
        let total = 10 * 10
        let current = 0;

        let startID;

        let vals = [];
        for (let x = 1; x <= 10; x++) {
            for (let y = 1; y <= 10; y++) {
                vals.push({ x: x, y: y });
            }
        }

        function compute() {
            if (current == total) {
                window.cancelAnimationFrame(startID);
                res({
                    basic: basicOptimal,
                    smart: smartOptimal
                });
                return;
            }

            setProgressValue(current + 1);
            let cv = vals[current];
            if (cv) {
                current++;

                let smartScore = computeSmartAvgScore(cv.x, cv.y, numTracks, hobohp, numRounds, numAvgs);
                let basicScore = computeBasicAvgScore(cv.x, cv.y, numTracks, hobohp, numRounds, numAvgs);

                if (smartScore.score >= basicScore.score) {
                    smartOptimal.push({ x: cv.x, y: cv.y });
                } else {
                    basicOptimal.push({ x: cv.x, y: cv.y });
                }
            }
            window.requestAnimationFrame(compute)
        }

        startID = window.requestAnimationFrame(compute)

    });
}

function computeSmartAvgScore(avgTimeOnTrack, avgTimesBetween, numTracks, hobohp, numRounds, numAvgs) {
    let totalAvgs = [];
    for (let i = 0; i < numAvgs; i++) {
        let game = new Game(60, avgTimeOnTrack, avgTimesBetween, numTracks, hobohp, numRounds);
        totalAvgs.push(game.runSmart());
    }

    totalAvgs = totalAvgs.reduce((a, c) => ({
        computedAvgTimeOnTrack: a.computedAvgTimeOnTrack + c.computedAvgTimeOnTrack,
        computedAvgTimesBetween: a.computedAvgTimesBetween + c.computedAvgTimesBetween,
        score: a.score + c.score
    }),
        { computedAvgTimeOnTrack: 0, computedAvgTimesBetween: 0, score: 0 });
    totalAvgs.computedAvgTimeOnTrack /= numAvgs;
    totalAvgs.computedAvgTimesBetween /= numAvgs;
    totalAvgs.score /= numAvgs;
    return totalAvgs
}

function computeBasicAvgScore(avgTimeOnTrack, avgTimesBetween, numTracks, hobohp, numRounds, numAvgs) {
    let totalAvgs = [];
    for (let i = 0; i < numAvgs; i++) {
        let game = new Game(60, avgTimeOnTrack, avgTimesBetween, numTracks, hobohp, numRounds);
        totalAvgs.push(game.runBasic());
    }

    totalAvgs = totalAvgs.reduce((a, c) => ({
        computedAvgTimeOnTrack: a.computedAvgTimeOnTrack + c.computedAvgTimeOnTrack,
        computedAvgTimesBetween: a.computedAvgTimesBetween + c.computedAvgTimesBetween,
        score: a.score + c.score
    }),
        { computedAvgTimeOnTrack: 0, computedAvgTimesBetween: 0, score: 0 });
    totalAvgs.computedAvgTimeOnTrack /= numAvgs;
    totalAvgs.computedAvgTimesBetween /= numAvgs;
    totalAvgs.score /= numAvgs;
    return totalAvgs
}

/* MULTIPLE AVERAGE
let totalAvgs = [];
let numAvgs = 10;
for(let i = 0; i < numAvgs; i++) {
    console.log(`${i}/${numAvgs}`);
    let game = new Game(60, 2, 2, 5);
    totalAvgs.push(game.runSmart());
}
console.log(totalAvgs);

totalAvgs = totalAvgs.reduce((a, c) => ({
    computedAvgTimeOnTrack: a.computedAvgTimeOnTrack+c.computedAvgTimeOnTrack,
    computedAvgTimesBetween: a.computedAvgTimesBetween+c.computedAvgTimesBetween,
    score: a.score+c.score}),
    {computedAvgTimeOnTrack: 0, computedAvgTimesBetween:0, score:0});
totalAvgs.computedAvgTimeOnTrack/=numAvgs;
totalAvgs.computedAvgTimesBetween/=numAvgs;
totalAvgs.score/=numAvgs;
console.log(totalAvgs);
*/

