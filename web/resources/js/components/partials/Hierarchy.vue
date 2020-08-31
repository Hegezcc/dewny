<template>
    <div class="card border border-primary">
        <div class="card-header">
            <h2 class="mb-0">System hierarchy</h2>
        </div>
        <div class="card-body">
            <div class="container">
                <div class="row">
                    <div class="col-md-8">
                        <p class="text-center my-5" v-if="$root.hierarchyMap === null">Loading map...</p>
                        <div id="hierarchy-map" v-html="$root.hierarchyMap"></div>
                    </div>
                    <div class="col-md-4 mt-3 mt-md-0">
                        <div class="card">
                            <div class="card-header">Connection info</div>
                            <div class="card-body">
                                <p class="mb-0" v-if="connection !== null">{{ hierarchyInfo[connection] }}</p>
                                <p class="mb-0" v-else><em>Hover/tap connections to show info about them!</em>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            hierarchyInfo: {
                "1": 'User starts OAuth flow with Laravel, and later on manages their keys from user page.',
                "2": 'Laravel server exchanges user-provided key to user details and authorization with Discord API.',
                "3": 'Laravel saves user data and keys to DB, and gets all that and message info from there.',
                "4": 'User service makes requests with right parameters to the Node.js API.',
                "5": 'Node.js server confirms the details from DB and saves message to DB, if it cannot be sent to Discord.',
                "6": 'Node.js server sends message to specified channel in Discord API.',
                "7": 'Discord API sends message to specified channel, and possibly notifies user client of that.',
            },
            connection: null,
            connectionListeners: [],
        }
    },
    created() {
        this.loadHierarchyMap();
    },
    beforeDestroy() {
        if (this.connectionListeners.length !== 0) {
            this.connectionListeners.forEach(el => {
                el.removeEventListener('mouseover', this.mapEventHandler)
                el.removeEventListener('click', this.mapEventHandler)
            });

            // Empty the array (just to be safe)
            this.connectionListeners = [];
        }
    },
    methods: {
        async loadHierarchyMap() {
            // The map may already be defined, but if not, then load it
            if (this.$root.hierarchyMap === null) {
                this.$root.hierarchyMap = await fetch('/images/graph.svg').then(d => d.text());
            }

            // Make sure this happens only after DOM update has already happened with setImmediate
            const vm = this;
            setTimeout(() => {
                $('#hierarchy-map #connections > .connection').each((i, parent) => {
                    $(parent).find('.cls-11, .cls-12', parent).each((i, el) => {
                        el.addEventListener('mouseover', this.mapEventHandler);
                        el.addEventListener('click', this.mapEventHandler);

                        // Save reference so we can remove listener when router unloads component
                        vm.connectionListeners.push(el);
                    })
                });
            }, 0);
        },
        mapEventHandler(ev) {
            const parent = $(ev.target).closest('.connection');
            const id = parent.data('connection');

            // Update connection if it is not the same one
            if (this.connection !== id) {
                $('#hierarchy-map #connections .active').removeClass('active');
                parent.addClass('active');
                this.connection = id;
            }
        }
    }
}
</script>
