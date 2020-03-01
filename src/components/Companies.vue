<template>
  <v-container>
    <v-col class="text-right add-company">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn class="mx-1" fab dark color="indigo" v-on="on">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Company Profile</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Name*" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Address*" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <v-text-field label="Email*" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <v-text-field label="Contact*" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Logo URL"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-row>
      <v-col cols="12">
         <v-card
          v-for="n in 9"
          :key="n"
          class="ma-1 pa-1 v-card-clickable"
          outlined
          tile
        >
          <v-list-item three-line class="pr-0">
            <router-link to="company/1" class="link-company">
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">Company Name</v-list-item-title>
                <v-list-item-subtitle>Company address</v-list-item-subtitle>
                <v-list-item-subtitle>Email</v-list-item-subtitle>
                <v-list-item-subtitle>Contact</v-list-item-subtitle>
              </v-list-item-content>
            </router-link>
            <v-list-item-avatar
              tile
              size="80"
              color="grey"
            ></v-list-item-avatar>
            <v-menu bottom left>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="ml-2"
                  dark
                  icon
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="dialog = true">
                  <v-list-item-title>Update</v-list-item-title>
                </v-list-item>
                <v-list-item @click="blnDelCompany = true">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="blnDelCompany"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Are you sure to delete this company?</v-card-title>
        <v-card-text>
          All records under this comapany will also be deleted.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="blnDelCompany = false"
          >
            No
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="blnDelCompany = false"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    data: function() {
      return {
        dialog : false,
        blnDelCompany: false
      }
    }
  };
</script>

<style scoped>
  .v-card-clickable {
    cursor: pointer;
  }
  .add-company {
    width: auto;
    right: 0;
    bottom: 0;
    position: fixed;
    z-index: 1;
    margin-bottom: 40px;
  }
  .link-company {
    width: 100%;
  }
</style>
