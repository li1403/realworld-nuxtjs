<template>
  <div class="article-meta">
    <nuxt-link :to="{
      name: 'profile',
      params: {
        username: article.author.username
      }
    }">
      <img :src="article.author.image"/>
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>

    <button
      class="btn btn-sm btn-outline-secondary"
      :class="{
        active: article.author.following
      }"
      @click="onFollow(article)"
      :disabled="article.author.followDisabled"
      v-if="!isSelf"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ article.author.following? "Unfollow": "Follow" }} {{ article.author.username }}
    </button>
    <button
      class="btn btn-sm btn-outline-secondary"
      @click="onEditArticle"
      :disabled="deleteDisabled"
      v-else
    >
      <i class="ion-edit"></i>
      &nbsp;
      Editor
    </button>
    &nbsp;
    <button
      class="btn btn-sm btn-outline-primary"
      :class="{
        active: article.favorited
      }"
      @click="onFavorite(article)"
      :disabled="article.favoriteDisabled"
      v-if="!isSelf"
    >
      <i class="ion-heart"></i>
      &nbsp;
      {{ article.favorited? "Unfavorite": "Favorite" }} Article <span class="counter">({{ article.favoritesCount }})</span>
    </button>
    <button
      class="btn btn-sm btn-danger"
      @click="onDeleteArticle"
      :disabled="deleteDisabled"
      v-else
    >
      <i class="ion-trash-a"></i>
      &nbsp;
      Delete Article
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { 
  addFavorite,
  deleteFavorite,
  deleteArticle
} from '@/api/article'
import { 
  followUser,
  unfollowUser
} from '@/api/profile'

export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      deleteDisabled: false,
    }
  },
  computed: {
    ...mapState(['user']),
    isSelf() {
      return this.user && this.article.author.username === this.user.username
    }
  },
  methods: {
    async onFavorite (article) {
      if (!this.user) {
        this.$router.push('/register')
        return
      }

      article.favoriteDisabled = true
      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
    async onFollow (article) {
      if (!this.user) {
        this.$router.push('/register')
        return
      }

      article.author.followDisabled = true
        if (article.author.following) {
          await unfollowUser(article.author.username)
          article.author.following = false
        } else {
          await followUser(article.author.username)
          article.author.following = true
        }
        article.author.followDisabled = false
    },
    async onDeleteArticle () {
      this.deleteDisabled = true
      await deleteArticle(this.article.slug)
      this.$router.push('/')
      this.deleteDisabled = false
    },
    onEditArticle() {
      this.$router.push({
        path: `/editor/${this.article.slug}`
      })
    }
  },
}
</script>

<style>

</style>