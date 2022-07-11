import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { InfoField } from "../components/InfoField";

const getIpfsUrl = (uri: string, protocol: string): string | null => {
  const publicIpfs = "https://ipfs.io/ipfs";
  if (protocol === "http") return uri;
  if (protocol === "ipfs") {
    const url = uri.split("//");
    return `${publicIpfs}/${url[1]}`;
  }
  return null;
};

export const DetailScreen = ({ route, navigation }) => {
  const { collection, id } = route.params;
  const [attributes, setAttributes] = useState<any[]>();
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const [address, name] = collection.split("::")[0].split(".");
    const abortController = new AbortController();
    const attributesRequest = fetch(
      `https://stxnft.com/api/v1/collections/${address}.${name}/${id}`,
      { signal: abortController.signal }
    );

    (async () => {
      try {
        const {
          data: { nft_token_attributes, token_metadata },
        } = await attributesRequest.then((response) => response.json());
        setAttributes(nft_token_attributes);
        if (
          token_metadata &&
          token_metadata.image_url &&
          token_metadata.image_protocol
        ) {
          setImage(
            getIpfsUrl(token_metadata.image_url, token_metadata.image_protocol)
          );
        }
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
        {
          <>
            {attributes &&
              attributes?.map((attribute, index) => {
                return (
                  <InfoField
                    key={`${index}${attribute.trait_type}`}
                    title={attribute.trait_type}
                    value={attribute.value}
                  />
                );
              })}
          </>
        }
      </View>
    </>
  );

  return (
    <ScrollView style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.nftImage} />}
      <View style={styles.content}>
        {basicInfoView}
        {attributesInfoView}
      </View>
    </ScrollView>
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
