import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { getLabels } from "../../lang/langFunctions";
import axiosClient from "../../axios-client";
import { hasPermission } from "../../utils/accessControl";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { MultiSelect } from "primereact/multiselect";
/**
 * Construction du composant permettant d'afficher la page de consultation des questions
 *
 * @returns La page des questions
 */
const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const { blockMain, unblockMain } = useStateContext();
  const toast = useRef(null);
  const navigate = useNavigate();
  const [arrayNbUtilisations, setArrayNbUtilisations] = useState([]);
  const [statuts] = useState([
    "Validée",
    "À valider",
    "À vérifier",
    "Vigilance",
    "Vigilance vérifiée",
    "Archivée",
    "Refusée",
  ]);
  const [filters] = useState({
    numero_question: { value: null, matchMode: FilterMatchMode.CONTAINS },
    reference_documentaire: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    statut: { value: null, matchMode: FilterMatchMode.CONTAINS },
    niveau: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nb_utilisation: { value: null, matchMode: FilterMatchMode.EQUALS },
    date_validation: {value: null, matchMode: FilterMatchMode.CONTAINS}
  });
  /**
   * Récupération des questions
   */
  const getQuestions = () => {
    blockMain();
    axiosClient.get("/questions").then(({ data }) => {
      unblockMain();
      setQuestions(data.data);
      setArrayNbUtilisations(data.data[0].nb_max_utilisation);
    });
  };

  /**
   * Initialisation des données nécessaires
   */
  useEffect(() => {
    getQuestions();
  }, []);

  /**
   * Retourne le niveau de sévérité pour les composants "Tag" en fonction du statut
   *
   * @param {string} status - Le statut
   * @returns Le niveau de sévérité
   */
  const getSeverity = (status) => {
    switch (status) {
      case "Vigilance":
        return "danger";
      case "Vigilance vérifiée":
        return "warning";
      case "Validée":
        return "success";
      case "À vérifier":
        return "info";
      case "À valider":
        return "primary";
    }
  };

  /**
   * Retourne un composant Tag avec le statut
   *
   * @param {object} option - Un objet contant la valeur du statut
   * @returns Le composant Tag avec le niveau de sévérité correspondant pour le statut
   */
  const statusItemTemplate = (option) => {
    if (option == "Archivée")
      return <Tag value={option} className="bg-gray-700" />;
    if (option == "Refusée")
      return <Tag value={option} className="bg-gray-800" />;

    return <Tag value={option} severity={getSeverity(option)} />;
  };

  /**
   * Construction du composant Dropdown pour le filtrage des statuts sur le tableau
   *
   * @param {object} option - Un objet contenant la valeur du statut
   * @returns Le composant de filtrage Dropdown
   */
  const statusRowFilterTemplate = (option) => {
    return (
      <Dropdown
        value={option.value}
        options={statuts}
        onChange={(e) => option.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Choisissez"
        className="p-column-filter"
        showClear
        style={{
          minWidth: "12rem",
          marginBottom: "1rem",
          minHeight: "3rem",
          padding: "0.25rem",
        }}
      />
    );
  };

  const statusBodyTemplate = (rowData) => {
    if (rowData.statut == "Archivée")
      return <Tag value={rowData.statut} className="bg-gray-700" />;
    if (rowData.statut == "Refusée")
      return <Tag value={rowData.statut} className="bg-gray-800" />;
    return (
      <Tag value={rowData.statut} severity={getSeverity(rowData.statut)} />
    );
  };

  const utilisationRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={arrayNbUtilisations}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Choisissez"
        className="p-column-filter"
        showClear
        style={{
          minWidth: "12rem",
          marginBottom: "1rem",
          minHeight: "3rem",
          padding: "0.25rem",
        }}
      />
    );
  };

  /**
   * Construction des boutons d'actions pour la ligne en cours de traitement
   *
   * @param {object} rowData - L'objet contenant toutes les informations de la ligne traitée
   * @returns Les différents boutons d'actions disponible pour la ligne (consultation, archivage, réactivation)
   */
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.statut == "Archivée" ? (
          <>
            {/** Réactivation */}
            <Button
              type="button"
              icon="pi pi-replay"
              tooltip="Activer"
              tooltipOptions={{
                className: "text-sm",
                position: "top",
              }}
              style={{ padding: "0", margin: "0" }}
              rounded
              onClick={() => reactivationQuestion(rowData)}
              visible={hasPermission("question.delete")}
            />
          </>
        ) : (
          <>
            {/** Archivage */}
            <Button
              type="button"
              icon="pi pi-trash"
              tooltip="Archiver"
              tooltipOptions={{
                className: "text-sm",
                position: "top",
              }}
              rounded
              style={{ padding: "0", margin: "0" }}
              onClick={() => confirmArchive(rowData)}
              visible={
                hasPermission("question.delete") &&
                rowData.statut != "Vigilance" &&
                rowData.statut != "Vigilance vérifiée" &&
                rowData.statut != "Refusée"
              }
            />
          </>
        )}
      </>
    );
  };

  /**
   * Traitement de l'archivage après acceptation, de la question en cours de traitement
   *
   * @param {object} rowData - Objet contenant toutes les informations de la ligne traitée
   */
  const acceptArchive = (rowData) => {
    axiosClient
      .delete(`/questions/${rowData.id}`)
      .then(() => {
        showToast(
          "info",
          "Succès",
          `La question ${rowData.numero_question} a bien été archivée.`
        );
        getQuestions();
      })
      .catch((e) => {
        showToast(
          "error",
          "Echec",
          `L'archivage de la question ${rowData.numero_question} a échoué. Contactez un administrateur avec le code erreur suivant : ${e}`,
          20000
        );
      });
  };

  const reactivationQuestion = (rowData) => {
    axiosClient
      .put(`/questions/desarchiver/${rowData.id}`)
      .then(() => {
        showToast(
          "info",
          "Succès",
          `La question ${rowData.numero_question} a bien été désarchivée.`
        );
        getQuestions();
      })
      .catch((e) => {
        showToast(
          "error",
          "Echec",
          `La désarchivation de la question ${rowData.numero_question} a échoué. Contactez un administrateur avec le code erreur suivant : ${e}`,
          20000
        );
      });
  };

  /**
   * Permet l'affichage du composant Toast pour diffuser des messages à l'utilisateur
   *
   * @param {string} severity - Niveau de sévérité du message
   * @param {string} summary - En-tête du message
   * @param {string} detail - Détail du message
   * @param {number} [life=3000] - Durée de vie du message (par défaut 3000 ms)
   */
  const showToast = (severity, summary, detail, life = 3000) => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: life,
    });
  };

  /**
   * Construction du composant ConfirmDialog pour l'archivage d'une question
   *
   * @param {object} rowData - Object contenant toutes les informations de la ligne traitée
   */
  const confirmArchive = (rowData) => {
    confirmDialog({
      message: "Êtes-vous sûr de vouloir archiver cette question ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => acceptArchive(rowData),
      acceptClassName: "bg-blue-500 text-white m-2 p-3",
      rejectClassName: "text-blue-500 m-2 p-3",
      acceptLabel: "Archiver",
      rejectLabel: "Annuler",
    });
  };
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Si la date est null ou undefined
    const date = new Date(dateString); // Convertir la chaîne en objet Date
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2); // Année sur deux chiffres
    return `${day}/${month}/${year}`; // Retourne le format JJ/MM/AA
  };

  /**
   * Création de la page
   */
  return (
    <>
      <span className="title">{getLabels("questions.consult.title")}</span>
      <Toast ref={toast} position="bottom-right" />
      {hasPermission("question.search") && (
        <>
          <ConfirmDialog />
          <div className="card">
            <DataTable
              value={questions}
              paginator
              rows={8}
              dataKey="id"
              filters={filters}
              filterDisplay="row"
              selectionMode="single"
              emptyMessage={getLabels("common.table.noEntries")}
              tableStyle={{ borderRadius: "10px" }}
              stripedRows
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
              currentPageReportTemplate="{first} - {last} de {totalRecords}"
              onRowSelect={(event) => navigate(`/questions/${event.data.id}`)}
            >
              <Column
                field="numero_question"
                header={getLabels("questions.fields.numero_question")}
                filter
                filterPlaceholder="N° question"
                showFilterMenu={false}
                style={{ minWidth: "12rem" }}
              />
              <Column
                field="reference_documentaire"
                header={getLabels("questions.fields.reference_documentaire")}
                filter
                filterPlaceholder="Référence documentaire"
                showFilterMenu={false}
                style={{ minWidth: "12rem" }}
              />
              <Column
                field="statut"
                header={getLabels("questions.fields.statut")}
                filter
                showFilterMenu={false}
                body={statusBodyTemplate}
                filterElement={statusRowFilterTemplate}
                filterMenuStyle={{ width: "14rem" }}
                style={{ minWidth: "12rem" }}
              />
              Z
              <Column
                field="niveau"
                header={getLabels("questions.fields.niveau")}
                filter
                filterPlaceholder="Niveau"
                showFilterMenu={false}
                style={{ minWidth: "12rem" }}
              />
              <Column
                field="nb_utilisation"
                header={getLabels("questions.fields.nb_utilisation")}
                filter
                filterPlaceholder="Utilisation"
                filterElement={utilisationRowFilterTemplate}
                filterMenuStyle={{ width: "14rem" }}
                showFilterMenu={false}
                style={{ minWidth: "12rem" }}
              />
              <Column
                field="date_validation"
                header={getLabels("questions.fields.date_validation")}
                filter
                filterPlaceholder="Date validation"
                showFilterMenu={false}
                style={{ minWidth: "12rem" }}
              />
              <Column
                headerStyle={{ width: "5rem", textAlign: "center" }}
                bodyStyle={{ textAlign: "center", overflow: "visible" }}
                body={actionBodyTemplate}
              />
            </DataTable>
          </div>
        </>
      )}
    </>
  );
};

export default Questions;
