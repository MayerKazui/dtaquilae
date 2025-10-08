import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
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
const ExportPDFCreateUser = async ({ nom, prenom, login, password }) => {
  let pdfName = `${nom}-${prenom}.pdf`;
  // Construction du tableau
  const blob = await pdf(
    <Document>
      {/*Afficher une seule page*/}
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.section}>
          <Text>{`Login : ${login}`}</Text>
          <Text>{`Mot de passe : ${password}`}</Text>
        </View>
      </Page>
    </Document>
  ).toBlob();

  saveAs(blob, pdfName);
};

export default ExportPDFCreateUser;
