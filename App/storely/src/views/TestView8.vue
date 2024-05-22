<template>
  <div class="popup">
    <h2>ToDo bearbeiten</h2>
    <input  class="name" placeholder="Name" />
    <textarea  class="description" placeholder="Beschreibung"></textarea>
    <input class="date" type="date" />
    <input class="time" type="time" />
    <label class="urgent">
      Dringend
      <input class="check-urgent" type="checkbox" />
    </label>
    <div class="buttons">
    <button class="add">Speichern</button>
    <button class="cancel">Abbrechen</button>
    </div>
  </div>

  <!-- <div class="popup">
    <h2>Neue ToDo</h2>
    <input class="name" placeholder="Name" />
    <textarea class="description" placeholder="Beschreibung"></textarea>
    <input class="date" type="date" />
    <input class="time" type="time" />
    <label class="urgent">
      Dringend
      <input class="check-urgent" type="checkbox" />
    </label>
    <div class="buttons">
      <button class="add">Hinzufügen</button>
      <button class="cancel">Abbrechen</button>
  </div>
  </div> -->
</template>


<style>
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
  z-index: 1000;
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