import { store } from 'quasar/wrappers';
import { createStore } from 'vuex';
import * as mutations from './mutations';
import * as actions from './actions';
import state from './state';

export default store =()=>{
  const vueStore = createStore({
      state: state,
      mutations: mutations,
      actions: actions,
  });
  return vueStore;
}
