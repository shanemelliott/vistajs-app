import Vue from 'vue'
import Vuex from 'vuex'
/*
 Not used yet.  Copied from another project to use as a framwork for bilding a store in the 
 future. 

*/
import axios from 'axios'
Vue.use(Vuex)
/* eslint-disable no-new */
const store = new Vuex.Store({
  modules: {
  },
  state: {
      specialHours: {
          1: [{
          }],
        2: {         
        },
        3: [        
        ],
        4: [{     
        }],
        5: [{     
        }],
        6: {
          from: 7 * 60,
          to: 20 * 60,
          class: 'closed',
          label: 'Closed'
        },
        7: {
          from: 7 * 60,
          to: 20 * 60,
          class: 'closed',
          label: 'Closed'
        }
    },
    loading: false,
    error: null,
  },
  mutations: {
    addLog(state, payload) {
      state.LogItems.push(payload);
    },
    setLogItems(state, payload) {
      state.LogItems = payload;
    },
    setLog(state, payload) {
      state.Logs = payload;
      state.LogItems = []
    },
    delLog(state, payload) {
      state.LogItems.splice(payload, 1)
    },
    setEvent(state, payload) {
      state.eventId = payload;
      state.LogItems = []
    },
    setMap(state, payload) {
      state.mapId = payload;
    }
  },
  actions: {
    getAppts({ commit }, payload) {
      if (payload === null) {
          VistaJS.callRpc(logger, configuration, 'SDES GET APPTS BY CLIN IEN 2', ['195', '2022-10-31T09:15-0500', '2022-11-04T09:15-0500'], printJsonResult);
          
        commit('setEvent', payload);
        }
    },
    addLogItem({ commit }, payload) {
      payload.eventID = this.state.eventId;
      payload.Date = payload.Date.toISOString()
      payload.utmZ = '11S';
      axios({
        method: 'post',
        url: url + '/log/set',
        withCredentials: true,
        auth: auth,
        data: payload
      }).then(function (data) {
        payload.logId = data.data.id;
        commit('addLog', payload);
      });

    },
    loadLogs({ commit }) {
      axios({
        method: 'get',
        url: url + '/log/get/' + this.state.eventId,
        withCredentials: true,
        auth: auth
      }).then(function (data) {
        commit('setLogItems', data.data);
        //localStorage.setItem('LogItems', data.data)
      }).catch(function (error) {
        console.log(error)
      });
    },
    loadLog({ commit }) {
      axios({
        method: 'get',
        url: url + '/log/get',
        withCredentials: true,
        auth: auth
      }).then(function (data) {
        commit('setLog', data.data);
      }).catch(function (error) {
        console.log(error)
      });
    },
    updateLog({ dispatch }, payload) {
      console.log('update')
      console.log(payload)
      axios({
        method: 'post',
        url: url + '/log/set/' + payload.id,
        withCredentials: true,
        auth: auth,
        data: payload
      }).then(function () {
        dispatch("loadLogs");
      });
    },
  delLog({ dispatch }, payload) {
    console.log('deleting '+ payload)
      axios({
        method: 'delete',
        url: url + '/log/' + payload,
        withCredentials: true,
        auth: auth
      }).then(function () {
        dispatch("loadLogs");
      });
    },
  setMap({ commit }, payload) {
    console.log(payload);
      localStorage.mapId = payload;
      commit('setMap', payload);
    },
  loadMap({ commit }) {
      if (localStorage.mapId){
        commit('setMap', localStorage.mapId);
      }
      
    },

    //going to move this out of the store. then leave the updating 
    //the save function. 
  addLocation({dispatch},payload){
    axios({
      method: 'post',
      url: urlsar + '/sartopo/point' ,
      withCredentials: true,
      data: payload
    }).then(function (data) {
      console.log(data.data.result.id);
      payload.markerId = data.data.result.id;
      dispatch("updateLog", payload) 
      console.log(payload)
      dispatch("loadLogs");
      return payload;
    });
  },
  },
  getters: {
    LogItems(state) {
      return state.LogItems;
    },
    mapId(state) {
      return state.mapId;
    },
    Logs(state) {
      return state.Logs;
    },
    isLog(state){
      return state.Logs.filter(item => { return item.eventID === state.eventId }).length > 0
    },
    logEventId(state) {
      return state.eventId;
    },

  }
});
export default store;
