<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <p @click="adds"><button>按钮</button></p>
    <p @click="$store.commit('add')">counter:{{$store.state.counter}}</p>
    <p @click="$store.dispatch('add')">async:{{$store.state.counter}}</p>
    <p >getters:{{$store.getters.doubleCounter}}</p>
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
  mounted() {
    console.log(this.$store.getters);
  },
  methods:{
    adds(){
      console.log('add event')
    }
  }
}
</script>
