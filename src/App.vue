<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>

.custom-switch.b-custom-control-lg .custom-control-label::before, .input-group-lg .custom-switch .custom-control-label::before  {
   cursor: pointer !important;
}
.select-type-report .vs__dropdown-menu{
max-height: 170px !important;
height: 170px;
}
.btn-report .btn-secondary{
  color: #ffffff !important;
  border-color: #5679a5 !important;
  background-color: #5679a5 !important;
}
.btn-report .dropdown-item:hover, .dropdown-item:focus {
    color: #16181b;
    text-decoration: none;
    background-color:#c3d3e7;
}
#content > iframe.if-link > html{
overflow: hidden !important;
}
.v-canvas.touches{
    height: 100vh !important;
}
#content > iframe.if-link{
width: 80%;
  height: 80vh;
}
 .btn-secondary:focus {
    box-shadow: 0 0 0 0.2rem rgb(130 138 145 / 0%);
}
.vs__dropdown-menu{
  z-index: 9999999 !important;
}
.box-contents{
  text-align: justify;
}
.arrow_box {
  font-size: small;
}
.b-avatar.imgpro.badge-secondary {
  background: #868788 !important;
}

.imgpro .b-avatar-img img {
  width: 100%;
  height: auto !important;
}
/* defaultwordcloud */
.toast {
  flex-basis: unset;
  max-width: auto;
  font-size: 0.875rem;
  background-color: rgba(255, 255, 255, 0.85);
  background-clip: padding-box;
  border: 0px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
  opacity: 0;
  border-radius: 0.25rem;
  color: #4c412b;
}
#loadcloud .velmld-spinner {
  top: 10% !important;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  text-align: center;
}
/*topuser */
.badge-info {
  color: #fff;
  background-color: #f8f9fa00 !important;
}
.b-avatar-badge {
  bottom: -9px !important;
  right: -17px !important;
  background-color: #17a3b800;
}
/* ------------------------------ */
.onedate,
.twodate {
  font-size: small;
  font-weight: bold;
  background: #eee;
  padding: 4px 15px;
  width: fit-content;
  border-radius: 10px;
}
#chart-domain svg {
  overflow: unset !important;
}
#readmore {
  cursor: pointer;
  color: #007bff;
  text-decoration: none;
  background-color: transparent;
}
#readmore :hover {
  cursor: pointer;
  color: #007bff;
  text-decoration: #3a86ad;
  background-color: transparent;
}
/* avatar user */
.hei-popup.modal-vue .modal-vue-show {
  max-height: 85% !important;
}
#user-table > tbody > tr > td {
  border-top: 1px solid rgba(0, 0, 0, 0.125) !important;
}
/* #user-table > thead > tr > th:first-child{
  width: 60px !important;
} */
/* #user-table > thead > tr > th:last-child{
  width: 300px !important;
} */
#user-table > thead > tr > th {
  width: auto !important;
}
/* ----------- */
.badge-light {
  color: #212529;
  background-color: #ede7dd !important;
}
.b-form-tag {
  font-size: 80%;
}
.b-form-tags .b-form-tags-list .b-form-tag {
  border: 1px solid #ccc !important;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: white;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #f1f1f1;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.fa-camera {
  margin-left: 5px;
  text-decoration: none;
  padding: 6px 7px;
  border-radius: 20px;
  background: #ccc;
  color: #696d71;
  font-size: 22px;
  vertical-align: bottom;
}
.fa-camera:hover {
  background: #696d71;
  color: #ccc;
  cursor: pointer;
}
#cmt-card {
  max-height: 500px;
  overflow: auto;
}
#cmt-time {
  float: right;
  color: #7b7d7f;
  font-size: small;
}
#img-cmt {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.vgs__container {
  height: 80vh !important;
}
.vgs__close {
  font-size: 50px !important;
  width: 88px !important;
}
.vs__search,
.vs__search:focus {
  color: grey !important;
}
.socialogo {
  width: 20%;
  margin-bottom: 15px;
  margin-top: 15px;
}
svg {
  overflow: auto;
  vertical-align: middle;
}
.vs--disabled .vs__clear,
.vs--disabled .vs__dropdown-toggle,
.vs--disabled .vs__open-indicator,
.vs--disabled .vs__search,
.vs--disabled .vs__selected {
  cursor: not-allowed;
  background-color: #ede7dd !important;
}
/* table monitor */
/* #tb-profile > thead > tr > th:nth-child(5){
    width: 121px !important;
 }
 #tb-profile > thead > tr > th:nth-child(7){
    width: 160px !important;
 } */
#not .card-body {
  min-height: auto;
}
/* dashboard */
.socialicon {
  width: 40px;
}
.modal-footer {
  display: none !important;
}
.box:focus {
  outline: none;
}
.modal-header .close:focus {
  outline: none;
}

.modal-header .close {
  padding: 1rem 1rem;
  margin: -1rem -1rem -1rem auto;
  position: absolute;
  right: 9px;
  font-size: 3rem;
  z-index: 2;
}
.modal-header {
  padding: 0rem 1rem;
  border-bottom: 0px solid #dee2e6;
}
.prt {
  display: none;
}
#export-btn {
  margin: 0px 20px;
  color: #495057;
  background-color: #e9ecef;
  border-color: #e9ecef;
  border-radius: 9px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 20%);
}
#export-btn:hover {
  color: white;
  background-color: #495057;
  border-color: #495057;
}
.box {
  margin-top: 20px;
  background-color: powderblue;
  position: relative;
  display: inline-block;
  min-height: 42vh;
  border-radius: 19px;
  width: 98%;
}
/* div.left {
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translate(-50%, -50%);
  height: 40px;
  width: 30px;
  border-radius: 150px 0 0 150px;
  background-color: #ffffff;
}
div.right {
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(-50%, -50%);
  height: 40px;
  width: 30px;
  border-radius: 0 150px 150px 0;
  background-color: #ffffff;
} */
.vue-popover {
  padding: 30px;
  width: 60vw !important;
  z-index: 2 !important;
  top: 50% !important;
}
.vue-popover.dropdown-position-bottom:before {
  border-left: 16px solid transparent !important ;
  border-right: 16px solid transparent !important;
  border-bottom: 16px solid #fff !important;
  top: -15px !important;
  left: calc(48% - 6px) !important;
  filter: drop-shadow(0px -2px 2px rgba(52, 73, 94, 0.1)) !important;
}
/* .velmld-overlay {
  position: relative !important;
}
.velmld-spinner {
  margin-top: 28px;
  position: relative !important;
} */

/* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); */

.bold {
  font-weight: bold;
}

.margin-auto {
  margin: auto !important;
}

.break-word {
  word-wrap: break-word;
}

.size {
  font-size: 30px;
}

.title {
  text-align: start;
  margin-left: 12%;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 10px;
  font-weight: bolder;
}

.align-start {
  text-align: start;
}

#app {
  background-color: #ddd;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  /* margin-top: 2%; */
}
/* #__BVID__254
  > div
  > div:nth-child(3)
  > div
  > div */
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .mx-datepicker-range {
    width: fit-content !important;
  }
  .title {
    font-size: 5vw !important;
  }
  /* scroll */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    padding-right: 2px;
    background: #f1f1f1;
  }
  /* dashboard */
  .mx-input:hover,
  .mx-input:focus {
    border-color: #fed16e !important;
  }
  .mx-input {
    color: #4c412b;
    text-align: center;
  }
  .mx-datepicker-body {
    color: #4c412b !important;
  }
  .mx-calendar-content .cell:hover {
    color: #795548 !important;
    background-color: #ede7dd !important;
  }
  .mx-table-date .today {
    color: #ffc107 !important;
  }
  .mx-calendar-content .cell.in-range,
  .mx-calendar-content .cell.hover-in-range {
    color: #795548 !important;
    background-color: #ede7dd !important;
  }
  .mx-calendar-content .cell.active {
    color: #fff !important;
    background-color: #4c412bfa !important;
  }
  /* dashboardPost */
  #btn-radios-1 > label.btn.btn-secondary {
    color: #636465;
    background-color: #dddddd;
    border-color: #dddddd;
  }
  #btn-radios-1 > label.btn.btn-secondary.active:nth-child(1) {
    background-color: #54c69d;
    border-color: #54c69d;
    color: white;
  }
  #btn-radios-1 > label.btn.btn-secondary.active:nth-child(2) {
    background-color: #3a86ad;
    border-color: #3a86ad;
    color: white;
  }
  #btn-radios-1 > label.btn.btn-secondary.active:nth-child(3) {
    background-color: #f7776a;
    border-color: #f7776a;
    color: white;
  }
}
/* .btn.btn-secondary.active > #btn-radios-1_BV_option_1 {
background-color: #54c69d !important;
border-color: #54c69d !important;
} */
/* ---------------------------------------------------- */
#overflow-page {
  overflow: hidden;
}
body {
  padding: 0px !important;
}
.page-link {
  color: #4c412b;
}
/* .modal-vue .modal-vue-show {
    width: 40% !important;
  } */

.modal-vue--content.space-content {
  background: white;
}
.modal-vue-overlay {
  background-color: black !important ;
  opacity: 0.5;
}
.table-hover tbody tr:hover {
  cursor: pointer;
  color: #4c412b;
  background-color: #ede7dd57;
}
.table-sm td,
.table-sm th {
  vertical-align: middle;
}
.page-item.active .page-link {
  z-index: 3;
  color: #fff;
  background-color: #4c412b;
  border-color: #4c412b;
}
.table-sm td,
.table-sm th {
  padding: 15px;
  border-top: 1px solid #504b3c9e;
}
.table .thead-light th {
  color: #4d422c;
  background-color: #ede7dd !important ;
  border-color: #ede7dd !important  ;
  /* border-top-left-radius: 18px;
      border-top-right-radius: 18px; */
}
.table .thead-dark th {
  color: #4d422c;
  background-color: #ede7dd !important ;
  border-color: #ede7dd !important  ;
}
/*-----------------------------end template domain---------------------- */
.custom-switch .custom-control-label::after {
  background-color: #ffffff;
}
.mi .custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  background-color:#5679a5;
  border: #5679a5 solid 1px;
}

.custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  background-color: #fed16e;
  border: #fed16e solid 1px;
}
.custom-control-label::before {
  border-color: #4d422c;
  background-color: #4e432d;
  color: #fff;
}
rect {
  cursor: pointer;
}
.vdatetime-popup__header {
  background: #fed16e;
}
.vdatetime-calendar__month__day--selected > span > span,
.vdatetime-calendar__month__day--selected:hover > span > span {
  color: #fff;
  background: #fed16e;
}
.vdatetime-popup__actions__button {
  color: #ffc107;
}
.vdatetime-time-picker__item--selected {
  color: #ffc107;
}
.dp-mi .dropdown-item:hover,
.dropdown-item:focus {
  color: #16181b;
  text-decoration: none;
  background-color: rgba(122, 158, 201, 0.452);
}
.dropdown-item:hover,
.dropdown-item:focus {
  color: #16181b;
  text-decoration: none;
  background-color: #fed16e8f;
}
/* .nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link {
    color: #4c412b;
    background-color: #fff;
    border-bottom-color:#4c412b !important;
    display: inline-block;
    border: 3px solid transparent;
}
.nav-link:hover{

  background-color: #ede7dd;
}
.nav-tabs {
    border-bottom: 1px solid transparent;
} */
.spinner-border {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  width: 120px;
  height: 120px;
  pointer-events: none;
  overflow: hidden;
  color: white;
}
.modal-vue--content-panel.space-content {
  padding: 30px;
}
#date-time > div > div > input {
  margin-top: 30px;
  width: 100%;
  background-color: #dddddd;
  border: 0;
  padding: 7px;
  border-radius: 15px;
  text-align: center;
  color: #4c412b;
}
#week
  > div
  > div:nth-child(4)
  > div.col-7
  > div
  > div
  > div:nth-child(1)
  > div
  > svg
  > g:nth-child(3)
  > g:nth-child(4)
  > g:nth-child(1)
  > text {
  display: none;
}
#week
  > div
  > div:nth-child(4)
  > div.col-7
  > div
  > div
  > div:nth-child(1)
  > div
  > svg
  > g:nth-child(3)
  > g:nth-child(4)
  > g:nth-child(2)
  > text {
  display: none;
}
#week
  > div
  > div:nth-child(4)
  > div.col-7
  > div
  > div
  > div:nth-child(1)
  > div
  > svg
  > g:nth-child(3)
  > g:nth-child(4)
  > g:nth-child(3)
  > text {
  display: none;
}
#month
  > div
  > div:nth-child(4)
  > div.col-7
  > div
  > div
  > div:nth-child(1)
  > div
  > svg
  > g:nth-child(3)
  > g:nth-child(4)
  > g:nth-child(1)
  > text {
  display: none;
}
#month
  > div
  > div:nth-child(4)
  > div.col-7
  > div
  > div
  > div:nth-child(1)
  > div
  > svg
  > g:nth-child(3)
  > g:nth-child(4)
  > g:nth-child(2)
  > text {
  display: none;
}
#month
  > div
  > div:nth-child(4)
  > div.col-7
  > div
  > div
  > div:nth-child(1)
  > div
  > svg
  > g:nth-child(3)
  > g:nth-child(4)
  > g:nth-child(3)
  > text {
  display: none;
}
#g-chart > div > div > div:nth-child(1) > div > svg > rect {
  fill: transparent;
}
div.modal-vue > div > div.modal-vue-panel.modal-fade.modal-vue-show {
  width: 80% !important;
}
#content
  > div:nth-child(12)
  > div
  > div:nth-child(1)
  > div
  > div.row.justify-content-center.info-party
  > div.result2
  > div
  > div
  > div:nth-child(1)
  > div
  > svg
  > rect {
  fill: transparent;
}
#content
  > div:nth-child(12)
  > div
  > div:nth-child(2)
  > div
  > div
  > div.result2
  > div
  > div
  > div:nth-child(1)
  > div
  > svg
  > rect {
  fill: transparent;
}
#content
  > div:nth-child(12)
  > div
  > div:nth-child(4)
  > div
  > div.row.justify-content-center.info-party
  > div.result2
  > div
  > div
  > div:nth-child(1)
  > div
  > svg
  > rect {
  fill: transparent;
}
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

* {
  font-family: "Prompt", "FontAwesome", sans-serif;
}

.bold {
  font-weight: bold;
}

.margin-auto {
  margin: auto !important;
}

.break-word {
  word-wrap: break-word;
}

.size {
  font-size: 30px;
}

.title {
  text-align: start;
  margin-left: 9%;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 10px;
  font-weight: bolder;
}

.align-start {
  text-align: start;
}
#app {
  background-color: #ddd;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}
#search-inputd .vs--disabled .vs__clear,
.vs--disabled .vs__dropdown-toggle,
.vs--disabled .vs__open-indicator,
.vs--disabled .vs__search,
.vs--disabled .vs__selected {
  cursor: not-allowed;
  background-color: #e9ecef !important;
}
/* #__BVID__254
    > div
    > div:nth-child(3)
    > div
    > div */
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .title {
    font-size: 5vw !important;
  }
  .md-font {
    font-size: 2vw !important;
  }
  .lg-font {
    font-size: 4vw !important;
  }
  #day > div > div:nth-child(3) > div.col > div {
    line-height: 12px;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  .md-font {
    font-size: 2vw !important;
  }
  /* .modal-vue .modal-vue-show {
      width: 60% !important;
    } */
}
@media only screen and (min-width: 1024px) and (max-width: 1370px) {
  .box {
    min-height: 40vh;
  }
  #sumboxsum {
    /* min-height: 50vh; */
    padding-top: 90px;
  }
}
@media only screen and (min-width: 0px) and (max-width: 985px) {
  .col-sm-4 {
    flex: 42.333333%;
    max-width: 58.333333%;
  }
}
@media (max-width: 767px) {
  .vgs {
    transition: opacity 0.2s ease;
    height: 100vh;
    background-color: rgba(0, 0, 0, 1) !important;
    display: table;
  }
  .vgs__container {
    top: 15% !important;
    height: 100vh !important;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  div.modal-vue > div > div.modal-vue-panel.modal-fade.modal-vue-show {
    width: 95% !important;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .apexcharts-element-hidden {
    display: none;
  }
  .apexcharts-toolbar {
    top: -25px !important;
  }
  .nav-link {
    padding: 6px 5px !important;
  }
  .b-avatar.imgpro.badge-secondary {
    width: 38px !important;
    height: 38px !important;
  }
  #date-domain {
    width: 220px;
  }
  h1,
  .h1 {
    font-size: 1.5rem;
  }
  div.modal-vue > div > div.modal-vue-panel.modal-fade.modal-vue-show {
    width: 95% !important;
  }

  #day > div > div:nth-child(3) > div.col > div {
    line-height: 12px;
  }
  .spinner-border {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: 150px;
    height: 150px;
    margin: -75px 0 0 -55px;
    width: 90px;
    height: 90px;
  }
  .md-font {
    font-size: 14px !important;
  }
  #g-chart
    > div
    > div
    > div:nth-child(1)
    > div
    > svg
    > g:nth-child(3)
    > g:nth-child(4) {
    display: none;
  }
  /* template domain */
  .modal-vue--content-panel.space-content {
    padding: 0px !important;
  }
  .title-domain {
    font-size: 4.2vw !important;
    text-align: left !important;
    margin-left: 15px !important;
  }
  #tp-size {
    width: 100% !important ;
  }
  .table.b-table.b-table-stacked-md > tbody > tr > [data-label]::before {
    content: attr(data-label);
    width: 40%;
    float: left;
    text-align: left;
    overflow-wrap: break-word;
    font-weight: bold;
    font-style: normal;
    padding: 0 calc(1rem / 2) 0 0;
    margin: 0;
  }
  body {
    padding: 0px !important;
  }
  .tooltip {
    display: none !important ;
  }
}
@media print {
  .fa-print {
    display: none;
  }
  .btnp {
    display: none;
  }
  #navHome {
    display: none;
  }
  .title {
    display: none;
  }
  #export-btn,
  .btn-add {
    display: none;
  }
  #search-input,
  #filter-input {
    display: none;
  }
  #g-chart
    > div
    > div
    > div:nth-child(1)
    > div
    > svg
    > g:nth-child(3)
    > g:nth-child(4) {
    display: none;
  }
  #page {
    display: none;
  }
  .prt {
    display: inline;
  }
}
</style>