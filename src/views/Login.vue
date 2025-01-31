<template>
<div id="Login" class="bg">
    <!-- <LoginAdmin/> -->
        <b-row align-h="center">
          <b-col align-self="center">
            <!-- <img src="../assets/AioNET.png" class="logo"> -->
            <img src="../assets/Aion.png" class="logo2">
          </b-col>
        </b-row>
    <LoginForm/>
    <Footer/>
    <!-- <FooterHome/> -->

   </div>
</template>

<script>
import FooterHome from "@/components/FooterHome.vue";

// import LoginAdmin from '@/components/login/LoginAdmin.vue';
import LoginForm from '@/components/login/LoginForm.vue';
import Footer from '@/components/login/Footer.vue';
export default {
name: 'Login',
components:{
    Footer,LoginForm,FooterHome //LoginAdmin
},
data() {
    return {
        
    }
},

}
</script>

<style scoped>
.logo2{
  margin: auto;
  width: 35vw;
  height: auto;
  margin-top: 10%;
}
.logo {
  margin: auto;
  width: 30vw;
  height: auto;
  margin-top: 10%;
}
.bg {
  margin: auto;
  background-color: #fff;
  height: 100vh;
  overflow: auto;
}
@media only screen and (min-width: 0px) and (max-width: 600px){


}
</style>