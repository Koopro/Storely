<template>
    <Sidebar />
    <div class="top"></div>
    <div class="menu">

        
    </div>

</template>

<style>
    body {
        margin: 0;
        padding: 0;
        background-color: white;
    }

    .top {
        position: fixed;
        top: 0;
        left: 0;
        height: 104px;
        width: 100%;
        background-color: #000000;
        z-index: 999;
    }

    .menu {
        position: fixed;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 425px;
        background-color: #8c8c8c;
    }
</style>

<script>
    import Sidebar from '../components/sidebar/Sidebar.vue';
    
    export default {
        components: {
            Sidebar
        }
    }
</script>