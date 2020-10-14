class CanvasRender {
    constructor(context, field_size, scale) {
        this.context = context;
        this.width = field_size.x();
        this.height = field_size.y();
        this.scale_factor = scale;
    }

    scale(coord) {
        return coord * this.scale_factor;
    }

    fill(pos) {
        const x = pos.x() * this.scale_factor;
        const y = pos.y() * this.scale_factor;

        this.context.fillRect(x, y, this.scale_factor, this.scale_factor);
    }

    line(from, to) {
        this.context.beginPath();
        this.context.moveTo(this.scale(from.x()) + 5, this.scale(from.y()) + 5);
        this.context.lineTo(this.scale(to.x()) + 5, this.scale(to.y()) + 5);
        this.context.stroke();
        this.context.closePath();
    }

    update() {
        this.context.clearRect(
            0, 0, this.scale(this.width), this.scale(this.height));
    }
}

module.exports = CanvasRender
