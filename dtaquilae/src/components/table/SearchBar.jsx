import React, { useState, useEffect } from "react";
import useDebouncedSearch from "../../hooks/table/useDebouncedSearch";
import { getLabels } from "../../lang/langFunctions";

/**
 * Méthode héritée du composant parent permettant d'alimenter la liste d'affichage
 * @callback setData
 * @param {Object[]} data - La liste d'objets
 */

/**
 * Méthode héritée du composant parent permettant la mise à jour de la page actuelle
 * @callback setCurrentPage
 * @param {number} currentPage - La page actuelle
 */

/**
 * Composant permettant une recherche dynamique et globale sur un table
 *
 * @param {String} table - Le nom de la table
 * @param {array} arrayColumns - La liste des colonnes (SQL) sur lesquelles le filtre s'appliquera
 * @param {setData} setData - La méthode permettant d'alimenter la liste d'objet 
 * @param {setCurrentPage} setCurrentPage - La méthode permettant la mise à jour de la page actuelle
 * @param {array} [arrayColumnsForeign=null] - La liste des colonnes (SQL) des clés étrangères
 * @param {boolean} [activeBoolean=null] - Boolean permettant d'ajouter un filtre sur le boolean "actif" de la table traitée
 * @returns Le composant
 */
function SearchBar({ table, arrayColumns, setData, setCurrentPage, arrayColumnsForeign = null, activeBoolean = null}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = activeBoolean === null ? 
  useDebouncedSearch(
    search,
    350,
    table,
    arrayColumns,
    setData,
    setCurrentPage,
    arrayColumnsForeign
  ) : 
  useDebouncedSearch(
    search,
    350,
    table,
    arrayColumns,
    setData,
    setCurrentPage,
    arrayColumnsForeign,
    activeBoolean
  );

  useEffect(() => {
    debouncedSearch;
  });

  return (
    <input
      type="text"
      className="search-bar"
      value={search}
      placeholder={getLabels("common.placeHolder.table.searchBar")}
      onChange={(event) => {
        setSearch(event.target.value);
      }}
    />
  );
}

export default SearchBar;
