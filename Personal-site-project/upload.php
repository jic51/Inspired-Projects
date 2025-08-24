<?php
$fullname = $_POST['fullname'] ?? '';
$email = $_POST['email'] ?? '';
$captcha = $_POST['g-recaptcha-response'] ?? '';

if (!$captcha) {
  die('Por favor verifica el captcha.');
}

// Validate reCAPTCHA with Google
$secretKey = "YOUR_SECRET_KEY_HERE";
$response = file_get_contents(
  "https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$captcha"
);
$responseData = json_decode($response);
if (!$responseData->success) {
  die('Falló la verificación reCAPTCHA.');
}

// Handle file upload
if (isset($_FILES['doc']) && $_FILES['doc']['error'] == 0) {
  $uploadDir = __DIR__ . '/uploads/';
  if (!file_exists($uploadDir)) mkdir($uploadDir, 0755, true);

  $filename = basename($_FILES['doc']['name']);
  $target = $uploadDir . time() . "_" . $filename;
  $fileType = pathinfo($filename, PATHINFO_EXTENSION);

  $allowed = ['pdf', 'jpg', 'jpeg', 'png'];
  if (!in_array(strtolower($fileType), $allowed)) {
    die('Tipo de archivo no permitido.');
  }

  if (move_uploaded_file($_FILES['doc']['tmp_name'], $target)) {
    // Save to CSV
    $csv = fopen(__DIR__ . '/submissions.csv', 'a');
    fputcsv($csv, [$fullname, $email, $target, date("Y-m-d H:i:s")]);
    fclose($csv);
    echo "Verificación completada. Gracias.";
  } else {
    echo "Error al subir el archivo.";
  }
} else {
  echo "Archivo no recibido.";
}
?>
