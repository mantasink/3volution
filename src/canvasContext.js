const RUN_SPEED = 100
export class CanvasContext {

    constructor(ctx, canvasContext) {
        this.ctx = ctx
        this.canvasContext = canvasContext
    }

    drawItem(item) {
        this.canvasContext.beginPath()
        this.canvasContext.arc(item.x, item.y, item.size, 0, Math.PI * 2, true)
        this.canvasContext.closePath()
        this.canvasContext.fillStyle = item.color
        this.canvasContext.fill()
    }

    drawCreature(creature) {
        this.drawItem(creature)
        this.canvasContext.beginPath()
        this.canvasContext.font = "10px";
        this.canvasContext.fillText(creature.claws, creature.x + creature.size, creature.y);
        this.canvasContext.fillText(creature.shell, creature.x + creature.size, creature.y + 10);
    }

    redraw() {
        this.canvasContext.clearRect(0, 0, canvas.width, canvas.height)
        stats.innerHTML = ""

        this.ctx.geneticContext.creatures.forEach(creature => {
            this.drawCreature(creature)
            stats.innerHTML += `<p>${creature.toString()} </p>`
        })

        this.ctx.geneticContext.finishedCreatures.forEach(creature => {
            if (!creature) {
                console.log('Error: ' + this.ctx.geneticContext.finishedCreatures)
            }
            stats.innerHTML += `<p class="dead">${creature.toString()} </p>`
        })

        this.ctx.geneticContext.food.forEach(snack => {
            this.drawItem(snack)
        })
    }

}