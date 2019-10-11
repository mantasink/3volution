import { ApplicationContext } from './applicationContext.js'
import { GeneticContext } from './geneticContext.js'
import { CanvasContext } from './canvasContext.js'
import { DnaChartContext } from './dnaChartContext.js'

import { getVal } from './utils.js'

const RUN_SPEED = 100

// html elements
const canvas = document.getElementById('canvas')
const canvasCtx = canvas.getContext('2d')
const runBtn = document.getElementById('runBtn')
const pauseBtn = document.getElementById('pauseBtn')
const forwardBtn = document.getElementById('forwardBtn')
const chartCtx = document.getElementById('myChart').getContext('2d')

const applicationContext = new ApplicationContext()
const geneticContext = new GeneticContext(applicationContext)
const canvasContext = new CanvasContext(applicationContext, canvasCtx)
const dnaChartContext = new DnaChartContext(chartCtx, [], [], [], [], [])

applicationContext.geneticContext = geneticContext
applicationContext.canvasContext = canvasContext
applicationContext.dnaChartContext = dnaChartContext

let paused = false

runBtn.addEventListener("click", () => {
    geneticContext.MAX_CREATURES = !getVal("creaturesInput") ? geneticContext.MAX_CREATURES : getVal("creaturesInput")
    geneticContext.MAX_FOOD = !getVal("foodInput") ? geneticContext.MAX_FOOD : getVal("foodInput")
    geneticContext.YEARS_TO_RUN = !getVal("yearsToRunInput") ? geneticContext.YEARS_TO_RUN : getVal("yearsToRunInput")

    initPopulation()
    run()

    runBtn.disabled = true
    pauseBtn.disabled = false
})

pauseBtn.addEventListener("click", () => {
    paused = !paused

    pauseBtn.innerText = paused ? 'Play' : 'Pause'
    if (!paused) {
        run()
    }
})

forwardBtn.addEventListener("click", () => {
    geneticContext.processSpeed = geneticContext.processSpeed === 1 ? RUN_SPEED : 1
})

function initPopulation() {
    for (let i = 0; i < geneticContext.MAX_CREATURES; i++) {
        geneticContext.addCreature()
    }

    for (let i = 0; i < geneticContext.MAX_FOOD; i++) {
        geneticContext.addFood()
    }
}

function run() {
    if (paused) {
        return
    }

    geneticContext.run()
    window.requestAnimationFrame(run)
}