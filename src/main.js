//entry point for the project
import Chart from 'chart.js';
import Game from './sim/sim';

let ctx = document.querySelector('#graph');

let game = new Game(60, 3, 5, 10);
let results = game.runSmart();

let graph = new Chart(ctx, {
    type: "scatter",
    data: {
        datasets: [
            {
                label: "Hits",
                backgroundColor: 'rgb(255, 99, 132)',
                data: results.hits
            },
            {
                label: "Hobo Position",
                backgroundColor: 'blue',
                data: results.hoboPos
            },
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }]
        }
    }
});

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

