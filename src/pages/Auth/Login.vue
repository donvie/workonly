<template>
  <q-page class="flex flex-center" padding>
    <q-card class="q-pa-lg" flat bordered>
      <div class="row login-form">
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
        <div class="col-12 q-mb-xs">
          <q-input
            ref="password"
            dense
            :rules="[
              val => val && val.length > 0 || 'Password can not be empty!',
              val => val.length >= 7 || 'Password atleast 7 characters',
            ]"
            color="primary"
            :type="isPwd ? 'password' : 'text'"
            placeholder="Enter your password"
            v-model="password"
            outlined
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>
        <div class="col-12 q-mb-lg">
          <span class="text-underline"><router-link to="/auth/forgot-password">Forgot Password?</router-link></span>
        </div>
        <div class="col-12 q-mb-xs">
          <q-btn dense @click="login()" :loading="isLoading" class="full-width" unelevated color="positive" no-caps label="Login with email" />
        </div>
        <div class="col-12 text-center q-mb-xl">
          Dont have an account? <router-link to="/auth/register">Register</router-link>
        </div>
        <div class="col-12 text-center">
          By clicking login you agree to the <span class="text-underline">Terms and Conditions.</span>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'PageLogin',
  data () {
    return {
      email: '312129003@qq.com',
      password: '1234567',
      isPwd: true,
      isLoading: false
    }
  },
  methods: {
    login () {
      this.$refs.email.validate()
      this.$refs.password.validate()

      if (this.$refs.email.hasError || this.$refs.password.hasError) {
        this.formHasError = true
      } else {
        this.isLoading = true
        this.$axios({
          method: 'post',
          url: 'api/v1/login',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer {token}'
          },
          data: {
            email: this.email,
            password: this.password
          }
        }).then((response) => {
          console.log(response)
          this.$q.localStorage.set('WorkOnlyUser', response.data)
          this.$router.push('/')
          this.isLoading = false
          this.$q.notify({
            icon: 'done',
            message: 'You have successfully logged in.',
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
.login-form {
  width: 270px;
}
.text-underline {
  text-decoration: underline;
}
</style>
