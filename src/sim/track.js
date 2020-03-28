import { weightedRand, genPoissDist } from "./helper";

function build(val, arr, start, end) {
    let a = new Array(arr);
    for(let i = start; i < end; i++) {
        if(a[i])
            a.push(val);
        else    
            a[i] = val;
    }
    return a;
}

export default class Track {
    //create a new track storing the distribution curve for 
    //train time on track and time between each train
    constructor(timeOnTrackDist, timeBetweenDist) {
        this.history = [];
        this.recent = [];
        this.state = 0;

        this.timeOnTrackDist = timeOnTrackDist;
        this.timeBetweenDist = timeBetweenDist;
    }

    //Generate the track history for an additional timestep into the future
    generateTrains(numTrains) {
        let generated = [];
        for (let i = 0; i < numTrains; i++) {
            let timeOnTrack = weightedRand(this.timeOnTrackDist);
            let timeBetween = weightedRand(this.timeBetweenDist);

            let stretch = [].concat(Array.from(Array(timeOnTrack), () => 1), Array.from(Array(timeBetween), () => 0))
            generated = generated.concat(stretch);
        }
        this.history = this.history.concat(generated);
        this.recent = generated;
        return generated;
    }
}
