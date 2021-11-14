<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <article-meta :article="article"/>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          <div v-html="article.body"></div>
          <div>
            <ul
              v-for="tag in article.tagList" 
              :key="tag"
              class="tag-list"
            >
              <li class="tag-default tag-pill tag-outline">
                {{ tag }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article"/>
      </div>

      <article-comments :article="article"/>

    </div>

  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import MarkdownIt from 'markdown-it'
import articleMeta from './components/article-meta.vue'
import ArticleComments from './components/article-comments.vue'

export default {
  name: 'ArticleIndex',
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    return {
      article: data.article
    }
  },
  components: { articleMeta, ArticleComments },
  head () {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        { hid: 'description', name: 'description',
          content: this.article.description }
      ]
    }
  }
}
</script>

<style scoped>

</style>