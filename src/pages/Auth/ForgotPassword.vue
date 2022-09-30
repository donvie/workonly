<template>
  <q-page class="flex flex-center" padding>
    <q-card class="q-pa-lg" flat bordered>
      <div class="row forgot-password-form">
        <div class="col-12 text-center q-mb-xl">
          <q-icon name="desktop_mac" size="72px" />
        </div>
        <div class="col-12 q-mb-sm">
          <q-input
            ref="email"
            dense
            color="primary"
            :rules="[ val => val && val.length > 0 || 'Email can not be empty!']"
            placeholder="Enter your email"
            v-model="email"
            type="email"
            outlined
          />
        </div>
        <div class="col-12 q-mb-sm">
          <q-btn dense @click="resetPassword()" :loading="isLoading" class="full-width" unelevated color="positive" no-caps label="Reset password" />
        </div>
        <div class="col-12 text-center q-mb-xl">
          Go back <router-link to="/auth/login">Login</router-link>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'PageForgotPassword',
  data () {
    return {
      email: '',
      isLoading: false
    }
  },
  methods: {
    resetPassword () {
      this.$refs.email.validate()

      if (this.$refs.email.hasError) {
        this.formHasError = true
      } else {
        this.isLoading = true
        this.$axios({
          method: 'post',
          url: 'api/v1/forget',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            Authorization: 'Bearer {token}'
          },
          data: {
            email: this.email,
            password: this.password
          }
        }).then((response) => {
          this.isLoading = false
          this.$q.notify({
            icon: 'done',
            message: 'Success!',
            color: 'positive'
          })
        }).catch(error => {
          this.isLoading = false
          console.log('error', error)
          this.$q.notify({
            icon: 'close',
            message: 'Error!',
            color: 'negative'
          })
        })
      }
    }
  }
}
</script>

<style scoped>
.forgot-password-form {
  width: 270px;
}
.text-underline {
  text-decoration: underline;
}
</style>
