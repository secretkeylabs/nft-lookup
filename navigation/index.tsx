import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { DetailScreen } from "../screens/DetailScreen";
import { LookUpScreen } from "../screens/LookUpScreen";

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="LookUp"
          component={LookUpScreen}
          options={{
            title: "NFTs Lookup",
            headerShown: true,
            headerTintColor: "white",
            headerStyle: {
              shadowRadius: 0,
              shadowOffset: { height: 0, width: 0 },
              backgroundColor: "#121212",
            },
            headerBackgroundContainerStyle: {},
          }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            title: "NFT Details",
            headerShown: true,
            headerTintColor: "white",
            headerStyle: {
              shadowRadius: 0,
              shadowOffset: { height: 0, width: 0 },
              backgroundColor: "#121212",
            },
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
