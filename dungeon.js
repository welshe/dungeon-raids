class Dungeon {
    constructor(name, difficulty) {
        this.name = name;
        this.difficulty = difficulty;
    }

    generateLoot() {
        const lootPool = ['Sword', 'Shield', 'Magic Scroll', 'Gold'];
        return lootPool[Math.floor(Math.random() * lootPool.length)];
    }
}

module.exports = Dungeon;
