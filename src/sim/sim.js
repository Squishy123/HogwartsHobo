const TIME_STEP = 60;

class Game {
    constructor(avgTimeBetweenTrains, avgTimeOnTracks, numTracks) {
        this.avgTimeBetweenTrains = avgTimeBetweenTrains;
        this.avgTimeOnTracks = avgTimeOnTracks;
        this.numTracks = numTracks;

        //generate all the stuff
        this.dist = genPoissDist(TIME_STEP / (avgTimeBetweenTrains + avgTimeOnTracks));
        console.log(this.dist);

        //generate all the track spawn dists
        this.trackDist = {};
        Object.keys(this.dist).forEach(k => {
            this.trackDist[k] = genPoissDist(k);
        });
        console.log(this.trackDist);

        this.loopCount = 0;
        this.loopLimit = 10000;
    }

    start() {
        console.log("STARTING SIMULATION");
        this.loop = setInterval(this.main.bind(this), 100);
    }

    stop() {
        clearInterval(this.loop);
    }

    main() {
        if (this.loopCount > this.loopLimit) {
            this.stop();
        } else {
            this.loopCount++;
        }

        if(this.loopCount % TIME_STEP == 0) {
           
        }  

        //console.log(numEvents);
        console.log("TICK " + this.loopCount)
    }
}

//let game = new Game(5, 3, 4);
//game.start();

