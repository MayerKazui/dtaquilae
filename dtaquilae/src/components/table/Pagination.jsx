import React from "react";
import classNames from "classnames";
import { usePagination, DOTS } from "../../hooks/table/usePagination";

/**
 * Méthode héritée du composant parent permettant permettant de mettre à jour la page actuelle lors d'un changement de page
 * @callback onPageChange
 * @param {number} pageNumber - Le numéro de la page
 */

/**
 *
 * @param {onPageChange} onPageChange - Méthode permettant la mise à jour de la page actuelle
 * @param {number} totalCount  - Nombre total d'enregistrement dans le tableau
 * @param {number} siblingCount - Nombre de numéro de page affichés de part et d'autre de la page actuelle
 * @param {number} currentPage - La page actuelle
 * @param {number} pageSize - La taille de la page
 * @returns
 */
const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 2,
  currentPage,
  pageSize,
}) => {
  
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // S'il y a moins de 2 pages on affiche pas la pagination
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <div>
      <ul
        className={"pagination-container"}
      >
        {/* Flèche de navigation gauche */}
        <li
          className={classNames("pagination-item", {
            disabled: currentPage === 1,
          })}
          onClick={onPrevious}
        >
          <div className="arrow left" />
        </li>
        {paginationRange.map((pageNumber) => {
          // Si le pageItem est "..." on affiche le caractère unicode
          if (pageNumber === DOTS) {
            return <li className="pagination-item dots">&#8230;</li>;
          }

          // Affichage des pages
          return (
            <li
              className={classNames("pagination-item", {
                selected: pageNumber === currentPage,
              })}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </li>
          );
        })}
        {/*  Flèche de navigation droite */}
        <li
          className={classNames("pagination-item", {
            disabled: currentPage === lastPage,
          })}
          onClick={onNext}
        >
          <div className="arrow right" />
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
