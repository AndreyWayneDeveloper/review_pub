export const state = () => ({
  categories: Object,
  filters: Array,
  products: Array,
  brands: Array,
  params: String,
  reset: Number,
  parser: Array
})

export const mutations = {
  setCategories(state, payload) {
    state.categories = payload
  },
  setFilters(state, payload) {
    state.filters = payload
  },
  setProducts(state, payload) {
    state.products = payload
  },
  setBrands(state, payload) {
    state.brands = payload
  },
  setParams(state, payload) {
    state.params = payload
  },
  setReset(state, payload) {
    state.reset++
  },
  setParser(state, payload) {
    state.parser = payload
  }
}
