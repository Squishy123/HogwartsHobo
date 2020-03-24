import { genPoissDist, weightedRand } from "./helper";
import chalk from "chalk";
import Track from "./track";
import Hobo from "./hobo";

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
        console.log("STARTING SIMULATION");
        this.loopCount = 0;
        this.loopLimit = 10000;
        this.loop = setInterval(this.main.bind(this), 100);
    }

    stop() {
        clearInterval(this.loop);
    }

    spawnNext() {
        this.tracks.forEach(t => t.generateTrains(5))//weightedRand(this.spawnDist)))
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
            console.log("GENERATING TRAINS")
            this.spawnNext();
        }

        //console.log(numEvents);
        console.log("TICK " + this.loopCount)
    }

    //run in preloaded chunks
    run() {
        let hobo = new Hobo(10, 0);
        let score = 0;
        this.spawnNext();
        for (let i = 1; i < 1000; i++) {
            console.log(chalk.blue("ROUND " + i))
            console.log(this.getInfo(i));
            if (this.getInfo(i)[hobo.pos] == 1) {
                hobo.hp--;
                console.log(chalk.red("HIT HP: " + hobo.hp));
                if (hobo.hp == 0)
                    break;
            }
            hobo.getInfo(this.getInfo(i-1));
            console.log(hobo.info);
            hobo.act();
            this.spawnNext();
            score++;
        }

        console.log("FINAL SCORE " + score);
    }
}

let game = new Game(60, 6, 5, 2);
game.run();

