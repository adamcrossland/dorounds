var DoRounds = DoRounds || {};
DoRounds.Weapons = (function () {
    const weaponStorageKey = "doRoundsWeapons";

    let Weapon = function(props) {
        var self = {};
        if (props.name) {
            self.name = props.name;
        } else {
            throw "Weapon must have a name property.";
        }
        self.damageType = props.damageType || 0;
        self.damage = props.damage || null;
        self.range = props.range || null;
        self.weight = props.weight || 0;
        self.properties = props.properties || [];
        self.versatileDamage = props.versatileDamage || null;
        self.special = props.special || null;
        self.hitbonus = props.hitbonus || 0;

        self.damageText = function () {
            if (Array.isArray(self.damage)) {
                return self.damage.join(", ");
            } else {
                return self.damage;
            }
        };

        return self;
    }

    let defaultWeaponData = {
        Categories: [
            "Simple",
            "Martial",
            "Spell"
        ],
        Properties: [
            {
                name: "ammunition",   // 0
                description: "You can use a weapon that has the ammunition property to make a ranged attack only if you have ammunition to fire from the weapon. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield. If you use a weapon that has the ammunition property to make a melee attack, you treat the weapon as an improvised weapon (see “Improvised Weapons” later in the section). A sling must be loaded to deal any damage when used in this way."
            },
            {
                name: "close",        // 1
                descritpion: " A close weapon is more effective up close than other ranged weapons. When you make a ranged attack with a close weapon, you do not suffer disadvantage on the attack roll when you are within 5 feet of a hostile creature who can see you and who is not incapacitated."
            },
            {
                name: "deadly",       // 2
                description: "When you roll a natural 1 on a damage die with a deadly weapon, treat the result as a 2 instead."
            },
            {
                name: "defensive",    // 3
                description: "A defensive weapon makes you harder to hit effectively while you are wielding two weapons. As long as at least one of your two weapons has the defensive property, you add +1 to your AC against the first attack that targets you in a round, provided you aren’t surprised or immobile. You regain the bonus at the start of your next turn, and do not gain this bonus against subsequent attacks against you until then."
            },
            {
                name: "finesse",      // 4
                description: "When making an attack with a finesse weapon, you use your choice of your Strength or Dexterity modifier for the attack and damage rolls. You must use the same modifier for both rolls."
            },
            {
                name: "heavy",        // 5
                description: "Small creatures have disadvantage on attack rolls with heavy weapons. A heavy weapon’s size and bulk make it too large for a Small creature to use effectively."
            },
            {
                name: "light",        // 6
                description: "A light weapon is small and easy to handle, making it ideal for use when fighting with two weapons."
            },
            {
                name: "loading",      // 7
                description: "Because of the time required to load this weapon, you can fire only one piece of ammunition from it when you use an action, bonus action, or reaction to fire it, regardless of the number of attacks you can normally make."
            },
            {
                name: "reach",        // 8
                description: "This weapon adds 5 feet to your reach when you attack with it, as well as when determining your reach for opportunity attacks with it."
            },
            {
                name: "special",      // 9
                description: "A weapon with the special property has unusual rules governing its use."
            },
            {
                name: "thrown",       // 10
                description: "If a weapon has the thrown property, you can throw the weapon to make a ranged attack. If the weapon is a melee weapon, you use the same ability modifier for that attack roll and damage roll that you would use for a melee attack with the weapon. For example, if you throw a handaxe, you use your Strength, but if you throw a dagger, you can use either your Strength or your Dexterity, since the dagger has the finesse property."
            },
            {
                name: "two-handed",   // 11
                description: "This weapon requires two hands when you attack with it."
            },
            {
                name: "versatile",     // 12
                description: "This weapon can be used with one or two hands. A damage value in parentheses appears with the property—the damage when the weapon is used with two hands to make a melee attack."
            }
        ],
        DamageTypes: [
            "bludgeoning",  // 0
            "piercing",     // 1
            "slashing",     // 2
            "radiant",      // 3
            "fire",         // 4
            "poison",       // 5
            "acid",         // 6
            "cold",         // 7
            "lightning",    // 8
            "necrotic",     // 9
            "force",        // 10
        ],
        Items: {
            "Simple": [
                Weapon({
                    name: "Club",
                    damageType: 0,
                    damage: "1d4",
                    range: null,
                    weight: 2,
                    properties: [6]
                }),
                Weapon({
                    name: "Dagger",
                    damageType: 1,
                    damage: "1d4",
                    range: "20/60",
                    weight: 1,
                    properties: [4, 6, 10]
                }),
                Weapon({
                    name: "Greatclub",
                    damageType: 0,
                    damage: "1d8",
                    range: null,
                    weight: 10,
                    properties: [11]
                }),
                Weapon({
                    name: "Handaxe",
                    damageType: 2,
                    damage: "1d6",
                    range: "20/60",
                    weight: 2,
                    properties: [6, 10]
                }),
                Weapon({
                    name: "Javelin",
                    damageType: 1,
                    damage: "1d6",
                    range: "30/120",
                    weight: 2,
                    properties: [10]
                }),
                Weapon({
                    name: "Light hammer",
                    damageType: 0,
                    damage: "1d4",
                    range: "20/60",
                    weight: 2,
                    properties: [6, 10]
                }),
                Weapon({
                    name: "Mace",
                    damageType: 0,
                    damage: "1d6",
                    range: null,
                    weight: 4,
                    properties: []
                }),
                Weapon({
                    name: "Quarterstaff",
                    damageType: 0,
                    damage: "1d6",
                    range: null,
                    weight: 4,
                    properties: [12],
                    versatileDamage: "1d8"
                }),
                Weapon({
                    name: "Sickle",
                    damageType: 2,
                    damage: "1d4",
                    range: null,
                    weight: 2,
                    properties: [6]
                }),
                Weapon({
                    name: "Spear",
                    damageType: 1,
                    damage: "1d6",
                    range: "20/60",
                    weight: 3,
                    properties: [10, 12],
                    versatileDamage: "1d8"
                }),
                Weapon({
                    name: "Crossbow, light",
                    damageType: 1,
                    damage: "1d8",
                    range: "80/320",
                    weight: 5,
                    properties: [0, 7, 11]
                }),
                Weapon({
                    name: "Dart",
                    damageType: 1,
                    damage: "1d4",
                    range: "20/60",
                    weight: .25,
                    properties: [4, 10]
                }),
                Weapon({
                    name: "Shortbow",
                    damageType: 1,
                    damage: "1d6",
                    range: "80/320",
                    weight: 2,
                    properties: [0, 11]
                }),
                Weapon({
                    name: "Sling",
                    damageType: 0,
                    damage: "1d4",
                    range: "30/120",
                    weight: 0,
                    properties: [0]
                })
            ],
            "Martial": [
                Weapon({
                    name: "Battleaxe",
                    damageType: 2,
                    damage: "1d8",
                    range: null,
                    weight: 4,
                    properties: [12],
                    versatileDamage: "1d10"
                }),
                Weapon({
                    name: "Dwarven Urgrosh",
                    damageType: [1, 2],
                    damage: ["1d8", "1d10"],
                    range: "20/60",
                    weight: 4,
                    properties: [9, 10],
                    special: "One head of this weapon ends in a spear and\nthe other end is an axe. Originally used\nexclusively for mining, these weapons were\nadapted to combat creatures in the Underdark.\n\nIf you have the Dual Wielder feat, the Exotic \nWeapon Master feat, or the Two-Weapon \nFighting style, you can wield a dwarven urgrosh\nas a one-handed spear and a one-handed\nbattleaxe. It gains the light property when\nwielded in this way."
                }),
                Weapon({
                    name: "Elven Crescent Blade",
                    damageType: 2,
                    damage: "2d6",
                    range: null,
                    weight: 6,
                    properties: [5, 9, 11],
                    special: "This long, almost moon-shaped blade allows a\nproper wielder unsurpassed flexibility in battle.\n\nIf you have the Exotic Weapon Master feat,\nthe elven crescent blade gains the finesse\nproperty."
                }),
                Weapon({
                    name: "Flail",
                    damageType: 0,
                    damage: "1d8",
                    range: null,
                    weight: 2,
                    properties: [],
                    versatileDamage: ""
                }),
                Weapon({
                    name: "Glaive",
                    damageType: 2,
                    damage: "1d10",
                    range: null,
                    weight: 6,
                    properties: [5, 8, 11]
                }),
                Weapon({
                    name: "Greataxe",
                    damageType: 2,
                    damage: "1d12",
                    range: null,
                    weight: 7,
                    properties: [5, 11]
                }),
                Weapon({
                    name: "Greatsword",
                    damageType: 2,
                    damage: "2d6",
                    range: null,
                    weight: 6,
                    properties: [5, 11]
                }),
                Weapon({
                    name: "Halberd",
                    damageType: 2,
                    damage: "1d10",
                    range: null,
                    weight: 6,
                    properties: [5, 8, 11]
                }),
                Weapon({
                    name: "Lance",
                    damageType: 1,
                    damage: "1d12",
                    range: null,
                    weight: 6,
                    properties: [8, 9],
                    special: "You have disadvantage when you use a lance\nto attack a target within 5 feet of you.\nAlso, a lance requires two hands to\nwield when you aren’t mounted."
                }),
                Weapon({
                    name: "Longsword",
                    damageType: 2,
                    damage: "1d8",
                    range: null,
                    weight: 3,
                    properties: [12],
                    versatileDamage: "1d10"
                }),
                Weapon({
                    name: "Maul",
                    damageType: 0,
                    damage: "2d6",
                    range: null,
                    weight: 10,
                    properties: [5, 11]
                }),
                Weapon({
                    name: "Morningstar",
                    damageType: 1,
                    damage: "1d8",
                    range: null,
                    weight: 4,
                    properties: []
                }),
                Weapon({
                    name: "Pike",
                    damageType: 1,
                    damage: "1d10",
                    range: null,
                    weight: 18,
                    properties: [5, 8, 11]
                }),
                Weapon({
                    name: "Rapier",
                    damageType: 1,
                    damage: "1d8",
                    range: null,
                    weight: 2,
                    properties: [4]
                }),
                Weapon({
                    name: "Scimitar",
                    damageType: 2,
                    damage: "1d6",
                    range: null,
                    weight: 3,
                    properties: [4, 6]
                }),
                Weapon({
                    name: "Shortsword",
                    damageType: 1,
                    damage: "1d6",
                    range: null,
                    weight: 2,
                    properties: [4, 6]
                }),
                Weapon({
                    name: "Spiked Chain",
                    damageType: 1,
                    damage: "1d8",
                    range: null,
                    weight: 10,
                    properties: [4, 5, 8, 9, 11],
                    special: "A length of spiked chain is between 6 and\n8-feet long with wicked barbs welded onto\none end. If you have the Dual-Wielder\nfeat, the Exotic Weapon Master feat, or\nthe Two-Weapon Fighting style, you can\nwield a spiked chain as two one-handed,\nlight weapons that each deal 1d6 piercing\ndamage. The spiked chain loses the reach\nproperty when wielded in this way."
                }),
                Weapon({
                    name: "Trident",
                    damageType: 1,
                    damage: "1d6",
                    range: "20/60",
                    weight: 5,
                    properties: [10, 12],
                    versatileDamage: "1d8"
                }),
                Weapon({
                    name: "War pick",
                    damageType: 1,
                    damage: "1d8",
                    range: null,
                    weight: 2,
                    properties: []
                }),
                Weapon({
                    name: "Warhammer",
                    damageType: 0,
                    damage: "1d8",
                    range: null,
                    weight: 2,
                    properties: [12],
                    versatileDamage: "1d10"
                }),
                Weapon({
                    name: "Whip",
                    damageType: 2,
                    damage: "1d4",
                    range: null,
                    weight: 3,
                    properties: [4, 8]
                }),
                Weapon({
                    name: "War Scythe",
                    damageType: 2,
                    damage: "1d10",
                    range: null,
                    weight: 2,
                    properties: [9, 11],
                    special: "Fashioned to resemble the threshing\nimplement but modified for battle, the war\nscythe can be a deadly weapon in the\nright hands.\nYou can’t wield a war scythe in one hand.\nIf you have the Exotic Weapon Master feat,\nyou can wield the war scythe as a war pick.\nIt gains the versatile (d10) property\nwhen wielded in this way.\nWhen you takethe Attack action, you can\nattempt the Trip Attack combat manuever\n(DC 8 + your proficiency bonus + your\nStrength modifier) against a creature as\none of your attacks."
                }),
                Weapon({
                    name: "Blowgun",
                    damageType: 1,
                    damage: "1",
                    range: "25/100",
                    weight: 1,
                    properties: [0, 7]
                }),
                Weapon({
                    name: "Crossbow, hand",
                    damageType: 1,
                    damage: "1d6",
                    range: "30/120",
                    weight: 3,
                    properties: [0, 6, 7]
                }),
                Weapon({
                    name: "Crossbow, heavy",
                    damageType: 1,
                    damage: "1d10",
                    range: "100/400",
                    weight: 18,
                    properties: [0, 5, 7, 11]
                }),
                Weapon({
                    name: "Great Bow",
                    damageType: 1,
                    damage: "1d8",
                    range: "150/600",
                    weight: 2,
                    properties: [0, 5, 9, 11],
                    special: "This 6-foot tall bow is made of elm\nrather than yew or ash, making it\nastonishingly stiff, large and strong,\nand equally capable of use for long and\nshort shooting.\nYou can use a bonus action to steady\nyourself. While you are steadied, your\nattacks with the great bow deal 2d6\npiercing damage. You are no longer\nsteadied if you move."
                }),
                Weapon({
                    name: "Longbow",
                    damageType: 1,
                    damage: "1d8",
                    range: "150/600",
                    weight: 2,
                    properties: [0, 5, 11]
                }),
                Weapon({
                    name: "Net",
                    damageType: -1,
                    damage: null,
                    range: "5/15",
                    weight: 3,
                    properties: [9, 10],
                    special: "A Large or smaller creature hit by a net\nis restrained until it is freed. A net has\nno effect on creatures that are formless,\nor creatures that are Huge or larger.\nA creature can use its action to make a\nDC 10 Strength check, freeing itself or\nanother creature within its reach on a\nsuccess. Dealing 5 slashing damage to the\nnet (AC 10) also frees the creature\nwithout harming it, ending the effect\nand destroying the net. When you use an\naction, bonus action, or reaction to\nattack regardless of the number of attacks\nyou can normally make."
                })
            ],
            "Spell": [
                Weapon({
                    name: "Acid Splash 1-4",
                    damageType: 6,
                    damage: "1d6",
                    range: 60,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Acid Splash 5-10",
                    damageType: 6,
                    damage: "2d6",
                    range: 60,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Acid Splash 11-16",
                    damageType: 6,
                    damage: "3d6",
                    range: 60,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Acid Splash 17+",
                    damageType: 6,
                    damage: "4d6",
                    range: 60,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Chill Touch 1-4",
                    damageType: 9,
                    damage: "1d8",
                    range: 120,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Chill Touch 5-10",
                    damageType: 9,
                    damage: "2d8",
                    range: 120,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Chill Touch 11-16",
                    damageType: 9,
                    damage: "3d8",
                    range: 120,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Chill Touch 17+",
                    damageType: 9,
                    damage: "4d8",
                    range: 120,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Eldritch Blast",
                    damageType: 10,
                    damage: "1d10",
                    range: 120,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Fire Bolt 1-4",
                    damageType: 4,
                    damage: "1d10",
                    range: 120,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Fire Bolt 5-10",
                    damageType: 4,
                    damage: "2d10",
                    range: 120,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Fire Bolt 11-16",
                    damageType: 4,
                    damage: "3d10",
                    range: 120,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Fire Bolt 17+",
                    damageType: 4,
                    damage: "4d10",
                    range: 120,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Poison Spray 1-4",
                    damageType: 5,
                    damage: "1d12",
                    range: 10,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Poison Spray 5-10",
                    damageType: 5,
                    damage: "2d12",
                    range: 10,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Poison Spray 11-16",
                    damageType: 5,
                    damage: "3d12",
                    range: 10,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Poison Spray 17+",
                    damageType: 5,
                    damage: "4d12",
                    range: 10,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Produce Flame 1-4",
                    damageType: 4,
                    damage: "1d8",
                    range: 30,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Produce Flame 5-10",
                    damageType: 4,
                    damage: "2d8",
                    range: 30,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Produce Flame 11-16",
                    damageType: 4,
                    damage: "3d8",
                    range: 30,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Produce Flame 17+",
                    damageType: 4,
                    damage: "4d8",
                    range: 30,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Ray of Frost 1-4",
                    damageType: 7,
                    damage: "1d8",
                    range: 60,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Ray of Frost 5-10",
                    damageType: 7,
                    damage: "2d8",
                    range: 60,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Ray of Frost 11-16",
                    damageType: 7,
                    damage: "3d8",
                    range: 60,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Ray of Frost 17+",
                    damageType: 7,
                    damage: "4d8",
                    range: 60,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Sacred Flame 1-4",
                    damageType: 3,
                    damage: "1d8",
                    range: 60,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Sacred Flame 5-10",
                    damageType: 3,
                    damage: "2d8",
                    range: 60,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Sacred Flame 11-16",
                    damageType: 3,
                    damage: "3d8",
                    range: 60,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Sacred Flame 17+",
                    damageType: 3,
                    damage: "4d8",
                    range: 60,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Shocking Grasp 1-4",
                    damageType: 8,
                    damage: "1d8",
                    range: 0,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Shocking Grasp 5-10",
                    damageType: 8,
                    damage: "2d8",
                    range: 0,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Shocking Grasp 11-16",
                    damageType: 8,
                    damage: "3d8",
                    range: 0,
                    weight: 0,
                    properties: [],
                }),
                Weapon({
                    name: "Shocking Grasp 17+",
                    damageType: 8,
                    damage: "4d8",
                    range: 0,
                    weight: 0,
                    properties: [],
                })
            ]
        }
    };

    let savedWeapons = localStorage.getItem(weaponStorageKey);
    if (savedWeapons === null) {
        savedWeapons = defaultWeaponData;
    }

    
    savedWeapons.save = function () {
        localStorage.setItem(weaponStorageKey, savedWeapons);
    };

    savedWeapons.autoSave = false;
    savedWeapons.doAutoSave = function () {
        if (savedWeapons.autoSave) {
            savedWeapons.save();
        }  
    };

    savedWeapons.AddCategory = function (categoryName) {
        let foundCategory = savedWeapons.Categories[categoryName];
        if (!foundCategory) {
            savedWeapons.Categories.push(categoryName);
            foundCategory = {
                name: categoryName,
                items: []
            };
            savedWeapons.Items.push(foundCategory);
            doAutoSave();
        }

        return foundCategory;
    };

    savedWeapons.AddWeapon = function (categoryName, weapon) {
        savedWeapons.AddCategory(categoryName);
        let foundCategory = savedWeapons.Categories[categoryName];
        foundCategory.push(weapon);
        doAutoSave();
    };

    savedWeapons.UnarmedAttack = new Weapon({
        name: "Unarmed attack",
        damageType: 0,
        damage: "1d4",
        range: 0,
        weight: 0,
        properties: []
    });

    savedWeapons.propertiesText = function (weapon) {
        let text = "";
        for (var i = 0; i < weapon.properties.length; i++) {
            if (text.length > 0) {
                text += ", ";
            }
            let curProp = savedWeapons.Properties[weapon.properties[i]];
            if (curProp.name == "versatile") {
                text += `versatile (${weapon.versatileDamage})`;
            } else if (curProp.name == "special") {
               // skip this type; it is rendered by UI code
            } else {
                text += savedWeapons.Properties[weapon.properties[i]].name;
            }
        }

        return text;
    };
    
    savedWeapons.damageText = function (weapon) {
        let text = "";

        if (Array.isArray(weapon.damageType)) {
            for (var i = 0; i < weapon.damageType.length; i++) {
                if (text.length > 0) {
                    text += ", ";
                }

                text += `${weapon.damage[i]} of ${savedWeapons.DamageTypes[weapon.damageType[i]]}`;
            }
        } else {
            text = `${weapon.damage} of ${savedWeapons.DamageTypes[weapon.damageType]}`;
        }

        return text;
    };

    savedWeapons.Weapon = Weapon;

    return savedWeapons;
}());