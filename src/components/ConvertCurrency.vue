<template>
  <v-container>
    <v-row>
      <v-col cols="12 mx-auto" sm="8" md="6" lg="8">
        <v-card
        class="mx-auto mt-10"
        >
          <template v-slot:title>
            <v-col cols="12">
              <v-img
                :src="logo"
                class="my-3"
                contain
                height="100"
              />
            </v-col>
            <span class="font-weight-black">Bot Whatsapp</span>
          </template>
    
          <v-card-text>
            <div class="text-medium-emphasis text-justify">
              Tu proyecto utiliza Vue.js para construir una interfaz web interactiva, Vuetify para diseñar componentes de Material Design, y axios para manejar solicitudes HTTP. whatsapp-web.js permite automatizar el envío de mensajes en WhatsApp Web desde Node.js, que actúa como el entorno de ejecución del servidor. Express.js facilita la gestión de rutas y solicitudes en el servidor.
            </div>
          </v-card-text>


          <v-card-text v-if="!sessionExists" class="bg-surface-light pt-4 text-center">
    
            <v-card-title class="text-h5">Vincula tu cuenta de WhatsApp</v-card-title>
            <v-card-text>
              <v-row justify="center">
                <v-col cols="12" class="text-center">
                  <v-img class="mx-auto" v-if="qrCode" :src="qrCode" alt="QR Code" max-width="300" />
                  <v-progress-circular v-else indeterminate color="primary" />
                </v-col>
              </v-row>
            </v-card-text>

          </v-card-text>
    
          <v-card-text v-else class="bg-surface-light pt-4 text-center">
    
            <v-card-title class="text-h5">Bienvenido</v-card-title>
    
            <v-card-text>
              <v-row justify="center">
                <v-col cols="12" class="text-center">
                  <!-- <v-btn color="red" @click="logout">Cerrar Sesión</v-btn> -->
                  <v-card
                    class="mx-auto"
                    max-width="400"
                  >
                    <v-img
                      class="align-end text-white"
                      height="200"
                      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                      cover
                    >
                      <v-card-title>    </v-card-title>
                    </v-img>

                    <v-card-subtitle class="pt-4">
                      Estamos listos
                    </v-card-subtitle>
                    <v-card-text>
                      <v-btn color="red" @click="logout">Cerrar Sesión</v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
    
            <v-card-text>
              <v-divider></v-divider>
              <div class="text-caption">Agregar números manualmente</div>
              <v-divider class="mb-2"></v-divider>
              <v-row>
                <v-col cols="12" sm="4">
                  <!-- Input para agregar números de teléfono -->
                  <v-select
                    v-model="selectedCode"
                    :items="countryCodes"
                    item-title="label"
                    item-value="value"
                    label="Select"
                    persistent-hint
                    return-object
                    single-line
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <!-- Input para agregar números de teléfono -->
                  <v-text-field
                    v-model="newNumber"
                    label="Número de Teléfono"
                    outlined
                  />
                </v-col>
                <v-col cols="12" sm="2">
                  <v-btn @click="addNumber" color="primary">Agregar</v-btn>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text>
              <v-divider></v-divider>
              <div class="text-caption">Agregar números masivos</div>
              <v-divider class="mb-2"></v-divider>
              <v-row>
                <v-col cols="12" sm="4">
                  <a :href="fileUrl" download="plantillaV1">
                    <v-btn append-icon="mdi-download-circle-outline" color="primary" variant="outlined" size="large" >
                      Plantilla
                    </v-btn>
                  </a>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-file-input
                    v-model="fileRecords"
                    accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    label="Subir archivo"
                    outlined
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-btn @click="addMassiveNumbers" color="primary">Agregar</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
    
            <v-card-text>
              <v-divider></v-divider>
              <div class="text-caption">Lista de números agregados</div>
              <v-divider class="mb-2"></v-divider>
              <v-row>
                <v-col cols="12">
                  <!-- Lista de números agregados -->
                  <v-list v-if="numbers.length > 0">
                    <v-list-item-group>
                      <v-chip color="secondary" v-for="(number, index) in numbers" :key="index" class="pb-1 mb-2 mr-1">
                        {{number.number}}
                        <v-btn @click="removeNumber(index)" icon size="x-small" class="ml-1" variant="elevated">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-chip>
                    </v-list-item-group>
                  </v-list>
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </v-card-text>
    
            <v-form ref="form">
              <v-col cols="12" md="12">
                  <v-textarea
                    v-model="messageText"
                    label="Mensaje"
                    outlined
                    rows="4"
                    :rules="[rules.required]"
                    required
                  />
              </v-col>
              <v-col cols="12" md="12">
                  <v-file-input
                    v-model="image"
                    label="Seleccionar Imagen"
                    accept="image/*"
                    outlined
                  ></v-file-input>
              </v-col>
              <v-col cols="12" md="12">
                <div class="text-caption">Intervalo a enviar</div>
                  <v-slider
                    v-model="intervalSeconds"
                    :max="20"
                    :min="3"
                    :step="1"
                    thumb-label="always"
                  ></v-slider>
              </v-col>
              <v-col cols="12" md="12">
                <v-btn color="#622ec3" :disabled="messageSend" @click="submit">
                  Enviar
                </v-btn>
              </v-col>
            </v-form>
    
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-divider></v-divider>
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th class="text-center">
                          NÚMERO
                        </th>
                        <th class="text-center">
                          PROGRESO
                        </th>
                        <th class="text-center">
                          RESULTADO
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        class="pt-4"
                        v-for="item in numbers"
                        :key="item.number"
                      >
                        <td>{{ item.number }}</td>
                        <td>
                          <v-progress-circular
                            :model-value="item.progress"
                            :rotate="-90"
                            :size="38"
                            :width="6"
                            color="primary"
                          >
                            {{ item.progress }}
                          </v-progress-circular>
                        </td>
                        <td>
                          <v-icon
                            :color="item.result ? 'green-darken-2' : 'red-darken-2'"
                            :icon="item.result ? 'mdi-emoticon' : 'mdi-emoticon-sad'"
                            size="large"
                          ></v-icon>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </v-card-text>
    
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import logo from '../assets/javier-logo-color.png'
const apiUrl = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = apiUrl;

export default {
  name: 'HelloWorld',

  data: () => ({
    logo,
    qrCode: null,
    number: '',
    message: '',
    image: null,
    file: null,
    valid: false,
    rules: {
      required: value => !!value || 'Requerido.',
      phone: value => /^\d+$/.test(value) || 'El número debe ser válido.',
    },
    sessionExists: false,
    newNumber: '',
    numbers: [],
    intervalSeconds: 3,
    messageText: '',
    messageSend: false,
    selectedCode: { label: "+51 Perú", value: "51" },
    countryCodes: [
      { label: "+52 México", value: "52" },
      { label: "+53 Cuba", value: "53" },
      { label: "+54 Argentina", value: "54" },
      { label: "+55 Brasil", value: "55" },
      { label: "+56 Chile", value: "56" },
      { label: "+57 Colombia", value: "57" },
      { label: "+58 Venezuela", value: "58" },
      { label: "+51 Perú", value: "51" },
      { label: "+502 Guatemala", value: "502" },
      { label: "+503 El Salvador", value: "503" },
      { label: "+504 Honduras", value: "504" },
      { label: "+505 Nicaragua", value: "505" },
      { label: "+506 Costa Rica", value: "506" },
      { label: "+507 Panamá", value: "507" },
      { label: "+591 Bolivia", value: "591" },
      { label: "+593 Ecuador", value: "593" },
      { label: "+595 Paraguay", value: "595" },
      { label: "+598 Uruguay", value: "598" }
    ],
    fileRecords : null,
    refreshInterval : null,
    fileUrl: '/files/plantilla-v1.xlsx'
  }),
  created() {
    this.checkSessionStatus();
  },
  methods: {
    async checkSessionStatus() {
      try {
        const response = await axios.get('/session-status');
        this.sessionExists = response.data.sessionExists;

        if (!this.sessionExists) {
          this.getQRCode();
          if(!this.refreshInterval){
            this.refreshInterval = setInterval(() => {
              this.checkSessionStatus();
            }, 10000);
          }
        }else{
          clearInterval(this.refreshInterval);
          this.refreshInterval = null;
        }

      } catch (error) {
        console.error('Error checking session status:', error);
      }
    },
    async getQRCode() {
      console.log("Métood get QR");
      
      try {
        const response = await axios.get('/qr');
        this.qrCode = response.data.qrCode;
      } catch (error) {
        console.error('Error al obtener el código QR', error);
      }
    },
    async sendMessage() {
      try {
        this.showSuccessAlert('Proceso de envío iniciado');
        this.messageSend = true;
        for (const number of this.numbers) {
          number.progress = 0;

          let halfInterval = (this.intervalSeconds * 1000) / 4;
          await new Promise(resolve => setTimeout(resolve, halfInterval));
          number.progress = 25;

          await new Promise(resolve => setTimeout(resolve, halfInterval));
          number.progress = 50;

          const formData = new FormData();
          formData.append('number', number.number);
          formData.append('message', this.messageText);
          if (this.image) {
            formData.append('image', this.image);
          }
          let {data} = await axios.post('/send-message', formData);
          number.result = data.success;

          await new Promise(resolve => setTimeout(resolve, halfInterval));
          number.progress = 75;

          await new Promise(resolve => setTimeout(resolve, halfInterval));
          number.progress = 100;
        }
        this.messageSend = false;
        this.showSuccessAlert('Proceso de envío finalizado');
      } catch (error) {
        console.error('Error al enviar el mensaje', error);
      }
    },
    async submit() {
      let {valid} = await this.$refs.form.validate();
      if (!valid) return;
      if(this.numbers.length == 0) {this.showInfoAlert('¡Agregar números a enviar!'); return;};
      if(this.messageText.trim() === '' || !this.messageText) {this.showInfoAlert('¡Completar el mensaje!'); return;};
      this.sendMessage();
    },
    async logout() {
      try {
        const response = await axios.post('/logout');
        if (response.data.success) {
          console.log('Sesión cerrada exitosamente.');
          this.sessionExists = false;
          await this.checkSessionStatus();
        } else {
          console.error('Error al cerrar sesión:', response.data.message);
        }
      } catch (error) {
        console.error('Error al hacer la solicitud de cierre de sesión:', error);
      }
    },
    addNumber() {
      if(this.newNumber.trim() === '' || !this.newNumber) {this.showInfoAlert('¡Completar número teléfono!'); return;};
   
      this.numbers.push({ number: `${this.selectedCode.value}${this.newNumber}` , result: '', status: 'Pendiente', progress : 0 });
      this.newNumber = '';
    },
    addMassiveNumbers() {
      if (!this.fileRecords) {this.showInfoAlert('Por favor, sube un archivo primero.'); return;}

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        jsonData.forEach((row, index) => {
          if (index !== 0) { // Ignorar la cabecera si la hay
            const [code, newNumber] = row;
            if (code && newNumber) {
              this.numbers.push({ number: `${code}${newNumber}` , result: '', status: 'Pendiente', progress : 0 });
              this.fileRecords = null;
            }
          }
        });
      };

      reader.readAsArrayBuffer(this.fileRecords);
    },
    removeNumber(index) {
      this.numbers.splice(index, 1);
    },



    async convertCurrency() {
      if (this.amount && this.fromCurrency && this.toCurrency) {
        try {
          const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${this.fromCurrency}`);
          const rate = response.data.rates[this.toCurrency];
          this.result = (this.amount * rate).toFixed(2);
          this.showSuccessAlert();
        } catch (error) {
          this.showErrorAlert();
        }
      }else{
        this.showValidationAlert();
      }
    },
    showInfoAlert(text) {
      Swal.fire({
        title: text,
        text: ``,
        icon: 'info',
        background: '#f9f9f9',
        showConfirmButton: false,
        toast: true,
        timer: 4000,
        timerProgressBar: true,
        position: 'top-end',
      });
    },
    showSuccessAlert(text) {
      Swal.fire({
        title: text,
        text: ``,
        icon: 'success',
        background: '#f9f9f9',
        showConfirmButton: false,
        toast: true,
        timer: 4000,
        timerProgressBar: true,
        position: 'top-end',
      });
    },
    showErrorAlert() {
      Swal.fire({
        title: '¡Error!',
        text: 'Ocurrió un error al obtener la tasa de cambio.',
        icon: 'error',
      });
    },
    showValidationAlert() {
      Swal.fire({
        title: '¡Campos Incompletos!',
        text: 'Por favor, completar todos los campos.',
        icon: 'warning'
      });
    }
  },
}
</script>
