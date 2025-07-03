// middlewares/alertMiddleware.js
module.exports = (req, res, next) => {
  // Inicializar alertas si no existen
  if (!req.session.alerts) {
    req.session.alerts = [];
  }

  // Método para agregar alertas
  res.locals.alertSwette = (type, message, options = {}) => {
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

  // Para rutas sin layout (como login) - guardar alertas en session
  res.addAlert = (alertData) => {
    req.session.alerts.push({
      type: alertData.type,
      message: alertData.message,
      title: alertData.title || '',
      icon: alertData.icon || getDefaultIcon(alertData.type),
      dismissible: alertData.dismissible !== false,
      timeout: alertData.timeout || 5000,
      position: alertData.position || 'top-right'
    });
  };

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