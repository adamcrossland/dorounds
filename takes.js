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
        self.ac = "";
        self.hitbonus = "";
        self.disabled = false;

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
            clonedLine.name = lastLine.name;
            clonedLine.ac = lastLine.ac;
            clonedLine.hitbonus = lastLine.hitbonus;
            self.lines.push(clonedLine);
        };
        self.isUnsaved = function () {
            var unsaved = self.name === newSessionName;
            return unsaved;
        };
        self.isSaving = false;
        self.newName = self.name;
        self.startSave = function () {
            self.isSaving = true;
        };
        self.finishSave = function () {
            self.isSaving = false;
            self.name = self.newName;
            foundSessions.push(Session());
            persistAll();
        };
        self.cancelSave = function () {
            self.currentlyEditingName = false;
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
            persistAll();
        };
        self.autoRollInitiative = function () {
            self.lines.forEach((line) => {
                if (!line.initiative || line.initiative.length === 0 || line.initiative === "0") {
                    line.initiative = Math.floor(Math.random() * 20) + 1;
                }
            });
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
                eachNewLine.ac = sl.ac;
                eachNewLine.hitbonus = sl.hitbonus;
                eachNewLine.disabled = sl.disabled || false;

                newSession.lines.push(eachNewLine);
            });
            foundSessions.push(newSession);
        });
        var newSession = Session(newSessionName);
        newSession.lines.push(Line());
        foundSessions.push(newSession);
    } else {
        var newPlaceholderSession = Session();
        foundSessions.push(newPlaceholderSession);
    }

    var app = new Vue({
        el: '#app',
        data: {
            sessions: foundSessions,
            currentSession: foundSessions[0]
        },
        methods: {
            currentSessionChanged: function (event) {
                this.currentSession = this.sessions[event.target.selectedIndex];
            },
            spaceKeyListener: function (evt) {
                if (evt.keyCode === 32) {
                    if (this.currentSession.currentlyPlaying) {
                        evt.preventDefault();
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
            saveData: function () {
                persistAll();
            }
        },
        computed: {
            currentIsUnsaved: function () {
                return this.currentSession.isUnsaved;
            }
        },
        created: function () {
            document.addEventListener('keyup', this.spaceKeyListener);
        },
        destroyed: function () {
            document.removeEventListener('keyup', this.spaceKeyListener);
        }
    });
})();

