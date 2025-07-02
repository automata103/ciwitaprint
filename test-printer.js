const { printer: ThermalPrinter, types: PrinterTypes } = require("node-thermal-printer");

const printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: 'printer:2C-POS80-01-V6 Printer(2)', // ← Usa aquí exactamente el nombre de tu impresora
  width: 48,
  characterSet: 'SLOVENIA',
  removeSpecialCharacters: false
});

printer.alignCenter();
printer.setTypeFontB();
printer.println("CARIBE AZUL");
printer.setTypeFontA();
printer.drawLine();
printer.println("TEST DE IMPRESIÓN");
printer.drawLine();
printer.println(new Date().toLocaleString('es-DO'));
printer.cut();

(async () => {
  try {
    const success = await printer.execute();
    console.log(success ? "🖨️ Impresión enviada correctamente" : "⚠️ Falló la impresión");
  } catch (error) {
    console.error("❌ Error de impresión:", error.message);
  }
})();
