import {useCookie} from "#imports";

export default defineNuxtPlugin(async (nuxtApp) => {
    const head = nuxtApp.vueApp._context.provides.usehead
    const mode = useCookie('mode')
        if (mode.value === 'dark') {
        // const linkElement = document.createElement('link');
        // linkElement.rel = 'stylesheet';
        // linkElement.href = '/css/dark.css';
        // linkElement.id = 'dark'
        // document.head.appendChild(linkElement);
            head.push({
                link: [{ rel: 'stylesheet', href:  '/css/dark.css', id: 'dark'}]
            })

    }
});
