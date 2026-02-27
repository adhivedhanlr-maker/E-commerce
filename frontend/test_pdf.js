const jspdfModule = require('jspdf');
console.log('Type of jsPDF:', typeof jspdfModule);
console.log('Keys:', Object.keys(jspdfModule));
console.log('Has jsPDF constructor?', !!jspdfModule.jsPDF);
