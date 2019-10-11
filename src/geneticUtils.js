import { rnd } from './utils.js'

const MUTATION_CHANCE = 15

export function mutate(chrmosome) {
    const length = chrmosome.length
    const mutatedChromosome = rnd(0, length)

    const newValue = rnd(0, 2) ? chrmosome[mutatedChromosome] + 2 : chrmosome[mutatedChromosome] - 2

    if (newValue > 0) {
        chrmosome[mutatedChromosome] = newValue
    }

    return chrmosome
}

export function crossover(mother, father) {
    const length = mother.getChromosome().length
    const crossoverPoint = rnd(1, length - 1)

    let sonDNA = [...father.getChromosome().slice(0, crossoverPoint), ...mother.getChromosome().slice(crossoverPoint, length)]
    let daughterDNA = [...mother.getChromosome().slice(0, crossoverPoint), ...father.getChromosome().slice(crossoverPoint, length)]

    if (rnd(0, 100) < MUTATION_CHANCE) {
        sonDNA = mutate(sonDNA)
    }

    if (rnd(0, 100) < MUTATION_CHANCE) {
        daughterDNA = mutate(daughterDNA)
    }

    return [sonDNA, daughterDNA]
}