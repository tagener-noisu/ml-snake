class CanvasRender {
    constructor(context, field_size, scale) {
        this.context = context;
        this.width = field_size.x();
        this.height = field_size.y();
        this.scale = scale;
    }

    fill(pos) {
        const x = pos.x() * this.scale;
        const y = pos.y() * this.scale;

        this.context.fillRect(x, y, this.scale, this.scale);
    }

    update() {
        this.context.clearRect(
            0, 0, this.width * this.scale, this.height * this.scale);
    }
}

module.exports = CanvasRender
