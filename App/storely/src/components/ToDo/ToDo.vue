<template>
    <button @click="showPopup = true" class="add-todo-button">Neue ToDo hinzufügen</button>
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
      <button @click="addTodo">Hinzufügen</button>
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
export default {
  data() {
    return {
      todos: JSON.parse(localStorage.getItem('todos')) || [],
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
    addTodo() {
      if (this.newTodo.name.trim() !== '') {
        this.todos.push({ ...this.newTodo });
        this.saveTodos();
        this.resetNewTodo();
        this.showPopup = false;
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
    updateTodo() {
      if (this.editIndex !== null) {
        this.todos.splice(this.editIndex, 1, { ...this.editTodo });
        this.saveTodos();
        this.showEditPopup = false;
      }
    },
    completeTodo(todo) {
      todo.completed = true;
      this.saveTodos();
      this.selectedTodo = null;
    },
    saveTodos() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    },
    todoClass(todo) {
      if (todo.completed) return 'completed';
      if (todo.urgent) return 'urgent';
      return 'normal';
    }
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
  display: grid;
  grid-template-columns: 23% 23% 23% 23%;
  gap: 1%;
  width: 97%;
  height: auto;
  justify-content: center;
  overflow: auto;
  margin-top: 10px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  cursor: pointer;
  position: relative;
  aspect-ratio: 1 / 1; /* Ensures the grid items are always square */
  border-radius: 20px;
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
  position: absolute;
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
  z-index: 999;
}
</style>
