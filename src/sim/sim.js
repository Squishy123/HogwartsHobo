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

//Main entry for sim goes here
function sim(avgTimeBetweenTrains, avgTimeOnTracks) {
    let lambda = avgTrains = TIME_STEP / (avgTimeBetweenTrains + avgTimeOnTracks);
    let dist = {}

    for (let i = 0; i < 1000; i++) {
        let p = poiss(lambda, i);
        if (!p || (dist[0] && p < dist[0]))
            break;
        dist[i] = poiss(lambda, i);
    }

    console.log(dist);
}

sim(5, 4);