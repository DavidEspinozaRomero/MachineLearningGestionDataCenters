
// asignacion de variables y constantes
const SEGUNDO = 1000 //milisegundos
const MINUTO = 60 * SEGUNDO //60 000 milisegundos
const TIEMPO_MAXIMO = 5
let l = document.getElementById("number");

// Visualizar la hora actual
var myVar = setInterval(myTimer, SEGUNDO);

function myTimer() {
  document.getElementById("demo").innerHTML = new Date().toLocaleTimeString();
}

function myStopFunction() {
  clearInterval(myVar);
}
// --- Machine Learning --- //

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
    // cronometro
    this.contadorTiempo = 0
    this.temporisador = setInterval(() => {
      l.innerHTML = this.contadorTiempo;
      console.log(`Tiempo: ${this.contadorTiempo}`)
      this.contadorTiempo++
    }, SEGUNDO)
  }

  trabajar () {
    // si hay energia empieza a trabajar
    if (this.energia) {
      this.TIEMPO_INICIAL = this.contadorTiempo
      this.contador()
      this.monitoreo()
      console.log(`trabajando `)
    } else {
      console.log("Descansando")
    }
  }

  tiempoCorrecto () {
    return this.TIEMPO_FINAL <= TIEMPO_MAXIMO
  }

  monitoreo(tiempo) {
    // monitorea el tiempo de trabajo, para que no se exeda
    this.submonitoreo = setInterval(() => {
    this.TIEMPO_FINAL = Math.abs(this.TIEMPO_INICIAL - this.contadorTiempo)
    // --- ML ---
      if (this.tiempoCorrecto()) {
        //todo bien sigo monitoreando 
        console.log(`todo bien`)
      } else {
        //Manda mensaje a la empresa para mantenimiento
        console.log(`falla inminente dar mantenimiento`)
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




const HORA_ACTUAL = setInterval(hora, 1000);

function hora() {
  const fecha = new Date().toLocaleTimeString()  
  let parrafo = document.getElementById("hora-actual")
  parrafo.innerHTML = fecha
  let cronometro = document.getElementById("cronometro")
  cronometro.innerHTML = fecha
}

let mensaje = document.getElementById("mensaje")

function detenerInterval() {
  clearInterval(HORA_ACTUAL);
}
