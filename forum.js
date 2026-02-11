<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= forum.title %> - E-Forum</title>
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Notification -->
    <div id="notification" class="notification"></div>

    <!-- Modals -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-sign-in-alt"></i> Login</h3>
                <button class="close-modal" onclick="closeModal('loginModal')">&times;</button>
            </div>
            <form id="loginForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="loginEmail" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="loginPassword" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
            </form>
        </div>
    </div>

    <div id="registerModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-user-plus"></i> Register</h3>
                <button class="close-modal" onclick="closeModal('registerModal')">&times;</button>
            </div>
            <form id="registerForm">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="regUsername" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="regEmail" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="regPassword" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" id="regConfirmPassword" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Register</button>
            </form>
        </div>
    </div>

    <!-- Header -->
    <header>
        <div class="container">
            <nav class="navbar">
                <a href="/" class="logo">
                    <i class="fas fa-comments"></i>
                    <span>E-Forum</span>
                </a>
                
                <div class="nav-links">
                    <a href="/"><i class="fas fa-home"></i> Home</a>
                    <a href="/forums"><i class="fas fa-list"></i> Forums</a>
                    <a href="/profile"><i class="fas fa-user"></i> Profile</a>
                    
                    <% if (user) { %>
                        <div class="user-info">
                            <div class="avatar"><%= user.username.charAt(0).toUpperCase() %></div>
                            <span><%= user.username %></span>
                            <a href="/logout" class="btn btn-danger">Logout</a>
                        </div>
                    <% } else { %>
                        <div>
                            <button class="btn btn-primary" onclick="showModal('loginModal')">Login</button>
                            <button class="btn btn-success" onclick="showModal('registerModal')">Register</button>
                        </div>
                    <% } %>
                </div>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container">
        <div style="margin-top: 20px;">
            <!-- Forum Info -->
            <div style="background: white; padding: 30px; border-radius: var(--radius); margin-bottom: 20px;">
                <h1><%= forum.title %></h1>
                <p style="color: var(--secondary); margin: 10px 0 20px;"><%= forum.description %></p>
                
                <div class="forum-meta">
                    <span><i class="fas fa-user"></i> Created by: <strong><%= forum.username %></strong></span>
                    <span><i class="fas fa-tag"></i> Category: <strong><%= forum.category %></strong></span>
                    <span><i class="fas fa-calendar"></i> <%= new Date(forum.created_at).toLocaleDateString() %></span>
                    <span><i class="fas fa-comment"></i> <%= forum.posts_count || 0 %> posts</span>
                    <span><i class="fas fa-eye"></i> <%= forum.views_count || 0 %> views</span>
                </div>
                
                <% if (user) { %>
                    <div style="margin-top: 30px; background: var(--light); padding: 25px; border-radius: var(--radius);">
                        <h3 style="margin-bottom: 20px;"><i class="fas fa-pen"></i> Create New Post</h3>
                        <div class="form-group">
                            <input type="text" id="postTitle" class="form-control" placeholder="Post Title" required>
                        </div>
                        <div class="form-group">
                            <textarea id="postContent" class="form-control textarea" placeholder="What would you like to discuss?" required></textarea>
                        </div>
                        <button class="btn btn-primary" onclick="createPost(<%= forum.id %>)">
                            <i class="fas fa-paper-plane"></i> Publish Post
                        </button>
                    </div>
                <% } else { %>
                    <div style="text-align: center; padding: 30px; background: var(--light); border-radius: var(--radius); margin-top: 30px;">
                        <i class="fas fa-lock" style="font-size: 2rem; color: var(--secondary); margin-bottom: 10px;"></i>
                        <h3>Login to Participate</h3>
                        <p style="margin-bottom: 20px;">Please login to create posts and join the discussion.</p>
                        <button class="btn btn-primary" onclick="showModal('loginModal')">
                            <i class="fas fa-sign-in-alt"></i> Login Now
                        </button>
                    </div>
                <% } %>
            </div>

            <!-- Posts Section -->
            <div style="background: white; padding: 30px; border-radius: var(--radius);">
                <div class="section-header">
                    <h2><i class="fas fa-comments"></i> Discussions (<%= posts.length %>)</h2>
                </div>
                
                <% if (posts && posts.length > 0) { %>
                    <div class="posts-list">
                        <% posts.forEach(post => { %>
                            <div class="post-card">
                                <div class="post-header">
                                    <div class="post-author">
                                        <div class="avatar" style="width: 40px; height: 40px;">
                                            <%= post.username.charAt(0).toUpperCase() %>
                                        </div>
                                        <div>
                                            <strong><%= post.username %></strong>
                                            <div style="font-size: 0.85rem; color: var(--secondary);">
                                                <i class="fas fa-clock"></i> <%= new Date(post.created_at).toLocaleString() %>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="post-content">
                                    <h3 style="margin-bottom: 15px; color: var(--primary);"><%= post.title %></h3>
                                    <p style="white-space: pre-line;"><%= post.content %></p>
                                </div>
                                
                                <div class="post-actions">
                                    <span><i class="fas fa-thumbs-up"></i> <%= post.likes || 0 %> likes</span>
                                    <span><i class="fas fa-comment"></i> <%= post.replies || 0 %> replies</span>
                                </div>
                            </div>
                        <% }) %>
                    </div>
                <% } else { %>
                    <div style="text-align: center; padding: 60px 20px;">
                        <i class="fas fa-comment-slash fa-4x" style="color: var(--secondary); margin-bottom: 20px;"></i>
                        <h3>No posts yet</h3>
                        <p style="color: var(--secondary); margin-bottom: 20px;">Be the first to start a discussion in this forum!</p>
                        <% if (user) { %>
                            <button class="btn btn-primary" onclick="document.getElementById('postTitle').focus()">
                                <i class="fas fa-pen"></i> Create First Post
                            </button>
                        <% } %>
                    </div>
                <% } %>
            </div>
        </div>
    </main>

    <script>
        // Modal functions
        function showModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        function showNotification(message, type = 'info') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${type} show`;
            setTimeout(() => notification.classList.remove('show'), 3000);
        }

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });

        // Create Post
        async function createPost(forumId) {
            const title = document.getElementById('postTitle').value;
            const content = document.getElementById('postContent').value;
            
            if (!title || !content) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            try {
                const response = await fetch('/create-post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ forumId, title, content })
                });
                
                const data = await response.json();
                if (data.success) {
                    showNotification('Post created successfully!', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    showNotification(data.message, 'error');
                }
            } catch (error) {
                showNotification('Server error', 'error');
            }
        }

        // Login Form
        document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            if (data.success) {
                showNotification('Login successful!', 'success');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                showNotification(data.message, 'error');
            }
        });

        // Register Form
        document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirmPassword').value;
            
            if (password !== confirm) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            if (data.success) {
                showNotification('Registration successful!', 'success');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                showNotification(data.message, 'error');
            }
        });
    </script>
</body>
</html>