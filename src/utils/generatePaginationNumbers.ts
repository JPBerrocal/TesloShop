export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number
) => {
  //Si el numero total de paginas es menor o igual a 7, mostrar todas las paginas
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1); //[1,2,3,4,5,6,7]
  }

  //si la pagina actual esta entre las primeras 3, mostrar las primeras 3,puntos suspensivos y las ultimas 2
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  //Si las pagina actual esta en las ultimas 3, mostrar las primeras 2,puntos suspensivos y las ultimas 3
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  //si la pagina actual esta en otro lugar medio
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
