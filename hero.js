class Hero {
    constructor(name, level) {
        this.name = name;
        this.level = level;
        this.hp = 100 + level * 10;
        this.attack = 10 + level * 2;
    }

    raidDungeon(dungeon) {
        let loot = [];
        let damageTaken = dungeon.difficulty * 5;
        this.hp -= damageTaken;
        
        if (this.hp > 0) {
            loot = dungeon.generateLoot();
        }

        return { hero: this.name, hpLeft: this.hp, loot };
    }
}

module.exports = Hero;
