<template>
  <v-container>
    <v-col class="text-right add-company">
      <v-dialog v-model="companyDialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn class="mx-1" fab dark color="indigo" v-on="on" @click="addCompany">
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
                  <v-text-field label="Name*" v-model="editedItem.name" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Address*" v-model="editedItem.address" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <v-text-field label="Email*" v-model="editedItem.email" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <v-text-field label="Contact*" v-model="editedItem.contact" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Logo URL" v-model="editedItem.logo"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="companyDialog = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="saveCompany">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-row>
      <v-col cols="12">
        <v-card
          v-for="(company, index) in companies"
          :key="index"
          class="ma-1 pa-1 v-card-clickable"
          outlined
          tile
        >
          <v-list-item three-line class="pr-0">
            <router-link :to='"company/"+company.id' class="link-company">
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">{{ company.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ company.address }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ company.email }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ company.contact }}</v-list-item-subtitle>
              </v-list-item-content>
            </router-link>
            <v-list-item-avatar tile size="80" color="grey">
              <img :src="company.logo ? company.logo : logoPlaceholder" />
            </v-list-item-avatar>
            <v-menu bottom left>
              <template v-slot:activator="{ on }">
                <v-btn class="ml-2" dark icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="editCompany(index)">
                  <v-list-item-title>Update</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteCompany(index, company.id)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="blnDelCompany" max-width="290">
      <v-card>
        <v-card-title class="headline">Are you sure to delete this company?</v-card-title>
        <v-card-text>All records under this comapany will also be deleted.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="blnDelCompany = false">No</v-btn>
          <v-btn color="green darken-1" text @click="commitDelete">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="errorDialog" max-width="320">
      <v-card>
        <v-card-title class="headline">Error</v-card-title>
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="errorDialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      logoPlaceholder:
        "https://www.suratimodhvanik.com/images/panch/no_logo.jpg",
      companyDialog: false,
      errorDialog: false,
      errorMessage: "",
      blnDelCompany: false,
      companies: null,
      delCompanyId: null,
      editedIndex: -1,
      editedItem: {
        name: "",
        address: "",
        email: "",
        contact: "",
        logo: ""
      },
      defaultItem: {
        name: "",
        address: "",
        email: "",
        contact: "",
        logo: ""
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Add Company Profile"
        : "Edit Company Profile";
    }
  },
  methods: {
    addCompany() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
    },
    editCompany(index) {
      this.companyDialog = true;
      this.editedIndex = index;
      this.editedItem = Object.assign({}, this.companies[index]);
    },
    saveCompany() {
      if (this.editedIndex === -1) {
        axios
          .post(`http://127.0.0.1:8000/api/v1/company`, this.editedItem)
          .then(response => {
            this.companyDialog = false;
            this.companies.unshift(response.data);
          })
          .catch(e => {
            this.companyDialog = false;
            this.showError(e);
          });
      } else {
        axios
          .put(
            `http://127.0.0.1:8000/api/v1/company/` + this.editedItem.id,
            this.editedItem
          )
          .then(response => {
            this.companyDialog = false;
            this.companies[this.editedIndex] = response.data;
          })
          .catch(e => {
            this.companyDialog = false;
            this.showError(e);
          });
      }
    },
    deleteCompany(index, id) {
      this.delCompanyId = id;
      this.editedIndex = index;
      this.blnDelCompany = true;
    },
    commitDelete() {
      axios
        .delete(`http://127.0.0.1:8000/api/v1/company/` + this.delCompanyId)
        .then(() => {
          this.blnDelCompany = false;
          this.companies.splice(this.editedIndex, 1);
        })
        .catch(e => {
          this.blnDelCompany = false;
          this.showError(e);
        });
    },
    showError(errorMsg) {
      this.errorDialog = true;
      this.errorMessage = errorMsg.message;
    }
  },
  created() {
    axios
      .get("http://127.0.0.1:8000/api/v1/company")
      .then(response => {
        this.companies = response.data.data;
      })
      .catch(e => {
        this.showError(e);
      });
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
