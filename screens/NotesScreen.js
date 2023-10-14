import React, { useEffect, useState } from "react";
import { StyleSheet,  Text,  View,  TouchableOpacity,  FlatList,} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";


const db = SQLite.openDatabase("notes.db");
console.log(FileSystem.documentDirectory);
export default function NotesScreen({ navigation, route }) {
  const [notes, setNotes] = useState([]);
  function refreshNotes() {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes ORDER BY done ASC",
        null,
        (txObj, { rows: { _array } }) => setNotes(_array),
        (txObj, error) => console.log(`Error: ${error}`)
      );
    });
  }
  // This is to initialise db
  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS notes
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          done INT)
        `
        );
      },
      null,
      refreshNotes
    );
  }, []);


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addNote}>
          <Ionicons
            name="ios-create-outline"
            size={30}
            color="black"
            style={{
              color: "#f55",
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    if (route.params?.text) {
      db.transaction(
        (tx) => {
          tx.executeSql("INSERT INTO notes (done, title) VALUES (0, ?)", [
            route.params.text,
          ]);
        },
        null,
        refreshNotes
      );
    }
  }, [route.params?.text]);

  function addNote() {
    navigation.navigate("Add Note");
    }
    

  function deleteNote(id) {
    console.log("Deleting " + id);
    db.transaction(
      (tx) => {
        tx.executeSql(`DELETE FROM notes WHERE id=${id}`);
      },
      null,
      refreshNotes
    );
  }

  function handlePress(id, currentDone) {
    console.log("Updating " + id);
    const newDone = currentDone === 1 ? 0 : 1; 
  
    db.transaction(
      (tx) => {
        tx.executeSql(`UPDATE notes SET done=${newDone} WHERE id=${id}`);
      },
      null,
      refreshNotes
    );
  }
  

    function renderItem({ item }) {

      const textStyle = item.done === 1 ? styles.greyText : styles.normalText;
   

    return (
      <View
        style={{
          padding: 10,
          paddingTop: 20,
          paddingBottom: 20,
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
       <TouchableOpacity onPress={() => handlePress(item.id,item.done)}>
      <View>
      <Text style={textStyle}>{item.title}</Text>
      </View>
    </TouchableOpacity>


        <TouchableOpacity onPress={() => deleteNote(item.id)}>
          <Ionicons name="trash" size={16} color="#944" />
        </TouchableOpacity>
        
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffc",
    alignItems: "center",
    justifyContent: "center",
  },
  rowNormal: {
    padding: 10,
  },
  rowPressed: {
    padding: 10,
  }, normalText: {
    color: "black", // Default text color
  },
  greyText: {
    color: "grey", // Text color when item.done is 1
  }
 
});