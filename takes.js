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
            self.isSaving = false;
        }

        return self;
    }

    var foundSessions = [];

    const savedSessions = localStorage.getItem(sessionsStorageKey);
    if (savedSessions !== null) {
        var deserialized = JSON.parse(savedSessions);
        deserialized.forEach((ss) => {
            var newSession = Session(ss.name, false);
            ss.lines.forEach((sl) => {
                var eachNewLine = Line();
                eachNewLine.name = sl.name;
                eachNewLine.initiative = sl.initiative;
                eachNewLine.ac = sl.ac;
                eachNewLine.hitbonus = sl.hitbonus;

                newSession.lines.push(eachNewLine);
            });
            foundSessions.push(newSession);
        });
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
            }
        },
        computed: {
            currentIsUnsaved: function () {
                return this.currentSession.isUnsaved;
            }
        }
    });    
})();

