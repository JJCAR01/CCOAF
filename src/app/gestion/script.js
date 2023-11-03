function verInformacionAdicional(idActividadEstrategica) {
    // Realiza una solicitud AJAX para cargar la información adicional desde el archivo HTML correspondiente
    $.get('./pat.crear.component.html', function (data) {
        $("#informacion-adicional").html(data);
    });
}

// Puedes hacer lo mismo para los otros botones como "Modificar" y "Eliminar".

