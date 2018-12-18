<template>
  <article>
    <h1>{{post.title}}</h1>
    <div v-html="$options.filters.parseMd(post.content)"></div>
  </article>
</template>

<script>
export default {
  // eslint-disable-next-line no-unused-vars
  async asyncData({ app, params, error, payload }) {
    if (payload) {
      return { post: payload }
    } else {
      let { data } = await app.$axios.post(
        'http://localhost:8080/api/collections/get/posts?token=4cc8f53a20e53378ee3ad1b26bc045',
        JSON.stringify({
          filter: { published: true },
          sort: { _created: -1 },
          limit: 10,
          populate: 1
        }),
        {
          headers: { 'Content-type': 'application/json' }
        }
      )
      if (!data.entries[0]) {
        return error({ message: '404 page not found', statusCode: 404 })
      }
      return { post: data.entries[0] }
    }
  }
}
</script>

<style>
img {
  max-width: 100%;
}
</style>
