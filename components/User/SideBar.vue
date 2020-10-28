<template lang='pug'>
Wrapper
  Container
    Section
      About(typed='container').gl-about-container
        SideBar(
          :api='api'
        )
        About(typed='content')
          slot
</template>

<script>
export default {
  props: {
    api: Object
  }
}
</script>
