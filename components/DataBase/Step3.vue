<template lang='pug'>
.step-wr
  .step
    .form
      .bl
        .images
          Tooltip(
            title='Информация о фото'
            position='left'
          ).tooltip
            img(src='/image/tooltip.svg')
          .image.image--static(
            v-for='(item, i) in productGallery_name'
            :key='i'
            :style='{ backgroundImage: `url(${ item.link })` }'
          )
            .image-delete(@click='delete_file("productGallery", "productGallery_name", i, item)')
              img(src='/image/exit.svg' style='height: 8px; width: 8px;')
          label.photo
            input(
              type='file'
              name='file'
              @change='add_files("productGallery", "productGallery_name")'
              enctype="multipart/form-data"
            )
            AccountAddButton(title='Добавить').add
      .bl
        H4(typed='regular-14') Загрузите фотографии использования товара в среде:
        .images
          Tooltip(
            title='Информация о фото'
            position='left'
          ).tooltip
            img(src='/image/tooltip.svg')
          .image.image--static(
            v-for='(item, i) in useGallery_name'
            :key='i'
            :style='{ backgroundImage: `url(${ item.link })` }'
          )
            .image-delete(@click='delete_file("useGallery", "useGallery_name", i, item)')
              img(src='/image/exit.svg' style='height: 8px; width: 8px;')
          label.photo
            input(
              type='file'
              name='file'
              @change='add_files("useGallery", "useGallery_name")'
              enctype="multipart/form-data"
            )
            AccountAddButton(title='Добавить').add
      .bl
        H4(typed='regular-14') Вставьте код с youtube.com (если есть):
        .youtubes
          Tooltip(
            title='Информация о скидке'
            position='left'
          ).tooltip
            img(src='/image/tooltip.svg')
          input.youtube(
            v-model='videoLink'
            placeholder='Например PvrY6soZNeY'
          )
          AccountAddButton(
            v-if='false'
            @click.native='addNewVideo'
            title='Добавить ссылку'
          ).add
      .bl
        H4(typed='regular-14') Загрузите фото для рекламного блока:
        .images
          Tooltip(
            title='Информация о фото'
            position='left'
          ).tooltip
            img(src='/image/tooltip.svg')
          .image.image--static(
            v-for='(item, i) in recommendBlockImage_name'
            :key='i'
            :style='{ backgroundImage: `url(${ item })` }'
          )
          label.photo
            input(
              type='file'
              name='file'
              @change='add_file("recommendBlockImage", "recommendBlockImage_name")'
              enctype="multipart/form-data"
            )
            AccountAddButton(title='Добавить').add
      .bl.textarea-bl
        H4(typed='regular-14') Отображать рекламный блок:
        .checkboxs
          label
            input(
              type='checkbox'
              v-model='showOnMain'
            ).checkbox
            .checkbox-custom
            Title(typed='regular-16') на главной
          label(v-if='false')
            input(
              type='checkbox'
              v-model='showInDiscountBlock'
            ).checkbox
            .checkbox-custom
            Title(typed='regular-16') в скидках
          label
            input(
              type='checkbox'
              v-model='showInNewsBlock'
            ).checkbox
            .checkbox-custom
            Title(typed='regular-16') в новинках
          label
            input(
              type='checkbox'
              v-model='showInPromoBlock'
            ).checkbox
            .checkbox-custom
            Title(typed='regular-16') в промо-блоке
          label
            input(
              type='checkbox'
              v-model='showInPopularBlock'
            ).checkbox
            .checkbox-custom
            Title(typed='regular-16') в популярных
    .tutors
      .tutor
        H4(typed='regular-14') Требования к фотографии товара:
        Title(typed='regular-14') - прозрачный фон
        Title(typed='regular-14') - размер от 300*300 px до 1000*1000 px
        Title(typed='regular-14') - вес до 10мб
        .blue(v-if='false')
          Title(typed='regular-14') Пример
      .tutor
        H4(typed='regular-14') Требования к фотографии товара в среде(использование товара потребителем):
        Title(typed='regular-14') - размер от 300*300 px до 1000*1000 px
        Title(typed='regular-14') - вес до 10мб
        .blue(v-if='false')
          Title(typed='regular-14') Пример
      .tutor
        H4(typed='regular-14') Требования к видео:
        Title(typed='regular-14') - продолжительность до 40 сек
        Title(typed='regular-14') - качество от 720p
        .blue(v-if='false')
          Title(typed='regular-14') Пример
      .tutor
        H4(typed='regular-14') Требования к фотографии товара:
        Title(typed='regular-14') - прозрачный фон
        Title(typed='regular-14') - размер от 300*300 px до 1000*1000 px 
        Title(typed='regular-14') - вес до 10 Мб
        .blue(v-if='false')
          Title(typed='regular-14') Пример
  .buttons
    ButtonBack(title='Вернуться назад' @click.native="$store.commit('baseGoods/commitStep', 2)")
    Button(
      :class='{ "button-disabled": !validate }'
      @click.native='send'
      typed='footer'
      :data-loading='loader'
    ) {{ nameSend }}
</template>

<script>
export default {
  props: {
    api: Object
  }
  data() {
    return {
      showOnMain: false,
      showInDiscountBlock: false,
      showInNewsBlock: false,
      showInPromoBlock: false,
      showInPopularBlock: false,
      videoLink: '',
      productGallery: [],
      productGallery_name: [],
      useGallery: [],
      useGallery_name: [],
      recommendBlockImage: [],
      recommendBlockImage_name: [],
      blocked: false,

      errors: {
        photo: false,
      },

      loader: false
    }
  },
  computed: {
    validate() {
      if (
        this.productGallery_name.length
      ) {
        return true
      } else {
        return false
      }
    },
    storeValidate() {
      return {
        val1: this.$store.state.baseGoods.validateOne,
        val2: this.$store.state.baseGoods.validateTwo,
        val3: this.$store.state.baseGoods.validateThree
      }
    },
    nameSend() {
      return this.$route.query.type === 'change' ? 'Завершить редактирование товара': 'Завершить добавление товара'
    }
  },
  methods: {
    delete_file(name, name_name, index, el) {
      if (!el.id) {
        this[name].splice(index, 1)
        this[name_name].splice(index, 1)
      } else {
        axios.delete(`${ process.env.apiUrl }personal${ this.role}/product-base/product/${this.$route.query.id}/proto/${ el.id }`,
        {
          headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
        }).then(res => {
          this[name].splice(index, 1)
          this[name_name].splice(index, 1)
        })
      }
    },
    add_files(name, name_name) {
      let input = event.target
      this[name].push(input.files[0])

      //reader

      let preview = ''
      let file = event.target.files[0]
      let reader  = new FileReader()
      let vue = this

      reader.onloadend = function () {
        preview = reader.result
        vue[name_name].push({ id: null, link: preview })
      }

      if (file) {
        reader.readAsDataURL(file)
      } else {
        preview = ""
      }
    },
    add_file(name, name_name) {
      let input = event.target
      this[name].push(input.files[0])

      let preview = ''
      let file = event.target.files[0]
      let reader  = new FileReader()
      let vue = this

      reader.onloadend = function () {
        preview = reader.result

        vue[name_name].push(preview)

        if (this[name_name].length >= 1) {
          this[name].shift()
          this[name_name].shift()
        }
      }

      if (file) {
        reader.readAsDataURL(file)
      } else {
        preview = ""
      }

      if (this[name_name].length >= 1) {
        this[name].shift()
        this[name_name].shift()
      }
    },
    send() {
      !this.productGallery_name.length
        ? this.errors.photo = true
        : this.errors.photo = false


      if (this.validate) {
        this.$store.commit('baseGoods/commitStepThree', {
          showOnMain: this.showOnMain,
          showInDiscountBlock: this.showInDiscountBlock,
          showInNewsBlock: this.showInNewsBlock,
          showInPromoBlock: this.showInPromoBlock,
          videoLink: this.videoLink,
          productGallery: this.productGallery,
          useGallery: this.useGallery,
          recommendBlockImage: this.recommendBlockImage,
          showInPopularBlock: this.showInPopularBlock
        })

        if (this.$store.state.baseGoods.validateOne && this.$store.state.baseGoods.validateTwo && this.$store.state.baseGoods.validateThree) {
          this.loader = true

          let stepOne = this.$store.state.baseGoods.stepOne
          let stepTwo = this.$store.state.baseGoods.stepTwo
          let stepThree = this.$store.state.baseGoods.stepThree

          let formData = new FormData()

          formData.append('name', stepOne.name)
          formData.append('printName', stepOne.printName)
          // formData.append('countryId', stepOne.countryId)
          // formData.append('gtd', stepOne.gtd)
          formData.append('article', stepOne.article)
          formData.append('brand', +stepOne.brand)
          formData.append('measureId', +stepOne.measure)
          formData.append('weight', stepOne.weight)
          formData.append('packageWeight', stepOne.packageWeight)
          formData.append('countInPackage', stepOne.countInPackage)
          formData.append('packageVolume', stepOne.packageVolume)
          formData.append('price', stepOne.price)
          formData.append('discountPercent', stepOne.discountPercent)
          formData.append('categoryId', stepOne.categoryId)
          formData.append('times', stepOne.times)

          formData.append('videoLink', stepThree.videoLink)
          formData.append('advantages', stepTwo.advantages)
          formData.append('certificateId', stepTwo.certificateId)
          formData.append('protectiveFunctions', stepTwo.protectiveFunctions)
          formData.append('applications', stepTwo.applications)
          formData.append('comfort', stepTwo.comfort)
          formData.append('composition', stepTwo.composition)
          formData.append('description', stepTwo.description)

          if (stepTwo.sertificatesGallery.length) {
            stepTwo.sertificatesGallery.forEach((item, i) => {
              formData.append('sertificatesGallery[]', item)
            })
          }

          if (stepTwo.sizes.length) {
            stepTwo.sizes.forEach((item, i) => {
              formData.append('sizes[]', item)
            })
          } else {
            // formData.append('sizes[]', 0)
          }

          if (this.$route.query.type === 'create') {
            if (stepTwo.colors.length) {
              stepTwo.colors.forEach((item, i) => {
                formData.append('colors[]', item)
              })
            }
          } else {
            formData.append('color', stepTwo.colors)
          }


          if (stepTwo.properties.length) {
            stepTwo.properties.forEach((item, i) => {
              formData.append('properties[]', item)
            })
          }

          if (stepTwo.standards.length) {
            stepTwo.standards.forEach((item, i) => {
              formData.append('standards[]', item)
            })
          }

          if (stepTwo.recommendations.length) {
            stepTwo.recommendations.forEach((item, i) => {
              formData.append('recommendations[]', item)
            })
          }


          if (stepThree.productGallery.length) {
            stepThree.productGallery.forEach((item, i) => {
              formData.append('productGallery[]', item)
            })
          }

          if (stepThree.useGallery.length) {
            stepThree.useGallery.forEach((item, i) => {
              formData.append('useGallery[]', item)
            })
          }

          if (stepThree.recommendBlockImage.length) {
            // stepThree.recommendBlockImage.forEach((item, i) => {
            let filterRec = stepThree.recommendBlockImage.filter(item => {
              return item != 0
            })

            if (filterRec.length) {
              formData.append('recommendBlockImage', filterRec[0])
            }
            // })
          }

          let showOnMain = 0
          let showInNewsBlock = 0
          let showInPromoBlock = 0
          let showInDiscountBlock = 0
          let showInPopularBlock = 0
          let declineDiscounts = 0

          if (stepThree.showOnMain) { showOnMain = 1 }
          if (stepThree.showInNewsBlock) { showInNewsBlock = 1 }
          if (stepThree.showInPromoBlock) { showInPromoBlock = 1 }
          if (stepThree.showInDiscountBlock) { showInDiscountBlock = 1 }
          if (stepThree.showInPopularBlock) { showInPopularBlock = 1 }
          if (stepOne.declineDiscounts) { declineDiscounts = 1 }

          formData.append('showOnMain', showOnMain)
          formData.append('showInNewsBlock', showInNewsBlock)
          formData.append('showInPromoBlock', showInPromoBlock)
          formData.append('showInDiscountBlock', showInDiscountBlock)
          formData.append('showInPopularBlock', showInPopularBlock)
          formData.append('declineDiscounts', declineDiscounts)

          this.blocked = true

          if (this.blocked) {
            axios({
              url: `${ process.env.apiUrl }personal${ this.role}/product-base/product/${ this.$route.query.id }`,
              headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${ this.$cookies.get('token') }`
              },
              method: 'post',
              data: formData
            }).then(data => {
              if (data.data.status === 'ok') {
                this.$store.commit('baseGoods/commitDone')

                window.scrollTo(0,0)

                this.blocked = false
              } else {
                alert(data.data.message)
              }

              this.loader = false
            }).catch(err => {
              this.loader = false
              alert(err)
            })
          }
        }
      }
    }
  },
  watch: {
    validate() {
      this.$store.commit('baseGoods/commitValidate', {
        name: 'validateThree',
        status: this.validate
      })
    },
    api() {
      if (this.api) {
        this.showOnMain = Boolean(this.api.showOnMain)
        // this.showInDiscountBlock = this.api.showInDiscountBlock
        this.showInNewsBlock = Boolean(this.api.showInNewsBlock)
        this.showInPromoBlock = Boolean(this.api.showInPromoBlock)
        this.showInPopularBlock = Boolean(this.api.showInPopularBlock)

        if (this.api.videoLink && this.api.videoLink != 'null') {
          this.videoLink = this.api.videoLink
        } else {
          this.videoLink = ''
        }

        this.productGallery_name = this.api.productGallery

        this.useGallery_name = this.api.useGallery

        if (this.api.recommendBlockImage) {
          this.recommendBlockImage_name = [this.api.recommendBlockImage]
          this.recommendBlockImage = [0]
        }
      }
    }
  },
  created() {
    if (this.api) {
      this.showOnMain = Boolean(this.api.showOnMain)
      // this.showInDiscountBlock = this.api.showInDiscountBlock
      this.showInNewsBlock = Boolean(this.api.showInNewsBlock)
      this.showInPromoBlock = Boolean(this.api.showInPromoBlock)
      this.showInPopularBlock = Boolean(this.api.showInPopularBlock)

      if (this.api.videoLink && this.api.videoLink != 'null') {
        this.videoLink = this.api.videoLink
      } else {
        this.videoLink = ''
      }

      this.productGallery_name = this.api.productGallery

      this.useGallery_name = this.api.useGallery

      if (this.api.recommendBlockImage) {
        this.recommendBlockImage_name = [this.api.recommendBlockImage]
        this.recommendBlockImage = [0]
      }
    }
  }
}
</script>
