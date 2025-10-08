import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
import { getLabels, getMessages } from "../../lang/langFunctions";
import ExportPDF from "../../views/users/ExportPDF";

/**
 * Méthode héritée du composant parent permettant de mettre à jour la liste (typiquement la méthode utilisée dans "useEffect")
 *
 * @callback getData
 */

/**
 * Méthode héritée du composant parent permettant la mise à jour de la page actuelle
 *
 * @callback setCurrentPage
 * @param {number} currentPage - La page actuelle
 */

/**
 * Retourne un tableau
 *
 * @param {Object[]} data - La liste des objets
 * @param {array} [headerLabels=[]] - La liste des headers
 * @param {array} attributesArray - La liste des attributs à afficher (en corrélation avec les noms des colonnes en base)
 * @param {string} api - Le nom du prefixe permettant d'accéder aux routes apis du modèle traité
 * @param {getData} getData - Méthode de mise à jour de la liste
 * @param {number} currentPage - La page actuelle
 * @param {setCurrentPage} setCurrentPage - Méthode de la mise à jour de la page actuelle
 * @param {boolean} [showId=false] - Indicateur permettant l'affichage de l'ID
 *  @param {boolean} [consultButton=false] - Indicateur permettant l'affichage du bouton de consultatation
 * @param {boolean} [deleteButton=false] - Indicateur permettant l'affichage du bouton de suppression
 * @param {boolean} [updateButton=false] - Indicateur permettant l'affichage du bouton de modification
 * @param {boolean} [selectButton=false] - Indicateur permettant l'affichage du bouton de selection d'un test
 * @returns Le composant
 */
const Table = ({
  data,
  headerLabels = [],
  attributesArray,
  api,
  getData,
  currentPage,
  setCurrentPage,
  showId = false,
  consultButton = false,
  activeButton = false,
  deleteButton = false,
  updateButton = false,
  selectButton = false,
}) => {
  const PAGE_SIZE = 10;
  const { setNotification } = useStateContext();

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, data]);

  /**
   * Suppression de l'objet après confirmation
   *
   * @param {Object} entry - L'entrée du tableau à supprimer
   * @returns Code HTTP 204 si réussite
   */
  const onDelete = (entry) => {
    if (!window.confirm(getMessages(`${api}.delete.confirmation`))) {
      return;
    }
    axiosClient.delete(`/${api}/${entry.id}`).then(() => {
      setNotification(getMessages(`${api}.delete.success`));
      getData();
    });
  };

  /** Activation de l'objet après confirmation
   *
   * @param {Object} entry - L'entrée du tableau à supprimer
   * @returns Code HTTP 204 si réussite
   */
  const onActive = (entry) => {
    if (!window.confirm(getMessages(`${api}.active.confirmation`))) {
      return;
    }
    axiosClient.put(`/${api}/activer/${entry.id}`).then(() => {
      setNotification(getMessages(`${api}.active.success`));
      getData();
    });
  };

  /**
   * Calcul le colspan nécessaire pour l'affichage du message en cas de liste vide
   *
   * @returns Le colspan
   */
  const getColspan = () => {
    let colspan =
    deleteButton || updateButton || activeButton || consultButton || selectButton ? 1 : 0;
    if (headerLabels.length > 0) colspan += headerLabels.length;
    return colspan;
  };

  return (
    <>
      <div className="card animate-fadeInDown">
        <table>
          <thead>
            <tr>
              {headerLabels.length > 0 &&
                headerLabels.map((header) => <th>{header}</th>)}
              {(deleteButton ||
                updateButton ||
                activeButton ||
                selectButton ||
                consultButton) && <th>{getLabels("common.table.actions")}</th>}
            </tr>
          </thead>
          <tbody>
            {currentTableData.length == 0 ? (
              <tr>
                <td colSpan={getColspan()} className="text-center">
                  {getLabels("common.table.noEntries")}
                </td>
              </tr>
            ) : (
              currentTableData.map((entry) => (
                <tr key={entry.id}>
                  {attributesArray.map((attribute) => (
                    <>
                      {attribute == "id" ? (
                        <>{showId && <td>{entry[attribute]}</td>}</>
                      ) : (
                        <td>
                          {typeof entry[attribute] == "boolean" ? (
                            <input
                              style={{ width: "35%" }}
                              type="checkbox"
                              checked={entry[attribute]}
                              disabled
                            ></input>
                          ) : (
                            entry[attribute]
                          )}
                        </td>
                      )}
                    </>
                  ))}
                  {(deleteButton ||
                    updateButton ||
                    activeButton ||
                    selectButton ||
                    consultButton) && (
                    <td>
                      {consultButton && (
                        <>
                          <Link
                            className="btn btn-edit"
                            to={`/${api}/${entry.id}`}
                          >
                            {getLabels("common.btn.consult")}
                          </Link>
                          &nbsp;
                        </>
                      )}
                      {updateButton && (
                        <>
                          <Link
                            className="btn btn-edit"
                            to={`/${api}/${entry.id}`}
                          >
                            {getLabels("common.btn.update")}
                          </Link>
                          &nbsp;
                        </>
                      )}
                      {deleteButton && (
                        <button
                          onClick={(ev) => onDelete(entry)}
                          className="btn btn-delete"
                        >
                          {getLabels("common.btn.delete")}
                        </button>
                      )}
                      {activeButton && (
                        <button
                          onClick={(ev) => onActive(entry)}
                          className="btn btn-active"
                        >
                          {getLabels("common.btn.active")}
                        </button>
                      )}
                      {selectButton && (
                        <Link
                          className="btn btn-select"
                          to={`/questionnaires/testStagiaire/${entry.id}`}
                        >
                          {getLabels("common.btn.select")}
                        </Link>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {currentTableData.length > 0 && (
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={data.length}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </>
  );
};

export default Table;
