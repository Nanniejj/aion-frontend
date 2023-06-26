<template>
    <div>
        <b-row align-h="center"  id="phone">
            <b-col  sm="8"></b-col>
        </b-row>
        <footer>
            <div class="footer md-font p-4">Registering to this website, you accept our Terms of use and our Privacy policy</div>
        </footer>
    </div>
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