module.exports = function(req, res, next) {
  // Inicializar alertas si no existen
  if (!req.session.alerts) {
    req.session.alerts = [];
  }

  // Método para agregar alertas
  res.locals.alertSwette = function(type, message, options = {}) {
    const alert = {
      type,
      message,
      title: options.title || '',
      icon: options.icon || getDefaultIcon(type),
      dismissible: options.dismissible !== false,
      timeout: options.timeout || 5000,
      position: options.position || 'top-right'
    };
    req.session.alerts.push(alert);
  };

  // Pasar alertas a las vistas
  res.locals.alerts = req.session.alerts || [];
  
  // Limpiar alertas después de mostrarlas
  req.session.alerts = [];

  next();
};

function getDefaultIcon(type) {
  const icons = {
    success: 'check-circle-fill',
    error: 'exclamation-triangle-fill',
    warning: 'exclamation-triangle-fill',
    info: 'info-circle-fill'
  };
  return icons[type] || 'info-circle-fill';
}