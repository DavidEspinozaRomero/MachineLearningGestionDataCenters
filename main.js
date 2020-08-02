
// asignacion de variables y constantes
const SEGUNDO = 1000 //milisegundos
const MINUTO = 60 * SEGUNDO //60 000 milisegundos

let tiempoCompresor = 0
let tiempoVentilador = 0
// const imgVE = document.getElementById("img-ventilador-evaporador")
// const imgVC = document.getElementById("img-ventilador-condensador")
// const imgCM = document.getElementById("img-compresor")
// const imgCN = document.getElementById("img-condensador")

// -- AUDIO -- //
const falla = new Audio ('../audio/falla.mp3')
const alerta = new Audio ('../audio/alerta.mp3')



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

swal("Bienvenido!!", "Al Asistente de Mantenimiento", "success")

// --- INICIO del codigo  --- //

class PROGRAMA {
  constructor (idCronometro, idMensaje, TIEMPO_MAXIMO, equipo, idata, idImg, srcAudio, CORRIENTE_MAXIMA, CORRIENTE_MINIMA, Tiempo_Descanso) {
    this.iniciar = this.iniciar.bind(this)
    this.idCronometro = idCronometro
    this.idMensaje = idMensaje
    this.TIEMPO_MAXIMO = TIEMPO_MAXIMO
    this.equipo = equipo
    this.data = idata
    this.idImg = idImg
    this.srcAudio = srcAudio
    this.CORRIENTE_MAXIMA = CORRIENTE_MAXIMA
    this.CORRIENTE_MINIMA = CORRIENTE_MINIMA
    this.Tiempo_Descanso = Tiempo_Descanso
    this.contadorTiempo = 0
    this.tiempototal = 0
    this.playAudio()
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

  playAudio() {
    this.audio = new Audio (this.srcAudio)
    this.audio.play()
  }

  corrienteRandom(id) {
    // mide la corriente que pasa por los cables e informa a la IA
    
    if (id == "mensaje-ventilador-evaporador") return ( (Math.random()*(this.CORRIENTE_MAXIMA - this.CORRIENTE_MINIMA) ) + this.CORRIENTE_MINIMA)
    
    //probabilidad de que la corriente no sea la adecuada
    this.probabilidad = () => {return Math.random() > 0.9999 }
    if (this.probabilidad()) {
      alerta.play() // Audio de Alerta revizar el equipo
      // Corriente puede dar una Sobrecarga / Insuficiencia
      this.energia = () => {return Math.random() > 0.95}
      // Genera un numero aleatorio entre 0 a 9 -Insuficiente-
      if (this.energia()) return (Math.random()* (this.CORRIENTE_MINIMA * 0.9 ))
      // Genera un numero aleatorio entre 15 a 30 -Sobrecarga-
        else return ( (Math.random()*(this.CORRIENTE_MAXIMA * 2 ) ) + (this.CORRIENTE_MAXIMA * 1.1)) 
      } else {
        // Genera un numero aleatorio entre 10 a 15 -Normal-
        return ( (Math.random()*(this.CORRIENTE_MAXIMA - this.CORRIENTE_MINIMA) ) + this.CORRIENTE_MINIMA)
        // ((Math.random()*(max - min + 1) ) + min)
      }
  
  }

  corrienteF1() {
    this.F1 = this.corrienteRandom(this.idMensaje).toFixed(1)
    console.log(`F1: ${this.F1} `);
    
    document.getElementById(this.idCronometro).innerHTML += (`F1:${this.F1} (A) <br/>`);
    return parseFloat(this.F1)
  }
  corrienteF2() {
    this.F2 = this.corrienteRandom(this.idMensaje).toFixed(1)
    document.getElementById(this.idCronometro).innerHTML += (`F2:${this.F2} (A) <br/>`);
    
    return parseFloat(this.F2)
  }
  corrienteF3() {
    this.F3 = this.corrienteRandom(this.idMensaje).toFixed(1)
    document.getElementById(this.idCronometro).innerHTML += (`F3:${this.F3} (A)`);
    
    return parseFloat(this.F3)
  }

  medidorEnergia() {
    this.trifasico = ((this.corrienteF1() + this.corrienteF2() + this.corrienteF3() ) / 3) / (this.CORRIENTE_MAXIMA * 2);
    console.log(`suma: ${this.trifasico} `);
    // console.log(`trifasico: ${this.trifasico} `);
    
    return this.trifasico; 
    // this.media = (this.corrienteF1() + this.corrienteF2())/2
  }

  // medidorEnergia(id) {
  //   // mide la corriente que pasa por los cables e informa a la IA
  //   if (id == "mensaje-ventilador-evaporador") return ((Math.random()*(0.5 - 0.1) ) + 0.1)

  //   //probabilidad de que la corriente no sea la adecuada
  //   this.probabilidad = () => {return Math.random() > 0.999 }
  //   if (this.probabilidad()) {
  //     // Corriente puede dar una Sobrecarga / Insuficiencia
  //     this.energia = () => {return Math.random() < 0.95}
  //     // Genera un numero aleatorio entre 0.048 a 0.001 -Insufuciente-
  //     if (this.energia()) return ((Math.random()*(0.048 - 0.001) ) + 0.001)
  //     // Genera un numero aleatorio entre 1 a 0.55 -Sobrecarga-
  //     else return ((Math.random()*(1 - 0.55) ) + 0.55)
  //   } else {
  //     // Genera un numero aleatorio entre 0.5 a 0.1 -Normal-
  //     return ((Math.random()*(0.5 - 0.1) ) + 0.1)
  //     // ((Math.random()*(max - min + 1) ) + min)
  //   }
  // }

  cronometro(id) {
    // cronometro para contar el tiempo de trabajo de la máquina
    this.contadorTiempo = 0
    this.temporisador = setInterval(() => {
      this.segHoras = (this.contadorTiempo/360).toFixed(2)
      // document.getElementById(id).innerHTML += (`<br/>${this.segHoras}h`);
      document.getElementById(id).innerHTML = (`${this.segHoras}h <br/>`);
      // console.log(`Tiempo: ${this.contadorTiempo}`)
      this.contadorTiempo++
    }, SEGUNDO / 1)
  }

  // extraerTiempo (id) {
  //   // --- Tiempo trabajado de los diferentes equipos ---
  //   if (id == "mensaje-ventilador-evaporador") {
  //     tiempoVentilador = this.contadorTiempo
  //   }
  //   if (id == "mensaje-compresor") {
  //     tiempoCompresor += this.contadorTiempo
  //   }

  // }

  relacionTiempos() { 
    // Da en porcentaje la diferencia de tiempo de trabajo del condensador con el ventilador evaporador
    this.relacion = ((tiempoCompresor * 100) / tiempoVentilador).toFixed(1)
      document.getElementById("relacion").innerHTML = (`<br/>TVent:${(tiempoVentilador/360).toFixed(1)}h TCom:${(tiempoCompresor/360).toFixed(1)}h <br/> Relacion:${this.relacion}%`);
  }

  mensajesAlerta(equipo, id) {
    // mostrar que parte fallo
    console.log(`falla en ${equipo} dar mantenimiento`)
    
    // Dependiendo la falla realiza una accion diferente
    if (this.informacion.e < 0.05) {
      falla.play()
      document.getElementById(id).innerHTML = `Falla de energia`
      // Falta de energia Comprobar interruptores y reiniciar equipos
      // console.log("Falta de energia Comprobar interruptores y reiniciar equipos");
      setTimeout(this.iniciar, MINUTO * 1)
    } else if (this.informacion.e > 0.59) {
      falla.play()
      document.getElementById(id).innerHTML = `Sobrecarga`
      // console.log("sobrecarga de energia");
      // solo reiniciar si ya se dio mantenimiento
      // setTimeout(this.iniciar, SEGUNDO * 10)
    } else {
      if (this.informacion.t > 0.5) {
        document.getElementById(id).innerHTML = `IA: Autoproteccion`
        // console.log("Tiempo limite");
        // mensaje de exceso de trabajo
        setTimeout(this.iniciar, MINUTO * this.Tiempo_Descanso)
      }
    }
  }

  tiempoCorrecto (id) {
    // transforma el tiempo de 0.0 a 1.0 para que la maquina entienda // tiempoTrabajado / tiempoMaximo * 2
    // if (id == "mensaje-ventilador-evaporador") return 0.3
    return ((this.contadorTiempo / 60) / (this.TIEMPO_MAXIMO * 2))
  }

  iluminar() {
    //ilumina el equipo que esta trabajando
    this.img = document.getElementById(this.idImg)
    if (this.img.classList.contains("dark")) {
      //Quita la iluminacion si esta Descanzando
      this.img.classList.remove("dark")
    } else {
      this.img.classList.add("dark")
    }
  }

  dataequipos() {
    // Muestra las informacion que recibe la IA y la desicion que toma
    document.getElementById(this.data).innerHTML = (`Tiempo: ${this.informacion.t} <br> Electricidad: ${this.informacion.e} <br> ON: ${this.decision.on.toFixed(3)} / OFF: ${this.decision.off.toFixed(3)}`)
  }


  monitoreo(id) {
    // monitorea el tiempo de trabajo y la energia, para que no se exceda
    this.iluminar()
    this.submonitoreo = setInterval(() => {

      // --- ML ---
      // crear un objeto con {e: 0-1, t: 0-1}
      // e = electricidad ; t = tiempo
      // La electricidad varia cada segundo, pudiendo no a ver energia (< 0), energia (0 - 0.5) o una sobre carga (> 0.5)

      this.informacion = {
        e: this.medidorEnergia().toFixed(3),
        t: this.tiempoCorrecto(id).toFixed(3),
      }
      // console.log(this.informacion);

        // Se entrega la informacion a la IA para que decida
        this.decision = network.run(this.informacion)
        // console.log(this.decision);
        this.dataequipos()

        // if on > off serguir trabajando // else apagar
        if (this.decision.on < this.decision.off) {
          // Manda mensaje a la empresa para mantenimiento
          this.iluminar()
          // document.getElementById(id).innerHTML = `FALLA`
          this.mensajesAlerta(this.equipo, id)
          
          // Agrega el tiempo trabajado 
          if (id == "mensaje-compresor") {
            tiempoCompresor += this.contadorTiempo
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
          document.getElementById(id).innerHTML = `Trabajando`
          if (id == "mensaje-ventilador-evaporador") {
            tiempoVentilador = this.contadorTiempo
          }
        }

        // console.log(tiempoCompresor + " " + tiempoVentilador);
        // console.log(this.tiempototal + " " + this.contadorTiempo);

    }, SEGUNDO / 1)
    // --- ML ---
  }

  pararIntervalo(idInterval) {
    clearInterval(idInterval)
  }
}

function empezarPrograma(id1, id2, Tiempo_Maximo, equipo, idata, idImg, srcAudio, CORRIENTE_MAXIMA, CORRIENTE_MINIMA, Tiempo_Descanso) {
  window.programa = new PROGRAMA(id1, id2, Tiempo_Maximo, equipo, idata, idImg, srcAudio, CORRIENTE_MAXIMA, CORRIENTE_MINIMA, Tiempo_Descanso)
}

function bienvenida () {
  const audio = new Audio ('./audio/bienvenida.mp3')
  audio.play()
} bienvenida()

// function iluminar() {
//   if (imagenEquipo.classlist.contains("light")) {
//     imagenEquipo.classlist.remove("light")
//   } else {
//     imagenEquipo.classlist.add("light")
//   }
// }

// let probabilidad = () => {return Math.random() > 0.01}
// for (let i = 0; i < 1000; i++) {
//   let probabilidad = () => {return (Math.random()*100) > 0.2}
//   console.log(probabilidad());

// }