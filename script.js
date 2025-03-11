let res = document.getElementById("res");
res.textContent = "0";

// Números
let b0 = document.getElementById("b0");
let b1 = document.getElementById("b1");
let b2 = document.getElementById("b2");
let b3 = document.getElementById("b3");
let b4 = document.getElementById("b4");
let b5 = document.getElementById("b5");
let b6 = document.getElementById("b6");
let b7 = document.getElementById("b7");
let b8 = document.getElementById("b8");
let b9 = document.getElementById("b9");

// Coma decimal
let bComa = document.getElementById("bCom");

// Operadores
let bDividir = document.getElementById("bDiv");
let bMultiplicar = document.getElementById("bX");
let bRestar = document.getElementById("bLess");
let bSumar = document.getElementById("bPlus");
let bIgual = document.getElementById("bEqual");

// Edición
let bBorrarTodo = document.getElementById("bCleanAll");
let bBorrarUltimo = document.getElementById("bDeleteLast");

let botones = [b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, bDividir, bMultiplicar, bRestar, bComa, bIgual, bSumar];

botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
        agregarElemento(boton.textContent);
    });
});

function agregarElemento(elemento) {
    if (elemento === ".") {
        agregarComa();
        return;
    }
    switch (elemento) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            agregarNumero(elemento);
            break;
        case "+":
        case "-":
        case "/":
        case "*":
            agregarOperacion(elemento);
            break;
        case "=":
            agregarIgual();
            break;
    }
}

function agregarComa() {
    let ultimoCaracter = res.textContent.slice(-1);

    // No agregar si el número actual ya tiene un punto decimal
    let tokens = parsearString(res.textContent);
    let ultimoNumero = tokens.length > 0 ? tokens[tokens.length - 1] : "";

    if (ultimoNumero.includes(".")) return;

    // No agregar "." después de un operador si no hay número antes
    if (["+", "-", "*", "/"].includes(ultimoCaracter)) {
        res.textContent += "0."; // Agregar "0." para evitar errores
    } else {
        res.textContent += ".";
    }
}

function agregarNumero(elemento) {
    if (esResCero()) {
        reemplazarResultado(elemento);
    } else {
        agregarAResultado(elemento);
    }
}

function esResCero() {
    return res.textContent === "0";
}

function agregarAResultado(elemento) {
    res.textContent += elemento;
}

function reemplazarResultado(elemento) {
    res.textContent = elemento;
}

// Caso para operadores
function agregarOperacion(elemento) {
    if (esResCero() && elemento === "-") { //Numero negativo en primer lugar
        reemplazarResultado(elemento);
    }
    // Si ya hay un número y se está ingresando un operador
    if (!esResCero() && !esOperador(res.textContent.slice(-1))) {
        agregarAResultado(elemento);
    }
}


function esOperador(elemento) {
    const operadores = ["+", "-", "*", "/"];
    return operadores.includes(elemento);
}

// Caso para el botón "="
function agregarIgual() {
    if (!esResCero() && res.textContent.slice(-1) !== "=") {
        calcularResultado();   
    }
}

function agregarHistorial(res) {
    let historial = document.getElementById("historial");
    let nuevoElemento = document.createElement("li");
    nuevoElemento.textContent = res;
    historial.appendChild(nuevoElemento);
}


function calcularResultado() {
    let tokens = parsearString(res.textContent);
  
    console.log("Tokens originales:", tokens);

    // Primero, resolver multiplicaciones y divisiones
    let resultadoMD = evaluarMultiplicacionesYDivisiones(tokens);
    console.log("Después de *, /:", resultadoMD);

    // Luego, resolver sumas y restas
    let resultadoFinal = evaluarSumasYRestas(resultadoMD);
    console.log("Resultado final:", resultadoFinal);

    // Asegurar que el resultado es un número válido antes de mostrarlo
    if (!isNaN(resultadoFinal) && isFinite(resultadoFinal)) {
        agregarHistorial(res.textContent + " = " + resultadoFinal.toString()); //Agrego el resultado al historial
        res.textContent = resultadoFinal.toString();
    } else {
        res.textContent = "Error"; // Manejo de errores básicos
    }
}

//Parsear la cadena en tokens
function parsearString(expresion) {
    const regex = /(\-?\d+(\.\d*)?|\.\d+|[\+\-\*\/])/g; // Expresión regular que reconoce y separa números (enteros y decimales) y operadores matemáticos (+, -, *, /).
    return expresion.match(regex) || [];
}

//Evaluar multiplicaciones y divisiones primero
function evaluarMultiplicacionesYDivisiones(tokens) {
    let pila = [];
    let i = 0;

    while (i < tokens.length) {
        let token = tokens[i];

        if (token === "*" || token === "/") {
            let num1 = parseFloat(pila.pop()); // Tomar el número anterior
            let num2 = parseFloat(tokens[i + 1]); // Tomar el siguiente número

            if (isNaN(num1) || isNaN(num2)) {
                console.error("Error en multiplicación/división con valores:", num1, token, num2);
                return [];
            }

            let resultado;
            if (token === "*") {
                resultado = num1 * num2;
            } else {
                resultado = num1 / num2;
            }

            pila.push(resultado); // Guardamos el resultado
            i += 2; // Saltamos al siguiente token después del número usado
        } else {
            pila.push(token);
            i++;
        }
    }
    return pila; // Retorna la lista con multiplicaciones y divisiones resueltas
}

//Evaluar sumas y restas
function evaluarSumasYRestas(tokens) {
    if (tokens.length === 0) return "Error"; // Evita cálculos con lista vacía

    let resultado = parseFloat(tokens[0]); // Primer número como base

    for (let i = 1; i < tokens.length; i += 2) {
        let operador = tokens[i]; // + o -
        let numero = parseFloat(tokens[i + 1]); // Número después del operador

        if (isNaN(numero)) {
            console.error("Error en suma/resta con valores:", resultado, operador, numero);
            return "Error";
        }

        if (operador === "+") {
            resultado += numero;
        } else if (operador === "-") {
            resultado -= numero;
        }
    }
    return resultado;
}


//Funciones para limpiar
bBorrarTodo.addEventListener("click", reiniciarResultado);

bBorrarUltimo.addEventListener("click", function () {
    if (res.textContent.length > 1) {
        res.textContent = res.textContent.slice(0, -1);
    } else {
        reiniciarResultado();  
    }
});

function reiniciarResultado() {
    res.textContent = "0"; // Reiniciar el resultado a 0
}
