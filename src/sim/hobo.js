import chalk from "chalk";

export default class Hobo {
    constructor(hp, initialPos) {
        this.hp = hp;
        this.pos = initialPos;
        this.info = [];
    }

    getInfo(trackInfo) {
        this.info.push(trackInfo);
        if (this.info.length > 2)
            this.info.shift();
    }

    jump(pos) {
        console.log(chalk.magenta("JUMPING TO " + pos))
        this.pos = pos;
    }

    act() {
        console.log(chalk.yellow("CURRENT POS " + this.pos));
        console.log(chalk.yellow("CURRENT HP " + this.hp))
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