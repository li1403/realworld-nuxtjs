<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button 
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{
                active: profile.following
              }"
              @click="onFollow()"
              :disabled="followDisabled"
              v-if="user && profile.username !== user.username"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ profile.following? "Unfollow": "Follow" }} {{ profile.username }}
            </button>
            <button 
              class="btn btn-sm btn-outline-secondary action-btn" 
              @click="onClickEditProfile"
              v-else
            >
              <i class="ion-gear-a"></i>
              &nbsp;
              Edit Profile Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="posts-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{
                    active: isMyPostTab
                  }"
                  @click="onClickTab('myPost')"
                >
                  My Articles
                </button >
              </li>
              <li class="nav-item">
                <button 
                  class="nav-link"
                  :class="{
                    active: !isMyPostTab
                  }"
                  @click="onClickTab('favoritePost')"
                >
                  Favorited Articles
                </button >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in currentList.articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }">
                <img :src="article.author.image" />
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
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link 
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul
                v-for="tag in article.tagList" 
                :key="tag"
                class="tag-list"
              >
                <li class="tag-default tag-pill tag-outline">
                  {{ tag }}
                </li>
              </ul>
            </nuxt-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile } from '@/api/profile'
import { getArticles, addFavorite, deleteFavorite } from '@/api/article'
import { followUser, unfollowUser } from '@/api/profile'
import { mapState } from 'vuex'
export default {
  middleware: 'authenticated',
  name: 'UserProfile',
  data() {
    return {
      profile: {},
      currentTab: "myPost",
      myPostList: {},
      favoritePostList: {},
      followDisabled: false
    }
  },
  computed: {
    ...mapState(['user']),
    isMyPostTab() {
      return this.currentTab === "myPost"
    },
    currentList() {
      return this.currentTab === "myPost"? this.myPostList: this.favoritePostList
    }
  },
  async created() {
    const { username } = this.$route.params
    if (username) {
      const [ profileRes, articleRes ] = await Promise.all([
        getProfile(username),
        getArticles({ author: username })
      ])
      this.profile = profileRes.data.profile
      this.myPostList = articleRes.data
    }    
  },
  methods: {
    async onClickTab(tab) {
      if (this.currentTab !== tab) {
        this.currentTab = tab
        const { username } = this.$route.params
        if (this.currentTab === "myPost") {
          const { data } = await getArticles({ author: username })
          this.myPostList = data
        } else {
          const { data } = await getArticles({ favorited: username })
          this.favoritePostList = data
        }
      }
    },
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
    async onFollow () {
      if (!this.user) {
        this.$router.push('/register')
        return
      }

      this.followDisabled = true
      if (this.profile.following) {
        await unfollowUser(this.profile.username)
        this.profile.following = false
      } else {
        await followUser(this.profile.username)
        this.profile.following = true
      }
      this.followDisabled = false
    },
    onClickEditProfile () {
      this.$router.push({
        path: '/settings'
      })
    }
  },
  head () {
    return {
      title: `@${this.$route.params.username} - Conduit`
    }
  }
}
</script>

<style scoped>

</style>