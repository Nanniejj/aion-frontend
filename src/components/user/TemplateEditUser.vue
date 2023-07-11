<template>
  
<div> 

 <vue-modaltor :visible="open" @hide="hideModal" :animation-panel="'modal-slide-top'" :resize-width='{3000:"40%",992:"50%",768:"90%"}'>
     <b-container fluid>
        <h5><b>แก้ไขข้อมูล</b></h5> <hr>
          <b-row class="my-1">
              <b-col sm="12"><span style="white-space: nowrap;">คำแนะนำ : กรุณาแก้ไขข้อมูลของ</span></b-col>
              <b-col sm="12"><span style="white-space: nowrap;">{{this.getAddUserStatus}}</span></b-col>
            <b-col sm="12">
              <br>
              <label for="input-small1"><b>Username : {{user.username}}</b></label>
            </b-col>
          </b-row>

 
           <b-row class="my-1">
            <b-col sm="12">
              <label for="input-small1"><b>ชื่อ </b></label>
            </b-col>
            <b-col sm="12">
              <b-form-input id="input-small1" placeholder="" v-model="user.name"></b-form-input>
      
            </b-col>
          </b-row>
           <b-row class="my-1">
            <b-col sm="12">
              <label for="input-small1"><b>นามสกุล </b></label>
            </b-col>
            <b-col sm="12">
              <b-form-input id="input-small1" placeholder="" v-model="user.lastname"></b-form-input>
        
            </b-col>
          </b-row>

          <b-row class="my-1">
            <b-col sm="12">
              <label for="input-small1"><b>บริษัท/หน่วย </b></label>
            </b-col>
            <b-col sm="12">
              <b-form-input id="input-small1" placeholder="" v-model="user.company"></b-form-input>

            </b-col>
          </b-row>

          <b-row class="my-1">
            <b-col sm="12">
              <label for="input-small1"><b>Email </b></label>
            </b-col>
            <b-col sm="12">
              <b-form-input id="input-small1" placeholder="" v-model="user.email"></b-form-input>
    
            </b-col>
          </b-row>

          <b-row class="my-1">
            <b-col sm="12">
              <label for="input-small1"><b>สิทธิ์ </b></label>
            </b-col>
            <b-col sm="12">
                        <div>
                            <input type="radio" value="user" id="user" name="permit" v-model="user.role" checked />
                            <label for="user">User</label>
                        </div>
                        <div>
                            <input type="radio" value="admin" id="admin" name="permit" v-model="user.role" />
                            <label for="admin">Admin</label>
                        </div>

            </b-col>
          </b-row>

          <b-row class="my-1">
            <b-col sm="12" style="text-align:right;">
                <br>
              <b-button class="btn btn-close" size="sm" @click=" hideModal()">ปิดหน้าต่าง</b-button>  <b-button class="btn btn-save" size="sm" @click="submitform()" >บันทึก</b-button>
            </b-col>
          </b-row>
     </b-container>
    </vue-modaltor>
</div>


</template>

<script>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            open: false,
            user: {
                _id: "",
                username: "",
                password: "",
                name: "",
                lastname: "",
                company: "",
                role: "user",
                email: "",
            },
        };
    },
methods: {

      submitform(){

          this.$store.dispatch("updateUser",this.user);
          console.log("Save data employee");
          this.open = false;
      },
    hideModal() {
      this.open = false;
    },    
    openModal(item) {

      this.$store.dispatch("statusUser","");
      this.user = item
      this.open = true;
    },
    },
    computed: {
    ...mapGetters(['getAddUserStatus']),
  },
};
</script>

<style  scoped>
.btn-close{
  color: #f8f9fa;
    background-color: #4c412b;
    border-color: #4c412b;
    box-shadow: 1px 1px 3px #666666;
}
.btn-save:hover {
    background: #fed16e;
    border-color: #fed16e;
}
.btn-save{
background:#ede7dd;
border-color:  #ede7dd;
color:#4c412b;
box-shadow: 1px 1px 3px #666666;
}
td{
    vertical-align: middle;
}
.btn-add:hover{
  
  background-color: #504b3c;
  color: white;
}
.btn-add:hover .fa-plus{
  
  background-color: #504b3c ;
  
}
.btn-add{
 background-color: #ede7dd;
 color:#504b3c;
  padding: 8px;
  padding-top: 5px;
   padding-bottom: 5px;
  border-radius: 25px;
  box-shadow: 1px 1px 3px #666666;
}

@media only screen and (min-width: 0px) and (max-width: 600px){
.btn-add {
    margin: auto;
    display: block;
    margin-top: 20px;
}
}

</style>