import pkg from 'bad-words'

/*
 * A wrapper class for bad-words due to inability to import it without doing a generic import.
 * Implemented as a singleton class.
*/

let instance

class Filter {
    constructor() {
        if (!instance) {
            this.filter = new pkg()
            instance = this
        }

        return instance
    }

    isProfane(message) {
        return this.filter.isProfane(message)
    }
}

export { Filter }