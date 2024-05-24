<template>
  <div class="add-todo-button-wrap">
    <button @click="showPopup = true" class="add-todo-button">Neue ToDo hinzufügen</button>
  </div>
  <div class="popup" v-if="showPopup">
    <h2>Add ToDo</h2>
    <input v-model="newTodo.name" class="name" placeholder="Name" />
    <textarea v-model="newTodo.description" class="description" placeholder="Beschreibung"></textarea>
    <input v-model="newTodo.dueDate" class="date" type="date" />
    <input v-model="newTodo.dueTime" 
       class="time" 
       type="time" 
       :disabled="!newTodo.dueDate" 
       :class="{ 'disabled-class': !newTodo.dueDate }" />

    <label class="urgentfield">
      Urgent
      <input v-model="newTodo.urgent" class="check-urgent" type="checkbox" />
    </label>
    <div class="buttons">
      <button @click="createTodo" class="add">Add</button>
      <button @click="showPopup = false" class="cancel">Cancel</button>
    </div>
  </div>

  <div class="popup" v-if="showEditPopup">
    <h2>Edit ToDo</h2>
    <input v-model="editTodo.name" class="name" placeholder="Name" />
    <textarea v-model="editTodo.description" class="description" placeholder="Beschreibung"></textarea>
    <input v-model="editTodo.dueDate" class="date" type="date" />
    <input v-model="editTodo.dueTime" class="time" type="time" :disabled="!editTodo.dueDate" />
    <div class="urgent-completed-wrap">
      <label class="urgentfield">
        Urgent
        <input v-model="editTodo.urgent" class="check-urgent" type="checkbox" :disabled="isOverdue(editTodo)" />
      </label>
      <label class="completedfield">
        Completed
        <input v-model="editTodo.completed" class="check-completed" type="checkbox" />
      </label>
    </div>
    <div class="buttons">
      <button @click="updateTodo" class="add">Update</button>
      <button @click="showEditPopup = false" class="cancel">Cancel</button>
      <button @click="deleteTodo" class="delete">Delete</button>
    </div>
  </div>

  <div class="grid-container">
    <div
      v-for="(todo, index) in sortedTodos"
      :key="index"
      :class="['grid-item', todoClass(todo)]"
      @click="selectTodo(todo)"
    >
      <div v-if="!todo.completed && isOverdue(todo)" class="overdue-timer">⏰</div>
      <div class="todo-header">{{ todo.name }}</div>
      <div class="todo-description">{{ todo.description }}</div>
      <div class="todo-datetime" v-if="todo.dueDate || todo.dueTime">
        <div v-if="todo.dueDate">{{ formatDate(todo.dueDate) }}</div>
        <div v-if="todo.dueTime">{{ formatTime(todo.dueTime) }}</div>
      </div>
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
      const sortedTodos = [...this.todos];

      sortedTodos.sort((a, b) => {
        // Sort by completed status
        if (a.completed !== b.completed) return a.completed ? 1 : -1;

        // Sort by urgency
        if (a.urgent !== b.urgent) return a.urgent ? -1 : 1;

        // Sort by due date
        if (a.dueDate && b.dueDate) {
          const [dayA, monthA, yearA] = a.dueDate.split('.');
          const [dayB, monthB, yearB] = b.dueDate.split('.');
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);

          if (dateA - dateB !== 0) return dateA - dateB;

          // If dates are equal, sort by due time
          if (a.dueTime && b.dueTime) {
            const [hourA, minuteA] = a.dueTime.split(':');
            const [hourB, minuteB] = b.dueTime.split(':');
            const timeA = new Date();
            timeA.setHours(hourA, minuteA, 0, 0);
            const timeB = new Date();
            timeB.setHours(hourB, minuteB, 0, 0);
            return timeA - timeB;
          }
          
          if (a.dueTime) return -1;
          if (b.dueTime) return 1;
        }

        if (a.dueDate) return -1;
        if (b.dueDate) return 1;

        // If neither has a due date, maintain original order
        return 0;
      });

      return sortedTodos;
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
    formatDateForAPI(date) {
      if (!date) return '';
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`;
    },
    formatDateForDisplay(date) {
      if (!date) return '';
      const [day, month, year] = date.split('.');
      return `${year}-${month}-${day}`;
    },
    async createTodo() {
      const nowselectedlist = localStorage.getItem('selectedListId');

      if (!nowselectedlist) {
        alert('Select a list in order to create a new todo!');
        return;
      }

      const todoData = {
        ...this.newTodo,
        dueDate: this.formatDateForAPI(this.newTodo.dueDate),
        list: nowselectedlist
      };

      try {
        const response = await axios.post(`${this.apiUrl}/todos`, todoData, {
          headers: {
            'Authorization': this.authToken
          }
        });
        if (response.status === 201) {
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
      this.editTodo = { 
        ...todo,
        dueDate: this.formatDateForDisplay(todo.dueDate)
      };
      this.showEditPopup = true;
    },
    async updateTodo() {
      const todoData = {
        ...this.editTodo,
        dueDate: this.formatDateForAPI(this.editTodo.dueDate)
      };

      try {
        const response = await axios.put(`${this.apiUrl}/todos/${this.editTodo._id}`, todoData, {
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
    async deleteTodo() {
      try {
        const response = await axios.delete(`${this.apiUrl}/todos/${this.editTodo._id}`, {
          headers: {
            'Authorization': this.authToken
          }
        });
        if (response.status === 200) {
          this.todos.splice(this.editIndex, 1);
          this.showEditPopup = false;
        }
      } catch (error) {
        console.log('Error deleting todo: ' + error.response.data.message);
      }
    },
    async deleteTodoById(todoId) {
      try {
        const response = await axios.delete(`${this.apiUrl}/todos/${todoId}`, {
          headers: {
            'Authorization': this.authToken
          }
        });
        if (response.status === 200) {
          this.todos = this.todos.filter(todo => todo._id !== todoId);
        }
      } catch (error) {
        console.log('Error deleting todo: ' + error.response.data.message);
      }
    },
    completeTodo(todo) {
      todo.completed = true;
      this.updateTodo();
    },
    todoClass(todo) {
      if (todo.completed) return 'completed';
      if (this.isOverdue(todo)) return 'urgent';
      if (todo.urgent) return 'urgent';
      return 'normal';
    },
    isOverdue(todo) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');

      const currentDate = `${year}-${month}-${day}`;

      let dueDate = null;
      if (todo.dueDate) {
        const [day, month, year] = todo.dueDate.split('.');
        dueDate = new Date(`${year}-${month}-${day}`);
      }

      let dueTime = null;
      if (todo.dueDate && todo.dueTime) {
        dueTime = new Date(`${year}-${month}-${day}T${todo.dueTime}:00`);
      }

      // Überprüfung, ob dueDate existiert und ob das Enddatum des Tages in der Vergangenheit liegt
      if (dueDate && dueDate < new Date(year, month - 1, day)) {
        return true;
      }

      // Wenn das Datum heute ist und die Uhrzeit in der Vergangenheit liegt
      if (dueDate && dueDate.toDateString() === now.toDateString()) {
        if (dueTime && dueTime < now) {
          return true;
        }
      }

      return false;
    },
    formatDate(date) {
      const [day, month, year] = date.split('.');
      return new Date(`${year}-${month}-${day}`).toLocaleDateString();
    },
    formatTime(time) {
      return time ? new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    }
  },
  created() {
    this.fetchTodos();
  }
};
</script>

<style scoped>
body {
  background-color: #f5f5f5;
  font-family: 'Roboto', sans-serif;
}

.popup {
  position: fixed;
  width: 80%;
  max-width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  overflow: hidden;
}

.popup h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
}

input, textarea {
  width: calc(100% - 2rem);
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #4caf50;
}

textarea {
  height: 100px;
  resize: none;
}

.urgent-completed-wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

label {
  font-size: 1rem;
  color: #333;
}

.check-urgent, .check-completed {
  margin-left: 0.5rem;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.add, .cancel, .delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add {
  background-color: #4caf50;
  color: #fff;
}

.add:hover {
  background-color: #45a049;
}

.cancel {
  background-color: #f44336;
  color: #fff;
}

.cancel:hover {
  background-color: #e53935;
}

.delete {
  background-color: #ff5722;
  color: #fff;
}

.delete:hover {
  background-color: #e64a19;
}

.grid-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  gap: 1%;
  padding: 1rem;
  margin-bottom: 45px;
}

.grid-item {
  flex: 1 1 calc(33.33% - 1%);
  max-width: calc(33.33% - 1%);
  margin-bottom: 1%;
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
  transition: transform 0.3s;
}

.grid-item:hover {
  transform: translateY(-5px);
}

.grid-item.urgent {
  background-color: #ff6b6b;
}

.grid-item.normal {
  background-color: #ffeb3b;
}

.grid-item.completed {
  background-color: #81c784;
  text-decoration: line-through black;
}

.todo-header {
  position: absolute;
  top: 5%;
  margin-left: 5%;
  margin-top: 2%;
  margin-right: 5%;
  font-size: 1.5rem;
  font-weight: bold;
  overflow-x: auto;
  overflow-y: hidden;
  color: black;
}

.todo-description {
  position: absolute;
  top: 25%;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 2%;
  font-size: 1rem;
  overflow-x: auto;
  overflow-y: auto;
  color: black;
}

.todo-datetime {
  margin-left: 5%;
  margin-right: 5%;
  margin-top: auto;
  font-size: 1rem;
  text-align: center;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.overdue-timer {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 2rem;
  color: #ff0000;
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
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.disabled-class {
  border: 2px solid red;
}

.add-todo-button:hover {
  background-color: #5a5a5a;
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
