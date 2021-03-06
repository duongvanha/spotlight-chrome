import plugins from "./plugins";
import { backgroundFunction } from "./services/shopBaseService";

window.addEventListener("load", function () {
    const id = Number(new URLSearchParams(window.location.search).get('spotlight'))
    const plugin = plugins.find(plugin => plugin.id === id)
    if (plugin && plugin.background) {
        plugin.background()
    }

    backgroundFunction()
});

