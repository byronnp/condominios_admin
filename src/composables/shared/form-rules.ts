export function requiredRule(label = 'Este campo') {
  return (value: unknown) =>
    value === null || value === undefined || value === '' ? `${label} es obligatorio` : true;
}

export function emailRule(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Ingresa un correo';
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? true : 'Ingresa un correo valido';
}

export function minLengthRule(min: number, label = 'El valor') {
  return (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return true;
    }

    return trimmed.length >= min ? true : `${label} debe tener al menos ${min} caracteres`;
  };
}

export function confirmedRule(value: string, confirmation: string) {
  if (!value.trim() && !confirmation.trim()) {
    return true;
  }

  if (!value.trim()) {
    return 'Ingresa el valor antes de confirmarlo';
  }

  if (!confirmation.trim()) {
    return 'Confirma el valor';
  }

  return value === confirmation ? true : 'La confirmacion no coincide';
}
