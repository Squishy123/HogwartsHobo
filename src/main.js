//entry point for the project
import Chart from 'chart.js';
import Game from './sim/sim';

let sctx = document.querySelector('#smart-graph');
let bctx = document.querySelector('#basic-graph');
let start = document.querySelector('button');

let smartGraph, basicGraph;

start.addEventListener('click', () => {
    if (smartGraph)
        smartGraph.destroy();

    if (basicGraph)
        basicGraph.destroy();

    startSimulation(Number(document.querySelector('#avg-time-on').value),
        Number(document.querySelector('#avg-time-between').value),
        Number(document.querySelector('#num-tracks').value),
        Number(document.querySelector('#hobohp').value),
        Number(document.querySelector('#num-rounds').value));
})

function startSimulation(avgTimeOnTrack, avgTimesBetween, numTracks, hobohp, numRounds) {
    console.log(numTracks);
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
                smartTrainPos[j].push({ x: smartResults.trackPos[i][j].x, y: j + 1});
        }
    }

    for (let i = 0; i < basicResults.trackPos.length; i++) {
        for (let j = 0; j < basicResults.trackPos[i].length; j++) {
            if (!basicTrainPos[j])
                basicTrainPos.push([]);

            if (basicResults.trackPos[i][j].y == 1)
                basicTrainPos[j].push({ x: basicResults.trackPos[i][j].x, y: j + 1});
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
                    data: basicResults.hoboPos.map((p) => ({x: p.x, y: p.y+1})),
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
                    }
                }],
                xAxes: [{
                    ticks: {
                        suggestedMax: Math.max(basicResults.score, smartResults.score) + 10,
                        stepSize: 1
                    }
                }]
            }
        }
    });

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
                    data: smartResults.hoboPos.map((p) => ({x: p.x, y: p.y+1})),
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
                    }
                }],
                xAxes: [{
                    ticks: {
                        suggestedMax: Math.max(basicResults.score, smartResults.score) + 10,
                        stepSize: 1
                    }
                }]
            }
        }
    });

}

async function findOptimum() {
    for(let x = 0; x < 10; x++) {
        for(let y = 0; y < 10; y++) {

        }
    }
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

