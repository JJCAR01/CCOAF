
  function cargarContenidoExterno(idGestion) {
    const contenidoExternoGestion = document.getElementById('contenidoExternoGestion');
  
    // Realiza una solicitud para cargar el contenido externo (ajusta la URL según tu caso)
    fetch('src/app/tarea/listar/tarea.listar.component.html')
      .then(response => response.text())
      .then(data => {
        contenidoExternoGestion.innerHTML = data;
      })
      .catch(error => console.error('Error al cargar el contenido externo: ', error));
  }
  
  // Ejemplo de cómo llamar la función al hacer clic en el botón "Ver"
  document.querySelector('.btn-outline-primary').addEventListener('click', function () {
    cargarContenidoExterno(1); // Puedes pasar un identificador o parámetro necesario
  });

