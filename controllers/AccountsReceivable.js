const AccountsReceivable = sequelize.define('AccountsReceivable', {
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'customerid'  // 👈 IMPORTANTE
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'invoiceid'  // 👈 IMPORTANTE
  },
  amount_due: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'accounts_receivable',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
