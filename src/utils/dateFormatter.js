const formatDate = (dateToFormat) => {
  return dateToFormat instanceof Date
    ? dateToFormat.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";
};

export default formatDate;