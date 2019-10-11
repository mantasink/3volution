
import { rnd } from '../utils.js';
import { MapObject } from './MapObject.js';

const ENERGY_CAPACITY_MULTIPLIER = 10000

function getHsl(value) {
    let lightness = 100 - Math.round(value * 5)

    if (lightness < 20) {
        lightness = 20
    }

    return `hsl(200, 100%, ${lightness}%)`
}

export class Creature extends MapObject {
    constructor(x, y, size, speed, claws, shell) {
        super(x, y, size, getHsl(speed))

        this.uid = Math.random().toString(36).substr(2, 9)
        this.age = 0
        this.generation = 0

        this.score = 0
        this.energyCollected = 0
        this.energyCapacity = Math.pow(this.size, 2) * ENERGY_CAPACITY_MULTIPLIER
        this.energy = this.energyCapacity

        // DNA
        this.size = this.size
        this.speed = speed
        this.claws = claws
        this.shell = shell

        const powerCost = Math.round(Math.pow(this.claws, 2.5) + Math.pow(this.shell, 1.5)) + Math.pow(this.claws + this.shell, 2)
        this.movementCost = powerCost + Math.round(Math.pow(this.speed, 2) * Math.pow(this.size, 3) / 2 * 0.1) + 1

        // console.log(`energyCapacity ${this.energyCapacity} powerCost ${powerCost} movementCost ${this.movementCost}`)

        this.angle = 0
        this.offsideTicker = 0
    }

    newPos() {
        const newX = this.x + Math.round(this.speed * Math.sin(this.angle))
        const newY = this.y - Math.round(this.speed * Math.cos(this.angle))

        this.x = newX
        this.y = newY

        if (newX > canvas.width) {
            this.x = canvas.width
            this.angle += rnd(0, 45)
            this.offsideTicker++
        }

        if (newX < 0) {
            this.x = 0
            this.angle += rnd(0, 45)
            this.offsideTicker++
        }

        if (newY > canvas.height) {
            this.y = canvas.height
            this.angle += rnd(0, 45)
            this.offsideTicker++
        }

        if (newY < 0) {
            this.y = 0
            this.angle += rnd(0, 45)
            this.offsideTicker++
        }
    }

    reset() {
        this.x = rnd(0, canvas.height)
        this.y = rnd(0, canvas.width)
        this.age++
        this.score = 0
        this.energy = this.energyCapacity
        this.energyCollected = 0
        this.angle = rnd(0, 360)
    }

    addEnergy(energy) {
        this.score += energy
        this.energyCollected += energy

        const dEnergy = this.energy + energy
        this.energy = dEnergy > this.energyCapacity ? this.energyCapacity : dEnergy
    }

    consumeEnergy() {
        this.energy -= this.movementCost
    }

    processMovement() {
        this.consumeEnergy()

        if (this.energy < 1) {
            this.energy = 0
            return
        }

        if (rnd(0, 100) < 3) {
            this.angle += rnd(0, 30)
        }

        this.newPos()
    }

    getChromosome() {
        return [this.speed, this.size, this.claws, this.shell]
    }

    toString() {
        return `uid: ${this.uid}, score:${this.score}, e:${this.energy}, cost:${this.movementCost}, cap:${this.energyCapacity}, x,y:${this.x},${this.y}, age:${this.age}, gen: ${this.generation}, size:${this.size}, speed:${this.speed}, claws:${this.claws}, shell:${this.shell}`
    }
}