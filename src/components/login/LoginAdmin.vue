<template>
   <b-row align-h="center" id="desktop">
                   <b-col  sm="7"></b-col>
                <b-col  sm="5">
                <a  v-bind:href="adminLink" target="_blank"><div id="admin-box">
                <i class="fa fa-user-circle"/><span class="text-title">  เข้าสู่ระบบการจัดการข้อมูล</span>
                </div></a>
                </b-col>
    </b-row>
</template>

<script>
export default {
data() {
    return {
         adminLink:this.$hostname +'/Management/login/',
    }
},
}
</script>

<style scoped>
a {
  color: black;
}
#phone{
  display: none;
}
.text-title{
font-size: large;
}
.fa-user-circle{
  font-size: x-large;
}
a{
  text-decoration: none
}
#admin-box{
     background-color: #fed16e;
    padding: 10px 25px;
    border-radius: 30px 0px 0px 30px;
    cursor: pointer;
    text-decoration: none;
    margin-top: 20px;
    -webkit-box-shadow: 1px 1px 4px #6666;
    box-shadow: 1px 1px 4px #6666;
    text-decoration: none;
    display: block;
    float: right;
    }
#admin-box:hover{
      background-color: #fed16e;
      color: white;
}
@media only screen and (min-width: 0px) and (max-width: 600px){
.text-title {
    font-size: medium; 
}
#admin-box {
    background-color: #fed16e;
    padding: 6px 20px;
    cursor: pointer;
    text-decoration: none;
    /* margin: 51px 0px; */
    margin-top: 20px;
    text-decoration: none;
    /* box-shadow: 1px 1px 4px #666666; */
    display: inline-block;
    float: none;
    border-radius: 30px;
}
#desktop{
  display: none;
}
#phone{
  display: block;
}
}
</style>