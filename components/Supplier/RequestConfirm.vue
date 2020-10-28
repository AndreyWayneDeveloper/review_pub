<template lang='pug'>
.confirm
  nuxt-link(to='/personal/supply-request-confirm').confirm__back-list
    img(src='/image/arrBack.svg').confirm__back-list-icon
    Title(typed='regular-14').confirm__back-list-title Вернуться в заказы для подтверждения
  H1(typed='regular-36').confirm__head Заказ для подтверждения
  .confirm__content
    .confirm__detail
      .confirm__detail-head Заполните даты поставки и количество
      .confirm__detail-items
        .c-item.confirm__detail-item(
          v-for='(item, i) in rest.products'
          :key='item.id'
        )
          .c-item__head
            .c-item__image(
              :style='{ backgroundImage: `url(${ item.image })` }'
            )
            .c-item__info
              .c-item__name {{ item.name }}
              .c-item__color(
                v-if='item.color'
              )
                .c-item__color-circle(
                  :style='colorHex(item.color)'
                  :class='{ "c-item__color-circle_border_gray": item.color.name === "Белый"  }'
                )
                .c-item__color-name {{ item.color.name }}
          .c-item__table
            .c-item__column.c-item__column_header
              .c-item__row.c-item__row_type_size.c-item__row_header
                .c-item__title.c-item__title_head Размер
              .c-item__row.c-item__row_type_request.c-item__row_header
                .c-item__title.c-item__title_head Запрошенное количество
              .c-item__row.c-item__row_type_supplied.c-item__row_header
                .c-item__title.c-item__title_head Поставляемое количество
              .c-item__row.c-item__row_type_date.c-item__row_header
                .c-item__title.c-item__title_head Дата поставки
              .c-item__row.c-item__row_type_comment.c-item__row_header
                .c-item__title.c-item__title_head Комментарий
              .c-item__row.c-item__row_type_number.c-item__row_header
                .c-item__title.c-item__title_head Номер отправление
              .c-item__row.c-item__row_type_action.c-item__row_header
                .c-item__title.c-item__title_head.c-item__title_opacity Действия
            .c-item__column(
              v-for='(skuItem, skuIndex) in item.sku'
              :key='skuIndex'
              :class='{ "c-item__column_canceled": skuItem.canceled }'
            )
              CommentConfirm(
                :api='skuItem'
                :rest='{ parent: i, children: skuIndex }'
                @changeComment='changeComment'
                :count='skuItem.popup'
              )
              .c-item__row.c-item__row_type_size
                .c-item__title.c-item__title_head.c-item__title_head-mobile Размер
                .c-item__title {{ skuItem.size }}
              .c-item__row.c-item__row_type_request
                .c-item__title.c-item__title_head.c-item__title_head-mobile Запрошенное количество
                .c-item__title {{ skuItem.quantity }}
              .c-item__row.c-item__row_type_supplied
                .c-item__title.c-item__title_head.c-item__title_head-mobile Поставляемое количество
                input(
                  v-model='skuItem.count'
                  :class='{ "c-item__input_error": skuItem.errors.count }'
                  type='number'
                  @input='validateCount(skuItem)'
                ).c-item__input
              .c-item__row.c-item__row_type_date
                .c-item__title.c-item__title_head.c-item__title_head-mobile Дата поставки
                Date(
                  :titleNames='skuItem.date'
                  @changeDate='changeDate'
                  :api='skuItem.date'
                  :rest='{ parent: i, children: skuIndex }'
                  :class='{ "gl-c-item-date_error": skuItem.errors.date }'
                ).gl-c-item-date
              .c-item__row.c-item__row_type_comment
                .c-item__title.c-item__title_head.c-item__title_head-mobile Комментарий
                .c-item__comment(
                  @click='openPopup(skuItem)'
                  :class='{ "c-item__comment_error": skuItem.errors.comment }'
                ) {{ commentTitle(skuItem.comment) }}
              .c-item__row.c-item__row_type_number
                .c-item__title.c-item__title_head.c-item__title_head-mobile Номер отправление
                .c-item__title {{ skuItem.name }}
              .c-item__row.c-item__row_type_action
                .c-item__title.c-item__title_head.c-item__title_head-mobile.c-item__title_opacity Действия
                img(src='/image/c-delete.svg').c-item__action-button(
                  v-if='!skuItem.canceled'
                  @click='toggleCanceled(true, skuItem)'
                )
                img(src='/image/c-return.svg').c-item__action-button(
                  v-else
                  @click='toggleCanceled(false, skuItem)'
                )
    .info.confirm__info
      .info__head Заказы для подтверждения
      .info__sum
        .info__sum-head Всего отправлений
        .info__sum-title {{ dataDispathUniq.length }}
      .info__content(
        v-if='dataDispath.length'
      )
        .info__section(
          v-for='(item, i) in dataDispathUniq'
          :key='i'
        )
          .info__name Отправление {{ i + 1 }}
          .info__date {{ item.date }}
      .info__actions
        .info__action(@click='save')
          img(src='/image/c-save.svg').info__action-icon
          .info__action-title Сохранить изменения
      .info__success(
        v-if='success'
      ) {{ success }}
      .info__error(
        v-if='error'
      ) {{ error }}
</template>

<script>
export default {
  props: {
    api: Object
  },
  data() {
    return {
      rest: this.api,

      showPopup: 0,

      success: '',
      error: '',

      watherSku: 0
    }
  },
  computed: {
    sku() {
      let sku = []

      this.rest.products.forEach(item => {
        item.sku.forEach(_item => {
          sku.push(_item)
        })
      })

      return sku
    },
    saveData() {
      return this.sku.map(item => {
        return {
          id: item.skuId,
          date: item.date,
          count: item.count,
          comment: item.comment,
          canceled: item.canceled
        }
      })
    },
    dataDispath() {
      return this.sku.filter(item => {
        return !item.canceled && item.date && item.count
      })
    },
    dataDispathUniq() {
      let names = this.dataDispath.map(item => { return item.name })

      let uniqNames = [...new Set(names)]

      return uniqNames
    }
  },
  methods: {
    colorHex(val) {
      if (val.image) {
        return {
          backgroundImage: `url(${ val.image })`
        }
      }

      return {
        backgroundColor: val.hex
      }
    },
    validateCount(el) {
      if (el.count < 0) {
        el.count = 0
      }

      if (el.count > el.quantity) {
        el.count = el.quantity
      }

      this.watherSku++
    },
    toggleCanceled(state, el) {
      if (state) {

        if (!el.comment) {
          el.typingComment = true
          el.popup++
        }
      }

      if (!state) {
        el.canceled = state
      }

      if (state && el.comment) {
        el.canceled = state
      }

      this.watherSku++
    },
    commentTitle(state) {
      return state ? 'Изменить' : 'Добавить'
    },
    changeDate(val) {
      this.rest.products[val.parent]['sku'][val.children]['date'] = val.value

      this.watherSku++
    },
    changeComment(val) {
      if (val.canceled) {
        this.rest.products[val.parent]['sku'][val.children]['comment'] = val.value
        this.rest.products[val.parent]['sku'][val.children]['typingComment'] = false
        this.rest.products[val.parent]['sku'][val.children]['errors'] = {
          count: false,
          comment: false,
          date: false
        }

        this.rest.products[val.parent]['sku'][val.children]['name'] = ''
        this.rest.products[val.parent]['sku'][val.children]['canceled'] = true

        this.watherSku++
      } else {
        this.rest.products[val.parent]['sku'][val.children]['comment'] = val.value
        this.rest.products[val.parent]['sku'][val.children]['typingComment'] = false

        this.watherSku++
      }
    },
    openPopup(el) {
      el.popup++

      this.watherSku++
    },
    validate() {
      let errors = []

      if (this.rest.products.length) {
        this.rest.products.forEach((item, i) => {

          item.sku.forEach((skuItem) => {
            if (!skuItem.canceled) {

              if (+skuItem.count === 0) {
                skuItem.errors.count = true
                errors.push(1)
              } else {
                skuItem.errors.count = false
              }

              if (!skuItem.date) {
                skuItem.errors.date = true
                errors.push(1)
              } else {
                skuItem.errors.date = false
              }

            } else {
              if (!skuItem.comment) {
                skuItem.errors.comment = true
                errors.push(1)
              } else {
                skuItem.errors.comment = false
              }
            }
          })

        })

        return errors.length
      }
    },
    async save() {
      let validate = this.validate()

      if (!validate) {

        let {
          data
        } = await axios.post(`${ process.env.apiUrl }personal/supplier/orders/approve/${ this.$route.params.id }`,
        {
          "products": this.saveData
        },
        {
          headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
        })

        if (data.status === 'ok') {
          this.success = 'Успешно'

          this.$router.replace({ path: `/personal/supply-request-confirm` })
        } else {
          this.error = 'Ошибка при сохранении'
        }

        setTimeout(() => {
          this.success = ''
          this.error = ''
        }, 2500)
      }
    }
  },
  watch: {
    watherSku() {
      this.sku.forEach((skuItem) => {
        let skuId = [...new Set(this.dataDispath.map(item => { return item.date }))]
        let skuIdIndex = skuId.findIndex(item => { return item === skuItem.date }) + 1

        if (skuItem.date) {
          skuItem.name = `Отправление ${ skuIdIndex }`
        } else {
          skuItem.name = ''
        }

        if (skuItem.canceled) {
          skuItem.name = ''
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
.confirm {
  color: @black;

  &__back-list {
    display: flex;
    align-items: center;

    &-title {
      margin-left: 6px;
      color: @black;
    }

  }

  &__head {
    margin-top: 25px;
    margin-bottom: 25px;
    @media screen and (max-width: @tablet) {
      margin-top: 30px;
      margin-bottom: 30px;
    }
  }

  &__content {
    display: flex;
    justify-content: space-between;

    @media screen and (max-width: 1780px) {
      flex-direction: column;
    }
  }

  &__detail {
    max-width: 987px;
    width: 100%;
    padding-top: 30px;
    border-top: 1px solid @gray;

    &-head {
      font-size: 25px;
      color: @black;
    }

    &-items {
      margin-top: 5px;
    }
  }
}

.c-item {
  width: 100%;
  padding: 25px 30px;
  border-radius: 3px;
  border: 1px solid @gray;
  margin-top: 20px;
  overflow: hidden;

  @media screen and (max-width: @laptop) {
    padding: 20px 15px;
  }

  &__head {
    display: flex;
  }

  &__image {
    min-width: 50px;
    max-width: 50px;
    height: 50px;
    background-color: @gray;
    border-radius: 50%;
    margin-right: 15px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  &__name {
    font-size: 14px;
    color: @black;
    margin-bottom: 12px;
  }

  &__color {
    display: flex;
    align-items: center;

    &-circle {
      min-width: 14px;
      max-width: 14px;
      height: 14px;
      border-radius: 50%;
      margin-right: 5px;

      &_border_gray {
        border: 1px solid @gray-black;
      }

    }

  }

  &__table {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 21px;
  }

  &__column {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    align-items: center;

    &_canceled {
      position: relative;
      &:before {
        position: absolute;
        width: 150%;
        height: 100%;
        background-color: @gray;
        content: '';
        left: -30px;
        top: 0;
        opacity: 0.5;
        z-index: 2;
      }
    }

    @media screen and (max-width: @laptop) {
      flex-wrap: wrap;
      padding-top: 20px;
      border-top: 1px solid @gray;
    }

    &_header {
      padding-bottom: 9px;
      border-bottom: 1px solid @gray;
      margin-top: 0;
      align-items: flex-end;
      margin-bottom: 10px;

      @media screen and (max-width: @laptop) {
        display: none;
      }

    }

  }

  &__row {
    margin-right: 20px;

    &_type {

      &_size {
        max-width: 130px;
        min-width: 130px;
      }

      &_request {
        max-width: 80px;
        min-width: 80px;
      }

      &_supplied {
        max-width: 90px;
        min-width: 90px;
        margin-right: 70px;
      }

      &_date {
        max-width: 90px;
        min-width: 90px;
        margin-right: 70px;
      }

      &_comment {
        max-width: 70px;
        min-width: 70px;
        margin-right: 60px;
      }

      &_number {
        max-width: 100px;
        min-width: 100px;
        margin-right: 40px;
      }

      &_action {
        max-width: 90px;
        min-width: 90px;
        margin-right: 0px;
        z-index: 3;
      }

    }

    @media screen and (max-width: @laptop) {
      max-width: calc(50% - 10px);
      min-width: calc(50% - 10px);
      margin-right: 0;
      margin-bottom: 15px;
    }

  }

  &__title {
    font-size: 14px;
    color: @black;

    &_head {
      font-size: 12px;
      opacity: 0.5;

      @media screen and (max-width: @laptop) {
        display: none;
      }
    }

    &_opacity {
      opacity: 0;
    }

    &_head-mobile {
      display: none;
      @media screen and (max-width: @laptop) {
        display: block;
        margin-bottom: 10px;
      }
    }

  }

  &__input {
    width: 100%;
    height: 25px;
    padding: 0 11px;
    border: 1px solid @gray;
    border-radius: 3px;
    font-size: 14px;
    color: @black;

    &_error {
      border: 1px solid @red;
    }

  }

  &__comment {
    cursor: pointer;
    border-bottom: 1px solid @blue;

    &_error {
      border-bottom: 1px solid @red;
    }

  }

  &__action-button {
    cursor: pointer;
  }
}


.info {
  border: 1px solid @gray;
  border-radius: 5px;
  padding: 25px;
  color: @black;
  min-width: 270px;
  max-width: 270px;

  @media screen and (max-width: 1780px) {
    margin-top: 50px;
  }

  &__success {
    color: @green;
    margin-top: 15px;
    text-align: center;
  }

  &__error {
    color: @red;
    margin-top: 15px;
    text-align: center;
  }

  &__head {
    font-size: 25px;
    margin-bottom: 24px;
  }

  &__sum {

    &-head {
      font-weight: Medium;
      color: @gray;
      font-size: 16px;
      margin-bottom: 6px;
    }

    &-title {
      font-weight: Medium;
      font-size: 36px;
    }

  }

  &__content {
    margin-top: 31px;
    margin-bottom: 40px
  }

  &__section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 21px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  &__name {
    font-size: 16px;
    color: @gray;
    max-width: 100px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__date {
    font-size: 18px;
  }

  &__actions {
    margin-top: 40px;
  }

  &__action {
    display: flex;
    align-items: center;
    cursor: pointer;

    &-icon {
      margin-right: 10px;
    }

    &-title {
      font-size: 15px;
      font-family: Medium;
    }

  }
}
</style>
