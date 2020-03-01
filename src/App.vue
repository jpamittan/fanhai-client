<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <router-link to="/">
          <v-list-item>
            <v-list-item-action>
              <v-icon large color="green darken-2">mdi-domain</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Companies</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Bogsoft</v-toolbar-title>
      <v-text-field
        class="ml-12"
        flat
        hide-details
        label="Search company"
        solo-inverted
        clearable
      ></v-text-field>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
    }),
    created () {
      this.$vuetify.theme.dark = true
    },
  }
</script>

<style>
  a { text-decoration: none; }
</style>