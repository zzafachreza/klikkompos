import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { MyButton, MyHeader } from '../../components';
import { colors, fonts } from '../../utils';
import { Table, Row, Rows } from 'react-native-table-component';

export default function KalkulatorKompos({ navigation }) {
  const tableHead = ['Bahan', 'Komposisi', 'Berat %'];

  // Initial state for inputs
  const [komposisi, setKomposisi] = useState({
    'Kotoran Sapi': '',
    'Eceng Gondok': '',
    'Sekam Padi': '',
    'Abu Sekam Padi': '',
    'Dedak': '',
    'Kotoran Ayam': '',
  });

  const [berat, setBerat] = useState({
    'Kotoran Sapi': '',
    'Eceng Gondok': '',
    'Sekam Padi': '',
    'Abu Sekam Padi': '',
    'Dedak': '',
    'Kotoran Ayam': '',
  });

  // Set initial value for C/N Ratio and Kelembapan to 0
  const [cnRatio, setCnRatio] = useState(0);
  const [kelembapan, setKelembapan] = useState(0);

  // Data for Carbon and Nitrogen content and Density
  const data = {
    'Kotoran Sapi': { C: 45.6, N: 2.4, Water: 19.0, Density: 1458 },
    'Eceng Gondok': { C: 29.5, N: 1.18, Water: 7.0, Density: 405 },
    'Sekam Padi': { C: 36.0, N: 0.3, Water: 86.0, Density: 202 },
    'Abu Sekam Padi': { C: 4.0, N: 0.18, Water: 85.0, Density: 150 },
    'Dedak': { C: 6.12, N: 0.605, Water: 91.02, Density: 590 },
    'Kotoran Ayam': { C: 30.0, N: 3.0, Water: 15.0, Density: 864 }
  };

  // Handle calculation
  const calculate = () => {
    let totalC = 0;
    let totalN = 0;
    let totalWater = 0;

    // Make sure all fields are filled
    for (let key in komposisi) {
      if (!komposisi[key]) {
        Alert.alert("Error", "Semua kolom komposisi harus diisi!");
        return;
      }
    }

    // Calculate weight percentage and C/N ratio
    let beratTotal = 0;

    Object.keys(komposisi).forEach((bahan) => {
      const komposisiBahan = parseFloat(komposisi[bahan]);
      const { C, N, Water, Density } = data[bahan];

      // Calculate the weight percentage using Density
      const beratBahan = Density * komposisiBahan;
      setBerat(prevState => ({ ...prevState, [bahan]: Math.round(beratBahan) }));

      totalC += C * komposisiBahan;
      totalN += N * komposisiBahan;
      totalWater += Water * komposisiBahan;
      beratTotal += beratBahan;
    });

    const cnRatioResult = Math.round(totalC / totalN);
    const kelembapanResult = Math.round((totalWater / beratTotal) * 100);

    // Update the results
    setCnRatio(cnRatioResult);
    setKelembapan(kelembapanResult);
  };

  const tableData = Object.keys(komposisi).map((bahan) => [
    bahan,
    <TextInput
      style={styles.input}
      value={komposisi[bahan].toString()}
      onChangeText={(value) => setKomposisi({ ...komposisi, [bahan]: value })}
      placeholder="..."
    />,
   <View style={{
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    width: "80%",
    height: 45,
    alignItems: "center",
    left: 10
   }}>
   <Text style={{ textAlign: 'center', fontFamily:fonts.primary[800], color:colors.coklat}}>{berat[bahan] || '0'}</Text>
   </View>
  ]);

  // Check if C/N Ratio or Kelembapan is within target range
  const cnRatioBackgroundColor = cnRatio === 0 ? colors.secondary : (cnRatio < 20 || cnRatio > 40 ? colors.kuning : colors.secondary);
  const kelembapanBackgroundColor = kelembapan === 0 ? colors.secondary : (kelembapan < 40 || kelembapan > 65 ? colors.kuning : colors.secondary);

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader title="Kalkulator Kompos" />
      <ScrollView>
        <View style={{ padding: 10 }}>
         <View style={{ padding: 10 }}>
         <Table borderStyle={{ borderWidth: 1, borderColor: colors.coklat }}>
            {/* Header */}
            <Row data={tableHead} style={styles.header} textStyle={styles.headerText} />
            {/* Data Rows */}
            <Rows data={tableData} style={styles.row} textStyle={styles.text} />
          </Table>

            <View style={{ padding: 20 }}>
              <MyButton title="Hitung" colorText={colors.white} onPress={calculate} />
            </View>
         </View>

         <View>
           <View style={{ marginTop: 20, padding: 20 }}>
                  <Text style={styles.resultTitle}>Hasil C/N Ratio :</Text>
                  <Text style={styles.resultSubtitle}>(Target 20 - 40)</Text>
                  {/* Hasil C/N Ratio */}
                  <View style={[styles.resultBox, { backgroundColor: cnRatioBackgroundColor }]}>
                      <Text style={styles.resultText}>{cnRatio}</Text>
                  </View>
           </View>

           <View style={{ marginTop: 5, padding: 20 }}>
                  <Text style={styles.resultTitle}>Hasil Kelembapan :</Text>
                  <Text style={styles.resultSubtitle}>(Target 40 - 65)</Text>
                  {/* Hasil Kelembapan */}
                  <View style={[styles.resultBox, { backgroundColor: kelembapanBackgroundColor }]}>
                      <Text style={styles.resultText}>{kelembapan}</Text>
                  </View>
           </View>
         </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
  },
  header: {
    height: 60,
    backgroundColor: colors.tertiary,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.coklat,
    textAlign: 'center',
  },
  row: {
    height: 60,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: colors.coklat,
    textAlign: 'center',
    padding: 10,
  },
  input: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 16,
    color: colors.coklat,
    height: 45,
    width: '80%',
    left: 10,
    fontFamily:fonts.primary[800]
  },
  resultTitle: {
    fontFamily: fonts.primary[400],
    fontSize: 25,
    color: colors.coklat,
  },
  resultSubtitle: {
    fontFamily: fonts.primary[400],
    fontSize: 15,
    color: colors.coklat,
  },
  resultBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    width: 211,
    marginTop: 20,
  },
  resultText: {
    textAlign: 'center',
    fontFamily: fonts.primary[800],
    fontSize: 20,
    color: colors.coklat,
  },
});
