// https://nuxt.com/docs/api/configuration/nuxt-config
import { join } from 'path'
import fs from 'fs'

export default defineNuxtConfig({
    ssr: true,
    devtools: { enabled: true },
    modules: [
        '@pinia/nuxt',
        '@nuxtjs/device',
        '@nuxtjs/tailwindcss',
        // '@zadigetvoltaire/nuxt-well-known'
    ],

    tailwindcss: {
        cssPath: '~/assets/css/tailwind.css',
        configPath: '~/tailwind.config.ts',
        viewer: false,
    },

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
    },
    build: {
        minify: 'terser',
        terserOptions: {
            format: {
                comments: false
            }
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
            bodyAttrs: {
                class: 'bg-ink-50 dark:bg-ink-900 text-ink-900 dark:text-white transition-colors pb-[88px] md:pb-0'
            },
            script: [
                // Apply saved theme before paint (no flash) — mirrors dolphhtml head script
                {
                    innerHTML: "(function(){try{var t=localStorage.getItem('dolph-theme');var h=document.documentElement;if(t==='light')h.classList.remove('dark');else if(t==='dark')h.classList.add('dark');else h.classList.add('dark');}catch(e){}})();",
                    tagPosition: 'head',
                    tagPriority: 'critical'
                },
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
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' },
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
