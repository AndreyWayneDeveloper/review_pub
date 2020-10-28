<template lang='pug'>
.account
  Header
  CatalogCrumb
  AccountContent
    div
      H1(typed='regular-36') База товаров
      DataGoodsList(
        :status='status'
        :brands='brands'
        :categories='categories'
        :products='products'
      )
  Footer
</template>

<script>

export default {
  middleware: [
    'authenticated'
  ],
  async asyncData({ app }) {
    let {
      data: {
        result: statuses
      }
    } = await axios.get(`${ process.env.apiUrl }personal/product-base/statuses-list`, {
      headers: { Authorization: `Bearer ${ app.$cookies.get('token') }` }
    })

    let {
      data: {
        result: brands
      }
    } = await axios.get(`${ process.env.apiUrl }personal/product-base/brands-list`, {
      headers: { Authorization: `Bearer ${ app.$cookies.get('token') }` }
    })

    let {
      data: {
        categories
      }
    } = await axios.get(`${ process.env.apiUrl }personal/product-base/sections-list`, {
      headers: { Authorization: `Bearer ${ app.$cookies.get('token') }` }
    })

    let {
      data: {
        result: products
      }
    } = await axios.post(`${ process.env.apiUrl }personal/product-base/products-list`, {}, {
      headers: { Authorization: `Bearer ${ app.$cookies.get('token') }` }
    })

    return {
      categories,
      products,
      role,
      status
    }
  }
}
</script>
