function formatDate(dateLike) {
  if (!dateLike) {
    return '-';
  }
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) {
    return '-';
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateTime(dateLike) {
  if (!dateLike) {
    return '-';
  }
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) {
    return '-';
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

function formatAmount(value) {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return '0.00';
  }
  return num.toFixed(2);
}

module.exports = {
  formatDate,
  formatDateTime,
  formatAmount
};
