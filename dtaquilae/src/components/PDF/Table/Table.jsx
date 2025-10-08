import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

/**
 * Style par défaut d'un table
 *
 * ! Le "width" doit être changé par 100% divisé par le nombre d'attribut, sinon risque de dépassement de la feuille
 * ! Par conséquent la taille de la police est à revoir
 */
const styles = StyleSheet.create({
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    display: "flex",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  tableCol: {
    width: "25%",
    display: "flex",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
});

// TODO : Expliquer la différence entre les différentes façon de construire un composant
/**
 * - const Component = () => ()
 * - const Component = () => {return}
 * - function () {return}
 */
// TODO : Expliquer la différence entre : (props) et ({attribute1, attribute2})

/**
 * Création d'une ligne du table ne pouvant être coupée par une nouvelle page
 *
 * @param {*} children L'ensemble des cellules composant la ligne du table
 * @returns Un ligne du table
 */
const TableRow = ({ children }) => (
  <View style={styles.tableRow} wrap={false}>
    {children}
  </View>
);

/**
 * Création d'une cellule du header
 *
 * @param {*} children Le label de la cellule du header
 * @param {Object} headerStyle Présent uniquement si un style particulier est appliqué à la cellule
 * @returns Une cellule du header
 */
const TableHeaderCell = ({ children, headerStyle }) => {
  let headerStyles = [];
  {
    Object.keys(headerStyle).length > 0
      ? headerStyles.push(styles.tableColHeader, headerStyle)
      : headerStyles.push(styles.tableColHeader);
  }
  return (
    <View style={headerStyles}>
      <Text>{children}</Text>
    </View>
  );
};

/**
 * Création d'une cellule du table
 *
 * @param {*} children Le label de la cellule
 * @param {Object} cellStyle Présent uniquement si un style particulier est appliqué à la cellule
 * @returns Une cellule
 */
const TableCell = ({ children, cellStyle }) => {
  let cellStyles = [];
  {
    Object.keys(cellStyle).length > 0
      ? cellStyles.push(styles.tableCol, cellStyle)
      : cellStyles.push(styles.tableCol);
  }
  return (
    <View style={cellStyles}>
      <Text>{children}</Text>
    </View>
  );
};

/**
 *
 * @param {Array} data Liste des datas à faire apparaître dans le tableau
 * @param {Object} tableStyle Présent uniquement si un style particulier doit être appliqué au table
 * @param {Object} headerStyle Présent uniquement si un style particulier doit être appliqué au headere
 * @param {Object} cellStyle Présent uniquement si un style particulier doit être appliqué aux cellules du table
 * @returns
 */
const Table = ({ data, tableStyle = {}, headerStyle = {}, cellStyle = {} }) => {
  let tableStyles = [];

  {
    Object.keys(tableStyle).length > 0
      ? tableStyles.push(styles.table, tableStyle)
      : tableStyles.push(styles.table);
  }

  return (
    <View style={tableStyles}>
      <TableRow>
        {/* Itération sur les clés du premier objet pour former le header via les attributs */}
        {Object.keys(data[0]).map((key) => (
          <TableHeaderCell key={key} headerStyle={headerStyle}>
            {key}
          </TableHeaderCell>
        ))}
      </TableRow>
      {/* Itération sur chaque élément en séparant l'objet de l'index */}
      {data.map((row, rowIndex) => (
        <TableRow key={`row-${rowIndex}`}>
          {/* Itération sur chaque objet en séparant la valeur et l'index de l'attribut afin d'obtenir un id suivant : cell-indexObjet-indexAttribut */}
          {Object.values(row).map((cell, cellIndex) => (
            <TableCell
              key={`cell-${rowIndex}-${cellIndex}`}
              cellStyle={cellStyle}
            >
              {cell}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </View>
  );
};

export default Table;
