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
        console.log(this.info);
    }

    jump(pos) {
        console.log("JUMPING TO " + pos)
        this.pos = pos;
    }

    act() {
        console.log("CURRENT POS " + this.pos);
        console.log("CURRENT HP " + this.hp)
        //basic -> find an empty track jump to it
        if (this.info && this.info[0])
            this.info[0].forEach((e, i) => {
                if (e == 0) {
                    this.jump(i);
                }
            });
    }
}