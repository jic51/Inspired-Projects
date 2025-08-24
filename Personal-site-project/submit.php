<?php
// reCAPTCHA secret key
$secret = 'YOUR_SECRET_KEY_HERE';
$response = $_POST['g-recaptcha-response'];
$verify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secret}&response={$response}");
$captcha_success = json_decode($verify)->success;

if (!$captcha_success) {
  die("CAPTCHA verification failed.");
}

// Sanitize input
$name = htmlspecialchars($_POST['name']);
$email = htmlspecialchars($_POST['email']);
$topic = htmlspecialchars($_POST['topic']);
$message = htmlspecialchars($_POST['message']);
$date = date("Y-m-d H:i:s");

// Handle file upload
$uploadDir = 'uploads/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
$file = $_FILES['cedula'];
$fileName = basename($file['name']);
$targetFile = $uploadDir . time() . "_" . $fileName;

$allowed = ['pdf', 'jpg', 'jpeg', 'png'];
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

if (!in_array($fileExt, $allowed)) {
  die("Invalid file type.");
}

if (move_uploaded_file($file['tmp_name'], $targetFile)) {
  // Save to CSV
  $csvLine = "\"$date\",\"$name\",\"$email\",\"$topic\",\"$message\",\"$targetFile\"\n";
  file_put_contents('submissions.csv', $csvLine, FILE_APPEND);
  // Send email
  $to = "cristinavera@example.com"; // Replace with Cristina's email
  $subject = "New Legal Inquiry from $name";
  $body = "You have a new message:\n\n".
          "Name: $name\n".
          "Email: $email\n".
          "Topic: $topic\n".
          "Message: $message\n\n".
          "View ID: " . $_SERVER['HTTP_HOST'] . "/" . $targetFile;

  $headers = "From: no-reply@yourdomain.com";

  mail($to, $subject, $body, $headers);


  echo "✅ Thank you! Your message has been submitted.";
} else {
  echo "❌ File upload failed.";
}
?>