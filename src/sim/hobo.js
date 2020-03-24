export default class Hobo {
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