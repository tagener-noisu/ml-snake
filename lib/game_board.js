class GameBoard {
    constructor(size) {
        this.size = size;
    }

    cell(pos) {
        if (pos.x() > this.size.x() || pos.y() > this.size.y())
            return "out of bound";

        return "empty";
    }
}

module.exports = GameBoard
