import Vue from 'vue'
import highlightjs from 'highlight.js'
import marked, { Renderer } from 'marked'

highlightjs.registerLanguage('php', require('highlight.js/lib/languages/php'))
highlightjs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
)
highlightjs.registerLanguage('css', require('highlight.js/lib/languages/css'))

const renderer = new Renderer()
renderer.code = (code, language) => {
  const validLang = !!(language && highlightjs.getLanguage(language))
  const highlighted = validLang
    ? highlightjs.highlight(language, code).value
    : code
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
}

marked.setOptions({ renderer })

Vue.filter('parseMd', function(content) {
  return marked(content)
})
