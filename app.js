// app.js
const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const { ensureAuthenticated } = require('./middleware/auth'); // Importa el middleware de autenticación
const sequelize = require('./config/database');
const expressLayouts = require('express-ejs-layouts');
const User = require('./models/User'); // Asegúrate de importar tus modelos
const Customer  = require('./models/Customer');
const alertMiddleware = require('./middlewares/alertMiddleware');

// Sincroniza los modelos con la base de datos
sequelize.sync({ force: false }) // Cambia `force: true` si quieres que se recreen las tablas
  .then(() => {
    console.log('Modelos sincronizados con la base de datos.');
  })
  .catch(err => {
    console.error('Error al sincronizar los modelos:', err);
  });

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: '123456789123456789', // Cambia esto por una clave secreta segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Configura esto a true si estás usando HTTPS
}));

// Middleware para pasar la información del usuario a las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// En tu app.js o archivo principal
app.use(function(req, res, next) {
  res.locals.user = req.session.user || null;
  next();
});
app.use(alertMiddleware);
// Rutas
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoute');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
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
app.use('/api', ensureAuthenticated, notificationRoutes);
app.use('/', cierreCajaRoutes);



// Ruta principal
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
