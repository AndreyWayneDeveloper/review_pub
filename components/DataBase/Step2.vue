<template lang='pug'>
.step
  .head
    .bl.colors
      H4(typed='regular-14' :class='{ "error-require": errors.getColors }') Цвет: <span class='require-val'>*</span>
      .colors-items(v-if='$route.query.type === "create"')
        .colors-item(
          v-for='(item, i) in colors'
          :style='colorHex(item)'
          :class='{ "colors-item-white": item.name === "Белый" || item.name === "Прозрачный", "color-disabled": item.disabled }'
        )
          label.label-ch
            .tooltip-color
              Title(typed='regular-14') {{ item.name }}
            input(
              type='checkbox'
              v-model='getColors'
              :value='item.id'
              :disabled='item.disabled'
            )
            .checked
      .colors-items(v-else)
        .colors-item(
          v-for='(item, i) in colors'
          :style='colorHex(item)'
          :class='{ "colors-item-white": item.name === "Белый" || item.name === "Прозрачный" }'
          :key='i'
        )
          label.label-ch
            .tooltip-color
              Title(typed='regular-14') {{ item.name }}
            input(
              type='radio'
              v-model='getColors'
              :value='item.id'
            )
            .checked
    .bl.sizes
      H4(typed='regular-14') Размеры
      .sizes-wr
        .sizes-items
          .sizes-item(
            v-for='(item, i) in sizes'
            :key='i'
          )
            Title(
              typed='regular-14'
              :class='{ active: item.active }'
            ).full {{ item.name }}
            label
              input(
                type='checkbox'
                v-model='getSize'
                :value='item.id'
              )
              .checked
        nuxt-link(
          to='/table-size'
          target='_blank'
        )
          ButtonNext(title='Таблицы размеров')
  .el(
    v-for='(item, i) in propsValues'
    :key='i'
  )
    .input__el(v-if='item.type === 3')
      H4(typed='regular-14' :class='{ "error-require": item.error }') {{ item.name }} <span v-if='item.required' class='require-val'>*</span>
      input(
        v-model='item.value'
      )
    .input__el(v-if='item.type === 1')
      H4(typed='regular-14' :class='{ "error-require": item.error }') {{ item.name }} <span  v-if='item.required' class='require-val'>*</span>
      input(
        type='number'
        v-model='item.value'
        min='0'
      )
    .input__el(v-if='item.type === 4')
      H4(typed='regular-14' :class='{ "error-require": item.error }') {{ item.name }} <span  v-if='item.required' class='require-val'>*</span>
      label
        input(
          type='checkbox'
          v-model='item.value'
          placeholder=''
        ).checkbox-props
        .checkbox-props-custom

  .checkboxs
    .el(
      v-for='(item, i) in propsValuesSelect'
      :key='i'
    )
      .bl.check-bl(v-if='item.type === 2 && item.multiple === true && item.values')
        H4(typed='regular-14' :class='{ "error-require": item.error }') {{ item.name }} <span  v-if='item.required' class='require-val'>*</span>
        label(
          v-for='(_item) in item.values'
        )
          input(
            :value='_item.value'
            v-model='item.value'
            type='checkbox'
          ).checkbox
          .checkbox-custom
          Title(typed='regular-16') {{ _item.value }}
      .bl.check-bl(v-if='item.type === 2 && item.multiple === false && item.values')
        H4(typed='regular-14' :class='{ "error-require": item.error }') {{ item.name }} <span  v-if='item.required' class='require-val'>*</span>
        label(
          v-for='(_item) in item.values'
        )
          input(
            :value='_item.value'
            v-model='item.value'
            type='radio'
            @click='clickedRadio(item, _item)'
          ).checkbox
          .checkbox-custom
          Title(typed='regular-16') {{ _item.value }}
  .checkboxs
    .bl.check-bl
      H4(typed='regular-14' :class='{ "error-require": errors.getStandards }') Стандарты <span class='require-val'>*</span>
      label(
        v-for='(item) in standards'
      )
        input(
          :value='item.id'
          v-model='getStandards'
          type='checkbox'
        ).checkbox
        .checkbox-custom
        .recommendation-image(:style='{ backgroundImage: `url(${ item.image })` }' v-if='item.image')
        Title(typed='regular-16') {{ item.name }}
  .checkboxs
    .bl.check-bl
      H4(typed='regular-14') Рекомендации по уходу
      label(
        v-for='(item) in recommendations'
      )
        input(
          :value='item.id'
          v-model='getRecommendations'
          type='checkbox'
        ).checkbox
        .checkbox-custom
        .recommendation-image(:style='{ backgroundImage: `url(${ item.image })` }' v-if='item.image')
        Title(typed='regular-16') {{ item.name }}
  .bl.bl-standards(v-if='false')
    H4(typed='regular-14') Свойства
    ProvDataBaseStepColumn
    ProvDataBaseStepColumnItem(
      v-for='(item, i) in props'
      :key='i'
      :api='item'
      :apiSelect='propsSelect'
    )
    AddButtonMin(title='Добавить').bl-standards-table
  .bl.bl-standards(v-if='false')
    H4(typed='regular-14') Разделы каталога
    DataBaseSection
    nuxt-link(to='/personal/control-categories/work?create=true').bl-link-create
      AddButtonMin(title='Добавить').bl-standards-table
  .textareas
    .bl.textarea-bl
      H4(typed='regular-14') Основные преимущества
      textarea(
        v-model='advantages'
      )
      transition(name='opacityFast')
        .error(v-if='false')
          Title(typed='regular-12') Заполните это поле
    .bl.textarea-bl
      H4(typed='regular-14') Защитные функции (перечислите через запятую):
      textarea(
        v-model='protectiveFunctions'
      )
    .bl.textarea-bl
      H4(typed='regular-14') Области применения (через точку с запятой)
      textarea(
        v-model='applications'
      )
    .bl.textarea-bl
      H4(typed='regular-14') Комфорт (описание)
      textarea(
        v-model='comfort'
      )
    .bl.textarea-bl
      H4(typed='regular-14') Состав (через точку с запятой)
      textarea(
        v-model='composition'
      )
    .bl.textarea-bl
      H4(typed='regular-14') Введите текст описания
      textarea(
        v-model='description'
        placeholder='Не более 1000 символов'
        :class='{ "error-texta": descError }'
      )
    .input__el.input__el--cert(v-if='certList.length')
      H4(typed='regular-14' :class='{ "error-require": errors.cert }') Сертификат <span class='require-val'>*</span>
      SelectMin(
        title='Сертификаты'
        :api='certList'
        name='cert'
        @cert='select_data_cert'
        :init='initCert'
      )
  .buttons
    ButtonBack(title='Вернуться назад' @click.native="$store.commit('baseGoods/commitStep', 1)")
    Button(
      typed='footer'
      @click.native='send'
      :class='{ "button-disabled": !validate }'
      :data-loading='loader'
    ) {{ nameSend }}
</template>

<script>
export default {
  props: {
    api: Object
  },
  data() {
    return {
      /* api */
      colors: [],
      sizes: [],
      props: [],
      propsSelect: [],
      propsList: [],
      propsString: [],
      standards: [],
      recommendations: [],
      certList: [],
      cert: null,

      getColors: [],
      getSize: [],
      getStandards: [],
      getRecommendations: [],
      propsValues: [],
      propsValuesSelect: [],
      advantages: '',
      comfort: '',
      applications: '',
      protectiveFunctions: '',
      composition: '',
      sertificatesGallery: [],
      sertificatesGallery_name: [],
      description: '',
      blocked: false,
      descError: false,

      errors: {
        propsValues: false,
        getStandards: false,
        getColors: false,
        cert: false
      },

      loader: false
    }
  },
  computed: {
    initCert() {
      return this.cert ? this.cert : ''
    },
    getCert() {
      return this.cert ? this.cert.id : ''
    },
    getProps() {
      let data = [...this.propsValues, ...this.propsValuesSelect].filter(item => {
        return item.value
      })

      if (data.length) {
        return data.map(item => {
          return Array.isArray(item.value)
            ? JSON.stringify({ id: item.id, values: item.value })
            : JSON.stringify({ id: item.id, values: [item.value] })
        })
      } else {
        return []
      }
    },
    validate() {
      // try {
        let propsReq = []
        let property = [...this.propsValues, ...this.propsValuesSelect]

        property.forEach((item, i) => {
          if (item.required && item.values) {
            if (Array.isArray(item.value)) {
              if (!item.value.length) {
                // item.error = true
                propsReq.push(item)
              } else {
                item.error = false
              }
            } else {
              if (!item.value) {
                // item.error = true
                propsReq.push(item)
              } else {
                item.error = false
              }
            }
          } else {
            item.error = false
          }
        })

        if (
          ((this.getColors && this.getColors.length) || (this.getColors && typeof this.getColors === 'number'))
          && propsReq.length === 0
          && this.getStandards.length
          && this.getCert
        ) {
          return true
        } else {
          return false
        }
      // } catch(err) {
      //   return false
      // }
    },
    category() {
      return this.$store.state.baseGoods.stepOne.categoryId
    },
    nameSend() {
      if (this.$cookies.get('role') === 'manager') {
        return this.$route.query.type === 'change' ? 'Далее': 'Завершить добавление товара'
      } else {
        return this.$route.query.type === 'change' ? 'Завершить изменение товара': 'Завершить добавление товара'
      }
    },
    copy() {
      return this.$store.state.baseGoods.copy
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
    select_data_cert(val) {
      this.cert = val
    },
    clickedRadioColor(parentChild, item) {
      if (parentChild.value === item.value) {
        parentChild.value = ''
      }
    },
    clickedRadio(parentChild, item) {
      if (parentChild.value === item.value) {
        parentChild.value = ''
      }
    },
    delete_file(name, name_name, index, el) {
      if (!el.id) {
        this[name].splice(index, 1)
        this[name_name].splice(index, 1)
      } else {
        axios.delete(`${ process.env.apiUrl }personal${ this.role }/product-base/product/${this.$route.query.id}/proto/${ el.id }`,
        {
          headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
        }).then(res => {
          this[name].splice(index, 1)
          this[name_name].splice(index, 1)
        })
      }
    },
    select_data(data) {
      this.type = data.title.id
    },
    add_files(name, name_name) {
      let input = event.target
      this[name].push(input.files[0])

      let preview = ''
      let file = event.target.files[0]
      let reader  = new FileReader()
      let vue = this

      reader.onloadend = function () {
        preview = reader.result

        vue[name_name].push({ link: preview })

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
    changeStore() {
      this.$store.commit('baseGoods/commitStepTwo', {
        colors: this.getColors,
        sizes: this.getSize,
        properties: this.getProps,
        standards: this.getStandards,
        recommendations: this.getRecommendations,
        advantages: this.advantages,
        protectiveFunctions: this.protectiveFunctions,
        applications: this.applications,
        comfort: this.comfort,
        composition: this.composition,
        sertificatesGallery: this.sertificatesGallery,
        description: this.description,
        certificateId: this.getCert
      })
    },
    send() {
      let propsReq = []
      let property = [...this.propsValues, ...this.propsValuesSelect]

      property.forEach((item, i) => {
        if (item.required && item.values) {
          if (Array.isArray(item.value)) {
            if (!item.value.length) {
              item.error = true
              propsReq.push(item)
            } else {
              item.error = false
            }
          } else {
            if (!item.value) {
              item.error = true
              propsReq.push(item)
            } else {
              item.error = false
            }
          }
        } else {
          item.error = false
        }
      })

      if (!(this.getStandards && this.getStandards.length)) {
        this.errors.getStandards = true
      } else {
        this.errors.getStandards = false
      }

      if (!((this.getColors && this.getColors.length) || (this.getColors && typeof this.getColors === 'number'))) {
        this.errors.getColors = true
      } else {
        this.errors.getColors = false
      }

      if (this.getCert) {
        this.errors.cert = false
      } else {
        this.errors.cert = true
      }


      if (this.validate) {
        // console.log(2)
        this.changeStore()

        if (this.$route.query.type === 'create' || this.$cookies.get("role") != "manager") {
          if (this.$store.state.baseGoods.validateOne && this.$store.state.baseGoods.validateTwo) {
            this.loader = true

            let stepOne = this.$store.state.baseGoods.stepOne
            let stepTwo = this.$store.state.baseGoods.stepTwo

            let formData = new FormData()

            formData.append('name', stepOne.name)
            formData.append('printName', stepOne.printName)
            // formData.append('countryId', stepOne.countryId)
            // formData.append('gtd', stepOne.gtd)
            formData.append('certificateId', stepTwo.certificateId)
            formData.append('article', stepOne.article)
            formData.append('brand', +stepOne.brand)
            formData.append('measureId', +stepOne.measure)
            formData.append('weight', stepOne.weight)
            formData.append('packageWeight', stepOne.packageWeight)
            formData.append('countInPackage', stepOne.countInPackage)
            formData.append('packageVolume', stepOne.packageVolume)
            formData.append('price', stepOne.price)
            formData.append('discountPercent', stepOne.discountPercent)
            formData.append('times', stepOne.times)
            formData.append('categoryId', stepOne.categoryId)
            formData.append('advantages', stepTwo.advantages)
            formData.append('protectiveFunctions', stepTwo.protectiveFunctions)
            formData.append('applications', stepTwo.applications)
            formData.append('comfort', stepTwo.comfort)
            formData.append('composition', stepTwo.composition)
            formData.append('description', stepTwo.description)

            let declineDiscounts = 0

            if (stepOne.declineDiscounts) { declineDiscounts = 1 }

            formData.append('declineDiscounts', declineDiscounts)

            if (stepTwo.sizes.length) {
              stepTwo.sizes.forEach((item, i) => {
                formData.append('sizes[]', item)
              })
              // console.log(formData.get('sizes[]'), 'formData: sizes')
            } else {
              // formData.append('sizes[]')
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


            if (stepTwo.sertificatesGallery.length) {
              stepTwo.sertificatesGallery.forEach((item, i) => {
                formData.append('sertificatesGallery[]', item)
              })
            }

            if (this.$cookies.get('role') === 'manager' || this.$route.query.type === 'create') {
              this.blocked = true

              if (this.blocked) {
                axios({
                  url: `${ process.env.apiUrl }personal${ this.role }/product-base/product`,
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
                })
              }
            } else {
              this.blocked = true

              if (this.blocked) {
                axios({
                  url: `${ process.env.apiUrl }personal${ this.role }/product-base/product/${ this.$route.query.id }`,
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
        } else {
          this.$store.commit('baseGoods/commitStep', 3)
        }
      }
    }
  },
  async created() {
    let {
      data: {
        result: colors
      }
    } = await axios.get(`${ process.env.apiUrl }personal${ this.role }/product-base/color/list`,
    {
      headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
    })

    let {
      data: {
        result: standards
      }
    } = await axios.get(`${ process.env.apiUrl }personal${ this.role }/product-base/standard/list`,
    {
      headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
    })

    let {
      data: {
        result: recommendations
      }
    } = await axios.get(`${ process.env.apiUrl }personal${ this.role }/product-base/recommendation/list`,
    {
      headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
    })


    let {
      data: {
        result: sizes
      }
    } = await axios.get(`${ process.env.apiUrl }personal${ this.role }/product-base/size/list`,
    {
      headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
    })


    let {
      data: {
        result: props
      }
    } = await axios.get(`${ process.env.apiUrl }personal${ this.role }/product-base/properties-list`,
    {
      headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
    })

    let {
      data: {
        result: propsSelect
      }
    } = await axios.get(`${ process.env.apiUrl }personal${ this.role }/product-base/property-types-list`,
    {
      headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
    })

    let copy = this.$store.state.baseGoods.copy

    colors.forEach((item, i) => {
      copy.forEach((_item, i) => {
        if (item.id === _item) {
          item.disabled = true
        }
      })

      item.index = i + 1
      item.active = false
    })

    this.colors = colors
    this.sizes = sizes

    this.props = props
    this.propsSelect = propsSelect

    this.standards = standards
    this.recommendations = recommendations

    if (this.api) {
      this.getColors = this.api.color
      this.getSize = this.api.sizes

      if (this.api.standards) {
        this.getStandards = this.api.standards
      }

      if (this.api.recommendations) {
        this.getRecommendations = this.api.recommendations
      }

      this.cert = { id: this.api.certificateId }

      if (this.api.advantages && this.api.advantages != 'null') {
        this.advantages = this.api.advantages
      } else {
        this.advantages = ''
      }

      if (this.api.comfort && this.api.comfort != 'null') {
        this.comfort = this.api.comfort
      } else {
        this.comfort = ''
      }

      if (this.api.applications && this.api.applications != 'null') {
        this.applications = this.api.applications
      } else {
        this.applications = ''
      }

      if (this.api.protectiveFunctions && this.api.protectiveFunctions != 'null') {
        this.protectiveFunctions = this.api.protectiveFunctions
      } else {
        this.protectiveFunctions = ''
      }

      if (this.api.composition && this.api.composition != 'null') {
        this.composition = this.api.composition
      } else {
        this.composition = ''
      }

      if (this.api.description && this.api.description != 'null') {
        this.description = this.api.description
      } else {
        this.description = ''
      }

      if (this.api.sertificates.length) {
        this.sertificatesGallery_name = this.api.sertificates
      }
    }
  },
  watch: {
    copy() {
      let copy = this.$store.state.baseGoods.copy

      this.colors.forEach((item, i) => {
        copy.forEach((_item, i) => {
          if (item.id === _item) {
            item.disabled = true
          }
        })

        item.index = i + 1
        item.active = false
      })
    },
    validate() {
      this.$store.commit('baseGoods/commitValidate', {
        name: 'validateTwo',
        status: this.validate
      })


      if (this.validate && this.$route.query.type === 'change' && this.$cookies.get('role') === 'manager') {
        this.changeStore()
      }
    },
    async category() {
      this.propsValues = []
      this.propsValuesSelect = []

      let {
        data: {
          result: propsList
        }
      } = await axios.get(`${ process.env.apiUrl }personal${ this.role }/product-base/properties-list/section/${ this.category }`,
      {
        headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
      })

      let url = this.$cookies.get('role') === "supplier" ? "personal/supplier/product-base/certificates" : "personal/manager/certificates"

      let {
        data: {
          result: certList
        }
      } = await axios.post(`${ process.env.apiUrl }${ url }`, {
        "showAll": true
      },
        {
          headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
        }
      )

      if (certList) {
        this.certList = certList
      }


      propsList.forEach((item, i) => {
        item.type === 2 && item.multiple ? item.value = [] : item.value = ''
      })

      let propsInt = propsList.filter(item => { return item.type === 1 })
      let propsCheckbox = propsList.filter(item => { return item.type === 2 && !item.multiple })
      let propsMulti = propsList.filter(item => { return item.type === 2 && item.multiple })
      let propsString = propsList.filter(item => { return item.type === 3 })
      let propsBoolean = propsList.filter(item => { return item.type === 4 })


      let propsData = [...propsInt, ...propsString, ...propsBoolean]
      let propsDataSelect = [...propsCheckbox, ...propsMulti]

      this.propsValues = propsData
      this.propsValuesSelect = propsDataSelect
      this.propsValues.forEach((item, i) => {
        item.error = false
      })

      this.propsValuesSelect.forEach((item, i) => {
        item.error = false
      })



      if (this.api) {
        if (this.api.properties.length) {
          this.api.properties.forEach((item, i) => {
            this.propsValues.forEach((_item, _i) => {
              if (item.id === _item.id) {
                // _item.value = item.values[0]
                Array.isArray(_item.value) ? _item.value = item.values : _item.value = item.values[0]
              }
            })
          })

          this.api.properties.forEach((item, i) => {
            this.propsValuesSelect.forEach((_item, _i) => {
              if (item.id === _item.id) {
                Array.isArray(_item.value) ? _item.value = item.values : _item.value = item.values[0]
              }
            })
          })
        }
      }
    }
  }
}
</script>
