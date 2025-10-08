import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios-client";
import Table from "../../components/table/Table";

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { blockMain, unblockMain } = useStateContext();

  /**
   * Récupération des tests
   */
  const getTests = () => {
    blockMain();
    axiosClient
      .get(`/tests/getTests`)
      .then(({ data }) => {
        unblockMain();
        // Filtrer les tests avec is_conforme = true
        const filteredTests = data.data.filter(test => test.is_conforme === true);
        setTests(filteredTests);
      })
      .catch(() => {
        unblockMain();
      });
  };

  /**
   * Initialisation des données nécessaires
   */
  useEffect(() => {
    getTests();
  }, []);

  // Les labels des colonnes
  const headerLabels = ["Libellé"];

  // Les attributs des objets de test à afficher dans le tableau
  const attributesArray = ["libelle"];

  /**
   * Création de la page
   */
  return (
    <div>
      <h1>Tests</h1>
      {tests.length > 0 ? (
        <Table
          data={tests}
          headerLabels={headerLabels}
          attributesArray={attributesArray}
          api="tests"
          getData={getTests}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          selectButton={true}
        />
      ) : (
        <p>Aucun test trouvé</p>
      )}
    </div>
  );
};

export default Dashboard;
