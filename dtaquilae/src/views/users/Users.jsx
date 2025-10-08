import { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { getLabels, getMessages } from "../../lang/langFunctions";
import axiosClient from "../../axios-client";
import { SelectButton } from "primereact/selectbutton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { hasPermission } from "../../utils/accessControl";

/**
 * Construction du composant permettant d'afficher la page de consultation des utilisateurs
 *
 * @returns La page des utilisateurs
 */
const Users = () => {
  const [users, setUsers] = useState([]);
  const [tabType, setTabType] = useState(1);
  const [showButtonTab, setShowButtonTab] = useState(true);
  const { blockMain, unblockMain } = useStateContext();
  const optionsSelect = ["Actifs", "Archivés"];
  const [valueSelect, setValueSelect] = useState(optionsSelect[0]);
  const navigate = useNavigate();
  const toast = useRef(null);
  const [filters] = useState({
    matricule: { value: null, matchMode: FilterMatchMode.CONTAINS },
    numeroAlliance: { value: null, matchMode: FilterMatchMode.CONTAINS },
    grade_abrege: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nom: { value: null, matchMode: FilterMatchMode.CONTAINS },
    prenom: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role_libelle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  /**
   * Récupération des utilisateurs
   */
  const getUsers = () => {
    blockMain();

    axiosClient
      .get(`/users/actif/${tabType}`)
      .then(({ data }) => {
        unblockMain();
        setUsers(data.data);
      })
      .catch(() => {
        blockMain();
      });
  };

  /**
   * Initialisation des données nécessaires
   */
  useEffect(() => {
    getUsers();
  }, [tabType]);

  const archiver = (rowData) => {
    axiosClient.delete(`/users/${rowData.id}`).then(() => {
      toast.current.show({
        severity: "info",
        summary: "Succès",
        detail: getMessages("users.delete.success"),
      });
      getUsers();
    });
  };

  const desarchiver = (rowData) => {
    axiosClient.put(`/users/activer/${rowData.id}`).then(() => {
      toast.current.show({
        severity: "info",
        summary: "Succès",
        detail: getMessages("users.active.success"),
      });
      getUsers();
    });
  };

  /**
   * Action sur l'evenement changement de type de table (actif ou supp)
   */
  const handleTypeTab = (event) => {
    if (event.target.value == "Actifs") {
      setShowButtonTab(true);
      setTabType(1);
    } else {
      setShowButtonTab(false);
      setTabType(0);
    }
    setValueSelect(event.target.value);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        {hasPermission("user.delete") && (
          <>
            {showButtonTab ? (
              <>
                <Button
                  type="button"
                  icon="pi pi-trash"
                  tooltip="Archiver"
                  tooltipOptions={{
                    className: "text-sm",
                    position: "top",
                  }}
                  style={{ padding: "0", margin: "0" }}
                  rounded
                  onClick={() => archiver(rowData)}
                />
              </>
            ) : (
              <>
                <Button
                  type="button"
                  icon="pi pi-replay"
                  tooltip="Désarchiver"
                  tooltipOptions={{
                    className: "text-sm",
                    position: "top",
                  }}
                  style={{ padding: "0", margin: "0" }}
                  rounded
                  onClick={() => desarchiver(rowData)}
                />
              </>
            )}
          </>
        )}
      </>
    );
  };

  /**
   * Création de la page
   */
  return (
    <>
      <span className="title">{getLabels("users.consult.title")}</span>
      <Toast ref={toast} />
      <div className="my-4">
        <SelectButton
          value={valueSelect}
          options={optionsSelect}
          onChange={handleTypeTab}
        />
      </div>

      <DataTable
        value={users}
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
        onRowSelect={(event) => {
          if (hasPermission("user.consult"))
            navigate(`/users/${event.data.id}`);
        }}
      >
        <Column
          field="matricule"
          header={getLabels("users.fields.matricule")}
          filter
          filterPlaceholder="Matricule"
          showFilterMenu={false}
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="numeroAlliance"
          header={getLabels("users.fields.numeroAlliance")}
          filter
          filterPlaceholder="Numéro alliance"
          showFilterMenu={false}
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="grade_abrege"
          header={getLabels("users.fields.grade")}
          filter
          filterPlaceholder="Grade"
          showFilterMenu={false}
          style={{ maxWidth: "14rem" }}
        />
        <Column
          field="nom"
          header={getLabels("users.fields.nom")}
          filter
          filterPlaceholder="Nom"
          showFilterMenu={false}
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="prenom"
          header={getLabels("users.fields.prenom")}
          filter
          filterPlaceholder="Prénom"
          showFilterMenu={false}
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="role_libelle"
          header={getLabels("users.fields.role")}
          filter
          filterPlaceholder="Rôle"
          showFilterMenu={false}
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="login"
          header={getLabels("users.fields.login")}
          style={{ minWidth: "12rem" }}
        />
        <Column
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionBodyTemplate}
        />
      </DataTable>
    </>
  );
};

export default Users;
