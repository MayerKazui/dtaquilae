import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import Table from "../../components/PDF/Table/Table";
import { getMessages } from "../../lang/langFunctions";
import { saveAs } from "file-saver";

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  cell: {
    borderColor: "#b70000",
  },
  header: {
    borderColor: "black",
  },
});

/**
 * Préparation de l'export en PDF des utilisateurs
 *
 * @param {Object[]} users - La liste des utilisateurs à exporter
 * @returns Le tableau (PDF) des utilisateurs
 */
const ExportPDF = async ({ users }) => {
  // Construction du tableau
  const blob = await pdf(
    <Document>
      {/*Afficher une seule page*/}
      <Page size="A4" style={styles.page} wrap>
        {users.length > 0 ? (
          <Table
            data={users}
            cellStyle={styles.cell}
            headerStyle={styles.header}
          />
        ) : (
          <View style={styles.section}>
            <Text>{getMessages("users.pdf.error")}</Text>
          </View>
        )}
      </Page>
    </Document>
  ).toBlob();

  saveAs(blob, "users-export.pdf");
};

export default ExportPDF;
