function toggle(id) {
  document.getElementById(id).classList.toggle("hidden");
  actualizarPreview();
  document.getElementById("mensajeCopiado").classList.add("hidden");
}

function actualizarPreview() {
  const tipo = document.getElementById("tipoIncidencia").value;
  let texto = `${tipo || ""}\n`;

  const descripcion = document.getElementById("descripcion");
  if (
    !descripcion.classList.contains("hidden") &&
    descripcion.value.trim() !== ""
  ) {
    texto += `${descripcion.value}\n\n`;
  }

  const campos = [
    { id: "usuario", label: "👤 Usuario" },
    { id: "equipo", label: "💾 IP / Equipo" },
    { id: "afecta", label: "👥 Afecta a más" },
    { id: "antes", label: "📌 Antes funcionaba" },
    { id: "otroEquipo", label: "🔄 Probó otro equipo" },
    { id: "ruta", label: "📍 Ruta error" },
    { id: "captura", label: "🖼️ Captura adjunta" },
    { id: "nhc", label: "🆔 NHC" },
    { id: "pruebas", label: "🛠️ Pruebas realizadas" },
    { id: "observaciones", label: "📝 Observaciones" },
  ];

  campos.forEach((campo) => {
    const elem = document.getElementById(campo.id);
    if (!elem.classList.contains("hidden") && elem.value.trim() !== "") {
      texto += `- ${campo.label}: ${elem.value}\n`;
    }
  });

  // 👇 Aquí actualizamos la parte de ubicación como grupo separado
  const bloqueUbicacion = document.getElementById("bloqueUbicacion");
  if (!bloqueUbicacion.classList.contains("hidden")) {
    const edificio = document.getElementById("edificio").value.trim();
    const planta = document.getElementById("planta").value.trim();
    const puerta = document.getElementById("puerta").value.trim();
    const referencia = document.getElementById("referencia").value.trim();

    if (edificio || planta || puerta || referencia) {
      texto += `- 📍 Ubicación: `;
      if (edificio) texto += `Edificio ${edificio}, `;
      if (planta) texto += `Planta ${planta}, `;
      if (puerta) texto += `Puerta ${puerta}, `;
      if (referencia) texto += `Referencia: ${referencia}, `;
      texto = texto.replace(/, $/, "\n"); // quitar la coma final
    }
  }

  document.getElementById("previewTexto").textContent = texto;
}

function copiarYGuardar() {
  const texto = document.getElementById("previewTexto").textContent;
  navigator.clipboard.writeText(texto).then(() => {
    guardarEnHistorial(texto);
    document.getElementById("mensajeCopiado").classList.remove("hidden");
  });
  resetFormulario();
  setTimeout(function () {
    location.reload();
  }, 2000);
}

function guardarEnHistorial(texto) {
  let historial = JSON.parse(localStorage.getItem("historialTickets") || "[]");
  const timestamp = new Date().toLocaleString();
  historial.unshift({ fecha: timestamp, contenido: texto });
  localStorage.setItem("historialTickets", JSON.stringify(historial));
  mostrarHistorial();
}

function mostrarHistorial() {
  let historial = JSON.parse(localStorage.getItem("historialTickets") || "[]");
  const contenedor = document.getElementById("historialTickets");
  contenedor.innerHTML = "";
  historial.slice(0, 5).forEach((item) => {
    const div = document.createElement("div");
    div.className = "historial-entry";
    div.innerHTML = `<strong>${item.fecha}</strong>\n${item.contenido}`;
    contenedor.appendChild(div);
  });
}
function resetFormulario() {
  document.getElementById("tipoIncidencia").value = "";

  const elementos = document.querySelectorAll(
    "input[type='text'], select, textarea"
  );
  elementos.forEach((e) => {
    e.value = "";
    if (!e.classList.contains("hidden")) {
      e.classList.add("hidden");
    }
  });

  // Ocultar el mensaje de copiado después de 1,5s
  setTimeout(() => {
    document.getElementById("mensajeCopiado").classList.add("hidden");
  }, 1500);

  document.getElementById("previewTexto").textContent = "";
  document.getElementById("bloqueUbicacion").classList.add("hidden");
  document.getElementById("edificio").value = "";
  document.getElementById("planta").value = "";
  document.getElementById("puerta").value = "";
  document.getElementById("referencia").value = "";
}

// Mostrar historial al cargar
mostrarHistorial();
