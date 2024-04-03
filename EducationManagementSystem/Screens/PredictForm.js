import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PredictForm = () => {
  const [gender, setGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [parentalEducation, setParentalEducation] = useState('');
  const [lunchType, setLunchType] = useState('');
  const [testPreparationCourse, setTestPreparationCourse] = useState('');
  const [readingScore, setReadingScore] = useState('');
  const [writingScore, setWritingScore] = useState('');
  const [predictionResult, setPredictionResult] = useState('');

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
      <Picker
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Select your Gender" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>

      <Picker
        selectedValue={ethnicity}
        onValueChange={(itemValue) => setEthnicity(itemValue)}
      >
        <Picker.Item label="Select Ethnicity" value="" />
        <Picker.Item label="Group A" value="group A" />
        <Picker.Item label="Group B" value="group B" />
        <Picker.Item label="Group C" value="group C" />
        <Picker.Item label="Group D" value="group D" />
        <Picker.Item label="Group E" value="group E" />
      </Picker>

      <Picker
        selectedValue={parentalEducation}
        onValueChange={(itemValue) => setParentalEducation(itemValue)}
      >
        <Picker.Item label="Select Parent Education" value="" />
        <Picker.Item label="Associate's Degree" value="associate's degree" />
        <Picker.Item label="Bachelor's Degree" value="bachelor's degree" />
        <Picker.Item label="High School" value="high school" />
        <Picker.Item label="Master's Degree" value="master's degree" />
        <Picker.Item label="Some College" value="some college" />
        <Picker.Item label="Some High School" value="some high school" />
      </Picker>

      <Picker
        selectedValue={lunchType}
        onValueChange={(itemValue) => setLunchType(itemValue)}
      >
        <Picker.Item label="Select Lunch Type" value="" />
        <Picker.Item label="Free/Reduced" value="free/reduced" />
        <Picker.Item label="Standard" value="standard" />
      </Picker>

      <Picker
        selectedValue={testPreparationCourse}
        onValueChange={(itemValue) => setTestPreparationCourse(itemValue)}
      >
        <Picker.Item label="Select Test Course" value="" />
        <Picker.Item label="None" value="none" />
        <Picker.Item label="Completed" value="completed" />
      </Picker>

      <TextInput
        placeholder="Enter your Reading score"
        keyboardType="numeric"
        value={readingScore}
        onChangeText={(text) => setReadingScore(text)}
      />

      <TextInput
        placeholder="Enter your Writing score"
        keyboardType="numeric"
        value={writingScore}
        onChangeText={(text) => setWritingScore(text)}
      />

      <Button title="Predict your Maths Score" onPress={handleSubmit} />

      <Text>The prediction is {predictionResult}</Text>
    </View>
  );
};

export default PredictForm;
