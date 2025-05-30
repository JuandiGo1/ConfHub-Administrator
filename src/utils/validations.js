// Valida que un campo no esté vacío (ni null ni string vacío)
export function isNotEmpty(value) {
  return value !== null && value !== undefined && value.toString().trim() !== "";
}

// Valida que un campo solo contenga letras y espacios
export function isOnlyText(value) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value.trim());
}

// Valida que un campo sea un número positivo
export function isPositiveNumber(value) {
  return !isNaN(value) && Number(value) >= 0;
}

// Valida que un array no esté vacío
export function isNonEmptyArray(arr) {
  return Array.isArray(arr) && arr.length > 0;
}