import chalk from "chalk";
import { poissSum } from "./helper";

export class Hobo {
    constructor(hp, initialPos) {
        this.hp = hp;
        this.pos = initialPos;
        this.info = [];
    }

    getInfo(trackInfo) {
        this.info.push(trackInfo);
        if (this.info.length > 2)
            this.info.shift();
        //console.log(this.info);
    }

    jump(pos) {
        //console.log(chalk.magenta("JUMPING TO " + pos))
        this.pos = pos;
    }

    act(info) {
        this.getInfo(info);
        //console.log(chalk.yellow("CURRENT POS " + this.pos));
        //console.log(chalk.yellow("CURRENT HP " + this.hp))
        //basic -> find an empty track jump to it
        if (this.info && this.info[1])
            for (let i = 0; i < this.info[1].length; i++) {
                if (this.info[1][i] == 0) {
                    this.jump(i);
                    break;
                }
            }
    }
}

export class SmartHobo {
    constructor(hp, initialPos) {
        this.hp = hp;
        this.pos = initialPos;
        this.info = [];

        this.expTimesOnTracks;
        this.avgTimesOnTracks;
        this.avgTimesOnTracksTot;

        this.expTimesBetween;
        this.avgTimesBetween;
        this.avgTimesBetweenTot;

        this.safety;
    }

    computeSafety() {
        //init
        if (!this.safety) {
            this.safety = Array.from(Array(this.info[0].length), () => 0);
        }

        if (this.info && this.info[1]) {
            for (let i = 0; i < this.safety.length; i++) {
                if (this.info[1][i] == 0) { //track is empty
                    if (this.avgTimesBetweenTot[i] == 0)
                        this.safety[i] = 0;
                    else
                        this.safety[i] = poissSum(this.expTimesBetween[i], this.avgTimesBetween[i] / this.avgTimesBetweenTot[i]);
                } else {
                    if (this.avgTimesOnTracksTot[i] == 0)
                        this.safety[i] = 1;
                    else
                        this.safety[i] = poissSum(this.expTimesOnTracks[i], this.avgTimesOnTracks[i] / this.avgTimesOnTracksTot[i]);
                }
            }
        }
    }

    getInfo(trackInfo) {
        this.info.push(trackInfo);
        if (this.info.length > 2) {
            this.info.shift();

            //init 
            if (!this.expTimesOnTracks) {
                this.expTimesOnTracks = Array.from(Array(trackInfo.length), () => 0);
            }

            if (!this.avgTimesOnTracks) {
                this.avgTimesOnTracks = Array.from(Array(trackInfo.length), () => 0);
            }

            if (!this.avgTimesOnTracksTot) {
                this.avgTimesOnTracksTot = Array.from(Array(trackInfo.length), () => 0);
            }

            if (!this.expTimesBetween) {
                this.expTimesBetween = Array.from(Array(trackInfo.length), () => 0);
            }

            if (!this.avgTimesBetween) {
                this.avgTimesBetween = Array.from(Array(trackInfo.length), () => 0);
            }

            if (!this.avgTimesBetweenTot) {
                this.avgTimesBetweenTot = Array.from(Array(trackInfo.length), () => 0);
            }


            //check if state changed
            for (let i = 0; i < this.info[0].length; i++) {
                //check if states changed
                if (this.info[0][i] != this.info[1][i]) {
                    //console.log("STATE CHANGE")
                    if (this.info[1][i] == 0) { //if 1 -> 0
                        this.avgTimesOnTracks[i] += this.expTimesOnTracks[i];
                        this.avgTimesOnTracksTot[i]++;
                        this.expTimesOnTracks[i] = 0;
                    } else { //if 0 -> 1
                        this.avgTimesBetween[i] += this.expTimesBetween[i];
                        this.avgTimesBetweenTot[i]++;
                        this.expTimesBetween[i] = 0;
                    }
                } else {
                    if (this.info[1][i] == 0) {
                        this.expTimesBetween[i]++;
                    } else {
                        this.expTimesOnTracks[i]++;
                    }
                }
            }
           // console.log("TIMES ON TRACKS")
            //console.log(this.expTimesOnTracks);
            ///console.log(this.avgTimesOnTracks);
            //console.log("TIMES BETWEEN")
            //console.log(this.expTimesBetween);
            //console.log(this.avgTimesBetween);
            this.computeSafety();
            //console.log("SAFETY")
            //console.log(this.safety);
        }
    }

    jump(pos) {
        console.log(chalk.magenta("JUMPING TO " + pos))
        this.pos = pos;
    }

    act(info) {
        this.getInfo(info);
        //console.log(chalk.yellow("CURRENT POS " + this.pos));
        //console.log(chalk.yellow("CURRENT HP " + this.hp))

        if (this.safety) {
            console.log("USING SAFETY FIRST");
            let max = this.safety[0];
            let maxIndex = 0;
            for (let i = 1; i < this.safety.length; i++) {
                if (this.safety[i] > max) {
                    max = this.safety[i];
                    maxIndex = i;
                }
            }

            this.jump(maxIndex);

        } else {
            //basic -> find an empty track jump to it
            if (this.info && this.info[1])
                for (let i = 0; i < this.info[1].length; i++) {
                    if (this.info[1][i] == 0) {
                        this.jump(i);
                        break;
                    }
                }
        }
    }
}