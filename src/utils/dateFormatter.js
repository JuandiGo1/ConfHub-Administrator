const formatDate = (dateToFormat) => {
  return dateToFormat instanceof Date
    ? dateToFormat.toLocaleDateString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";
};

export default formatDate;
