<?php
// Simple auth
$PASSWORD = "milagro2025"; // Change this
session_start();
if (!isset($_POST['password']) && !isset($_SESSION['auth'])) {
  echo '<form method="POST"><input type="password" name="password" placeholder="Enter password"/><button>Access</button></form>';
  exit;
} elseif (isset($_POST['password']) && $_POST['password'] === $PASSWORD) {
  $_SESSION['auth'] = true;
} elseif (!isset($_SESSION['auth'])) {
  die("Unauthorized.");
}

// Display table
$csvFile = fopen("submissions.csv", "r");
echo "<h2>Submissions</h2><table border='1'><tr><th>Date</th><th>Name</th><th>Email</th><th>Topic</th><th>Message</th><th>ID File</th></tr>";
while (($data = fgetcsv($csvFile)) !== false) {
  echo "<tr>";
  for ($i = 0; $i < 5; $i++) {
    echo "<td>" . htmlspecialchars($data[$i]) . "</td>";
  }
  $filePath = htmlspecialchars($data[5]);
  echo "<td><a href='$filePath' target='_blank'>View</a></td>";
  echo "</tr>";
}
echo "</table>";
fclose($csvFile);
?>
