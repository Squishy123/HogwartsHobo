//poisson function
export function poiss(lambda, k) {
    return Math.pow(Math.E, -lambda) * (Math.pow(lambda, k) / fact(k))
}

//factorial function
export function fact(x) {
    if (x <= 0) {
        return 1;
    }

    return x * fact(x - 1);
}

//generate a randint from 0 to x
export function randInt(x) {
    return Math.floor(Math.random() * Math.floor(x))
}

//generate a random number from a weighted distribution
export function weightedRand(dist) {
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

//generate a distribution curve given lambda
export function genPoissDist(lambda) {
    let dist = {}
    for (let i = 0; i < 1000; i++) {
        let p = poiss(lambda, i);
        if (!p || (dist[0] && p < dist[0]))
            break;
        dist[i] = poiss(lambda, i);
    }

    return dist;
}
