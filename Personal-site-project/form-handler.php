<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitizar y validar los datos del formulario
    $name = htmlspecialchars(strip_tags(trim($_POST["name"])));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(strip_tags(trim($_POST["message"])));

    // Validar que los campos no estén vacíos
    if (empty($name) || empty($email) || empty($message)) {
        echo "Por favor, completa todos los campos.";
        exit;
    }

    // Dirección de correo de destino
    $to = "cristina.vera.abogada@gmail.com";
    $subject = "Nuevo mensaje del sitio web";
    $body = "Nombre: $name\nCorreo: $email\n\nMensaje:\n$message";
    $headers = "From: $email";

    // Enviar el correo
    if (mail($to, $subject, $body, $headers)) {
        echo "Mensaje enviado correctamente.";
    } else {
        echo "Hubo un error al enviar el mensaje. Intenta nuevamente.";
    }
}
?>