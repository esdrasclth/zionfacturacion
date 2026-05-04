const UNIDADES = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
const DECENAS_ESPECIALES = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
const DECENAS = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
const CENTENAS = ["", "CIEN", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

function convertirMenorMil(n: number): string {
  if (n === 0) return "";
  if (n < 10) return UNIDADES[n];
  if (n < 20) return DECENAS_ESPECIALES[n - 10];
  if (n < 100) {
    const dec = Math.floor(n / 10);
    const uni = n % 10;
    if (n >= 20 && n < 30 && uni > 0) return `VEINTI${UNIDADES[uni]}`;
    return uni === 0 ? DECENAS[dec] : `${DECENAS[dec]} Y ${UNIDADES[uni]}`;
  }
  const cen = Math.floor(n / 100);
  const resto = n % 100;
  const cenStr = cen === 1 && resto > 0 ? "CIENTO" : CENTENAS[cen];
  return resto === 0 ? cenStr : `${cenStr} ${convertirMenorMil(resto)}`;
}

function convertirEntero(n: number): string {
  if (n === 0) return "CERO";
  if (n < 1000) return convertirMenorMil(n);

  if (n < 1_000_000) {
    const miles = Math.floor(n / 1000);
    const resto = n % 1000;
    const milesStr = miles === 1 ? "MIL" : `${convertirMenorMil(miles)} MIL`;
    return resto === 0 ? milesStr : `${milesStr} ${convertirMenorMil(resto)}`;
  }

  if (n < 1_000_000_000) {
    const millones = Math.floor(n / 1_000_000);
    const resto = n % 1_000_000;
    const millStr = millones === 1 ? "UN MILLÓN" : `${convertirMenorMil(millones)} MILLONES`;
    return resto === 0 ? millStr : `${millStr} ${convertirEntero(resto)}`;
  }

  return n.toString();
}

export function numeroALetras(amount: number): string {
  const entero = Math.floor(amount);
  const centavos = Math.round((amount - entero) * 100);
  const centavosStr = centavos.toString().padStart(2, "0");
  return `${convertirEntero(entero)} CON ${centavosStr}/100 LEMPIRAS`;
}
