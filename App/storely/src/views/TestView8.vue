<template>
    <div class="wrap">
  <div class="popup">
    <h2>Neue ToDo</h2>
    <input placeholder="Name" />
    <textarea placeholder="Beschreibung"></textarea>
    <input type="date" />
    <input type="time" />
    <label>
      Dringend
      <input type="checkbox" />
    </label>
    <button>Hinzufügen</button>
    <button>Abbrechen</button>
  </div>
</div>
</template>


<style>
.wrap {
    position: absolute;
    height: 90%;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
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
</style>