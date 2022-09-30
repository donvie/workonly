<template>
  <q-page class="flex flex-center" padding>
    <q-card class="q-pa-lg" flat bordered>
      <div class="row signup-form">
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
          <q-input
            ref="password"
            dense
            :rules="[
              val => val && val.length > 0 || 'Confirm Password can not be empty!',
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
        <div class="col-12 q-mb-sm">
          <q-input
            ref="confirm_password"
            dense
            :rules="[
              val => val && val.length > 0 || 'Confirm Password can not be empty!',
              val => val.length >= 7 || 'Password atleast 7 characters',
            ]"
            color="primary"
            :type="isPwd ? 'password' : 'text'"
            placeholder="Enter your confirm password"
            v-model="confirmPassword"
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
        <div class="col-12 q-mb-xs">
          <q-btn dense @click="register()" :loading="isLoading" class="full-width" unelevated color="positive" no-caps label="Register" />
        </div>
        <div class="col-12 text-center q-mb-xl">
          Already have an account? <router-link to="/auth/login">Login</router-link>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'PageRegister',
  data () {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      isPwd: true,
      isLoading: false
    }
  },
  methods: {
    register () {
      this.$refs.email.validate()
      this.$refs.password.validate()
      this.$refs.confirm_password.validate()

      if (this.$refs.email.hasError || this.$refs.password.hasError || this.$refs.confirm_password.hasError) {
        this.formHasError = true
      } else if (this.password !== this.confirmPassword) {
        this.$q.notify({
          icon: 'close',
          message: 'Password does not match!',
          color: 'negative'
        })
      } else {
        this.isLoading = true
        this.$axios({
          method: 'post',
          url: '/api/v1/register',
          headers: {
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
            message: 'You have successfully registered.',
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
.signup-form {
  width: 270px;
}
.text-underline {
  text-decoration: underline;
}
</style>
