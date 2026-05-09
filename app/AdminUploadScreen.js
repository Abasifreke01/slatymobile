import React, { useState } from "react";
import { 
  View, Text, Button, StyleSheet, ActivityIndicator, Alert 
} from "react-native";

import { uploadOrUpdateQuestions } from "./addSubjects";

// IMPORT THE BIG JSON FILE
import allSubjects from "./Questions/math5000.json";

// import allSubjects from "./Questions/allSubjects.json";


const AdminUploadScreen = () => {

  const [uploading, setUploading] = useState(false);


  const uploadAllSubjects = async () => {
    console.log("📁 Checking allSubjects JSON...");

    if (
      typeof allSubjects !== "object" ||
      Array.isArray(allSubjects) ||
      Object.keys(allSubjects).length === 0
    ) {
      Alert.alert("Error", "Invalid allSubjects.json format.");
      console.log("❌ Invalid JSON:", allSubjects);
      return;
    }

    setUploading(true);

    try {
      for (const subjectName of Object.keys(allSubjects)) {
        const questionsArray = allSubjects[subjectName];

        // Validate array
        if (!Array.isArray(questionsArray)) {
          console.log(`❌ ${subjectName} questions is not an array`);
          continue;
        }

        // Validate first question
        if (!questionsArray[0]?.question || 
            !questionsArray[0]?.choices || 
            !questionsArray[0]?.correctAnswer) 
        {
          console.log(`❌ ${subjectName} JSON missing fields`);
          continue;
        }

        console.log(`🚀 Uploading ${questionsArray.length} questions for: ${subjectName}`);

        await uploadOrUpdateQuestions(subjectName, questionsArray);

        console.log(`✔ Completed: ${subjectName}`);
      }

      Alert.alert("Success", "All subjects uploaded successfully!");

    } catch (err) {
      console.log("🔥 Bulk upload failed:", err);
      Alert.alert("Upload Failed", err.message || "Unknown error");

    } finally {
      setUploading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Bulk Subject Uploader</Text>

      {uploading ? (
        <View style={{ marginTop: 30 }}>
          <ActivityIndicator size="large" color="purple" />
          <Text style={{ color: "white", marginTop: 10 }}>
            Uploading ALL subjects... Please wait
          </Text>
        </View>
      ) : (
        <Button
          title="Upload ALL Subjects"
          color="purple"
          onPress={uploadAllSubjects}
        />
      )}

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "black",
    flex: 1,
  },
  h1: {
    color: "white",
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  }
});

export default AdminUploadScreen;
