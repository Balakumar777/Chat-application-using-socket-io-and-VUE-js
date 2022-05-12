<template>
   <q-dialog v-model="showAlert">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Note!!!</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{message}}
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" @click="this.$store.dispatch('showAlert',{show:false})" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Alert',
  computed:{
      showAlert:function(){
          return this.$store.state.showAlert;
      },
      message:function() {
        return this.$store.state.alertMessage;
      }
  }
})
</script>
