import { genPoissDist, weightedRand } from "./helper";
import Track from "./track";
import { Hobo, SmartHobo } from "./hobo";

export default class Game {
    constructor(timeStep, avgTimeOnTrack, avgTimeBetween, numTracks, hoboHP, numRounds) {
        //props
        this.timeStep = timeStep;
        this.avgTimeOnTrack = avgTimeOnTrack;
        this.avgTimeBetween = avgTimeBetween;
        this.hoboHP = hoboHP;
        this.numRounds = numRounds;

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
        let hoboPos = [];
        let trackPos = [];
        let hits = [];
        let totalHits = 0;

        this.hobo = new SmartHobo(this.hoboHP, 0);
        let score = 1;
        this.spawnNext();
        for (let i = 1; i < this.numRounds; i++, score++) {
            trackPos.push(this.getInfo(i).map((val) => ({ x: i, y: val })))
            if (this.getInfo(i)[this.hobo.pos] == 1) {
                totalHits++;
                this.hobo.hp--;
                if (this.hobo.hp == 0)
                    break;
            }
            if (totalHits / i != 1)
                hits.push({ x: i, y: (totalHits) / i });
            this.hobo.act(this.getInfo(i - 1));
            hoboPos.push({ x: i, y: this.hobo.pos });
            this.spawnNext();
        }

        let computedAvgTimeOnTrack = 0;
        for (let i = 0; i < this.hobo.avgTimesOnTracks.length; i++) {
            computedAvgTimeOnTrack += this.hobo.avgTimesOnTracks[i] / this.hobo.avgTimesOnTracksTot[i];
        }
        computedAvgTimeOnTrack /= this.hobo.avgTimesOnTracks.length;

        let computedAvgTimesBetween = 0;
        for (let i = 0; i < this.hobo.avgTimesBetween.length; i++) {
            computedAvgTimesBetween += this.hobo.avgTimesBetween[i] / this.hobo.avgTimesBetweenTot[i];
        }
        computedAvgTimesBetween /= this.hobo.avgTimesBetween.length;

        return {
            computedAvgTimeOnTrack: computedAvgTimeOnTrack,
            computedAvgTimesBetween: computedAvgTimesBetween,
            score: score,
            hoboPos: hoboPos,
            trackPos: trackPos,
            hits: hits
        };
    }

    runBasic() {
        let hoboPos = [];
        let trackPos = [];
        let hits = [];
        let totalHits = 0;

        this.hobo = new Hobo(this.hoboHP, 0);
        let score = 1;
        this.spawnNext();
        for (let i = 1; i < this.numRounds; i++, score++) {
            trackPos.push(this.getInfo(i).map((val) => ({ x: i, y: val })))
            if (this.getInfo(i)[this.hobo.pos] == 1) {
                totalHits++;
                this.hobo.hp--;
                if (this.hobo.hp == 0)
                    break;
            }
            if (totalHits / i != 1)
                hits.push({ x: i, y: (totalHits) / i });
            this.hobo.act(this.getInfo(i - 1));
            hoboPos.push({ x: i, y: this.hobo.pos });
            this.spawnNext();
        }

        return {
            score: score,
            hoboPos: hoboPos,
            trackPos: trackPos,
            hits: hits
        };
    }
}


let b = new SmartHobo(100, 0);

