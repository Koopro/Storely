<template>
  <div class="add-todo-button-wrap">
    <button @click="showPopup = true" class="add-todo-button">Neue ToDo hinzufügen</button>
  </div>
  <div class="popup" v-if="showPopup">
    <h2>Neue ToDo</h2>
    <input v-model="newTodo.name" placeholder="Name" />
    <textarea v-model="newTodo.description" placeholder="Beschreibung"></textarea>
    <input v-model="newTodo.dueDate" type="date" />
    <input v-model="newTodo.dueTime" type="time" />
    <label>
      Dringend
      <input v-model="newTodo.urgent" type="checkbox" />
    </label>
    <button @click="createTodo">Hinzufügen</button>
    <button @click="showPopup = false">Abbrechen</button>
  </div>

  <div class="popup" v-if="showEditPopup">
    <h2>ToDo bearbeiten</h2>
    <input v-model="editTodo.name" placeholder="Name" />
    <textarea v-model="editTodo.description" placeholder="Beschreibung"></textarea>
    <input v-model="editTodo.dueDate" type="date" />
    <input v-model="editTodo.dueTime" type="time" />
    <label>
      Dringend
      <input v-model="editTodo.urgent" type="checkbox" />
    </label>
    <label>
      Erledigt
      <input v-model="editTodo.completed" type="checkbox" />
    </label>
    <button @click="updateTodo">Speichern</button>
    <button @click="showEditPopup = false">Abbrechen</button>
  </div>

  <div class="grid-container">
    <div
      v-for="(todo, index) in sortedTodos"
      :key="index"
      :class="['grid-item', todoClass(todo)]"
      @click="selectTodo(todo)"
    >
      <div class="todo-header">{{ todo.name }}</div>
      <div class="todo-description">{{ todo.description }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      apiUrl: `${process.env.VUE_APP_API_URL}/api`,
      authToken: `Bearer ${localStorage.getItem('authToken')}`,
      selectedListId: localStorage.getItem('selectedListId'),
      todos: [],
      newTodo: {
        name: '',
        description: '',
        dueDate: '',
        dueTime: '',
        urgent: false,
        completed: false
      },
      editTodo: {
        name: '',
        description: '',
        dueDate: '',
        dueTime: '',
        urgent: false,
        completed: false
      },
      showPopup: false,
      showEditPopup: false,
      selectedTodo: null,
      editIndex: null
    };
  },
  computed: {
    sortedTodos() {
      const urgentTodos = this.todos.filter(todo => todo.urgent && !todo.completed);
      const normalTodos = this.todos.filter(todo => !todo.urgent && !todo.completed);
      const completedTodos = this.todos.filter(todo => todo.completed);
      return [...urgentTodos, ...normalTodos, ...completedTodos];
    }
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get(`${this.apiUrl}/todos`, {
          params: { list: this.selectedListId },
          headers: {
            'Authorization': this.authToken
          }
        });
        this.todos = response.data;
      } catch (error) {
        console.log('Error fetching todos: ' + error.response.data.message);
      }
    },
    async createTodo() {
      if (!this.selectedListId) {
        console.log('No list selected!');
        return;
      }

      const todoData = {
        ...this.newTodo,
        list: this.selectedListId
      };

      try {
        const response = await axios.post(`${this.apiUrl}/todos`, todoData, {
          headers: {
            'Authorization': this.authToken
          }
        });
        if (response.status === 201) {
          console.log('Todo created successfully!');
          this.todos.push(response.data);
          this.resetNewTodo();
          this.showPopup = false;
        }
      } catch (error) {
        console.log('Error creating todo: ' + error.response.data.message);
      }
    },
    resetNewTodo() {
      this.newTodo = {
        name: '',
        description: '',
        dueDate: '',
        dueTime: '',
        urgent: false,
        completed: false
      };
    },
    selectTodo(todo) {
      this.editIndex = this.todos.indexOf(todo);
      this.editTodo = { ...todo };
      this.showEditPopup = true;
    },
    async updateTodo() {
      try {
        const response = await axios.put(`${this.apiUrl}/todos/${this.editTodo._id}`, this.editTodo, {
          headers: {
            'Authorization': this.authToken
          }
        });
        if (response.status === 200) {
          this.todos.splice(this.editIndex, 1, response.data);
          this.showEditPopup = false;
        }
      } catch (error) {
        console.log('Error updating todo: ' + error.response.data.message);
      }
    },
    completeTodo(todo) {
      todo.completed = true;
      this.updateTodo();
    },
    todoClass(todo) {
      if (todo.completed) return 'completed';
      if (todo.urgent) return 'urgent';
      return 'normal';
    }
  }, 
  created() {
    this.fetchTodos();
  }
};
</script>

<style>
body {
  background-color: rgba(0, 0, 0, alpha);
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1rem;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.grid-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  gap: 1%; /* Adds the gap between rows and columns */
}

.grid-item {
  flex: 1 1 calc(33.33% - 1%); /* Calculate the width including the gap */
  max-width: calc(33.33% - 1%);
  margin-bottom: 1%; /* Adds the gap between rows */
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  cursor: pointer;
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 20px;
  background-color: #4caf50;
  color: white;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  box-sizing: border-box;
}


.grid-item.urgent {
  background-color: #ff6b6b;
}

.grid-item.normal {
  background-color: #ffeb3b;
}

.grid-item.completed {
  background-color: #81c784;
}

.todo-header {
  margin-left: 5%;
  margin-top: 2%;
  margin-right: 5%;
  height: 20%;
  font-size: 1.5rem;
  font-weight: bold;
  overflow-x: auto;
  overflow-y: hidden;
  color: black; /* Ensure text is always black */
}

.todo-description {
  margin-left: 5%;
  margin-right: 5%;
  height: 85%;
  font-size: 1rem;
  overflow-x: auto;
  overflow-y: auto;
  color: black; /* Ensure text is always black */
}

.todo-details {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.add-todo-button {
  position: fixed;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  bottom: 20px;
  height: 35px;
  width: 200px;
  z-index: 999;
  border-radius: 10px;
  background-color: #707070;
  color: rgb(0, 0, 0);
}

.add-todo-button-wrap {
  position: fixed;
  display: flex;
  justify-content: center;
  bottom: 10%;
  left: 25%;
  right: 0;
  z-index: 999;
}

</style>