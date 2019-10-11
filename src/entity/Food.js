import { MapObject } from './MapObject.js';

export class Food extends MapObject {
    constructor (x, y, size) {
        super(x, y, size, 'green')
    }
}
