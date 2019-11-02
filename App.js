import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import HomeScreen from "./src/screens/HomeScreen";
import RecipeListScreen from "./src/screens/RecipeListScreen";
import RecipeScreen from "./src/screens/RecipeScreen";

const MainNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    RecipeList: { screen: RecipeListScreen },
    Recipe: { screen: RecipeScreen }
  },
  {
    initialRouteName: "Home"
  }
);

const App = createAppContainer(MainNavigator);
export default App;
