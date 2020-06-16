
// asignacion de variables y constantes
const SEGUNDO = 1000 //milisegundos
const MINUTO = 60 * SEGUNDO //60 000 milisegundos
const TIEMPO_MAXIMO = 15
let l = document.getElementById("number");
let mensaje = document.getElementById("mensaje")

// Visualizar la hora actual
var myVar = setInterval(myTimer, SEGUNDO);

function myTimer() {
  document.getElementById("hora-actual").innerHTML = new Date().toLocaleTimeString()
}

function myStopFunction() {
  clearInterval(myVar);
}

// --- Machine Learning --- //
const config = {
  binaryThresh: 0.5,
  hiddenLayers: [4], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
}

const network = new brain.NeuralNetwork(config)

network.train([

  // Sin energia Esta apagado sin importar el tiempo de trabajo
  { input: {e: 0, t: 0} , output: {on:0, off:1} },  
  { input: {e: 0, t: 0.5} , output: {on:0, off:1} },  
  { input: {e: 0, t: 1} , output: {on:0, off:1} },  

  // Con energia y con tiempo Normales
  { input: {e: 0.1, t: 0} , output: {on:1, off:0} },  
  { input: {e: 0.1, t: 0.5} , output: {on:1, off:0} },  
  { input: {e: 0.5, t: 0} , output: {on:1, off:0} },
  { input: {e: 0.5, t: 0.5} , output: {on:1, off:0} },

  // Con energia y con exceso tiempo
  { input: {e: 0.1, t: 1} , output: {on:0, off:1} },  
  { input: {e: 0.1, t: 0.6} , output: {on:0, off:1} },  
  { input: {e: 0.5, t: 1} , output: {on:0, off:1} },
  { input: {e: 0.5, t: 0.6} , output: {on:0, off:1} },

  // Con exceso de energia se apaga por precaucion
  { input: {e: 0.6, t: 0} , output: {on:0, off:1} },
  { input: {e: 0.6, t: 0.5} , output: {on:0, off:1} },
  { input: {e: 0.6, t: 1} , output: {on:0, off:1} },
  { input: {e: 1, t: 0} , output: {on:0, off:1} },
  { input: {e: 1, t: 0.5} , output: {on:0, off:1} },
  { input: {e: 1, t: 1} , output: {on:0, off:1} },
])

// const result1 = (network.run({e: 0.02, t: 0.005 }))
// const result2 = (network.run({e: 0.3, t: 0.3 }))
// const result3 = (network.run({e: 0.3, t: 0.5 }))
// const result4 = (network.run({e: 0.3, t: 0.6 }))
// const result5 = (network.run({e: 0.3, t: 0.8 }))
// const result6 = (network.run({e: 0.3, t: 1 }))

// console.log(result1);
// console.log(result2);
// console.log(result3);
// console.log(result4);
// console.log(result5);
// console.log(result6);

// --- Machine Learning --- //

// --- INICIO del codigo base --- //

class PROGRAMA {
  constructor () {
    this.inicializar = this.inicializar.bind(this)
    this.inicializar()
  }

  inicializar() {
    // Prender maquina
    this.energia = true
    this.trabajar()
  }

  medidorenergia() {
    // mide la energia que pasa por los cables e informa a la IA
    return (Math.random()*(0.55 - 0.098) ) + 0.098
    // ((Math.random)*(max - min + 1) ) + min)
  }

  cronometro() {
    // cronometro para contar el tiempo de trabajo de la máquina
    this.contadorTiempo = 0
    this.temporisador = setInterval(() => {
      document.getElementById('cronometro-condensador').innerHTML = this.contadorTiempo;
      // console.log(`Tiempo: ${this.contadorTiempo}`)
      this.contadorTiempo++
    }, SEGUNDO)
  }

  trabajar () {
    // si hay energia empieza a trabajar
    if (this.energia) {
      this.cronometro()
      this.monitoreo()
      this.TIEMPO_INICIAL = this.contadorTiempo
      console.log(`Trabajando `)
    } else {
      console.log("Falta de energia")
    }
  }

  tiempoCorrecto () {
    return ((this.contadorTiempo / 60) / (TIEMPO_MAXIMO * 2))
  }

  monitoreo() {
    // monitorea el tiempo de trabajo, para que no se exceda
    this.submonitoreo = setInterval(() => {

      // --- ML ---
      // crear un objeto con {e: 0-1, t: 0-1}; e = electricidad t = tiempo
      // La electricidad varia cada segundo, pudiendo no a ver energia (< 0), energia (0 - 0.5) o una sobre carga (> 0.5)
      // tiempo = tiempoTrabajo / tiempoMaximo * 2
      this.informacion = {
        e: this.medidorenergia(),
        t: this.tiempoCorrecto(),
      }
      console.log(this.informacion);

      //si energia < 0.1 mandar mensaje "Falta de energia"
      if (this.informacion.e < 0.1) {
        console.log("Falta de energia comprobar interruptores y reiniciar equipos");
        this.pararIntervalo(this.temporisador)
        this.pararIntervalo(this.submonitoreo)
      } else {
        // Se entrega la informacion a la IA para que decida
        this.decision = network.run(this.informacion)
        console.log(this.decision);
    
        // if on > off serguir trabajando // else apagar
        if (this.decision.on < this.decision.off) {
          //Manda mensaje a la empresa para mantenimiento
          //mostrar que parte fallo
          console.log(`falla dar mantenimiento`)
          document.getElementById('mensaje-condensador').innerHTML = `falla dar mantenimiento`

          // para el temporizador y el monitoreo
          this.pararIntervalo(this.temporisador)
          this.pararIntervalo(this.submonitoreo)

          // apaga la luz para prevenir daños
          this.energia = false
          // verifica si hay luz, manda a descanzar
          this.trabajar()
        } else {
          //todo bien sigo monitoreando
          console.log(`todo bien`)
          document.getElementById('mensaje-condensador').innerHTML = `todo bien`
        }

      }

    }, SEGUNDO * 1)
    // --- ML ---
  }

  pararIntervalo(idInterval) {
    clearInterval(idInterval)
  }
}

function empezarPrograma() {
  window.programa = new PROGRAMA
}
