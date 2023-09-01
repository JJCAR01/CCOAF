<script>
    $(document).ready(function () {
        // Escucha los clics en los enlaces de la barra lateral
        $(".menu a").click(function (e) {
            e.preventDefault(); // Evita que el enlace se comporte como un enlace normal

            // Obtiene la URL del enlace
            var url = $(this).attr("routerLink");

            // Carga el contenido de la URL en el elemento principal
            $("#main-content").load(url);
        })
    });
</script>