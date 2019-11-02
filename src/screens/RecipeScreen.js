import React from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { ListItem, Image, Text, Button } from "react-native-elements";

import CustomText from "../components/CustomText";

class RecipeScreen extends React.Component {
  constructor(props) {
    super(props);

    const recipe = props.navigation.getParam("recipe");

    this.state = {
      uploading: true,
      recipe: {
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.imageUrl
      },
      cookingMinutes: 0,
      extraIngredients: [],
      recipeInstructions: []
    };
  }

  componentDidMount() {
    const url =
      "https://api.spoonacular.com/recipes/" +
      this.state.recipe.id +
      "/information?includeNutrition=false&apiKey=55bc2cf6e0a548e495072f61f6169980";
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ uploading: false });

        // Parse the response.
        // set cooking minutes
        this.setState({ cookingMinutes: responseJson["cookingMinutes"] });

        // set extra ingredients
        let extraIngrList = responseJson["extendedIngredients"];
        let newIngrList = [];
        extraIngrList.forEach(ingredient => {
          let newIngredient = {
            id: ingredient["id"],
            string: ingredient["originalString"]
          };
          newIngrList.push(newIngredient);
        });
        this.setState({ extraIngredients: newIngrList });

        // set instructions
        let instructionObj = responseJson["analyzedInstructions"][0]["steps"];
        instructionObj.forEach(instruction => {
          let newInstruction = {
            id: instruction["number"],
            step: instruction["step"]
          };
          this.setState({
            recipeInstructions: [
              ...this.state.recipeInstructions,
              newInstruction
            ]
          });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <CustomText style={styles.headerText}>
          {this.state.recipe.title}
        </CustomText>
        <Image
          source={{ uri: this.state.recipe.imageUrl }}
          style={{ width: 200, height: 200 }}
        />
        {/* show loading button while calling API */}
        {this.state.uploading && (
          <ActivityIndicator size="large" color="#FFF" />
        )}

        <Text h4>Cooking minutes: {this.state.cookingMinutes} mins</Text>

        <Text h4>Extra ingredients:</Text>
        <View style={styles.listContainer}>
          {this.state.extraIngredients.map(ingredient => (
            <ListItem
              key={ingredient.id}
              title={ingredient.string}
              bottomDivider
            />
          ))}
        </View>

        <Text h4>Instructions:</Text>
        <View style={styles.listContainer}>
          {this.state.recipeInstructions.map(instruction => (
            <ListItem
              key={instruction.id}
              title={instruction.step}
              bottomDivider
            />
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 10,
    padding: 20
  },
  button: {
    backgroundColor: "#FCAE6B",
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: 15
  },
  buttonContainer: {
    // marginTop: 10,
    marginVertical: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  listContainer: {
    marginTop: 10,
    flex: 1
  },
  headerText: {
    fontSize: 500,
    marginTop: 10
  }
});

export default RecipeScreen;
