import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { getLabels } from "../../lang/langFunctions";
import axiosClient from "../../axios-client";
import { hasPermission } from "../../utils/accessControl";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SelectButton } from "primereact/selectbutton";
import { FilterMatchMode } from "primereact/api";

const Questionnaires = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const { blockMain, unblockMain } = useStateContext();
  const navigate = useNavigate();

  // Etat pour la sélection du statut
  const [valueSelect, setValueSelect] = useState("En cours");
  const optionsSelect = ["En cours", "Archivés"];

  /**
   * Récupération des questionnaires en fonction du statut sélectionné.
   *
   * Pour les questionnaires archivés, on retourne ceux qui possèdent au moins
   * un test lié terminé.
   */
  const getQuestionnaires = (status) => {
    blockMain();
    let endpoint = `/questionnaires/enCours`;
    if (status === "Archivés") {
      endpoint = `/questionnaires/archiver`;
    }
    axiosClient
      .get(endpoint)
      .then(({ data }) => {
        unblockMain();
        setQuestionnaires(data.data);
      })
      .catch(() => {
        unblockMain();
      });
  };

  useEffect(() => {
    getQuestionnaires(valueSelect);
  }, [valueSelect]);

  const handleSelectChange = (e) => {
    setValueSelect(e.value);
  };

  const [filters] = useState({
    date: {value: null, matchMode: FilterMatchMode.CONTAINS},
    nom: {value: null, matchMode: FilterMatchMode.CONTAINS}
  });

  return (
    <>
      <div className="heading">
        <span className="title">
          {getLabels("questionnaire.consult.title")}
        </span>
      </div>
      {/* Onglets pour changer de statut */}
      <div className="my-2">
        <SelectButton
          value={valueSelect}
          options={optionsSelect}
          onChange={handleSelectChange}
        />
      </div>
      <DataTable
        value={questionnaires}
        paginator
        rows={8}
        dataKey="id"
        selectionMode="single"
        filters={filters}
        filterDisplay="row"
        sortField="date"       // Champ utilisé pour le tri
        sortOrder={1}         // Tri croissant
        emptyMessage={getLabels("common.table.noEntries")}
        stripedRows
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="{first} - {last} de {totalRecords}"
        onRowSelect={(event) => {
          if (hasPermission("questionnaire.consult"))
            navigate(`/questionnaires/${event.data.id}`);
        }}
      >
        <Column
          field="date"
          header={getLabels("questionnaire.fields.date")}
          filter
          filterPlaceholder="date"
          showFilterMenu={false}
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="nom"
          filter
          filterPlaceholder="nom"
          showFilterMenu={false}
          header={getLabels("questionnaire.fields.nom")}
          style={{ minWidth: "12rem" }}
        />
      </DataTable>
    </>
  );
};

export default Questionnaires;
