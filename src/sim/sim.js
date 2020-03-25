import { genPoissDist, weightedRand } from "./helper";
import chalk from "chalk";
import Track from "./track";
import {Hobo, SmartHobo} from "./hobo";

class Game {
    constructor(timeStep, avgTimeOnTrack, avgTimeBetween, numTracks) {
        //props
        this.timeStep = timeStep;
        this.avgTimeOnTrack = avgTimeOnTrack;
        this.avgTimeBetween = avgTimeBetween;

        //generate distributions
        this.spawnDist = genPoissDist(timeStep / (avgTimeOnTrack + avgTimeBetween)); //number of events within the time step
        this.timeOnTrackDist = genPoissDist(avgTimeOnTrack); //train duration on track
        this.timeBetweenDist = genPoissDist(avgTimeBetween); //duration before train spawning

        //create tracks
        this.tracks = Array.from(Array(numTracks), () => new Track(this.timeOnTrackDist, this.timeBetweenDist));
    }

    start() {
        //console.log("STARTING SIMULATION");
        this.loopCount = 0;
        this.loopLimit = 10000;
        this.loop = setInterval(this.main.bind(this), 100);
    }

    stop() {
        clearInterval(this.loop);
    }

    spawnNext() {
        this.tracks.forEach(t => t.generateTrains(weightedRand(this.spawnDist)))//
    }

    //get a snapshot of track data
    getInfo(index) {
        return this.tracks.map(t => t.history[index])
    }

    //run in real-time
    main() {
        if (this.loopCount > this.loopLimit) {
            this.stop();
        } else {
            this.loopCount++;
        }

        //spawn stuff for the next step
        if (this.loopCount % this.timeStep == 0) {
            //console.log("GENERATING TRAINS")
            this.spawnNext();
        }

        ////console.log(numEvents);
        //console.log("TICK " + this.loopCount)
    }

    //run in preloaded chunks
    runSmart() {
        let hobo = new SmartHobo(1000, 0);
        let score = 1;
        this.spawnNext();
        for (let i = 1; i < 10000; i++,score++) {
            //console.log(chalk.blue("ROUND " + i))
            //console.log("TRACK STATUS")
            //console.log(this.getInfo(i-1));
            //console.log(this.getInfo(i));
            //console.log("=========")
            if (this.getInfo(i)[hobo.pos] == 1) {
                hobo.hp--;
                //console.log(chalk.red("HIT HP: " + hobo.hp));
                if (hobo.hp == 0)
                    break;
            }
            hobo.act(this.getInfo(i-1));
            this.spawnNext();
        }

        //console.log("FINAL SCORE " + score);
        let computedAvgTimeOnTrack = 0;
        for(let i = 0; i < hobo.avgTimesOnTracks.length; i++) {
            computedAvgTimeOnTrack+=hobo.avgTimesOnTracks[i]/hobo.avgTimesOnTracksTot[i];
        }
        computedAvgTimeOnTrack/=hobo.avgTimesOnTracks.length;
      
        let computedAvgTimesBetween = 0;
        for(let i = 0; i < hobo.avgTimesBetween.length; i++) {
            computedAvgTimesBetween+=hobo.avgTimesBetween[i]/hobo.avgTimesBetweenTot[i];
        }
        computedAvgTimesBetween/=hobo.avgTimesBetween.length;

        return [computedAvgTimeOnTrack, computedAvgTimesBetween];
    }

    runBasic() {
        let hobo = new Hobo(20, 0);
        let score = 1;
        this.spawnNext();
        for (let i = 1; i < 1000; i++,score++) {
            //console.log(chalk.blue("ROUND " + i))
            //console.log("TRACK STATUS")
            //console.log(this.getInfo(i-1));
            //console.log(this.getInfo(i));
            //console.log("=========")
            if (this.getInfo(i)[hobo.pos] == 1) {
                hobo.hp--;
                //console.log(chalk.red("HIT HP: " + hobo.hp));
                if (hobo.hp == 0)
                    break;
            }
            hobo.act(this.getInfo(i-1));
            this.spawnNext();
        }

        //console.log("FINAL SCORE " + score);
    }
}

let totalAvgs = [];
let numAvgs = 10;
for(let i = 0; i < numAvgs; i++) {
    console.log(`${i}/${numAvgs}`);
    let game = new Game(60, 5, 3, 5);
    totalAvgs.push(game.runSmart());
}
////console.log(totalAvgs);

totalAvgs = totalAvgs.reduce((a, c) => [a[0]+c[0], a[1]+c[1]], [0, 0]);
totalAvgs[0]/=numAvgs;
totalAvgs[1]/=numAvgs;
console.log(totalAvgs);


