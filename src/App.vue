<template>
<v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline center text-uppercase">
        <span> My Work Week</span>
      </v-toolbar-title>
        </v-toolbar>
     
      <div class="text-xs-center">
      <v-btn outline color="indigo" @click="refresh">Refresh</v-btn>
      </div>
  
<!--vue-cal :disable-views="['years', 'year', 'month']" :time-from="7 * 60" :time-to="20 * 60"
  :special-hours="specialHours"  />
  <vue-cal  class="vuecal--full-height-delete" :disable-views="['years', 'year', 'month']" :time-from="7 * 60" :time-to="20 * 60"
    :events="events"/-->
    <vue-cal selected-date="2022-11-03"  :disable-views="['years', 'year', 'month']" 
      :events="events">
    </vue-cal>
</v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import axios from 'axios'


export default {
  name: 'App',
  components: {
    VueCal
  },
  data: () => ({

    events: [
    ]
  }),
  computed: {
    menuItems() {
      let items = [

        { icon: 'Prefs', title: 'Preferences' },

      ]
      return items
    }
  },
  methods: {
    refresh() {
      var that=this
      axios({
        method: 'get',
        url: 'http://localhost:4567/api/appts',
        
      }).then(function (data) {
        data.data.Appointment.forEach(element => {
          console.log(new Date(element.AppointmentDateTime).toLocaleString([], { hour12: false }))
          var appt = {
            start: new Date(element.AppointmentDateTime).toLocaleString([], { hour12: false }),
            end: new Date(element.EndTime).toLocaleString([], { hour12: false }),
            content: element.Clinic.Name + ',' + element.PurposeOfVisit,
            title: element.Patient.Name
          }
          that.events.push(appt)
        });
        
      })

         }

  },
  mounted() {
      this.refresh()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

}

</style>
