//entry point for the project
import Chart from 'chart.js';
import Game from './sim/sim';

let ctx = document.querySelector('#graph');
let start = document.querySelector('button');

let graph;

start.addEventListener('click', () => {
    if(graph)
        graph.destroy();

    startSimulation(Number(document.querySelector('#avg-time-on').value), 
    Number(document.querySelector('#avg-time-between').value), 
    Number(document.querySelector('#num-tracks').value));
})

function startSimulation(avgTimeOnTrack, avgTimesBetween, numTracks) {
    console.log(numTracks);
    let game = new Game(60, avgTimeOnTrack, avgTimesBetween, numTracks);
    let results = game.runSmart();

    let trainPos = [];

    for (let i = 0; i < results.trackPos.length; i++) {
        for (let j = 0; j < results.trackPos[i].length; j++) {
            if (!trainPos[j])
                trainPos.push([]);

            if (results.trackPos[i][j].y == 1)
                trainPos[j].push({ x: results.trackPos[i][j].x, y: j });
        }
    }

    console.log(trainPos);

    console.log(trainPos.map((tp, i) => ({
        label: `Track ${i}`,
        backgroundColor: "green",
        data: tp
    })))

    graph = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [
                /*{
                    label: "Hits",
                    backgroundColor: 'rgb(255, 99, 132)',
                    data: results.hits
                },*/
                {
                    label: "Hobo Position",
                    backgroundColor: 'rgba(245, 66, 164, 0.7)',
                    data: results.hoboPos,
                    pointRadius: 7
                },
                ...trainPos.map((tp, i) => ({
                    label: `Track ${i}`,
                    backgroundColor: "rgb(66, 245, 167)",
                    data: tp,
                    pointRadius: 10
                })),
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: numTracks,
                        stepSize: 1
                    }
                }]
            }
        }
    });
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

