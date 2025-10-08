import { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";

/**
 * Méthode héritée du composant parents permettant d'alimenter la liste d'affichage
 * @callback setData
 * @param {Object[]} data - La liste d'objets
 */

/**
 * Méthode héritée du composant parent permettant la mise à jour de la page actuelle
 * @callback setCurrentPage
 * @param {number} currentPage - La page actuelle
 */

/**
 * Hook permettant de traiter de manière "asynchrone" la saisie pour une rercherche dans un tableau.
 * L'execution de la requête ne se fera qu'à échéance du délai définit après la dernière tape.
 * Mise en place pour éviter de surcharger le serveur en requête.
 * 
 * @param {String} search - Le string recherché
 * @param {number} delay - Le temps en ms d'attente avant execution
 * @param {String} table - Le nom de la table
 * @param {array} arrayColumns - Les noms des colonnes sur lesquelles porte la recherche
 * @param {setData} setData  - La méthode permettant d'alimenter la liste d'objet
 * @param {setCurrentPage} setCurrentPage - La méthode permettant la mise à jour de la page actuelle
 * @param {array} [arrayColumnsForeign=null] - La liste des colonnes (SQL) des clés étrangères
 * @param {boolean} [activeBoolean=null] - Boolean permettant d'ajouter un filtre sur le boolean "actif" de la table traitée
 * @returns La recherche complète après la fin du délai
 */
export function useDebouncedSearch(search, delay, table, arrayColumns, setData, setCurrentPage, arrayColumnsForeign = null, activeBoolean = null) {
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { blockMain, unblockMain, setNotification } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      const payload =activeBoolean === null ? 
      {
        table: table,
        columns: arrayColumns,
        columnsForeign: arrayColumnsForeign,
        search: search
      } : 
      {
        table: table,
        columns: arrayColumns,
        search: search,
        columnsForeign: arrayColumnsForeign,
        activeBoolean : activeBoolean
      }
      blockMain();
      axiosClient.post('/searchBar',payload).then(({ data }) => {
        setData(data.data);
        setCurrentPage(1);
        unblockMain();
      })
      .catch((err) => {
        blockMain();
        const response = err.response;
        if (response && response.status == 403) {
          navigate(-1);
          setNotification(response.data.message);
        }
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [search, delay]);

  return debouncedSearch;
}
export default useDebouncedSearch;
