import {weightedRand} from "./helper";

export default class Track {
    constructor(timestep, trackDist) {
        this.history = [];
        this.state = 0;

        this.timestep = timestep;
        this.trackDist = trackDist;
    }

    //Generate the track history for an additional timestep into the future
    generateTrains(numTrains) {
        let generated = [];
        for(let i = 0; i < numTrains; i++) {
            let spawnTime = weightedRand(numTrains)
        }
    }
}