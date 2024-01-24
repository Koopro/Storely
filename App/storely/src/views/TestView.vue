<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <notes-component></notes-component>
      </v-col>
      <!-- Temporarily comment this out for testing
      <v-col cols="12" md="6">
        <todo-component></todo-component>
      </v-col>
      -->
    </v-row>
  </v-container>
</template>


<script>
// Importing the components from their respective files
import NotesComponent from "../components/TestComponents/NotesComponent.vue";
import ToDoComponent from "../components/TestComponents/ToDoComponent.vue";

export default {
  // Registering the imported components for use in this component's template
  components: {
    NotesComponent,
    ToDoComponent
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
