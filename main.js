
// asignacion de variables y constantes
const SEGUNDO = 1000 //milisegundos
const MINUTO = 60 * SEGUNDO //60 000 milisegundos
const TIEMPO_MAXIMO = 20
let l = document.getElementById("number");
let mensaje = document.getElementById("mensaje")

// Visualizar la hora actual
var myVar = setInterval(myTimer, SEGUNDO);

function myTimer() {
  document.getElementById("hora-actual").innerHTML = new Date().toLocaleTimeString();
}


function myStopFunction() {
  clearInterval(myVar);
}
// --- Machine Learning --- //
const config = {
  binaryThresh: 0.5,
  hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
};

const network = new brain.NeuralNetwork()

network.train([
  // Sin energia y Sin tiempo de trabajo
  // { input: {e: 0, t: 0} , output: [1] },  
  { input: {e: 0, t: 0} , output: {prendido:1 , apagado:0} },  
  { input: {e: 0, t: 0.53} , output: {prendido:1 , apagado:0} },  

  // Con energia y Trabajando
  // { input: {e: 0.3, t: 0.3} , output: [1] },  
  { input: {e: 0.3, t: 0.3} , output: {prendido:1, apagado:0} },  

  // Con energia y Trabajando
  // { input: {e: 0.5, t: 0.5} , output: [1] },  
  { input: {e: 0.5, t: 0.5} , output: {prendido:1, apagado:0} },
  { input: {e: 0.5, t: 0} , output: {prendido:1, apagado:0} },

  // Con energia y Con tiempo de trabajo
  // { input: {e: 0.5, t: 0.53} , output: [0] },  
  { input: {e: 0.5, t: 0.53} , output: {apagado:1, prendido:0} },  

  // Con exceso de energia y Sin tiempo trabajo
  // { input: {e: 0.51, t: 0} , output: [0] },
  { input: {e: 0.51, t: 0} , output: {apagado:1, prendido:0} },
  { input: {e: 0.3, t: 0.6} , output: {apagado:1, prendido:0} },

  // Con exceso de energia y Con tiempo de trabajo
  // { input: {e: 0.75, t: 0.3} , output: [0] },
  { input: {e: 0.75, t: 0.3} , output: {apagado:1, prendido:0} },

  // Con exceso de energia y Con exceso de trabajo
  // { input: {e: 0.75, t: 0.53} , output: [0] },
  { input: {e: 0.75, t: 0.53} , output: {apagado:1, prendido:0} },

  // Con exceso de energia y Con exceso de trabajo
  // { input: {e: 1, t: 1} , output: [0] },
  { input: {e: 0.9, t: 1} , output: {apagado:1, prendido:0} },
  { input: {e: 1, t: 1} , output: {apagado:1, prendido:0} },
])

const result1 = (network.run({e: 0.3, t: 0.5 }))
// if el resultado es mayor a 0.5 serguir trabajando
// else apagar
console.log(result1);

// --- Machine Learning --- //

// --- INICIO del codigo base --- //

class PROGRAMA {
  constructor () {
    this.inicializar = this.inicializar.bind(this)
    this.inicializar()
  }

  inicializar() {
    // conectado de la maquina
    this.energia = true
    this.trabajar()
  }
  
  contador() {
    // cronometro para contar el tiempo de trabajo de la máquina
    this.contadorTiempo = 0
    this.temporisador = setInterval(() => {
      document.getElementById('cronometro').innerHTML = this.contadorTiempo;
      console.log(`Tiempo: ${this.contadorTiempo}`)
      this.contadorTiempo++
    }, SEGUNDO)
  }

  trabajar () {
    // si hay energia empieza a trabajar
    if (this.energia) {
      this.contador()
      this.monitoreo()
      this.TIEMPO_INICIAL = this.contadorTiempo
      // console.log(`ti: ${TIEMPO_INICIAL}`);
      console.log(`Trabajando `)
    } else {
      console.log("Descansando")
    }
  }

  tiempoCorrecto () {
    if ((this.TIEMPO_FINAL <= TIEMPO_MAXIMO)) return 1
  }

  monitoreo(tiempo) {
    // monitorea el tiempo de trabajo, para que no se exceda
    this.submonitoreo = setInterval(() => {
    this.TIEMPO_FINAL = Math.abs(this.TIEMPO_INICIAL - this.contadorTiempo)
    // console.log(`tf: ${this.TIEMPO_FINAL} ti: ${TIEMPO_INICIAL} ct: ${this.contadorTiempo}`);
    
    // --- ML ---
      if (this.tiempoCorrecto()) {
        //todo bien sigo monitoreando 
        console.log(`todo bien`)
        document.getElementById('mensaje').innerHTML = `todo bien`
      } else {
        //Manda mensaje a la empresa para mantenimiento
        console.log(`falla inminente dar mantenimiento`)
        document.getElementById('mensaje').innerHTML = `falla inminente dar mantenimiento`
        // para el temporizador y el monitoreo
        this.pararIntervalo(this.temporisador)
        this.pararIntervalo(this.submonitoreo)
        // apaga la luz para prevenir daños
        this.energia = false
        // verifica si hay luz, manda a descanzar
        this.trabajar()
      }
    }, SEGUNDO * 10)
    // --- ML ---
  }

  pararIntervalo(idInterval) {
    clearInterval(idInterval)
  }
}

function empezarPrograma() {
  window.programa = new PROGRAMA
}

// --- FINAL del codigo base --- //
// const HORA_ACTUAL = setInterval(hora, 1000);


// function detenerInterval() {
//   clearInterval(HORA_ACTUAL);
// }
