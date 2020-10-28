<template lang='pug'>
.my-data
  H2(typed='regular-36').my-data__head Мои данные
  form.my-data__form
    .my-data__form-section
      .my-data__form-header ФИО
      input(
        v-model='name'
        :class='{ "my-data__form-input_error": $v.name.$error }'
      ).my-data__form-input
    .my-data__form-section
      .my-data__form-header E-mail
      input(
        v-model='email'
        :class='{ "my-data__form-input_error": $v.email.$error }'
      ).my-data__form-input
    .my-data__form-section.my-data__form-section_hidden
      .my-data__form-header Телефон
      input(
        v-mask="'+7 (###)-###-##-##'"
        v-model='apiPhone'
      ).my-data__form-input
    .my-data__form-section
      .my-data__form-header Телефон
      input(
        v-mask="'+7 (###)-###-##-##'"
        placeholder='+7 (___) ___ __ __'
        :class='{ "my-data__form-input_error": $v.phone.$error }'
        v-model='phone'
        @input='changePhone'
      ).my-data__form-input
    .my-data__form-section
      Button(
        :class='{ "my-data__button_disabled": validateSendCode }'
        :disabled='!(phone.length === 18)'
        typed='footer'
        @click.prevent='activateTimerConfirm(60)'
      ).my-data__button {{ confirmCodeTitle }}
    .my-data__confirm(v-if='showConfirm && phone.length === 18')
      .my-data__form-section
        .my-data__form-header Введите код подтверждения
        input(
          v-model='codeSms'
          v-mask="'####'"
          :class='{ errorInput: error.confirm }'
        ).my-data__form-input
      .my-data__form-section
        Button(
          :class='{ "my-data__button_disabled": !(codeSms.length === 4) }'
          :disabled='!(codeSms.length === 4)'
          @click.prevent='confirmSend'
          typed='footer'
        ).my-data__button Подтвердить
    .my-data__form-section
    Button(
      typed='footer'
      @click.prevent='save'
    ).my-data__button Сохранить
    .my-data__error(v-if='errorMessage') {{ errorMessage }}
    .my-data__success(v-if='success') {{ success }}
</template>

<script>
import axios from 'axios'

import { mask } from 'vue-the-mask'

import { required, requiredIf, minLength, maxLength, email, numeric } from 'vuelidate/lib/validators'

export default {
  props: {
    api: Object
  },
  data() {
    return {
      rest: this.api,
      name: "",
      email: "",
      phone: "",
      apiPhone: this.api.phone || '',
      phoneConfirmed: false,

      codeSms: '',
      showConfirm: false,

      phoneTimerStart: false,
      confirmTimer: 0,
      timing: null,

      error: {
        confirm: ''
      },
      errorMessage: '',

      success: ''
    }
  },
  computed: {
    validateSendCode() {
      return !(this.phone.length === 18) || this.phoneConfirmed || this.confirmTimer != 0
    },
    confirmCodeTitle() {
      if (!(this.phone.length === 18)) {
        return 'Подтвердить код'
      }

      if (!this.phoneConfirmed && this.phoneTimerStart && this.confirmTimer > 0) {
        return `Выслать код повторно через ${ this.confirmTimer } сек.`
      }

      if (!this.phoneConfirmed && this.phoneTimerStart && this.confirmTimer === 0) {
        return `Выслать код повторно`
      }

      if (!this.phoneConfirmed && !this.phoneTimerStart) {
        return `Подтвердить код`
      }

      return `Подтвердить код`
    }
  },
  methods: {
    async confirmSend() {
      if (this.codeSms.length < 4) {
        return false
      }

      let {
        data
      } = await axios.post(`${ process.env.apiUrl }user/check_code`, {
        phone: `+${ this.phone.replace(/\D+/g,"")}`,
        code: this.codeSms
      })

      if (data.status === 'ok') {
        this.phoneConfirmed = true
        this.timing = clearInterval(this.timing)
        this.phoneTimerStart = false
        this.confirmTimer = 0
        this.showConfirm = false
        this.codeSms = ''
        this.errorMessage = ''
      } else {
        this.errorMessage = 'Неверный код'

        return false
      }
    },
    async activateTimerConfirm(timer) {
      if (!this.validateSendCode) {
        let {
          data
        } = await axios.post(`${ process.env.apiUrl }user/send_code`, {
          phone: `+${ this.phone.replace(/\D+/g,"")}`
        })

        this.showConfirm = true

        this.phoneTimerStart = true

        if (this.confirmTimer === 0) {
          let timerSecond = timer || 10

          this.confirmTimer = timerSecond
        }

        this.timing = setInterval(() => {
          this.confirmTimer--
        }, 1000)
      }
    },
    changePhone() {
      if (this.phone != this.apiPhone && this.phone.length) {
        this.codeSms = ''
        this.showConfirm = false
        this.phoneConfirmed = false

        this.phoneTimerStart = false
        this.confirmTimer = 0
        this.timing = clearInterval(this.timing)

        this.error = {
          confirm: ''
        }
      }

      if (this.phone === this.apiPhone && this.phone.length) {
        this.phoneConfirmed = this.rest.phoneConfirmed
      }
    },
    async save() {
      this.$v.$touch()

      if (!this.phoneConfirmed && !this.$v.$error) {
        this.errorMessage = 'Подтвердите номер'

        return false
      }

      this.errorMessage = ''

      if (this.phoneConfirmed && !this.$v.$error) {

        let {
          data
        } = await axios.put(`${ process.env.apiUrl }personal/user/profile`, {
          "phone": this.phone,
          "email": this.email,
          "name": this.name
        }, {
          headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
        })

        this.success = 'Изменения сохранены!'

        let {
          data: myData
        } = await axios.get(`${ process.env.apiUrl }personal/user/profile`, {
          headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
        })

        this.rest.phone = myData.phone
        this.apiPhone = myData.phone

        this.success = ''
      }
    }
  },
  watch: {
    confirmTimer() {
      if (this.confirmTimer === 0) {
        this.timing = clearInterval(this.timing)
      }
    }
  },
  validations: {
    name: {
      required
    },
    email: {
      email,
      required
    },
    phone: {
      minLength: minLength(18),
      maxLength: maxLength(18),
      required
    }
  },
  created() {
    if (this.api) {
      this.name = this.rest.name
      this.email = this.rest.email
      this.phone = this.rest.phone
      this.phoneConfirmed = this.rest.phoneConfirmed
    }
  }
}
</script>

<style scoped lang='less'>
.my-data {

  &__head {
    margin-bottom: 40px;
  }

  &__form {
    max-width: 300px;

    @media screen and (max-width: @mobile) {
      max-width: 100%;
    }

  }

  &__error {
    color: @red;
    margin-top: 15px;
    text-align: center;
  }

  &__success {
    color: @green;
    margin-top: 15px;
    text-align: center;
  }

  &__form-section {
    margin-bottom: 30px;

    &:last-child {
      margin-bottom: 0;
    }

    &_hidden {
      display: none;
    }

  }

  &__form-header {
    font-size: 20px;
    margin-bottom: 6px;
    color: @black;
  }

  &__form-input  {
    height: 66px;
    width: 100%;
    padding-left: 30px;
    background: white;
    padding-right: 30px;
    border: 0;
    outline: 0;
    font-size: 18px;
    color: #231f1f;
    border-radius: 3px;
    border: solid 1px #979797;

    &_error {
      border: solid 1px @red;
    }

  }

  &__button {
    height: 66px;
    width: 100%;
    background: #3ebbed;
    max-width: 100%;
    border: 0;
    outline: 0;
    font-family: 'Medium',sans-serif;
    font-size: 15px;
    color: white;
    cursor: pointer;

    &_disabled {
      background-color: #edeff2;
      color: rgba(0,0,0,0.5);
      cursor: default;
    }
  }
}
</style>
