<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <p @click="$store.commit('add')">counter:{{$store.state.counter}}</p>
    <p @click="$store.dispatch('add')">async:{{$store.state.counter}}</p>
    <!-- <p >getters:{{$store.getters.doubleCounter}}</p> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  created() {
    console.log(this.$router);
    console.log(this);
  },
  mounted() {
    console.log(this.$router);
    console.log(this);
  }
}
</script>
