<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin Panel')</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            margin: 0;
            min-height: 100vh;
            background: linear-gradient(-45deg, #1e3c72, #2a5298, #76b852, #8DC26F);
            background-size: 400% 400%;
            animation: gradientShift 12s ease infinite;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .navbar {
            background-color: rgba(0, 0, 0, 0.7) !important;
            backdrop-filter: blur(8px);
        }

        .navbar-brand {
            font-weight: 600;
            color: #ffffff !important;
        }

        footer {
            text-align: center;
            background-color: transparent;
            color: #000;
        }

        /* Allow full-screen layouts (like login) */
        .full-screen {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
        }
    </style>
</head>
<body>

    <nav class="navbar navbar-expand-lg shadow-sm">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">🩺 Medi-Ecom Admin</a>
        </div>
    </nav>

    <!-- This container is flexible -->
    <div class="@yield('container-class', 'container my-4')">
        @yield('content')
    </div>

    <footer class="py-3">
        <small>© {{ date('Y') }} Medi-Ecom Admin Portal</small>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
