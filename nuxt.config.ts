// https://nuxt.com/docs/api/configuration/nuxt-config
import { join } from 'path'
import fs from 'fs'

export default defineNuxtConfig({
    ssr: true,
    devtools: { enabled: true },
    modules: [
        '@pinia/nuxt',
        '@nuxtjs/device',
        // '@zadigetvoltaire/nuxt-well-known'
    ],
    plugins: [
    ],
    sourcemap: {
        server: true,
        client: true
    },
    runtimeConfig: {
        public: {
            key: process.env.PRIVATE_KEY,
            pub: process.env.KEY, // can be overridden by NUXT_API_SECRET environment variable
        }
    },

    vite: {
        server: {
            hmr: {
                protocol: 'ws',
                host: 'localhost'
            }
        }
    },
    // wellKnown: {
    //     contentUris: [
    //       { path: 'apple-developer-merchantid-domain-association.txt', content: fs.readFileSync(join(process.cwd(), 'public', 'content.txt'), 'utf8') },
    //     ]
    //   },
    app: {
        head: {
            script: [
                { src: '/js/Jquery.js', async: false },
                { src: '/js/owl.carousel.min.js', async: false },
                { src: '/js/popper.js' },
                { src: '/js/bootstrap.min.js' },
                { src: '/js/login-modal.js', async: true },
                { src: '/js/core.js', async: true },
                { src: 'https://widget.whelp.co/app.js', tagPosition: 'bodyClose' },
                { src: '/js/whelp.js', async: true, tagPosition: 'bodyClose' },
                { src: 'https://www.googletagmanager.com/gtag/js?id=G-2S7PWPTY0L', async: true },
                { src: '/js/google.js' },
            ],
            htmlAttrs: {
                lang: 'az'
            },
            meta: [
                { name: 'lang', content: 'az' }
            ],
            link: [
                // {rel: 'icon', type: 'image/png', href: '/favicon.png'},
                { href: '/css/all.min.css', rel: 'stylesheet' },
                { href: '/css/animate.min.css', rel: 'stylesheet' },
                { href: '/css/icofont.min.css', rel: 'stylesheet' },
                { href: '/css/bootstrap.min.css', rel: 'stylesheet' },
                { href: '/css/swiper.css', rel: 'stylesheet' },
                { href: '/css/owl.theme.default.min.css', rel: 'stylesheet' },
                { href: '/css/owl.carousel.min.css', rel: 'stylesheet' },
                { href: '/css/login-modal.css', rel: 'stylesheet' },
                { href: '/css/style.css', rel: 'stylesheet', id: 'style' },
                { 
                  rel: 'stylesheet', 
                  href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
                  integrity: 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==',
                  crossorigin: 'anonymous',
                  referrerpolicy: 'no-referrer' 
                },
            ]
        }
    }
})
