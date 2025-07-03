require('dotenv').config();
const express = require('express');
const session = require('express-session');
const PostgreSQLStore = require('connect-pg-simple')(session);
const path = require('path');
const app = express();
const sequelize = require('./config/database');
const expressLayouts = require('express-ejs-layouts');

// Middlewares
const { ensureAuthenticated } = require('./middleware/auth');
const alertMiddleware = require('./middleware/alertMiddleware');

// Middlewares base
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// EJS y Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// --- SESIONES ---
const sessionConfig = {
  store: new PostgreSQLStore({
    conString: process.env.DATABASE_URL || 
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    createTableIfMissing: true,
    pruneSessionInterval: 60 * 60, // Limpiar sesiones cada hora
    ssl: {
      rejectUnauthorized: false
    }
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  }
};

// Ajuste para desarrollo sin HTTPS
if (process.env.NODE_ENV === 'development') {
  sessionConfig.cookie.secure = false;
}

app.use(session(sessionConfig));

// --- Middleware Global ---
app.use(alertMiddleware);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.alerts = req.session.alerts || [];
  req.session.alerts = []; // Limpiar alertas
  next();
});

// --- Sincronización con Sequelize ---
sequelize.sync({ force: process.env.FORCE_SYNC === 'true' })
  .then(() => {
    console.log('✅ Modelos sincronizados con la base de datos');
    if (process.env.FORCE_SYNC === 'true') {
      console.log('⚠️  ¡FORCE_SYNC activado! Las tablas fueron recreadas');
    }
  })
  .catch(err => {
    console.error('❌ Error al sincronizar modelos:', err.message);
  });

// --- Rutas ---
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const customerRoutes = require('./routes/customerRoute');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cierreCajaRoutes = require('./routes/cierres');

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/customers', ensureAuthenticated, customerRoutes);
app.use('/products', ensureAuthenticated, productRoutes);
app.use('/invoices', ensureAuthenticated, invoiceRoutes);
app.use('/payments', ensureAuthenticated, paymentRoutes);
app.use('/orders', ensureAuthenticated, orderRoutes);
app.use('/users', ensureAuthenticated, userRoutes);
app.use('/reports', ensureAuthenticated, reportRoutes);
app.use('/api/notifications', ensureAuthenticated, notificationRoutes);
app.use('/cierre-caja', ensureAuthenticated, cierreCajaRoutes);

// --- Ruta raíz ---
app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.redirect('/login');
});

// --- Error 404 ---
app.use((req, res, next) => {
  res.status(404);
  if (!res.headersSent) {
    return res.render('errors/404', {
      layout: 'layouts/layout',
      title: 'Página no encontrada'
    });
  }
});

// --- Middleware de errores generales ---
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  if (!res.headersSent) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    req.session.alerts = [{
      type: 'error',
      title: 'Error del sistema',
      message: 'Ocurrió un error inesperado'
    }];

    return res.redirect(req.session.user ? '/dashboard' : '/login');
  }
});

// --- Iniciar servidor ---
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// --- Cierre elegante ---
process.on('SIGTERM', () => {
  console.log('🛑 Recibido SIGTERM. Cerrando servidor...');
  server.close(() => {
    console.log('🔴 Servidor cerrado');
    process.exit(0);
  });
});

module.exports = app;
