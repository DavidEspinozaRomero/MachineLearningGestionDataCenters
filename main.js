
// asignacion de variables y constantes
const SEGUNDO = 1000 //milisegundos
const MINUTO = 60 * SEGUNDO //60 000 milisegundos

let tiempoCompresor = 0
let tiempoVentilador = 0

// Visualizar la hora actual
var myVar = setInterval(myTimer, SEGUNDO);

function myTimer() {
  document.getElementById("hora-actual").innerHTML = new Date().toLocaleTimeString()
}

// --- Machine Learning START --- //
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

// const result1 = (network.run({e: 0.45, t: 0.005 }))
// const result2 = (network.run({e: 0.5, t: 0.001 }))
// const result3 = (network.run({e: 0.55, t: 0.001 }))
// const result4 = (network.run({e: 0.05, t: 0.001 }))
// const result5 = (network.run({e: 0.049, t: 0.001 }))
// const result6 = (network.run({e: 0.048, t: 0.001 }))

// console.log(result1);
// console.log(result2);
// console.log(result3);
// console.log(result4);
// console.log(result5);
// console.log(result6);

// --- Machine Learning END --- //

// --- INICIO del codigo  --- //

class PROGRAMA {
  constructor (idCronometro, idMensaje, TIEMPO_MAXIMO, equipo) {
    this.iniciar = this.iniciar.bind(this)
    this.idCronometro = idCronometro
    this.idMensaje = idMensaje
    this.TIEMPO_MAXIMO = TIEMPO_MAXIMO
    this.equipo = equipo
    this.contadorTiempo = 0
    this.tiempototal = 0
    this.iniciar()
  }

  iniciar() {
    // Prende la maquina que monitorea y analiza los datos
    // this.energia = true
    // this.trabajar(this.id)
    this.pararIntervalo(this.temporisador)
    this.cronometro = this.cronometro.bind(this)
    this.monitoreo = this.monitoreo.bind(this)
    this.cronometro(this.idCronometro)
    this.monitoreo(this.idMensaje, this.equipo)
    // this.comparacionTiempos()
  }

  medidorEnergia(id) {
    // mide la energia que pasa por los cables e informa a la IA
    if (id == "mensaje-ventilador-evaporador") return ((Math.random()*(0.5 - 0.1) ) + 0.1)

    this.probabilidad = () => {return Math.random() > 0.9999 }
    if (this.probabilidad()) {
      this.energia = () => {return Math.random() < 0.95}
      if (this.energia()) return ((Math.random()*(0.048 - 0.001) ) + 0.001)
      else return ((Math.random()*(1 - 0.55) ) + 0.55)
    } else {
      // Genera un numero aleatorio entre 0.06 a 0.45
      return ((Math.random()*(0.5 - 0.1) ) + 0.1)
      // ((Math.random()*(max - min + 1) ) + min)
    }

  }

  cronometro(id) {
    // cronometro para contar el tiempo de trabajo de la máquina
    this.contadorTiempo = 0
    this.temporisador = setInterval(() => {
      document.getElementById(id).innerHTML = Math.floor(this.contadorTiempo / 1);
      // console.log(`Tiempo: ${this.contadorTiempo}`)
      this.contadorTiempo++
    }, SEGUNDO / 100)
  }

  extraerTiempo (id) {
    // --- Tiempo trabajado de los diferentes equipos ---
    if (id == "mensaje-ventilador-evaporador") {
      tiempoVentilador = this.contadorTiempo
    }
    if (id == "mensaje-compresor") {
      tiempoCompresor += this.contadorTiempo
    }

  }

  comparacionTiempos() { 
    // saca en porcentaje la diferencia de tiempo del condensador con el ventilador evaporador
    // setInterval(() => {
      return ((tiempoCompresor * 100) / tiempoVentilador).toFixed(1)
    // }, SEGUNDO * 60);
  }

  mensajesAlerta(equipo) {
    // mostrar que parte fallo
    console.log(`falla en ${equipo} dar mantenimiento`)

    // Dependiendo la falla realiza una accion diferente
    if (this.informacion.e < 0.05) {
      // Falta de energia Comprobar interruptores y reiniciar equipos
      console.log("Falta de energia Comprobar interruptores y reiniciar equipos");
      setTimeout(this.iniciar, SEGUNDO * 10)
    } else if (this.informacion.e > 0.59) {
      console.log("sobrecarga de energia");
      // solo reiniciar si ya se dio mantenimiento
      // setTimeout(this.iniciar, SEGUNDO * 10)
    } else {
      if (this.informacion.t > 0.5) {
        console.log("Tiempo limite");
        // mensaje de exceso de trabajo
        setTimeout(this.iniciar, SEGUNDO * 10)
      }
    }
  }

  tiempoCorrecto (id) {
    // transforma el tiempo de 0.0 a 1.0 para que la maquina entienda // tiempoTrabajado / tiempoMaximo * 2
    if (id == "mensaje-ventilador-evaporador") return 0.3
    return ((this.contadorTiempo / 60) / (this.TIEMPO_MAXIMO * 2))
  }

  monitoreo(id) {
    // monitorea el tiempo de trabajo y la energia, para que no se exceda
    this.submonitoreo = setInterval(() => {
      // --- ML ---
      // crear un objeto con {e: 0-1, t: 0-1}
      // e = electricidad ; t = tiempo
      // La electricidad varia cada segundo, pudiendo no a ver energia (< 0), energia (0 - 0.5) o una sobre carga (> 0.5)

      this.informacion = {
        e: this.medidorEnergia(id).toFixed(3),
        t: this.tiempoCorrecto(id).toFixed(3),
      }
      console.log(this.informacion);

        // Se entrega la informacion a la IA para que decida
        this.decision = network.run(this.informacion)
        console.log(this.decision);

        // if on > off serguir trabajando // else apagar
        if (this.decision.on < this.decision.off) {
          // Manda mensaje a la empresa para mantenimiento
          document.getElementById(id).innerHTML = `falla`
          // document.getElementById(id).innerHTML = `falla dar mantenimiento`
          this.mensajesAlerta(this.equipo)
          
          // Agrega el tiempo trabajado 
          if (id == "mensaje-compresor") {
            tiempoCompresor += this.contadorTiempo
            this.porcentaje = this.comparacionTiempos()
            console.log(this.porcentaje);
          }
          // Detiene el cronometro y el monitoreo 
          this.pararIntervalo(this.temporisador)
          this.pararIntervalo(this.submonitoreo)
          
          // Dependiendo de la relacion del tiempo del condensador con el del ventilador del evaporador manda mensaje de dar mantenimiento
          if (this.relacion > 60) {
            // mensaje de mantenimiento
          }
          // apaga la luz para prevenir daños
          // this.energia = false
          // verifica si hay luz, manda a descanzar
          // this.trabajar()
        } else {
          //todo bien sigo monitoreando
          // console.log(`todo bien`)
          document.getElementById(id).innerHTML = `todo bien`
          if (id == "mensaje-ventilador-evaporador") {
            tiempoVentilador = this.contadorTiempo
          }
        }

        // console.log(tiempoCompresor + " " + tiempoVentilador);
        // console.log(this.tiempototal + " " + this.contadorTiempo);

    }, SEGUNDO / 100)
    // --- ML ---
  }

  pararIntervalo(idInterval) {
    clearInterval(idInterval)
  }
}

function empezarPrograma(id1, id2, Tiempo_Maximo, equipo) {
  window.programa = new PROGRAMA(id1, id2, Tiempo_Maximo, equipo)
}

// let probabilidad = () => {return Math.random() > 0.01}
// for (let i = 0; i < 1000; i++) {
//   let probabilidad = () => {return (Math.random()*100) > 0.2}
//   console.log(probabilidad());

// }