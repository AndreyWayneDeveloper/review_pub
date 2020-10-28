<template lang='pug'>
.account
  Header
  CatalogCrumb
  AccountContent
    div
      DataGoodsWork(:api='api')
  Footer
</template>

<script>
export default {
  middleware: [
    'authenticated',
  ],
  async asyncData({ store, app, route }) {
    let {
      data: api
    } = await axios.get(`${ process.env.apiUrl }personal/product-base/product/${ route.query.id }`, {
      headers: { Authorization: `Bearer ${ app.$cookies.get('token') }` }
    })

    return {
      api
    }
  }
}
</script>
