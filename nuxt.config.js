const pkg = require('./package')
const collect = require('collect.js')
import axios from 'axios'
require('dotenv').config()

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: ['@/assets/css/main.css', 'highlight.js/styles/dracula.css'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['~/plugins/filters.js'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  generate: {
    routes: async () => {
      let { data } = await axios.post(
        'http://localhost:8080/api/collections/get/posts?token=4cc8f53a20e53378ee3ad1b26bc045',
        JSON.stringify({
          filter: { published: true },
          sort: { _created: -1 },
          populate: 1
        }),
        {
          headers: { 'Content-type': 'application/json' }
        }
      )
      const collection = collect(data.entries)
      let tags = collection
        .map(post => post.tags)
        .flatten()
        .unique()
        .map(tag => {
          let payload = collection
            .filter(item => {
              return collect(item.tags).contains(tag)
            })
            .all()
          return {
            route: `category/${tag}`,
            payload: payload
          }
        })
        .all()

      let posts = collection
        .map(post => {
          return {
            route: post.title_slug,
            payload: post
          }
        })
        .all()

      return posts.concat(tags)
    }
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
