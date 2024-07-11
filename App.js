import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function App() {
  // State tanımlamaları
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [neck, setNeck] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('BMH');
  const [isMaleChecked, setMaleChecked] = useState(false);
  const [isFemaleChecked, setFemaleChecked] = useState(false);
  const [result, setResult] = useState('');
  const [isBMH, setIsBMH] = useState(true);


  
  // Vücut yağ oranı hesaplama fonksiyonu
  const calculateBodyFat = () => {
    const waistNum = parseFloat(waist);
    const neckNum = parseFloat(neck);
    const heightNum = parseFloat(height);
    const hipNum = parseFloat(hip);

    let bodyFatPercentage;
    if (isMaleChecked) {
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistNum - neckNum) + 0.15456 * Math.log10(heightNum)) - 450;
    } else {
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistNum + hipNum - neckNum) + 0.22100 * Math.log10(heightNum)) - 450;
    }

    const evaluation = evaluateBodyFat(bodyFatPercentage);
    setResult(`Yağ Oranı: ${bodyFatPercentage.toFixed(2)}%\n${evaluation}`);
  };

  // Vücut yağ oranı değerlendirme fonksiyonu
  const evaluateBodyFat = (bodyFatPercentage) => {
    if (isMaleChecked) {
      if (bodyFatPercentage >= 2 && bodyFatPercentage <= 14) {
        return 'Yaşam için gerekli yağ oranında.';
      } else if (bodyFatPercentage >= 6 && bodyFatPercentage <= 13) {
        return 'Sporcularda uygun yağ oranında.';
      } else if (bodyFatPercentage >= 14 && bodyFatPercentage <= 17) {
        return 'Formda kalmak isteyenler için uygun yağ oranında.';
      } else if (bodyFatPercentage >= 18 && bodyFatPercentage <= 24) {
        return 'Kabul edilebilir yağ oranında.';
      } else if (bodyFatPercentage >= 25 && bodyFatPercentage <= 37) {
        return 'Fazla kilolu olarak değerlendirilmektedir.';
      } else if (bodyFatPercentage >= 38) {
        return 'Obezite rahatsızlığına işaret eder.';
      }
    } else {
      if (bodyFatPercentage >= 10 && bodyFatPercentage <= 12) {
        return 'Yaşam için gerekli yağ oranında.';
      } else if (bodyFatPercentage >= 14 && bodyFatPercentage <= 20) {
        return 'Sporcularda uygun yağ oranında.';
      } else if (bodyFatPercentage >= 21 && bodyFatPercentage <= 24) {
        return 'Formda kalmak isteyenler için uygun yağ oranında.';
      } else if (bodyFatPercentage >= 25 && bodyFatPercentage <= 31) {
        return 'Kabul edilebilir yağ oranında.';
      } else if (bodyFatPercentage >= 32 && bodyFatPercentage <= 41) {
        return 'Fazla kilolu olarak değerlendirilmektedir.';
      } else if (bodyFatPercentage >= 42) {
        return 'Obezite rahatsızlığına işaret eder.';
      }
    }

    return '';
  };

  // Hesaplama ekranı türünü değiştirme fonksiyonu
  const handleButtonPress = (metric) => {
    setSelectedMetric(metric);
    setIsBMH(metric === 'BMH');
    setHeight('');
    setWeight('');
    setAge('');
    setWaist('');
    setHip('');
    setNeck('');
    setMaleChecked(false);
    setFemaleChecked(false);
    setResult('');
  };

  // Erkek cinsiyet seçimini işleme fonksiyonu
  const handleMaleChange = () => {
    setMaleChecked(true);
    setFemaleChecked(false);
  };

  // Kadın cinsiyet seçimini işleme fonksiyonu
  const handleFemaleChange = () => {
    setMaleChecked(false);
    setFemaleChecked(true);
  };

  // BMI hesaplama fonksiyonu
  const calculateBMI = (weight, height) => {
    const bmi = weight / ((height / 100) ** 2);
    let category = '';
    if (bmi < 18.5) {
      category = 'İdeal kilonun altında';
    } else if (bmi < 24.9) {
      category = 'İdeal kiloda';
    } else if (bmi < 29.9) {
      category = 'İdeal kilonun üstünde';
    } else if (bmi < 39.9) {
      category = 'İdeal kilonun çok üstünde (obez)';
    } else {
      category = 'İdeal kilonun çok üstünde (morbid obez)';
    }
    return { bmi: bmi.toFixed(2), category };
  };

  // Hesaplama butonuna tıklama işlemleri
  const handleCalculate = () => {
    if (!height || !weight || (!isMaleChecked && !isFemaleChecked)) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun ve cinsiyet seçiminizi yapın.');
      return;
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(heightNum) || isNaN(weightNum)) {
      Alert.alert('Hata', 'Lütfen geçerli sayılar girin.');
      return;
    }

    const { bmi, category } = calculateBMI(weightNum, heightNum);

    if (isBMH) {
      if (!age) {
        Alert.alert('Hata', 'Lütfen yaşınızı girin.');
        return;
      }

      const ageNum = parseFloat(age);

      if (isNaN(ageNum)) {
        Alert.alert('Hata', 'Lütfen geçerli bir yaş girin.');
        return;
      }

      const bmh = isFemaleChecked
        ? 655.10 + (9.56 * weightNum) + (1.85 * heightNum) - (4.68 * ageNum)
        : 66.47 + (13.75 * weightNum) + (5 * heightNum) - (6.76 * ageNum);

      const formattedResult = `Hesaplanan BMH: ${bmh.toFixed(2)} kcal\nHesaplanan VKİ: ${bmi}\nKategori: ${category}`;
      setResult(formattedResult);
    } else {
      if (!waist || !neck || (isFemaleChecked && !hip)) {
        Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
        return;
      }

      const waistNum = parseFloat(waist);
      const neckNum = parseFloat(neck);
      const hipNum = isFemaleChecked ? parseFloat(hip) : 0;

      if (isNaN(waistNum) || isNaN(neckNum) || (isFemaleChecked && isNaN(hipNum))) {
        Alert.alert('Hata', 'Lütfen geçerli sayılar girin.');
        return;
      }

      calculateBodyFat();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#af221e" />

      {/* Hesaplama türü seçim butonları */}
      <View style={[styles.buttonContainer, { backgroundColor: "#af221e" }]}>
        <TouchableOpacity
          style={selectedMetric === 'BMH' ? styles.selectedButton : styles.button}
          onPress={() => handleButtonPress('BMH')}
        >
          <Text style={selectedMetric === 'BMH' ? styles.selectedText : styles.buttonText}>BMH</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedMetric === 'VYO' ? styles.selectedButton : styles.button}
          onPress={() => handleButtonPress('VYO')}
        >
          <Text style={selectedMetric === 'VYO' ? styles.selectedText : styles.buttonText}>VYO</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.inputContainer, { marginTop: 20 }]}>
          {/* Başlık metni, hesaplama türüne göre değişir */}
          {isBMH && (
            <Text style={[styles.textTitle, { paddingBottom: 20 }]}>
              Bazal Metabolik Hız Hesaplama
            </Text>
          )}
          {!isBMH && (
            <Text style={[styles.textTitle, { paddingBottom: 20 }]}>
              Vücut Yağ Oranı Hesaplama
            </Text>
          )}

          {/* Giriş alanları */}
          <Text style={styles.label}>Boy (cm)</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setHeight(text)}
            value={height}
            placeholder="Ör: 175"
            placeholderTextColor="grey"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Kilo (kg)</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setWeight(text)}
            value={weight}
            placeholder="Ör: 65"
            placeholderTextColor="grey"
            keyboardType="numeric"
          />
          {/* BMH hesaplama için yaş girişi */}
          {isBMH && (
            <>
              <Text style={styles.label}>Yaş</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setAge(text)}
                value={age}
                placeholder="Ör: 25"
                placeholderTextColor="grey"
                keyboardType="numeric"
              />
            </>
          )}
          {/* Vücut yağ oranı hesaplama için ekstra ölçümler */}
          {!isBMH && (
            <>
              <Text style={styles.label}>Bel Çevresi (cm)</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setWaist(text)}
                value={waist}
                placeholder="Ör: 80"
                placeholderTextColor="grey"
                keyboardType="numeric"
              />
              <Text style={styles.label}>Boyun Çevresi (cm)</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setNeck(text)}
                value={neck}
                placeholder="Ör: 40"
                placeholderTextColor="grey"
                keyboardType="numeric"
              />
              {/* Sadece kadın için kalça çevresi girişi */}
              {isFemaleChecked && (
                <>
                  <Text style={styles.label}>Kalça Çevresi (cm)</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => setHip(text)}
                    value={hip}
                    placeholder="Ör: 95"
                    placeholderTextColor="grey"
                    keyboardType="numeric"
                  />
                </>
              )}
            </>
          )}

          {/* Cinsiyet seçimi checkboxları */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkboxItem, { flexDirection: 'row', alignItems: 'center'}]}
              onPress={handleMaleChange}
            >
              <View style={[styles.checkbox, { width: 30, height: 30, borderRadius: 100, borderWidth: 3, borderColor: '#af221e' }]}>
                {isMaleChecked && <View style={{ flex: 1, backgroundColor: '#af221e', borderRadius: 100 }} />}
              </View>
              <Text style={styles.checkboxLabel}>Erkek</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.checkboxItem, { flexDirection: 'row', alignItems: 'center' }]}
              onPress={handleFemaleChange}
            >
              <View style={[styles.checkbox, { width: 30, height: 30, borderRadius: 100, borderWidth: 3, borderColor: '#af221e' }]}>
                {isFemaleChecked && <View style={{ flex: 1, backgroundColor: '#af221e', borderRadius: 100 }} />}
              </View>
              <Text style={styles.checkboxLabel}>Kadın</Text>
            </TouchableOpacity>
          </View>

          {/* Hesapla butonu */}
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleCalculate}
          >
            <Text style={styles.calculateButtonText}>Hesapla</Text>
          </TouchableOpacity>

          {/* Sonuç metni */}
          <Text style={styles.resultText}>{result}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 25,
  },
  button: {
    backgroundColor: '#771515',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 45,
  },
  selectedButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 45,
    borderWidth: 3,
    borderColor: '#771515'
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  selectedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#771515',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  inputContainer: {
    paddingHorizontal: 30,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  textInput: {
    height: 40,
    borderColor: '#af221e',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 3,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calculateButton: {
    backgroundColor: '#af221e',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 25,
    color: 'black',
    marginVertical: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'black',
  }
});
