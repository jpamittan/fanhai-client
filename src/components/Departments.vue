<template>
  <v-container>
    <h2>Company Details</h2>
    <v-col cols="10" class="company-details-wrapper">
      <div>
        <label>Name:</label>
        {{ company.name }}
      </div>
      <div>
        <label>Address:</label>
        {{ company.address }}
      </div>
      <div>
        <label>Email:</label>
        {{ company.email }}
      </div>
      <div>
        <label>Contact:</label>
        {{ company.contact }}
      </div>
    </v-col>
    <v-col cols="2" class="company-logo-wrapper">
      <v-list-item-avatar tile size="80" color="grey" class="ma-0">
        <img :src="company.logo ? company.logo : logoPlaceholder" />
      </v-list-item-avatar>
    </v-col>
    <hr />
    <v-data-table :headers="headers" :items="departments" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat dark>
          <v-toolbar-title>Departments</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="editedItem.name" label="Department name"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
		<router-link :to='"/company/department/"+item.id'>
			<v-icon small class="mr-2">mdi-eye</v-icon>
		</router-link>
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    logoPlaceholder: "https://www.suratimodhvanik.com/images/panch/no_logo.jpg",
    dialog: false,
    company: {
      name: "",
      address: "",
      email: "",
      contact: "",
      logo: ""
    },
    headers: [
      {
        text: "Department Name",
        align: "start",
        sortable: false,
        value: "name"
      },
      { text: "Actions", value: "action", sortable: false }
    ],
    departments: [],
    editedIndex: -1,
    editedItem: {
      company_id: "",
      name: ""
    },
    defaultItem: {
      company_id: "",
      name: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Department" : "Edit Department";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    axios
      .get("http://127.0.0.1:8000/api/v1/company/" + this.$route.params.comp_id)
      .then(response => {
        this.company = Object.assign({}, response.data);
      })
      .catch(e => {
        console.log(e);
      });
    this.initialize();
  },

  methods: {
    initialize() {
      axios
        .get(
          "http://127.0.0.1:8000/api/v1/department/" +
            this.$route.params.comp_id
        )
        .then(response => {
          this.departments = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    editItem(item) {
      this.editedIndex = this.departments.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.departments.indexOf(item);
      if (confirm("Are you sure you want to delete this item?")) {
        axios
          .delete(
            "http://127.0.0.1:8000/api/v1/department/" + item.id,
            this.editedItem
          )
          .then(() => {
            this.departments.splice(index, 1);
          })
          .catch(e => {
            console.log(e);
          });
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        axios
          .put(
            "http://127.0.0.1:8000/api/v1/department/" + this.editedItem.id,
            this.editedItem
          )
          .then(response => {
            Object.assign(this.departments[this.editedIndex], response.data);
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        this.editedItem.company_id = this.$route.params.comp_id;
        axios
          .post("http://127.0.0.1:8000/api/v1/department/", this.editedItem)
          .then(response => {
            this.editedItem = Object.assign({}, response.data);
            this.departments.push(this.editedItem);
          })
          .catch(e => {
            console.log(e);
          });
      }
      this.close();
    }
  }
};
</script>

<style scoped>
.company-details-wrapper {
  display: inline-block;
}
.company-logo-wrapper {
  display: inline-block;
  float: right;
  text-align: right;
}
</style>
