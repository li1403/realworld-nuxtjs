<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input v-model="user.image" class="form-control" type="text" placeholder="URL of profile picture">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="user.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="user.email" class="form-control form-control-lg" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" @click.prevent="onClickUpdate">
                Update Settings
              </button>
            </fieldset>
          </form>

          <hr/>

          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getUser, updateUser } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  middleware: 'authenticated',
  name: 'SettingsIndex',
  data() {
    return {
      user: {
        email: "",
        username: "",
        bio: "",
        image: "",
        password: "",
      },
      updateDisabled: false,
    }
  },
  async created() {
    const { data } = await getUser()
    this.user = data.user
    this.user.image = this.user.image || "https://api.realworld.io/images/smiley-cyrus.jpeg"
  },
  methods: {
    async onClickUpdate() {
      this.updateDisabled = true
      const { data } = await updateUser({
        user: this.user
      })
      this.$store.commit('setUser', data.user)
      this.$router.push({
        path: `/profile/${data.user.username}`
      })
    },
    logout() {
      this.$store.commit('setUser', null)

      // 数据持久化
      Cookie.set('user', '')

      // 跳转到首页
      this.$router.push('/')
    }
  },
  head () {
    return {
      title: `Settings - Conduit`
    }
  }
}
</script>

<style scoped>

</style>