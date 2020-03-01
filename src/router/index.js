import Vue from "vue";
import VueRouter from "vue-router";
import Companies from "@/components/Companies.vue";
import Departments from "@/components/Departments.vue";
import Employees from "@/components/Employees.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Companies",
    component: Companies
  },
  {
    path: "/company/:comp_id",
    name: "Departments",
    component: Departments
  },
  {
    path: "/company/:comp_id/department/:dept_id",
    name: "Employees",
    component: Employees
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
