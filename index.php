<?php
// Washa ripoti ya makosa ili uone tatizo likitokea
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require 'db.php'; 

$topics = [];
try {
    $sql = "SELECT topics.*, users.username, categories.name as cat_name 
            FROM topics 
            JOIN users ON topics.user_id = users.user_id 
            JOIN categories ON topics.category_id = categories.category_id 
            ORDER BY created_at DESC LIMIT 10";
    $stmt = $pdo->query($sql);
    $topics = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Hapa itakaa kimya kama hakuna mada
}
?>

<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <title>E-Forum | Karibu</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; background: #f0f2f5; }
        header { background: #007bff; color: white; padding: 15px 5%; display: flex; justify-content: space-between; }
        nav a { color: white; text-decoration: none; margin-left: 20px; }
        .hero { background: white; padding: 40px; text-align: center; border-bottom: 1px solid #ddd; }
        .container { max-width: 900px; margin: 20px auto; padding: 0 15px; }
        .topic-card { background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .btn-register { background: #28a745; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; font-weight: bold; }
    </style>
</head>
<body>

<header>
    <div style="font-size: 24px; font-weight: bold;">E-Forum</div>
    <nav>
        <a href="index.php">Nyumbani</a>
        <a href="login.html">Ingia</a>
        <a href="register.html">Jisajili</a>
    </nav>
</header>

<div class="hero">
    <h1>Jukwaa la Majadiliano</h1>
    <p>Jiunge leo uanze kuchangia mada.</p>
    <a href="register.html" class="btn-register">Jisajili Bure</a>
</div>

<div class="container">
    <h2>Mada za Hivi Karibuni</h2>
    <?php if(empty($topics)): ?>
        <div class="topic-card"><p>Bado hakuna mada. Kuwa wa kwanza kuanzisha!</p></div>
    <?php else: ?>
        <?php foreach($topics as $topic): ?>
            <div class="topic-card">
                <h3><?php echo htmlspecialchars($topic['title']); ?></h3>
                <p><?php echo substr(htmlspecialchars($topic['content']), 0, 150); ?>...</p>
                <small>Na: <?php echo htmlspecialchars($topic['username']); ?> katika <?php echo htmlspecialchars($topic['cat_name']); ?></small>
            </div>
        <?php endforeach; ?>
    <?php endif; ?>
</div>

</body>
</html>