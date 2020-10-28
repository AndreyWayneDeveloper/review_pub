<template lang='pug'>
.step
  .input
    .input__el.input__el--name
      .flex-name
        H4(
          typed='regular-14'
          :class='{ "error-require": errors.name }'
        )
          | Наименование товара
          span.require-val *
        .tool
          Tooltip(
            title='В названиях нельзя использовать цвета'
            position='bottom'
          )
            img(src='/image/quest-blue.svg')
      div
        input(
          v-model='name'
          @change='searchQuery'
        )
        .warn(v-if='getSearch.length')
          Title(typed='regular-14').red Такое название товара уже существует в базе
          Title(typed='regular-14').gray Смените название или будет выполнена автоматическая привязка к товарам:
          .goods
            a.good(
              v-for='(item, i) in getSearch'
              :key='i'
              v-if='item.images.length'
              :href='`/personal/products/work?type=change&id=${ item.id }`'
            )
              .img(:style='{ backgroundImage: `url(${ item.images[0] })` }')
              .title
                Title(typed='regular-14').name {{ item.name }}
                .color(
                  v-for='(_item, _i) in item.colors'
                  :key='_i'
                )
                  .circle(:style='{ backgroundColor: _item.hex }' :class='{ "circle-white": _item.name === "Белый" || _item.name === "Прозрачный" }')
                  Title(typed='regular-14') {{ _item.name }}
    .input__el.input__el--article(v-if='brandsList.length && $cookies.get("role") === "manager"')
      H4(typed='regular-14' :class='{ "error-require": errors.getBrand }') Бренд <span class='require-val'>*</span>
      SelectMin(
        title='Бренды'
        :api='brandsList'
        name='brand'
        @brand='select_data'
        :init='initBrand'
      )
    .input__el.input__el--article(v-if='$cookies.get("role") != "manager" && brandsList.length && $store.state.blockedSupplier.user.brand.length > 1')
      H4(typed='regular-14' :class='{ "error-require": errors.getBrand }') Бренд <span class='require-val'>*</span>
      SelectMin(
        title='Бренды'
        :api='$store.state.blockedSupplier.user.brand'
        name='brand'
        @brand='select_data'
        :init='initBrand'
      )
    .input__el.input__el--name.input__el--article
      H4(typed='regular-14') Название для печатных документов
      input(v-model='printName')
    .input__el.input__el--article
      H4(typed='regular-14'  :class='{ "error-require": errors.article }') Артикул <span class='require-val'>*</span>
      input(v-model='article')
    .input__el.input__el--weight
      H4(typed='regular-14'  :class='{ "error-require": errors.weight }') Вес товара <span class='require-val'>*</span>
      input(
        v-model.number='weight'
        min="0.00001"
        type='number'
      )
      Title(typed='regular-14') кг.
    .input__el
      H4(typed='regular-14'  :class='{ "error-require": errors.countInPackage }') Количество товара в упаковке <span class='require-val'>*</span>
      input(
        v-model.number='countInPackage'
        min="0.00001"
        type='number'
      )
    .input__el.input__el--article(v-if='unitList.length')
      H4(typed='regular-14'  :class='{ "error-require": errors.getUnit }') Ед. измерения <span class='require-val'>*</span>
      SelectUnit(
        title='Ед. измерения'
        :api='unitList'
        name='unit'
        @unit='select_data'
        :init='initUnit'
      )
    .input__el
      H4(typed='regular-14'  :class='{ "error-require": errors.packageVolume }') Размер упаковки <span class='require-val'>*</span>
      input(
        v-model.number='packageVolume'
        min="0.00001"
        type='number'
      )
      Title(typed='regular-14') м<sup>3</sup>
    .input__el
      H4(typed='regular-14'  :class='{ "error-require": errors.price }') Цена за товар <span class='require-val'>*</span>
      input(
        v-model.number='price'
        min="0.00001"
        type='number'
      )
      Title(typed='regular-14') рублей
    .input__el
      H4(typed='regular-14') Кратность упаковки
      input(
        v-model.number='times'
        min="1"
        type='number'
      )
    .input__el
      H4(typed='regular-14') Скидки на товар
      input(
        v-model.number='discountPercent'
        min="0.00001"
        type='number'
      )
      Title(typed='regular-14') %
    .input__el.input__el--name(v-if='false')
      H4(typed='regular-14') Номер ГТД
      input(
        v-model='gtd'
        v-mask="'########/######/#######/##'"
      )
    .input__el.input__el--name(v-if='false')
      H4(typed='regular-14') Страна происхождения
      dadata-suggestions(
          v-model="address"
          :fullInfo.sync="textFull"
          field-value="unrestricted_value"
          :options="dadataOptions"
      )
    .input__el
      H4(typed='regular-14') Не суммировать с другими скидами:
      .checkboxs
        label
          input(
            type='checkbox'
            v-model='declineDiscounts'
          ).checkbox
          .checkbox-custom
  .cat.cat-desk
    .cat-block(
      v-for='(item, i) in treeCategories'
      :key='i'
      v-if='item.length'
    )
      H4(v-if='i === 0' typed='regular-14'  :class='{ "error-require": errors.getCategory }') Категория 1
      H4(v-else typed='regular-14'  :class='{ "error-require": errors.getCategory }') Подкатегория {{ i + 1 }} <span class='require-val'>*</span>
      ul.cat-items
        li.cat-item(
          v-for='(_item, _i) in item'
          :key='_i'
          @click='select(_item, i)'
        )
          Title(
            typed='regular-14'
            :class='{ active: _item.id === categoryId.id }'
          ) {{ _item.name }}
    .cat-block(v-if='false')
      H4(typed='regular-14') Подборки
      ul.cat-items
        li.cat-item(
          v-for='(item, i) in collectionsList'
          :key='i'
          @click='setCollectionsId(item)'
        )
          Title(
            typed='regular-14'
            :class='{ active: item.active }'
          ) {{ item.name }}
  Button(
    typed='footer'
    @click.native='send'
    :class='{ "button-disabled": !validate }'
  ) Далее
</template>

<script>
export default {
  props: {
    api: Object
  },
  data() {
    return {
      textFull: '',
      dadataOptions: {
        type:'country',
        addon: 'none',
        geoLocation: false,
        constraints: {
          locations: { country: "*" }
        }
      },
      /* rest */
      brandsList: [],
      collectionsList: [],
      categoriesList: [],
      treeCategories: [],
      unitList: [],
      declineDiscounts: false,

      /* data */
      unit: null,
      address: '',
      name: '',
      gtd: '',
      printName: '',
      brand: null,
      article: '',
      weight: '',
      countInPackage: '',
      collectionsId: '',
      categoryId: '',
      packageVolume: '',
      price: '',
      discountPercent: '',
      times: '',
      getSearch: [],
      colors: [],
      ban: false,

      errors: {
        name: false,
        getBrand: false,
        article: false,
        weight: false,
        packageWeight: false,
        countInPackage: false,
        getCategory: false,
        packageVolume: false,
        price: false,
        getUnit: false
      }
    }
  },
  computed: {
    countryId() {
      return (this.textFull) ? this.textFull.data.code : ''
    },
    getBrand() {
      if (this.$cookies.get("role") === "manager" || this.$store.state.blockedSupplier.user.brand.length) {
        return this.brand ? this.brand.id : ''
      } else {
        return this.$store.state.blockedSupplier.user.brand.id
      }
    },
    getUnit() {
      return this.unit ? this.unit.id : ''
    },
    getCategory() {
      return this.categoryId ? this.categoryId.id : ''
    },
    getCollection() {
      return this.collectionsId ? this.collectionsId.id : 1
    },
    packageWeight() {
      if (this.weight && this.countInPackage) {
        return this.weight * this.countInPackage
      } else {
        return 0
      }
    },
    validate() {
      if (this.name
        && typeof this.getBrand === 'number'
        && this.article
        && this.weight
        && this.packageWeight
        && this.countInPackage
        && typeof this.getCategory === 'number'
        && this.packageVolume
        && this.price
        && !this.ban
        && typeof this.getUnit === 'number'
      ) {
        return true
      } else {
        return false
      }
    },
    initBrand() {
      return this.brand ? this.brand : ''
    },
    initUnit() {
      return this.unit ? this.unit : ''
    }
  },
  methods: {
    async searchQuery() {
      let {
        data: {
          result
        }
      } = await axios.get(`${ process.env.apiUrl }catalog/search/products?search=${ encodeURIComponent(this.name) }`)

      if (result.data && result.data.length) {

        let filter = result.data.filter(item => {
          return item.name === this.name
        })

        if (filter.length) {
          this.getSearch = filter

          let mapColors = []

          filter.forEach((item, i) => {
            item.colors.forEach((_item, _i) => {
              mapColors.push(_item)
            })
          })

          let mapColorses = mapColors.map(item => {
            return item.id
          })

          let idColors = [...new Set(mapColorses)]

          this.$store.commit('baseGoods/commitCopy', idColors)

          if (idColors.length >= this.colors.length) {
            this.ban = true
          } else {
            this.ban = false
          }

          this.$store.commit('baseGoods/commitCopy', idColors)

        } else {
          this.getSearch = []

          this.$store.commit('baseGoods/commitCopy', [])
        }
      } else {
        this.getSearch = []

        this.$store.commit('baseGoods/commitCopy', [])
      }
    },
    select(el, i) {
      this.treeCategories.splice(i + 1)

      this.treeCategories.push(el.children)

      this.categoryId = el
    },
    setCollectionsId(el) {
      this.collectionsList.forEach((item, i) => {
        item.active = false
      })

      el.active = true

      this.collectionsId = el
    },
    send() {
      for (let key in this.errors) {
        if (this[key]) {
          this.errors[key] = false
        } else {
          this.errors[key] = true
        }

        if (key === 'getBrand' || key === 'getCategory' || key === 'getUnit') {
          if (typeof this[key] === 'number') {
            this.errors[key] = false
          } else {
            this.errors[key] = true
          }
        }
      }

      if (this.validate) {
        this.changeStore()
        this.$store.commit('baseGoods/commitStep', 2)
      }
    },
    changeStore() {
      this.$store.commit('baseGoods/commitStepOne', {
        name: this.name,
        printName: this.printName,
        measure: this.getUnit,
        gtd: this.gtd,
        countryId: this.countryId,
        brand: this.getBrand,
        article: this.article,
        weight: this.weight,
        packageWeight: this.packageWeight,
        countInPackage: this.countInPackage,
        categoryId: this.getCategory,
        packageVolume: this.packageVolume,
        price: this.price,
        discountPercent: this.discountPercent,
        times: this.times,
        declineDiscounts: this.declineDiscounts
      })
    }
  },
  async created() {
    let {
      data: unit
    } = await axios.get(`${ process.env.apiUrl }personal${ this.role }/product-base/measure-list`,
    {
      headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
    })

    let {
      data: {
        result: brands
      }
    } = await axios.get(`${ process.env.apiUrl }personal${ this.role }/product-base/brands-list`, {
      headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
    })

    let {
      data: {
        categories
      }
    } = await axios.get(`${ process.env.apiUrl }personal${ this.role }/product-base/sections-list`, {
      headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
    })

    let {
      data: {
        collections
      }
    } = await axios.get(`${ process.env.apiUrl }collections`)

    let {
      data: {
        result: colors
      }
    } = await axios.get(`${ process.env.apiUrl }personal${ this.role }/product-base/color/list`,
    {
      headers: { Authorization: `Bearer ${ this.$cookies.get('token') }` }
    })

    this.colors = colors

    collections.forEach((item, i) => {
      item.active = false
    })

    this.collectionsList = collections

    this.categoriesList = categories

    this.treeCategories.push(categories)

    if (this.api) {
      this.name = this.api.name
      if (this.api.printName != 'null') {
        this.printName = this.api.printName
      }
      this.gtd = this.api.gtd
      this.brand = { id: this.api.brand }
      this.unit = { id: this.api.measure }
      this.article = this.api.article
      this.weight = this.api.weight
      this.packageWeight = this.packageWeight
      this.countInPackage = this.api.countInPackage
      this.collectionsId = this.api.collectionsId
      this.categoryId = { id: this.api.categoryId }
      this.packageVolume = this.api.packageVolume
      this.price = this.api.price
      this.discountPercent = this.api.discountPercent
      this.times = this.api.times
      this.declineDiscounts = Boolean(this.api.declineDiscounts)

      if (this.api.country) {
        this.textFull = {
          data: {
            code: this.api.country.global_id
          }
        }

        this.address = this.api.country.fullname
      }

      function find(array, id) {
        if (typeof array != 'undefined') {
          for (var i = 0; i < array.length; i++) {
            if (array[i].id == id) return [array]
            var a = find(array[i].children, id)
            if (a != null) {
              a.unshift(array)
              return a
            }
          }
        }
        return null
      }

      if (this.api.categoryId) {
        this.treeCategories = []

        let resultCat = find(categories, this.api.categoryId)

        if (resultCat.length) {
          resultCat.forEach((item, i) => {
            this.treeCategories.push(item)
          })
        }
      }
    }

    this.brandsList = brands

    this.unitList = unit

    if (this.$cookies.get("role") != 'manager' && this.$store.state.blockedSupplier.user.brand.length === 1) {
      this.brand = { id: this.$store.state.blockedSupplier.user.brand[0].id }
    }
  }
}
</script>
