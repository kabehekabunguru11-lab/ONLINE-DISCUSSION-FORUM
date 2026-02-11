const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./config/db');
const { setLocals } = require('./middleware/auth');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'eforum_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set local variables middleware
app.use(setLocals);

// Test database connection
const testDB = async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ MySQL database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
    }
};
testDB();

// ============ ROUTES ============

// Home Page
app.get('/', async (req, res) => {
    try {
        const [forums] = await db.query(`
            SELECT f.*, u.username, 
                   (SELECT COUNT(*) FROM posts WHERE forum_id = f.id) as posts_count
            FROM forums f
            JOIN users u ON f.created_by = u.id
            ORDER BY f.created_at DESC
            LIMIT 5
        `);
        
        res.render('index', { forums });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server error' });
    }
});

// All Forums
app.get('/forums', async (req, res) => {
    try {
        const [forums] = await db.query(`
            SELECT f.*, u.username,
                   (SELECT COUNT(*) FROM posts WHERE forum_id = f.id) as posts_count
            FROM forums f
            JOIN users u ON f.created_by = u.id
            ORDER BY f.created_at DESC
        `);
        
        res.render('forums', { forums });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server error' });
    }
});

// Single Forum
app.get('/forum/:id', async (req, res) => {
    try {
        const forumId = req.params.id;
        
        // Update views count
        await db.query('UPDATE forums SET views_count = views_count + 1 WHERE id = ?', [forumId]);
        
        // Get forum details
        const [forumRows] = await db.query(`
            SELECT f.*, u.username 
            FROM forums f
            JOIN users u ON f.created_by = u.id
            WHERE f.id = ?
        `, [forumId]);
        
        if (forumRows.length === 0) {
            return res.redirect('/forums');
        }
        
        // Get posts
        const [posts] = await db.query(`
            SELECT p.*, u.username 
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.forum_id = ?
            ORDER BY p.created_at DESC
        `, [forumId]);
        
        res.render('forum', { forum: forumRows[0], posts });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server error' });
    }
});

// Profile
app.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    
    try {
        const userId = req.session.user.id;
        
        // Get user stats
        const [stats] = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM posts WHERE user_id = ?) as total_posts,
                (SELECT COUNT(*) FROM forums WHERE created_by = ?) as total_forums
        `, [userId, userId]);
        
        res.render('profile', { stats: stats[0] });
    } catch (error) {
        console.error(error);
        res.render('profile', { stats: { total_posts: 0, total_forums: 0 } });
    }
});

// ============ AUTH ROUTES ============
const bcrypt = require('bcryptjs');

// Register
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Check if user exists
        const [existing] = await db.query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );
        
        if (existing.length > 0) {
            return res.json({ 
                success: false, 
                message: 'Email or username already exists' 
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        
        // Get new user
        const [newUser] = await db.query(
            'SELECT id, username, email, role FROM users WHERE id = ?',
            [result.insertId]
        );
        
        // Set session
        req.session.user = newUser[0];
        
        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Server error' });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }
        
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }
        
        // Set session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        
        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Server error' });
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// ============ FORUM ROUTES ============

// Create Forum
app.post('/create-forum', async (req, res) => {
    if (!req.session.user) {
        return res.json({ success: false, message: 'Please login first' });
    }
    
    const { title, description, category } = req.body;
    
    try {
        await db.query(
            'INSERT INTO forums (title, description, category, created_by) VALUES (?, ?, ?, ?)',
            [title, description, category, req.session.user.id]
        );
        
        res.json({ success: true, message: 'Forum created successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Server error' });
    }
});

// Create Post
app.post('/create-post', async (req, res) => {
    if (!req.session.user) {
        return res.json({ success: false, message: 'Please login first' });
    }
    
    const { forumId, title, content } = req.body;
    
    try {
        await db.query(
            'INSERT INTO posts (forum_id, user_id, title, content) VALUES (?, ?, ?, ?)',
            [forumId, req.session.user.id, title, content]
        );
        
        // Update forum posts count
        await db.query(
            'UPDATE forums SET posts_count = posts_count + 1 WHERE id = ?',
            [forumId]
        );
        
        res.json({ success: true, message: 'Post created successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Server error' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Views directory: ${path.join(__dirname, 'views')}`);
    console.log(`🎨 Public directory: ${path.join(__dirname, 'public')}`);
});