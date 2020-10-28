<template lang='pug'>
.sys
  .sys__container
    H1(typed='regular-36').sys__header Система скидок
    .sys__wrapper
      .sys__block.sys-block(
        v-for='(item, i) in api'
        :key='i'
      )
        .sys-block__head
          nuxt-link(:to='item.link').sys-block__link
            img.sys-block__logo(
              :src='item.logo'
            )
          .sys-block__head
            H3(typed='demibold-16').sys-block__name Индивидуальная скидка
            .sys-block__percent
              Title(typed='demibold-16') -{{ item.discounts.personal[0].discount }}%
        .sys__body
          .sys-block
            H3(typed='demibold-16').sys-block__name Накопительная скидка
            .sys-block__discount(
              v-for='(subItem, subIndex) in item.discounts.cumulative'
              :key='subIndex'
            )
              Title(typed='demibold-16' v-if='subItem.discount').sys-block__discount-title -{{ subItem.discount }}%
              Title(typed='regular-14' v-if='subItem.needleSum').sys-block__discount-subtitle  При суммарной покупке от {{ subItem.needleSum }}₽ товаров этого бренда
          .sys-block__discount-item
            .sys-block__discount(
              v-for='(subItem, subIndex) in item.discounts.sum'
              :key='subIndex'
            )
              Title(typed='demibold-16' v-if='subItem.discount').sys-block__discount-title -{{ subItem.discount }}%
              Title(typed='regular-14' v-if='subItem.needleSum').sys-block__discount-subtitle  При суммарной покупке от {{ subItem.needleSum }}₽ товаров этого бренда
</template>

<script>
export default {
  props: {
    api: Object
  }
}
</script>
