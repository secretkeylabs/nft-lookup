import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export const LookUpScreen = ({ navigation }) => {
  const [input, setInput] = useState(
    "SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG"
  ); // Maybe use Formik instead
  const [result, setResult] = useState<any>();

  const handleLookUp = async () => {
    try {
      const responseJson = await fetch(
        `https://stacks-node-api.mainnet.stacks.co/extended/v1/address/${input}/nft_events`
      ).then((response) => response.json());
      if (responseJson.error) {
        throw Error(responseJson.error);
      } else {
        setResult(responseJson.nft_events);
      }
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  const resultView = (
    <>
      {result && (
        <>
          <Text style={styles.text}>Results</Text>
          <View style={styles.results}>
            {result.map((nft) => {
              return (
                <TouchableOpacity
                  key={nft.value.hex}
                  onPress={() =>
                    navigation.navigate("Detail", {
                      collection: nft.asset_identifier,
                      id: nft.value.repr.replace("u", ""),
                    })
                  }
                >
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ color: "white", marginVertical: 10 }}>
                      {nft.asset_identifier}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <Text style={styles.text}>Stacks Address:</Text>
            <TextInput
              editable
              value={input}
              style={styles.input}
              onChangeText={(text) => {
                setInput(text);
              }}
            />
            <TouchableOpacity style={styles.button} onPress={handleLookUp}>
              <Text style={{ textAlign: "center", color: "white" }}>
                Look up
              </Text>
            </TouchableOpacity>
            {resultView}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    margin: 10,
  },
  text: {
    fontSize: 16,
    color: "white",
    margin: 5,
  },
  input: {
    fontSize: 16,
    padding: 10,
    backgroundColor: "#222",
    color: "white",
  },
  results: {
    marginHorizontal: 5,
    marginVertical: 20,
  },
  button: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    borderWidth: 1,
  },
});
