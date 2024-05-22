<template>
  <div class="add-todo-button-wrap">
    <button @click="showPopup = true" class="add-todo-button">Neue ToDo hinzufügen</button>
  </div>
  <div class="popup" v-if="showPopup">
    <h2>Neue ToDo</h2>
    <input v-model="newTodo.name" class="name" placeholder="Name" />
    <textarea v-model="newTodo.description" class="description" placeholder="Beschreibung"></textarea>
    <input v-model="newTodo.dueDate" class="date" type="date" />
    <input v-model="newTodo.dueTime" class="time" type="time" />
    <label class="urgent">
      Dringend
      <input v-model="newTodo.urgent" class="check-urgent" type="checkbox" />
    </label>
    <div class="buttons">
      <button @click="createTodo" class="add">Hinzufügen</button>
      <button @click="showPopup = false" class="cancel">Abbrechen</button>
  </div>
  </div>

  <div class="popup" v-if="showEditPopup">
    <h2>ToDo bearbeiten</h2>
    <input v-model="editTodo.name" class="name" placeholder="Name" />
    <textarea v-model="editTodo.description" class="description" placeholder="Beschreibung"></textarea>
    <input v-model="editTodo.dueDate" class="date" type="date" />
    <input v-model="editTodo.dueTime" class="time" type="time" />
    <label class="urgent">
      Dringend
      <input v-model="editTodo.urgent" class="check-urgent" type="checkbox" />
    </label>
    <label class="completed">
      Erledigt
      <input v-model="editTodo.completed" class="check-completed" type="checkbox" />
    </label>
    <div class="buttons">
      <button @click="updateTodo" class="add">Speichern</button>
      <button @click="showEditPopup = false" class="cancel">Abbrechen</button>
    </div>
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
  width: 70%;
  height: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(0, 0, 0);
  padding: 1rem;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  overflow: hidden;
}

.name {
  position: absolute;
  margin-top: 30px;
  left: 5%;
  border: 2px solid #ffffff;
  color: #ffffff;
  border-radius: 10px;
  padding-left: 10px;
}

.name:hover, .description:hover, .date:hover, .time:hover {
  border-radius: 5px;
}

.description {
  position: absolute;
  margin-top: 80px;
  width: 90%;
  left: 50%;
  transform: translate(-50%, 0);
  min-height: 30%;
  max-height: 55%;
  border: 2px solid #ffffff;
  color: #ffffff;
  border-radius: 10px;
  padding-left: 10px;
}

.date {
  position: absolute;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  border: 2px solid #ffffff;
  color: #ffffff;
  border-radius: 10px;
  padding-left: 10px;
}

.time {
  position: absolute;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  right: 5%;
  border: 2px solid #ffffff;
  color: #ffffff;
  border-radius: 10px;
  padding-left: 10px;
}

.buttons {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  width: 50%;
  bottom: 40px;
}

.add, .cancel {
  position: absolute;
  height: auto;
  width: 40%;
  display: flex;
  justify-content: center;
  border-radius: 10px;
}

.add:hover, .cancel:hover {
  border: 2px solid rgb(50, 252, 0);
}

.add {
  left: 0;
  background-color: white;
  color: black;
}

.cancel {
  right: 0;
  background-color: white;
  color: black;
}

.urgent {
  position: absolute;
  display: flex;
  bottom: 100px;
  left: 50%;
  transform: translate(-50%, 0);
}

.check-urgent {
  margin-left: 10px;
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

@media (max-width: 925px) {
  .popup {
    height: 70%;
  }

  .description {
    margin-top: 25%;
  }

  .date {
    margin-top: 15%;
    left: 5%;
    transform: unset;
  }
  .time {
    margin-top: 15%;
    right: 5%;
    transform: unset;
  }
}


@media (max-width: 617px) {
    .description {
      margin-top: 40%;
    }

    .buttons {
      width: 100%;
    }

    .add {
      left: 5px;
    }

    .cancel {
      right: 5px;
    }

    .date {
      margin-top: 30%;
    }

    .time {
      margin-top: 30%;
    }

  }

</style>