import { poiss, fact, randInt, genPoissDist, weightedRand } from "../../src/sim/helper";
import { Hobo } from "../../src/sim/hobo"
import { Game } from "../../src/sim/sim"
test('1', () => {
    expect(1).toBe(1);
  });
//console.log(poiss(.1, 7))


  
function round(val, decimals){
    //Parse the value as a float value
    val = parseFloat(val);
    //Format the value w/ the specified number
    //of decimal places and return it.
    return val.toFixed(decimals);
}


//test('Correct calucation of poisson values from lamba 0.1 - 1 and k = 0-9', () => {
    let answerKey = [
        [0.9048, 0.8187, 0.7408, 0.6703, 0.6065, 0.5488, 0.4966, 0.4493, 0.4066, 0.3679],
        [0.0905, 0.1637, 0.2222, 0.2681, 0.3033, 0.3293, 0.3476, 0.3595, 0.3659, 0.3679],
        [0.0045, 0.0164, 0.0333, 0.0536, 0.0758, 0.0988, 0.1217, 0.1438, 0.1647, 0.1839],
        [0.0002, 0.0011, 0.0033, 0.0072, 0.0126, 0.0198, 0.0284, 0.0383, 0.0494, 0.0613],
        [0, 0.0001, 0.0003, 0.0007, 0.0016, 0.003, 0.005, 0.0077, 0.0111, 0.0153],
        [0, 0, 0, 0.0001, 0.0002, 0.0004, 0.0007, 0.0012, 0.002, 0.0031],
        [0, 0, 0, 0, 0, 0, 0.0001, 0.0002, 0.0003, 0.0005],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0001],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    let count = 1
    for(let i = 0; i < answerKey.length; i++){ //k
        for (let j = 0; j < answerKey[0].length; j++){//lambda
            count++
            let k = j
            let l = (.1 * (i+1))
            let p = poiss(l, k)
            let rounded = Number(round(p, 4))
            //console.log(l + ", " + k + " = " + rounded)
            //expect(rounded).toBe(answerKey[j][i])
            test('poiss' + count, () => {
                expect(rounded).toBe(answerKey[j][i]);
              });
        }
    }
    //expect(true).toBe(true)
  //});

  test('factorial1', () => {
    expect(fact(1)).toBe(1);
  });

  test('factorial2', () => {
    expect(fact(2)).toBe(2);
  });

  test('factorial3', () => {
    expect(fact(3)).toBe(6);
  });

  test('factorial4', () => {
    expect(fact(4)).toBe(24);
  });


function inRange(n, lower, upper){
    if(n <= upper && n >= lower){
        return true
    }
    return false
}

  test('rand int range test', () => {
    let list = []
    for (let i = 0; i < 200; i++){
        list.push(randInt(10))
    }

    for (let i = 0; i < 200; i++){
        if (!inRange(list[i], 0, 10)){
            expect(false).toBe(true)
        }
    }
    expect(true).toBe(true);
  });

  test('poisson distribution length test 1', () => {
    let d = genPoissDist(5)
    let l = Object.keys(d).length
    expect(l).toBe(12);
  });

  test('poisson distribution length test 2', () => {
    let d = genPoissDist(100)
    let l = Object.keys(d).length
    expect(l).toBe(171);
  });


  test('weighted random test 1', () => {
    let d = {}
    let r = weightedRand(d)
    expect(r).toBe(0);
  });

  test('weighted random test 2', () => {
    let d = {1:.01, 2:.98, 3:.01}
    let found = false
    for(let i = 0; i < 100; i++){
        let r = weightedRand(d)
        if(r == 2){
            found = true
        }
    }
    expect(found).toBe(true);
  });

  test('Hobo test 1', () => {
    let h = new Hobo(10, 2)
    expect(h.hp).toBe(10)
    expect(h.pos).toBe(2)
  });

  test('Hobo jump', () => {
    let h = new Hobo(10, 2)
    h.jump(3)
    expect(h.pos).toBe(3)
  });

  test('track init', () => {
    let game = new Game(60, 5, 3, 3);
    expect(game.tracks.length).toBe(3)
});

test('Hobo guaranteed damage on single track', () => {
    let game = new Game(60, 5, 3, 1);
    game.runBasicCycles(50)
    expect(game.hobo.hp < 20).toBe(true)
});

test('Short term game run without crash', () => {
    let game = new Game(60, 5, 3, 3);
    game.runBasicCycles(100)
    expect(true).toBe(true)
});
