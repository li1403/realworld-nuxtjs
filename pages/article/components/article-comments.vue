<template>
  <div>

    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <template v-if="user">
          <form class="card comment-form">
            <div class="card-block">
              <textarea 
                v-model="comment"
                class="form-control" 
                placeholder="Write a comment..." 
                rows="3"
                :disabled="this.postDisabled"
              >
              </textarea>
            </div>
            <div class="card-footer">
              <img :src="user.image" class="comment-author-img" />
              <button 
                class="btn btn-sm btn-primary"
                @click="postComments"
                :disabled="this.postDisabled"
              >
              Post Comment
              </button>
            </div>
          </form>
        </template>
        <template v-else>
          <p>
            <nuxt-link class="nav-link" to="/login">Sign in</nuxt-link> or <nuxt-link class="nav-link" to="/register">sign up</nuxt-link> to add comments on this article.
          </p>
        </template>

        <div 
          class="card"
          v-for="(comment, index) in comments"
          :key="comment.id"
        >
          <div class="card-block">
            <p class="card-text">{{ comment.body }}</p>
          </div>
          <div class="card-footer">
            <nuxt-link class="comment-author" :to="{
              name: 'profile',
              params: {
                username: comment.author.username
              }
            }">
              <img :src="comment.author.image" class="comment-author-img" />
            </nuxt-link>
            &nbsp;
            <nuxt-link class="comment-author" :to="{
              name: 'profile',
              params: {
                username: comment.author.username
              }
            }">
              {{ comment.author.username }}
            </nuxt-link>
            <span class="date-posted">{{ comment.createdAt | date('MMM DD,YYYY') }}</span>
            <span class="mod-options" v-if="user && comment.author.username === user.username">
              <i class="ion-trash-a" @click="deleteComments(comment.id, index)"></i>
            </span>
          </div>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script>
import { 
  getComments,
  addComments,
  deleteComments
} from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true,
    }
  },
  data () {
    return {
      comment: "",
      comments: [],
      postDisabled: false,
      deleteDisabled: false,
    }
  },
  computed: {
    ...mapState(['user']),
  },
  async mounted () {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  },
  methods: {
    async postComments() {
      if (!this.user) {
        this.$router.push('/register')
        return
      }

      this.postDisabled = true
      const { data } = await addComments(this.article.slug, {
        comment: {
          body: this.comment
        }
      })
      this.comments.unshift(data.comment)
      this.postDisabled = false
    },
    async deleteComments(id, index) {
      if (!this.user) {
        this.$router.push('/register')
        return
      }

      if (this.deleteDisabled) { return }

      this.deleteDisabled = true
      await deleteComments(this.article.slug, id)
      this.comments.splice(index, 1)
      this.deleteDisabled = false
    }
  }
}
</script>

<style>

</style>