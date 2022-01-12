import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { InfoField } from "../components/InfoField";

const getIpfsUrl = (url: string, id: string): string => {
  const ipfsUrl = url.split("//");
  const address = ipfsUrl[1].split("/");
  return `https://ipfs.io/ipfs/${address[0]}/${id}.png`;
};

export const DetailScreen = ({ route, navigation }) => {
  const { collection, id } = route.params;
  const [isLoading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState();
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const [address, name] = collection.split("::")[0].split(".");
    const abortController = new AbortController();
    const attributesRequest = fetch(
      `https://stxnft.com/api/nft?address=${address}&name=${name}&id=${id}`,
      { signal: abortController.signal }
    );
    (async () => {
      setLoading(true);

      try {
        const { attributes, image: imageURL } = await attributesRequest.then(
          (response) => response.json()
        );
        setAttributes(attributes);
        if (imageURL) setImage(getIpfsUrl(imageURL, id));
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") {
            Alert.alert("Error", err.message, [
              {
                text: "OK",
                onPress: () => {
                  navigation.goBack();
                },
                style: "cancel",
              },
            ]);
            setLoading(false);
          }
        }
      }
    })();
    return () => {
      abortController.abort();
    };
  }, []);

  const basicInfoView = (
    <>
      <Text style={styles.contentTitle}>Item Details</Text>
      <View style={styles.divider} />
    </>
  );

  const attributesInfoView = (
    <>
      <Text style={{ color: "grey" }}>Identifier</Text>
      <Text
        style={{
          color: "white",
          paddingVertical: 10,
        }}
      >
        {collection}
      </Text>
      <InfoField title={"ID value"} value={id} />
      <View style={{ marginTop: 10 }}>
        <Text style={styles.contentTitle}>Attributes</Text>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 25 }} />
        ) : (
          <>
            {attributes &&
              attributes?.map((attribute) => {
                return (
                  <InfoField
                    key={attribute.trait_type}
                    title={attribute.trait_type}
                    value={attribute.value}
                  />
                );
              })}
          </>
        )}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.nftImage} />}
      <View style={styles.content}>
        {basicInfoView}
        <ScrollView>{attributesInfoView}</ScrollView>
      </View>
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
    margin: 20,
  },
  contentTitle: {
    color: "white",
    fontSize: 20,
  },
  divider: {
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
  nftImage: {
    width: "100%",
    aspectRatio: 1,
  },
});
