(function () {
    const appName = "dorounds";

    self.addEventListener('install', function (e) {
        e.waitUntil(
            caches.open(appName).then(function (cache) {
                return cache.addAll([
                    '/index.html',
                    '/about.html',
                    '/dorounds.js',
                    '/dorounds.css',
                    '/vue.min.js',
                    '/install.js',
                    '/manifest.webmanifest',
                    '/spectre-exp.min.css',
                    '/spectre-icons.min.css',
                    '/spectre.min.css',
                    '/tutorial/tutorial.html',
                    '/tutorial/images/copy_of_encounter.png',
                    '/tutorial/images/delete_encounter.png',
                    '/tutorial/images/edit_round.png',
                    '/tutorial/images/encounter_clone_button.png',
                    '/tutorial/images/encounter_list.png',
                    '/tutorial/images/first_creature_added.png',
                    '/tutorial/images/five_damage.png',
                    '/tutorial/images/gcb_all_filled_in.png',
                    '/tutorial/images/players_filled_out.png',
                    '/tutorial/images/players_first_line.png',
                    '/tutorial/images/playing_1.png',
                    '/tutorial/images/ready_to_go.png',
                    '/tutorial/images/sort_button.png',
                    '/tutorial/images/start_button.png',
                    '/tutorial/images/three_goblins.png',
                ]);
            })
        );
    });
    
    self.addEventListener( "activate", event => {
        ;
    });

    self.addEventListener('fetch', function (event) {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );
    });
})();
