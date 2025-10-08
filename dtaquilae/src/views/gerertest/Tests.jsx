import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { getLabels, getMessages } from "../../lang/langFunctions";
import axiosClient from "../../axios-client";
import { hasPermission } from "../../utils/accessControl";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { SelectButton } from "primereact/selectbutton";
import { Toast } from "primereact/toast";

/**
 * Composant pour afficher la page de consultation des tests avec trois onglets.
 */
const Tests = () => {
  const [tests, setTests] = useState([]);
  const { setNotification, blockMain, unblockMain } = useStateContext();
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Ajout de la gestion des onglets de statut
  const [valueSelect, setValueSelect] = useState("En cours");
  const optionsSelect = ["Terminé", "En cours", "À venir"];

  const toast = useRef(null);

  /**
   * Récupération des tests en fonction du statut sélectionné
   */
  const getTests = (status) => {
    blockMain();
    let endpoint = `/tests/status/encours`;
    if (status === "Terminé") endpoint = `/tests/status/terminer`;
    if (status === "À venir") endpoint = `/tests/status/avenir`;
  
    axiosClient
      .get(endpoint)
      .then(({ data }) => {
        unblockMain();
        setTests(data.data);
      })
      .catch(() => {
        unblockMain();
      });
  };

  /**
   * Appel à l'initialisation ou lors du changement de statut
   */
  useEffect(() => {
    getTests(valueSelect);
  }, [valueSelect]);

  /**
   * Gestion du changement de statut dans le SelectButton
   */
  const handleSelectChange = (event) => {
    setValueSelect(event.value);
  };

  const counterTestDatatableTemplate = (rowData) => {
    return <Checkbox checked={rowData.is_counter_test} disabled />;
  };

  /**
   * Affiche le dialogue pour modifier la date d'un test
   */
  const openEditDialog = (rowData) => {
    setSelectedTest(rowData);
    const datePartsDebut = rowData.debut.split("/"); // ex: ["20", "11", "2024"]
    const datePartsFin = rowData.fin.split("/");     // ex: ["26", "11", "2024"]
    const minDate = new Date(
      datePartsDebut[2],
      datePartsDebut[1] - 1,
      datePartsDebut[0]
    );
    const maxDate = new Date(
      datePartsFin[2],
      datePartsFin[1] - 1,
      datePartsFin[0]
    );

    setNewDate(new Date(rowData.date.split("/").reverse().join("-"))); // Conversion en Date
    setDialogVisible(true);

    // On conserve les limites pour le calendrier
    setSelectedTest({
      ...rowData,
      minDate,
      maxDate,
    });
  };

  /**
   * Sauvegarde de la nouvelle date du test
   */
  const saveNewDate = () => {
    if (!newDate) {
      toast.current.show({
        severity: "warn",
        summary: "Erreur",
        detail: "Veuillez sélectionner une date.",
      });
      return;
    }

    // Conversion de la date en UTC avant l'envoi
    const formattedDate = new Date(
      newDate.getTime() - newDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0]; // Format 'YYYY-MM-DD'

    axiosClient
      .put(`/tests/${selectedTest.id}`, { date: formattedDate })
      .then(() => {
        setNotification(getMessages("test.update.date.success"));
        setDialogVisible(false);
        getTests(valueSelect);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          // Gestion des erreurs de validation (si besoin)
        } else {
          setNotification(getMessages("test.update.date.error"));
        }
      });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text"
          tooltip="Modifier la date"
          onClick={() => openEditDialog(rowData)}
          tooltipOptions={{
            className: "text-sm",
            position: "top",
          }}
        />
      </>
    );
  };

  /**
   * Création de la page
   */
  return (
    <>
      <span className="title">{getLabels("tests.consult.title")}</span>
      <Toast ref={toast} />
      {/* Sélecteur d'onglets pour le statut */}
      <div className="my-2">
        <SelectButton
          value={valueSelect}
          options={optionsSelect}
          onChange={handleSelectChange}
        />
      </div>
      <div className="card">
        <DataTable
          value={tests}
          paginator
          rows={8}
          dataKey="id"
          selectionMode="single"
          emptyMessage={getLabels("common.table.noEntries")}
          stripedRows
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="{first} - {last} de {totalRecords}"
          onRowSelect={(event) => {
            if (hasPermission("test.search"))
              navigate(`/tests/${event.data.id}`);
          }}
        >
          <Column field="libelle" header={getLabels("tests.fields.libelle")} />
          <Column field="date" header={getLabels("tests.fields.date")} />
          <Column field="stage" header={getLabels("tests.fields.stage")} />
          <Column
            header={getLabels("tests.fields.is_counter_test")}
            body={counterTestDatatableTemplate}
          />
          <Column
            headerStyle={{ width: "5rem", textAlign: "center" }}
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
            body={actionBodyTemplate}
          />
        </DataTable>
      </div>
      <Dialog
        header="Modifier la date du test"
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        style={{ width: "20vw" }}
        footer={
          <div>
            <Button
              label="Annuler"
              icon="pi pi-times"
              className="text-blue-500 p-button-text"
              onClick={() => setDialogVisible(false)}
            />
            <Button
              label="Enregistrer"
              icon="pi pi-check"
              className="text-white bg-blue-500 p-button-text"
              onClick={saveNewDate}
            />
          </div>
        }
      >
        <div className="flex">
          <Calendar
            id="date"
            value={newDate}
            onChange={(e) => setNewDate(e.value)}
            dateFormat="dd/mm/yy"
            showIcon
            minDate={selectedTest?.minDate}
            maxDate={selectedTest?.maxDate}
          />
        </div>
      </Dialog>
    </>
  );
};

export default Tests;