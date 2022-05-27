Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
});
Vue.component('treeselect', VueTreeselect.Treeselect);

(function () {

    function Line(initObj) {
        var self = {};
        self.name = "";
        self.initiative = null;
        self.initmod = 0;
        self.hp = 0;
        self.ac = "";
        self.weapons = [];
        self.selectedWeapons = [];
        self.disabled = false;
        self.unmod = null;

        if (initObj) {
            self.name = initObj.name || self.name;
            self.initiative = initObj.initiative || self.initiative;
            self.initmod = initObj.initmod || self.initmod;
            self.hp = initObj.hp || self.hp;
            self.ac = initObj.ac || self.ac;
            if (initObj.weapons == null || initObj.length == 0) {
                self.weapons = ["unarmed"];
            } else {
                self.weapons = initObj.weapons;
            }
            self.selectedWeapons = initObj.selectedWeapons || [];
            self.disabled = initObj.disabled || self.disabled;
            self.unmod = initObj.unmod || self.unmod;
        }

        if (self.hp < 1) {
            self.disabled = true;
        }

        self.copy = function () {
            var copy = Line();
            copy.name = self.name;
            copy.initiative = self.initiative;
            copy.initmod = self.initmod;
            copy.hp = self.hp;
            copy.ac = self.ac;
            copy.weapons = self.weapons;
            copy.selectedWeapon = self.selectedWeapon;
            copy.disabled = self.disabled;
            copy.unmod = self.unmod
            return copy;
        };

        self.storeUnmodifiedValues = function () {
            if (self.unmod === null) {
                self.unmod = {};
                self.unmod.name = self.name;
                self.unmod.initmod = self.initmod;
                self.unmod.hp = self.hp;
                self.unmod.ac = self.ac;
                self.unmod.weapons = self.weapons;
                self.unmod.selectedWeapon = self.selectedWeapon;
            }
        };

        self.setCurrentLine = function (linenum) {
            if (!self.unmod.linenum) {
                self.unmod.linenum = linenum + 1;
            }
        };

        self.resetUnmodifiedValues = function () {
            if (self.unmod !== null) {
                self.name = self.unmod.name;
                self.initmod = self.unmod.initmod;
                self.hp = self.unmod.hp;
                self.ac = self.unmod.ac;
                self.weapons = self.unmod.weapons;
                self.selectedWeapon = self.unmod.selectedWeapon;

                if (self.hp > 0) {
                    self.disabled = false;
                }
            }
        };

        self.availableWeapons = function () {
            return [DoRounds.Weapons.UnarmedAttack].concat(self.weapons);
        };

        self.safeSelectedWeapon = function () {
            return self.selectedWeapon || self.availableWeapons()[0];
        };

        return self;
    }

    const newSessionName = "New...";
    const sessionsStorageKey = "doRoundsSessions";
    const lightdarkStorageKey = "doRoundsLightMode";
    const localStorage = window.localStorage;

    function persistAll() {
        var sessionsWithoutNew = [];
        foundSessions.forEach((s) => {
            if (s.name !== newSessionName) {
                sessionsWithoutNew.push(s);
            }
        });
        const serialized = JSON.stringify(sessionsWithoutNew);
        localStorage.setItem(sessionsStorageKey, serialized);
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    
    function Session(id, name, addBlankLine) {
        var self = {};
        if (id) {
            self.id = id;
        } else {
            self.id = Date.now()
        }
        if (name) {
            self.name = name;
        } else {
            self.name = newSessionName;
        }
        self.lines = [];
        if (addBlankLine) {
            self.lines.push(Line());
        }
        self.newLine = function () {
            self.lines.push(Line());
        };
        self.isLastLine = function (index) {
            return index === self.lines.length - 1;
        };
        self.sortLines = function () {
            for (let i = 0; i < self.lines.length; i++) {
                self.lines[i].setCurrentLine(i);
            }

            self.lines.sort(function (a, b) {
                if (a.initiative !== null && b.initiative !== null) {
                    if (a.initiative > b.initiative) {
                        return -1;
                    } else if (a.initiative < b.initiative) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    if (a.initiative === null && b.initiative !== null) {
                        return 0;
                    } else if (a.initiative !== null && b.initiative === null) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });

            persistAll();
        };
        self.deleteLine = function (index) {
            self.lines.splice(index, 1);
            persistAll();
        };
        self.currentlyPlaying = false;
        self.togglePlaying = function () {
            self.currentlyPlaying = !self.currentlyPlaying;
            if (self.currentlyPlaying) {
                self.lines.forEach(l => {
                    l.storeUnmodifiedValues();
                });
                self.sortLines();
            }

            persistAll();
        };
        self.currentRound = 1;
        self.toggleLinedisabled = function (index) {
            self.lines[index].disabled = !self.lines[index].disabled;
            console.log("Weapons: " + self.lines[index].weapons);
            persistAll();
        };
        self.activeLine = 0;
        self.anyLinesActive = function () {
            var anyActive = false;
            for (var i = 0; i < self.lines.length; i++) {
                if (!self.lines[i].disabled) {
                    anyActive = true;
                    break;
                }
            }

            return anyActive;
        };
        self.currentlyEditingRound = false;
        self.toggleRoundEditing = function () {
            self.currentlyEditingRound = !self.currentlyEditingRound;
            persistAll();
        };
        self.currentlyEditingName = false;
        self.toggleNameEditing = function () {
            self.currentlyEditingName = !self.currentlyEditingName;
            if (!hasNewSession()) {
                addNewSession();
            }
            sortSessions();
            persistAll();
        };
        self.autoRollInitiative = function () {
            self.lines.forEach((line) => {
                if (!line.initiative ||line.initiative.length === 0 || line.initiative === "0") {
                    line.initiative = Math.floor(Math.random() * 20) + 1 + line.initmod;
                }
            });

            persistAll();
        };
        self.clone = function () {
            var clonedSession = Session(null, `Copy of ${self.name}`, false);
            self.lines.forEach(l => {
                clonedSession.lines.push(l.copy());
            });
            
            foundSessions.push(clonedSession);

            return clonedSession;
        };
        self.reset = function () {
            self.lines.forEach(l => {
                l.resetUnmodifiedValues();
                l.initiative = null;
            });
            self.currentRound = 1;

            self.lines.sort(function (a, b) {
                if (a.unmod && a.unmod.linenum && b.unmod && b.unmod.linenum) {
                    if (a.unmod.linenum < b.unmod.linenum) {
                        return -1;
                    } else if (a.unmod.linenum > b.unmod.linenum) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    if ((!a.unmod || !a.unmod.linenum) && (b.unmod && b.unmod.linenum)) {
                        return 0;
                    } else if ((a.unmod && a.unmod.linenume) && (!b.unmod || !b.unmod.linenum)) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });
        }
        return self;
    }

    var foundSessions = [];

    function loadSavedData(loadTo) {
        const savedSessions = localStorage.getItem(sessionsStorageKey);
        if (savedSessions !== null) {
            var deserialized = JSON.parse(savedSessions);
            deserialized.forEach((ss) => {
                var newSession = Session(ss.id, ss.name, false);
                newSession.currentlyPlaying = ss.currentlyPlaying || false;
                newSession.currentRound = ss.currentRound || 1;
                newSession.activeLine = ss.activeLine || 0;
                ss.lines.forEach((sl) => {
                    var eachNewLine = Line(sl);
                    newSession.lines.push(eachNewLine);
                });
                loadTo.push(newSession);
            });
            addNewSession();
        } else {
            addNewSession();
        }

        sortSessions();
    }

    function hasNewSession() {
        var doesHave = false;
        foundSessions.forEach((s) => {
            if (s.name === newSessionName) {
                doesHave = true;
                return;
            }
        });

        return doesHave;
    }

    function addNewSession() {
        var newSession = Session(null, newSessionName);
        newSession.lines.push(Line());
        foundSessions.push(newSession);
    }

    function sortSessions() {
        foundSessions.sort(function (a, b) {
            // The New... session should always be last on the list
            if (a.name === newSessionName) {
                return 1;
            }

            if (b.name === newSessionName) {
                return -1;
            }

            if (a.name === b.name) {
                return 0;
            }

            if (a.name < b.name) {
                return -1;
            }

            return 1;
        });
    }

    loadSavedData(foundSessions);

    var app = new Vue({
        el: '#app',
        data: {
            sessions: foundSessions,
            currentSession: foundSessions[0],
            currentSessionIdx : 0,
            deleteSessionDialogOpen: false,
            dataExport: null,
            exportDataDialogOpen: false,
            dataImport: "",
            importDataDialogOpen: false,
            dataImportError: null,
            lightMode: true,
            resetEncounterDialogOpen: false,
            extraMenuOpen: false,
            clearStorageOpen: false,
            weapons: DoRounds.Weapons,
            editWeaponsOpen: false,
            weaponBeingEdited: null,
            editableWeaponList: [],
            weaponProperties: DoRounds.Weapons.Properties || [],
            newEncounterDialogOpen: false,
            newEncounterName: "",
            newEncounterInclude: []
        },
        methods: {
            currentSessionChanged: function (event) {
                this.currentSession = this.sessions[event.target.selectedIndex];
                this.currentSessionIdx = event.target.selectedIndex;
                persistAll();
            },
            keyListener: function (evt) {
                // Some keys only trigger on keydown, not keypress, thus the need
                // for a separate handler.
                switch (evt.keyCode) {
                    case 9:
                        if (this.currentSession.currentlyPlaying) {
                            evt.preventDefault();
                            evt.stopImmediatePropagation();
                            var activeId = document.activeElement.id;
                            if (!activeId.startsWith("line-")) {
                                // Not currently focused on a hitpoint field,
                                // so all that we can do is set it to the first one.
                                this.$refs.hitpoints[0].focus();
                            } else {
                                // Currently focused on a hitpoint field, so
                                // determine which is next and focus there.
                                var numPart = activeId.replace("line-", "");
                                var asNumber = Number(numPart);
                                if (asNumber === this.$refs.hitpoints.length - 1) {
                                    // At the end, move to the top.
                                    asNumber = 0;
                                } else {
                                    asNumber++;
                                }
                                this.$refs.hitpoints[asNumber].focus();
                            }
                        }
                        break;
                    case 32:
                        if (this.currentSession.currentlyPlaying) {
                            evt.preventDefault();
                            evt.stopImmediatePropagation();
                            do {
                                this.currentSession.activeLine++;
                                if (this.currentSession.activeLine == this.currentSession.lines.length) {
                                    this.currentSession.activeLine = 0;
                                    this.currentSession.currentRound++;
                                }
                            } while (this.currentSession.anyLinesActive() &&
                                this.currentSession.lines[this.currentSession.activeLine].disabled);
                            if (!this.currentSession.anyLinesActive()) {
                                this.currentSession.togglePlaying();
                            }
                        }
                        break;
                    case 27:
                        this.currentSession.currentlyPlaying = false;
                        break;
                }
            },
            saveData: function () {
                sortSessions();
                this.weapons.save();
                persistAll();
            },
            deleteCurrentSession: function () {
                this.deleteSessionDialogOpen = true;
            },
            confirmDeleteSession: function () {
                this.sessions.splice(this.currentSessionIdx, 1);
                if (this.sessions.length === 0) {
                    addNewSession();
                }
                this.currentSessionChanged({ target: { selectedIndex: 0 } });
                this.deleteSessionDialogOpen = false;
            },
            cancelDeleteSession: function () {
                this.deleteSessionDialogOpen = false;
            },
            hitPointsChanged: function (idx) {
                var line = this.currentSession.lines[idx];
                if (line.hp <= 0) {
                    line.disabled = true;
                } else if (line.disabled) {
                    line.disabled = false;
                }

                persistAll();
            },
            exportData: function () {
                this.toggleExtraMenu();
                let exportData = {
                    sessions: localStorage.getItem(sessionsStorageKey),
                    weapons: this.weapons.export()
                };
                let exportDataAsJSON = JSON.stringify(exportData);
                this.dataExport = btoa(unescape(encodeURIComponent(exportDataAsJSON)));
                this.exportDataDialogOpen = true;
            },
            closeExportDataDialog: function () {
                this.dataExport = null;
                this.exportDataDialogOpen = false;
            },
            showImportData: function () {
                this.toggleExtraMenu();
                this.importDataDialogOpen = true;
            },
            importData: function () {
                try {
                    const importDataRaw = decodeURIComponent(escape(window.atob(this.dataImport)));
                    let importData = JSON.parse(importDataRaw);
                    while (this.sessions.length > 0) {
                        this.sessions.pop();
                    }
                    localStorage.setItem(sessionsStorageKey, importData.sessions);
                    this.weapons.import(importData.weapons);
                    loadSavedData(this.sessions);
                    this.importDataDialogOpen = false;
                    this.dataImport = "";
                } catch (e) {
                    this.dataImportError = `Error loading data: ${e}`;
                }
            },
            closeImportDataDialog: function () {
                this.dataImport = "";
                this.importDataDialogOpen = false;
            },
            cloneLine: function () {
                var linesCount = this.currentSession.lines.length;
                var lastLine = this.currentSession.lines[linesCount - 1];
                var clonedLine = lastLine.copy();
    
                var nameParts = lastLine.name.split(' ');
                if (nameParts.length > 0 && isNumeric(nameParts[nameParts.length - 1])) {
                    var asNumber = Number.parseInt(nameParts[nameParts.length - 1]);
                    asNumber++;
                    nameParts[nameParts.length - 1] = asNumber.toString();
                    clonedLine.name = nameParts.join(' ');
                } else {
                    clonedLine.name = lastLine.name;
                }
                
                this.currentSession.lines.push(clonedLine);
                Vue.nextTick(() => this.$refs.clonelinebutton[0].focus());
            },
            toggleLightMode: function (setTo) {
                if (typeof setTo === 'boolean') {
                    this.lightMode = setTo;
                } else {
                    this.lightMode = !this.lightMode;
                }
                localStorage.setItem(lightdarkStorageKey, this.lightMode);

                if (this.lightMode) {
                    document.body.className = 'lightmode';
                } else {
                    document.body.className = 'darkmode';
                }
            },
            cloneencounter: function() {
                var clonedSession = this.currentSession.clone();
                sortSessions();
                persistAll();
                this.currentSession = clonedSession;
            },
            toggleResetEncounter: function () {
                this.resetEncounterDialogOpen = !this.resetEncounterDialogOpen;
            },
            resetEncounter: function () {
                this.currentSession.reset();
                this.resetEncounterDialogOpen = false;
            },
            toggleExtraMenu: function () {
                this.extraMenuOpen = !this.extraMenuOpen;
            },
            toggleClearStorage: function (setOpen) {
                if (setOpen && typeof setOpen === 'boolean') {
                    this.clearStorageOpen = setOpen;
                } else {
                    this.clearStorageOpen = !this.clearStorageOpen;
                }
                if (!this.clearStorageOpen) {
                    this.toggleExtraMenu();
                }
            },
            clearAllSavedData: function () {
                let currentLightMode = localStorage.getItem(lightdarkStorageKey);
                localStorage.clear();
                this.sessions.splice(0, this.sessions.length);
                loadSavedData(foundSessions);
                this.toggleClearStorage(false);
                this.currentSession = this.sessions[0];
                this.togglelightmode(currentLightMode === "true" ? true : false);
            },
            toggleEditWeapons: function () {
                this.editableWeaponList = this.weapons.weaponsWithNew();
                if (!this.editWeaponsOpen) {
                    this.weaponBeingEdited = this.weapons.Weapon();
                }
                this.editWeaponsOpen = !this.editWeaponsOpen;
            },
            normalizeWeaponNode: function (node) {
                if (node) {
                    if (node.children) {
                        return node;
                    } else {
                        return {
                            id: node.name,
                            label: node.name
                        };
                    }
                } else {
                    return {
                        id: "New weapon",
                        label: "New weapon"
                    };
                }
            },
            normalizeWeaponProperties: function (node) {
                if (node) {
                    return {
                        id: node.id,
                        label: node.name
                    }
                } else {
                    return {
                        id: -1,
                        label: "Unknown"
                    }
                }
            },
            saveNewWeapon: function () {
                this.weapons.AddWeapon(this.weaponBeingEdited.category, this.weaponBeingEdited);
                this.weapons.save();
                this.weaponBeingEdited = this.weapons.Weapon();
            },
            saveWeaponChanges: function () {
                this.weapons.save();
            },
            deleteWeapon: function () {
                if (this.weapons.deleteWeapon(this.weaponBeingEdited.name)) {
                    this.weapons.save();
                    this.weaponBeingEdited = this.weapons.Weapon();
                }
            },
            canDeleteWeapon: function () {
                let canDelete = true;
                if (!this.weaponBeingEdited || this.weaponBeingEdited.name === "New weapon" ||
                    !this.weapons.weaponExists(this.weaponBeingEdited.name)) {
                    canDelete = false;
                }

                return canDelete;
            },
            canAddWeapon: function () {
                let canAdd = false;
                if (this.weaponBeingEdited && this.weaponBeingEdited.name.trim().length > 0
                    && this.weaponBeingEdited.name !== "New weapon"
                    && !this.weapons.weaponExists(this.weaponBeingEdited.name)) {
                    canAdd = true;
                }

                return canAdd;
            },
            toggleNewEncounter: function () {
                this.newEncounterDialogOpen = !this.newEncounterDialogOpen;
                if (!this.newEncounterDialogOpen) {
                    this.newEncounterName = "";
                    this.newEncounterInclude = [];
                }
            },
            saveNewEncounter: function () {
                let newSession = Session(null, this.newEncounterName, false);
                this.newEncounterInclude.forEach(nei => {
                    nei.lines.forEach(nel => {
                        newSession.lines.push(nel.copy());
                    });
                });
                this.sessions.push(newSession);
                persistAll();

                this.toggleNewEncounter();
            },
            normalizeEncounterNode: function (node) {
                return {
                    id: node.id,
                    label: node.name
                }
            }
        },
        created: function () {
            document.addEventListener('keydown', this.keyListener);
            var savedLightMode = localStorage.getItem(lightdarkStorageKey);
            if (savedLightMode === "true" || !savedLightMode) {
                this.lighMode = true;
                document.body.className = 'lightmode';
            } else {
                this.lightMode = false;
                document.body.className = 'darkmode';
            }
        },
        destroyed: function () {
            document.removeEventListener('keydown', this.keyListener);
        }
    });
     
    return app;
})();

