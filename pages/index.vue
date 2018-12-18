<template>
  <section class="container">
    <div class="posts">
      <div class="post" v-for="(post, key) in posts" :key="key">
        <a :href="post.title_slug">
          <h2>{{ post.title }}</h2>
          <span>{{ post.excerpt }}</span>
        </a>
        <div v-html="post.content"></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  async asyncData({ app }) {
    const { data } = await app.$axios.post(
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
    return { posts: data.entries }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
