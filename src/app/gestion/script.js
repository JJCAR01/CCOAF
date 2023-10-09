function mostrarFormulario(tipo) {
    // Ocultar todos los formularios
    document.querySelectorAll(".formulario").forEach(function(form) {
        form.style.display = "none";
    });

    // Mostrar el formulario seleccionado
    document.getElementById("form" + tipo).style.display = "block";

    // Habilitar o deshabilitar el botón Registrar según el formulario seleccionado
    document.getElementById("botonRegistrar").disabled = (tipo === "") ? true : false;
}
function abrirModal() {
    $('#myModal').modal('show'); // Abre el modal con el ID "myModal"
  }

  // Función para cerrar el modal
  function cerrarModal() {
    $('#myModal').modal('hide'); // Cierra el modal con el ID "myModal"
  }