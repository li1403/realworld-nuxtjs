<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
              <li
                v-for="(messages, field) in errors"
                :key="messages"
              >{{ field }} {{ messages }}</li>
          </ul>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input 
                  type="text"
                  class="form-control form-control-lg" 
                  placeholder="Article Title"
                  v-model="title"
                  :disabled="postDisabled"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text" 
                  class="form-control" 
                  placeholder="What's this article about?"
                  v-model="description"
                  :disabled="postDisabled"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea 
                  class="form-control" 
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="body"
                  :disabled="postDisabled"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter tags"
                  v-model="tag"
                  @keyup.enter="onEnterTag"
                  :disabled="postDisabled"
                >
                <div class="tag-list">
                  <span 
                    class="tag-default tag-pill"
                    v-for="tag in tagList"
                    :key="tag"
                  >
                    <i 
                      class="ion-close-round"
                      @click="onDeleteTag(tag)"
                      :disabled="postDisabled"
                    ></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary" 
                type="button"
                @click="onPublish"
                :disabled="postDisabled"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  createArticle, 
  getArticle, 
  updateArticle 
} from '@/api/article'
export default {
  middleware: 'authenticated',
  name: 'EditorIndex',
  data() {
    return {
      slug: "",
      title: "",
      description: "",
      body: "",
      tag: "",
      tagList: [],
      postDisabled: false,
      errors: {},   // 错误信息
    }
  },
  async created() {
    const { slug } = this.$route.params
    if (slug) {
      this.slug = slug
      const { data } = await getArticle(slug)
      const { article } = data
      this.title = article.title
      this.description = article.description
      this.body = article.body
      this.tagList = article.tagList
    }
  },
  methods: {
    async onPublish() {
      const data = {
        article: {
          title: this.title,
          description: this.description,
          body: this.body,
          tagList: this.tagList
        }
      }

      this.postDisabled = true
      try {
        if (this.slug) {
          const { data: res } = await updateArticle(this.slug, data)
          this.$router.push({
            path: `/article/${res.article.slug}`
          })
        } else {
          const { data: res } = await createArticle(data)
          this.$router.push({
            path: `/article/${res.article.slug}`
          })
        }
      } catch (err) {
        this.errors = err.response.data.errors
      }
    },
    onEnterTag() {
      if (!this.tagList.includes(this.tag)) {
        this.tagList.push(this.tag)
        this.tag = ""
      }
    },
    onDeleteTag(tag) {
      const id = this.tagList.indexOf(tag)
      if (id !== -1) {
        this.tagList.splice(id, 1)
      }
    },
  },
  head () {
    return {
      title: `Editor - Conduit`
    }
  }
}
</script>

<style scoped>

</style>