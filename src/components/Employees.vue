<template>
  <v-container>
    <v-data-table :headers="headers" :items="employees" sort-by="calories" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat dark>
          <v-toolbar-title>Employees</v-toolbar-title>
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
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.fname" label="First Name"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.mname" label="Middle Name"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.lname" label="Last Name"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.position" label="Position"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.contact" label="Contact"></v-text-field>
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
    dialog: false,
    headers: [
      {
        text: "First Name",
        align: "start",
        value: "fname"
      },
      { text: "Middle Name", value: "mname" },
      { text: "Last Name", value: "lname" },
      { text: "Position", value: "position" },
      { text: "Email", value: "email" },
      { text: "contact", value: "contact" },
      { text: "Actions", value: "action", sortable: false }
    ],
    employees: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      fname: "",
      mnme: "",
      lname: "",
      position: "",
      email: "",
      contact: ""
    },
    defaultItem: {
      id: "",
      fname: "",
      mnme: "",
      lname: "",
      position: "",
      email: "",
      contact: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Employee" : "Edit Employee";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      axios
        .get(
          "http://127.0.0.1:8000/api/v1/employee/" + this.$route.params.dept_id
        )
        .then(response => {
          this.employees = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    editItem(item) {
      this.editedIndex = this.employees.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.employees.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.employees.splice(index, 1);
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
        Object.assign(this.employees[this.editedIndex], this.editedItem);
      } else {
        this.editedItem.department_id = this.$route.params.dept_id;
        axios
          .post("http://127.0.0.1:8000/api/v1/employee/", this.editedItem)
          .then(response => {
            this.editedItem = Object.assign({}, response.data);
            console.log(this.editedItem)
            var phonebookObj = {
              employee_id: this.editedItem.id,
              email: this.editedItem.email,
              contact: this.editedItem.contact
            };
            console.log(phonebookObj)
            axios
              .post("http://127.0.0.1:8000/api/v1/phonebook/", phonebookObj)
              .then(() => {
                this.employees.push(this.editedItem);
              })
              .catch(e => {
                console.log(e);
              });
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
