Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
});

(function () {

    function Line() {
        var self = {};
        self.name = "";
        self.initiative = null;
        self.hp = 0;
        self.ac = "";
        self.hitbonus = "";
        self.disabled = false;

        self.copy = function () {
            var copy = Line();
            copy.name = self.name;
            copy.initiative = self.initiative;
            copy.hp = self.hp;
            copy.ac = self.ac;
            copy.hitbonus = self.hitbonus;
            copy.disabled = self.disabled;

            return copy;
        };

        return self;
    }

    const newSessionName = "New...";
    const sessionsStorageKey = "doRoundsSessions";
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
    
    function Session(name, addBlankLine) {
        var self = {};
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
        };
        self.cloneLine = function () {
            var clonedLine = Line();
            var lastLine = self.lines[self.lines.length - 1];
            var nameParts = lastLine.name.split(' ');
            if (nameParts.length > 0 && isNumeric(nameParts[nameParts.length - 1])) {
                var asNumber = Number.parseInt(nameParts[nameParts.length - 1]);
                asNumber++;
                nameParts[nameParts.length - 1] = asNumber.toString();
                clonedLine.name = nameParts.join(' ');
            } else {
                clonedLine.name = lastLine.name;
            }
            
            clonedLine.ac = lastLine.ac;
            clonedLine.hitbonus = lastLine.hitbonus;
            self.lines.push(clonedLine);
        };
        self.deleteLine = function (index) {
            self.lines.splice(index, 1);
            persistAll();
        };
        self.currentlyPlaying = false;
        self.togglePlaying = function () {
            self.currentlyPlaying = !self.currentlyPlaying;
            persistAll();
        };
        self.currentRound = 1;
        self.toggleLinedisabled = function (index) {
            self.lines[index].disabled = !self.lines[index].disabled;
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
            persistAll();
        };
        self.autoRollInitiative = function () {
            self.lines.forEach((line) => {
                if (!line.initiative ||line.initiative.length === 0 || line.initiative === "0") {
                    line.initiative = Math.floor(Math.random() * 20) + 1;
                }
            });
        };
        self.clone = function () {
            var clonedSession = Session(`Copy of ${self.name}`, false);
            self.lines.forEach(l => {
                clonedSession.lines.push(l.copy());
            });
            
            foundSessions.push(clonedSession);
            document.getElementById('sessionSelection').selectedIndex = foundSessions.length - 1;
        };
        return self;
    }

    var foundSessions = [];

    const savedSessions = localStorage.getItem(sessionsStorageKey);
    if (savedSessions !== null) {
        var deserialized = JSON.parse(savedSessions);
        deserialized.forEach((ss) => {
            var newSession = Session(ss.name, false);
            newSession.currentlyPlaying = ss.currentlyPlaying || false;
            newSession.currentRound = ss.currentRound || 1;
            newSession.activeLine = ss.activeLine || 0;
            ss.lines.forEach((sl) => {
                var eachNewLine = Line();
                eachNewLine.name = sl.name;
                eachNewLine.initiative = sl.initiative;
                eachNewLine.hp = sl.hp;
                eachNewLine.ac = sl.ac;
                eachNewLine.hitbonus = sl.hitbonus;
                eachNewLine.disabled = sl.disabled || false;

                newSession.lines.push(eachNewLine);
            });
            foundSessions.push(newSession);
        });
        addNewSession();
    } else {
        addNewSession();
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
        var newSession = Session(newSessionName);
        newSession.lines.push(Line());
        foundSessions.push(newSession);
    }

    var app = new Vue({
        el: '#app',
        data: {
            sessions: foundSessions,
            currentSession: foundSessions[0],
            currentSessionIdx : 0,
            deleteSessionDialogOpen: false
        },
        methods: {
            currentSessionChanged: function (event) {
                this.currentSession = this.sessions[event.target.selectedIndex];
                this.currentSessionIdx = event.target.selectedIndex;
                persistAll();
            },
            keyListener: function (evt) {
                if (evt.keyCode === 32) {
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
                } 
            },
            arrowsKeyListener: function (evt) {
                // Arrow keys only trigger on keydown, not keypress, thus the need
                // for a separate handler.
                if (evt.keyCode === 40) { // down arrow
                    if (this.currentSession.currentlyPlaying) {
                        evt.preventDefault();
                        evt.stopImmediatePropagation();
                        this.currentSession.lines[this.currentSession.activeLine].hp--;
                        if (this.currentSession.lines[this.currentSession.activeLine].hp === 0) {
                            this.currentSession.lines[this.currentSession.activeLine].disabled = true;
                        }
                    }
                } else if (evt.keyCode === 38) { // down arrow
                    if (this.currentSession.currentlyPlaying) {
                        evt.preventDefault();
                        evt.stopImmediatePropagation();
                        this.currentSession.lines[this.currentSession.activeLine].hp++;
                        if (this.currentSession.lines[this.currentSession.activeLine].hp > 0) {
                            this.currentSession.lines[this.currentSession.activeLine].disabled = false;
                        }
                    }
                }
            },
            saveData: function () {
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
            }
        },
        created: function () {
            document.addEventListener('keypress', this.keyListener);
            document.addEventListener('keydown', this.arrowsKeyListener)
        },
        destroyed: function () {
            document.removeEventListener('keypress', this.keyListener);
            document.removeEventListener('keydown', this.arrowsKeyListener)
        }
    });
})();

