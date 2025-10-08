import { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { getLabels } from "../../lang/langFunctions";
import axiosClient from "../../axios-client";
import { SelectButton } from "primereact/selectbutton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

const Stages = () => {
  const [stages, setStages] = useState([]);
  const [valueSelect, setValueSelect] = useState("En cours");
  const [filters, setFilters] = useState({
    libelle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    formation: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [selectedStage, setSelectedStage] = useState(null); // État pour la sélection
  const { blockMain, unblockMain } = useStateContext();
  const optionsSelect = ["Terminé", "En cours", "À venir"];
  const navigate = useNavigate();
  const toast = useRef(null);

  /**
   * Récupération des stages en fonction du statut sélectionné
   */
  const getStages = (status) => {
    blockMain();
    let endpoint = `/stages/encours`;
    if (status === "Terminé") endpoint = `/stages/terminer`;
    if (status === "À venir") endpoint = `/stages/avenir`;

    axiosClient
      .get(endpoint)
      .then(({ data }) => {
        unblockMain();
        setStages(data.data);
      })
      .catch(() => {
        unblockMain();
      });
  };

  useEffect(() => {
    getStages(valueSelect);
  }, [valueSelect]);

  /**
   * Action sur le changement de statut
   */
  const handleSelectChange = (event) => {
    setValueSelect(event.value);
  };

  /**
   * Gestion de la sélection d'une ligne
   */
  const onRowSelect = (event) => {
    if (event.data && event.data.id) {
      navigate(`/stages/${event.data.id}`);
    }
  };

  /**
   * Création de la page
   */
  return (
    <>
      <span className="title">{getLabels("stage.consult.title")}</span>
      <Toast ref={toast} />
      <div className="my-2">
        <SelectButton
          value={valueSelect}
          options={optionsSelect}
          onChange={handleSelectChange}
        />
      </div>
      <DataTable
        value={stages}
        paginator
        rows={8}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        selectionMode="single" // Activer la sélection
        selection={selectedStage}
        onSelectionChange={(e) => setSelectedStage(e.value)} // Mettre à jour l'état de sélection
        onRowSelect={onRowSelect} // Gérer la navigation lors de la sélection
        emptyMessage={getLabels("common.table.noEntries")}
        tableStyle={{ borderRadius: "10px" }}
        stripedRows
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="{first} - {last} de {totalRecords}"
      >
        <Column
          field="libelle"
          header={getLabels("stage.fields.libelle")}
          filter
          filterPlaceholder="Rechercher par nom"
          showFilterMenu={false}
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="debut_table"
          header={getLabels("stage.fields.dateDebut")}
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="fin_table"
          header={getLabels("stage.fields.dateFin")}
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="formation"
          header={getLabels("stage.fields.formation")}
          filter
          filterPlaceholder="Rechercher par formation"
          showFilterMenu={false}
          style={{ minWidth: "12rem" }}
        />
      </DataTable>
    </>
  );
};

export default Stages;
