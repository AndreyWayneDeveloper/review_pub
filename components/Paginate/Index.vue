<template lang='pug'>
.paginate
  Wrapper
    Section
      .paginate__wrapper
        .paginate__count
          Title(typed='medium-36') {{ api.current_page }}/{{ api.last_page }}
          Title(typed='regular-14') страниц
        .paginate__body
          paginate(
            v-model='step'
            :page-count="api.last_page"
            :page-range="range"
            :margin-pages="1"
            :prev-text="'Назад'"
            :next-text="'Вперед'"
            :click-handler="clickCallback"
            :page-link-class='"paginate__el"'
          )
</template>

<script>
export default {
  props: {
    rest: Object
  },
  data() {
    return {
      step: 1,
      range: 5,
      mount: false
    }
  },
  methods: {
    clickCallback (pageNum) {
      let url = null
      let str = '?page='
      let fullPath = null
      let urlEnd = this.$route.fullPath.indexOf('?')
      let active = false

      if (typeof this.$route.query.sort === 'undefined' && typeof this.$route.query.by === 'undefined') {
        if (urlEnd != -1) {
          url = this.$route.fullPath.substring(0, urlEnd)
          fullPath = `${ url }${ str }${ pageNum }`
        } else {
          url = this.$route.fullPath
          fullPath = `${ url }${ str }${ pageNum }`
        }
      } else {
        let sort = `&sort=${ this.$route.query.sort }&by=${ this.$route.query.by }`

        url = this.$route.fullPath.substring(0, urlEnd)

        fullPath = `${ url }${ str }${ pageNum }${ sort }`
      }

      this.$nuxt.$router.replace({ path: fullPath })

      window.scrollTo(0,0)

    },
    resize() {
      window.innerWidth < 767 ? this.range = 1 : this.range = 5
    }
  },
  computed: {
    api() {
      return this.rest ? this.rest : null
    }
  },
  created() {
    if (typeof this.$route.query.page != 'undefined') {
      this.step = +this.$route.query.page
    }
  },
  mounted() {
    this.mount = true

    this.resize()

    window.addEventListener("resize", this.resize)
  }
}
</script>
