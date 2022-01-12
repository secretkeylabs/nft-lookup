import { View, Text } from "react-native";

export const InfoField = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ color: "grey" }}>{title}</Text>
      <View
        style={{
          borderRadius: 5,
          backgroundColor: "#202020",
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            padding: 10,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};
