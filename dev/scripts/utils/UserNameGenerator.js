/**
 * An object that generates cute names.
 */
export class UserNameGenerator{
    constructor(comboArray = []){
        this.comboArray = comboArray;

        this.firstNames = [
            'Fuzzy',
            'Wuzzy',
            'Sprinkly',
            'Giggly',
            'Cuddly',
            'Snuggly',
            'Wiggly',
            'Crunchy',
            'Sizzly',
            'Squirmy'

        ]

        this.middleNames = [
            'Apple',
            'Orange',
            'Pear',
            'Banana',
            'Strawberry',
            'Blueberry',
            'Mango',
            'Grape',
            'Peach',
            'Lemon'
        ]

        this.lastNames = [
            'cake',
            'smile',
            'pie',
            'friend',
            'beast',
            'bottom',
            'bomb',
        ]
    }

    /**
     * Return a tuple of 3 integers. 
     */
    generateCombo(){
        return [
                Math.floor(Math.random() * this.firstNames.length),
                Math.floor(Math.random() * this.middleNames.length),
                Math.floor(Math.random() * this.lastNames.length)
            ];
    }

    /**
     * Add an array of combinations to this generator's seen list.
     * @param {[String]} arr 
     */
    addSeenNameCombos(arr){
        this.comboArray = [...this.comboArray,...arr];
    }

    /**
     * Generate a random cute name :)
     */
    generateName(){
        let combo = this.generateCombo();
        let stringCombo = `${combo[0]}${combo[1]}${combo[2]}`

        while(this.comboArray.includes(stringCombo)){
            combo = this.generateCombo();
            stringCombo = `${combo[0]}${combo[1]}${combo[2]}`
        }

        this.comboArray.push(stringCombo);

        return {
            name : `${this.firstNames[combo[0]]} ${this.middleNames[combo[1]]}${this.lastNames[combo[2]]}`,
            combo : stringCombo
        };
    }
}