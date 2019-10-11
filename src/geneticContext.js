import { Food } from './entity/Food.js'
import { Creature } from './entity/Creature.js'
import { rnd, collision, average } from './utils.js'
import { crossover } from './geneticUtils.js'

const MIN_INIT_SPEED = 1
const MAX_INIT_SPEED = 5

const MIN_INIT_SIZE = 5
const MAX_INIT_SIZE = 10

const MIN_INIT_CLAWS = 1
const MAX_INIT_CLAWS = 2

const MIN_INIT_SHELL = 2
const MAX_INIT_SHELL = 3

const MIN_INIT_FOOD_SIZE = 15
const MAX_INIT_FOOD_SIZE = 20

const FOOD_ENERGY_MULTIPLIER = 10000

export class GeneticContext {

    constructor(ctx) {
        this.ctx = ctx

        this.MAX_CREATURES = 20
        this.MAX_FOOD = 40
        this.YEARS_TO_RUN = 1000

        this.year = 0
        this.processSpeed = 1
        this.creatures = []
        this.finishedCreatures = []
        this.food = []
    }

    run() {
        // speed up the process
        if (this.processSpeed > 1) {
            for (let i = 0; i < this.processSpeed; i++) {
                this.process()
            }
        }

        this.process()
        this.ctx.canvasContext.redraw()

        if (this.creatures.length === 0) {
            this.reinitalize()

            this.year++;
            if (this.year >= this.YEARS_TO_RUN) {
                return // stop
            }
        }
    }

    process() {
        this.creatures.forEach((creature, index) => {
            if (creature.energyCapacity / creature.movementCost < 100) { // so that creatures living few seconds won't dominate
                this.killCreature(index)
            }

            creature.processMovement()

            this.creatures.forEach(enemy => {
                const caught = collision(creature.x, creature.y, creature.size, enemy.x, enemy.y, enemy.size)
                const penetratedDefence = enemy.claws > creature.shell & enemy.shell > creature.shell
                const smallerClaws = enemy.claws > creature.claws
                const self = enemy.uid === creature.uid

                if (caught && penetratedDefence && smallerClaws && !self) {
                    console.log(`killed ${creature.uid} ${creature.getChromosome()} by ${enemy.uid} ${enemy.getChromosome()}`)
                    this.killCreature(index)
                    enemy.addEnergy(creature.energyCapacity)
                }
            })

            this.food.forEach((snack, findex) => {
                if (collision(creature.x, creature.y, creature.size, snack.x, snack.y, snack.size)) {
                    creature.addEnergy(Math.round(Math.pow(snack.size, 2) * Math.PI) * FOOD_ENERGY_MULTIPLIER)
                    this.food.splice(findex, 1)
                }
            })

            if (this.food.length === 0) {
                this.creatures.forEach(c => c.energy = 0)
            }

            if (creature.energy <= 0) {
                this.killCreature(index)
            }
        })
    }

    reinitalize() {
        this.finishedCreatures.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0))
        this.udpateChart()
        this.finishedCreatures.forEach(c => c.reset())

        this.creatures = this.finishedCreatures.slice(0, this.MAX_CREATURES / 2)
        this.finishedCreatures = []

        let matingPool = [...this.creatures]

        matingPool.forEach(creature => {
            const mateIndex = rnd(0, matingPool.length)
            const children = crossover(creature, matingPool[mateIndex])

            const sonDNA = children[0]
            const daughterDNA = children[1]

            const sonCreature = new Creature(rnd(0, canvas.height), rnd(0, canvas.width), sonDNA[0], sonDNA[1], sonDNA[2], sonDNA[3])
            sonCreature.generation = creature.generation + 1

            const daugterCreature = new Creature(rnd(0, canvas.height), rnd(0, canvas.width), daughterDNA[0], daughterDNA[1], daughterDNA[2], daughterDNA[3])
            daugterCreature.generation = creature.generation + 1

            this.creatures.push(sonCreature)
            this.creatures.push(daugterCreature)

            matingPool.splice(mateIndex, 1)
        })

        while (this.creatures.length < this.MAX_CREATURES) {
            this.addCreature()
        }

        this.food = []
        for (let i = 0; i < this.MAX_FOOD; i++) {
            this.addFood()
        }
    }

    addCreature() {
        const speed = rnd(MIN_INIT_SPEED, MAX_INIT_SPEED)
        const size = rnd(MIN_INIT_SIZE, MAX_INIT_SIZE)
        const claws = rnd(MIN_INIT_CLAWS, MAX_INIT_CLAWS)
        const shell = rnd(MIN_INIT_SHELL, MAX_INIT_SHELL)

        this.creatures.push(new Creature(rnd(0, canvas.height), rnd(0, canvas.width), size, speed, claws, shell))
    }

    addFood() {
        const x = rnd(0, canvas.width)
        const y = rnd(0, canvas.height)
        const size = rnd(MIN_INIT_FOOD_SIZE, MAX_INIT_FOOD_SIZE)

        this.food.push(new Food(x, y, size))
    }

    killCreature(index) {
        if (!this.creatures[index]) {
            console.log('killCreature fail ' + this.creatures.length + ' ' + this.creatures.index)
            return
        }
        this.finishedCreatures.push(this.creatures[index])
        this.finishedCreatures.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0))
        this.creatures.splice(index, 1)
    }

    udpateChart() {
        const topCreatures = this.finishedCreatures.slice(0, this.MAX_CREATURES / 3)

        this.ctx.dnaChartContext.years.push(this.year)
        this.ctx.dnaChartContext.speeds.push(average(topCreatures, 'speed'))
        this.ctx.dnaChartContext.sizes.push(average(topCreatures, 'size'))
        this.ctx.dnaChartContext.claws.push(average(topCreatures, 'claws'))
        this.ctx.dnaChartContext.shells.push(average(topCreatures, 'shell'))

        this.ctx.dnaChartContext.update()
    }
}