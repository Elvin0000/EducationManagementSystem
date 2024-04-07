import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomHeader from '../Components/CustomHeader';

const PredictResult = () => {
  const [gender, setGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [parentalEducation, setParentalEducation] = useState('');
  const [lunchType, setLunchType] = useState('');
  const [testPreparationCourse, setTestPreparationCourse] = useState('');
  const [readingScore, setReadingScore] = useState('');
  const [writingScore, setWritingScore] = useState('');
  const [predictionResult, setPredictionResult] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [allPickersSelected, setAllPickersSelected] = useState(false);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('gender', gender);
      formData.append('ethnicity', ethnicity);
      formData.append('parental_level_of_education', parentalEducation);
      formData.append('lunch', lunchType);
      formData.append('test_preparation_course', testPreparationCourse);
      formData.append('reading_score', readingScore);
      formData.append('writing_score', writingScore);
  
      const response = await fetch('http://192.168.136.1:5000/predictdata', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      // Check if all Pickers have a selected value
      if (gender !== "" && ethnicity !== "" && parentalEducation !== "" && lunchType !== "" && testPreparationCourse !== "") {
        setAllPickersSelected(true);
        // Perform any other necessary actions here
      } else {
        setAllPickersSelected(false);
        Alert.alert(
          'Incomplete Selection',
          'Please select values for all fields before submitting.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
        // Show a message to the user indicating that all Pickers need to be selected
      }

      // Set the submission status to true
      setIsSubmitted(true);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setPredictionResult(data.result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  

  return (
    <View>
      <CustomHeader/>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender !== "" ? gender : "select"}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="select" enabled={false} />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
  
        <Picker
          selectedValue={ethnicity !== "" ? ethnicity : "select"}
          onValueChange={(itemValue) => setEthnicity(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Race/Ethnicity" value="select" enabled={false} />
          <Picker.Item label="American Indian/Alaska Native" value="group A" />
          <Picker.Item label="Asian " value="group B" />
          <Picker.Item label="Black or African American " value="group C" />
          <Picker.Item label="Native Hawaiian or other Pacific Islander" value="group D" />
          <Picker.Item label="White" value="group E" />
        </Picker>
  
        <Picker
          selectedValue={parentalEducation !== "" ? parentalEducation : "select"}
          onValueChange={(itemValue) => setParentalEducation(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Parent Education" value="select" enabled={false} />
          <Picker.Item label="Associate's Degree" value="associate's degree" />
          <Picker.Item label="Bachelor's Degree" value="bachelor's degree" />
          <Picker.Item label="High School" value="high school" />
          <Picker.Item label="Master's Degree" value="master's degree" />
          <Picker.Item label="Some College" value="some college" />
          <Picker.Item label="Some High School" value="some high school" />
        </Picker>
  
        <Picker
          selectedValue={lunchType !== "" ? lunchType : "select"}
          onValueChange={(itemValue) => setLunchType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Lunch Type" value="select" enabled={false} />
          <Picker.Item label="Free/Reduced" value="free/reduced" />
          <Picker.Item label="Standard" value="standard" />
        </Picker>
  
        <Picker
          selectedValue={testPreparationCourse !== "" ? testPreparationCourse : "select"}
          onValueChange={(itemValue) => setTestPreparationCourse(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Test Preparation Course" value="select" enabled={false} />
          <Picker.Item label="None" value="none" />
          <Picker.Item label="Completed" value="completed" />
        </Picker>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reading Score:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your score (1~100)"
            keyboardType="numeric"
            value={readingScore}
            onChangeText={(text) => setReadingScore(text)}
          />
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Writing Score:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your score (1~100)"
            keyboardType="numeric"
            value={writingScore}
            onChangeText={(text) => setWritingScore(text)}
          />
        </View>
  
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Predict your Maths Score</Text>
        </TouchableOpacity>
  
        {isSubmitted && allPickersSelected && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>The prediction for maths score is {predictionResult}</Text>
          </View>
        )}
      </View>
    </View>
  );
  
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {

    flex: 1,
    marginLeft: 20,
    textAlign: 'left',
    // fontWeight: 'bold',
    fontSize:18,
    color:'black',
  },
  input: {
    marginTop: 10,
    flex: 1,
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 35,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 40,
  },
  infoText: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4494ad',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop:40,
    marginLeft:40,
    marginRight:40,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PredictResult;
