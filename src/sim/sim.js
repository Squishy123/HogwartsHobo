const TIME_STEP = 60;

function poiss(lambda, k) {
    return Math.pow(Math.E, -lambda) * (Math.pow(lambda, k) / fact(k))
}

function fact(x) {
    if (x <= 0) {
        return 1;
    }

    return x * fact(x - 1);
}

function randInt(x) {
    return Math.floor(Math.random() * Math.floor(x))
}

function weightedRand(dist) {
    let sum = 0;
    let r = Math.random();
    let rand = 0;

    for (let i = 0; i < Object.keys(dist).length; i++) {
        sum+=dist[Object.keys(dist)[i]];
        if(r <= sum) { 
            rand = Object.keys(dist)[i];
            break;
        }
    }

    return rand;
}

//Main entry for sim goes here
function sim(avgTimeBetweenTrains, avgTimeOnTracks, runtime) {
    let lambda = avgTrains = TIME_STEP / (avgTimeBetweenTrains + avgTimeOnTracks);
    let dist = {}

    //generate distribution curve
    for (let i = 0; i < 1000; i++) {
        let p = poiss(lambda, i);
        if (!p || (dist[0] && p < dist[0]))
            break;
        dist[i] = poiss(lambda, i);
    }

    for(let i = 0; i < runtime; i+=TIME_STEP) {
        let numEvents = weightedRand(dist);
        console.log(numEvents);
    }
}

class Hobo {
    constructor(hp, initialPos) {
        this.hp = hp;
        this.pos = initialPos;
        this.info = [];
    }

    getInfo(trackInfo) {
        this.info.push(trackInfo);
        if (this.info.length > 2)
            this.info.pop(0);
    }

    jump(pos) {
        this.pos = pos;
    }

    act() {
        //basic -> find an empty track jump to it
        this.info[0].forEach((e, i) => {
            if (e == 0) {
                this.jump(i);
            }
        });
    }
}

function genPoissDist(lambda) {
    let dist = {}
    for (let i = 0; i < 1000; i++) {
        let p = poiss(lambda, i);
        if (!p || (dist[0] && p < dist[0]))
            break;
        dist[i] = poiss(lambda, i);
    }

    return dist;
}

class Game {
    constructor(avgTimeBetweenTrains, avgTimeOnTracks, numTracks) {
        this.avgTimeBetweenTrains = avgTimeBetweenTrains;
        this.avgTimeOnTracks = avgTimeOnTracks;
        this.numTracks = numTracks;
        //generate all the stuff
        this.dist = genPoissDist(TIME_STEP / (avgTimeBetweenTrains + avgTimeOnTracks));
        console.log("GENERATED DISTRIBUTION CURVE");

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
            let numEvents = weightedRand(this.dist);
            console.log("GENERATING TRAINS")
        }  

        //console.log(numEvents);
        console.log("TICK " + this.loopCount)
    }
}

let game = new Game(5, 4, 4);
game.start();

