import React, { useState } from "react";
import { Text, View, Pressable, StyleSheet, TextInput } from "react-native";

export default function AddScreen({ route, navigation }) {
const [text, setText] = useState("");

return (
<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
<Text style={styles.label}>Add your todo</Text>
<TextInput
style={styles.textInput}
value={text}
onChangeText={(newText) => setText(newText)}></TextInput>
<View style={styles.buttons}>
<Pressable
onPress={() => navigation.navigate("Notes", { text })}
style={[styles.button, styles.submitButton]}>
<Text style={styles.buttonText}>Submit</Text>
</Pressable>
<Pressable
onPress={() => navigation.goBack()}
style={[styles.button, styles.cancelButton]}>
<Text style={styles.buttonText}>Cancel</Text>
</Pressable>
</View>

<Text style={{ marginTop: 40, color: "grey" }}>
This is what you typed:
</Text>
<Text style={{ color: "#333", marginTop: 10 }}>{text}</Text>
</View>
);

}

const styles = StyleSheet.create({
label: {
fontWeight: "bold",
fontSize: 24
},
textInput: {
margin: 20,
borderWidth: 1,
width: "80%",
padding: 10,
borderColor: "#ccc"
},
buttons: {
flexDirection: "row"
},
button: {
padding: 10,
margin: 5
},
buttonText: {
fontWeight: "bold",
color: "white"
},
submitButton: {
backgroundColor: "green"
},
cancelButton: {
backgroundColor: "red"
}
});


