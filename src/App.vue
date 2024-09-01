<template>
  <v-app>
    <v-main class="bg-grey-lighten-1">
      <ConvertCurrency/>
    </v-main>
  </v-app>
</template>

<script>
import ConvertCurrency from './components/ConvertCurrency.vue'

export default {
  name: 'App',

  components: {
    ConvertCurrency,
  },

  data: () => ({
    //
  }),
}
</script>
