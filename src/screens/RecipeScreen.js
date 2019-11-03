import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions
} from "react-native";
import { ListItem, Icon, Text, Button } from "react-native-elements";

import CustomText from "../components/CustomText";

import * as theme from "../theme";

const { width, height } = Dimensions.get("window");
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
      "/information?includeNutrition=false&apiKey=INSERT_API_KEY_HERE";
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
        if (typeof extraIngrList !== "undefined") {
          extraIngrList.forEach(ingredient => {
            let newIngredient = {
              id: ingredient["id"],
              string: ingredient["originalString"]
            };
            newIngrList.push(newIngredient);
          });
          this.setState({ extraIngredients: newIngrList });
        }

        // set instructions
        // console.log(responseJson["analyzedInstructions"][0]);
        if (typeof responseJson["analyzedInstructions"][0] == "undefined") {
          console.log("HERE");
          let empty = {
            number: 0,

            step: "Sorry no instructions found."
          };
          this.setState({
            recipeInstructions: [...this.state.recipeInstructions, empty]
          });
        } else {
          let instructionObj = responseJson["analyzedInstructions"][0]["steps"];
          if (instructionObj) {
            instructionObj.forEach(instruction => {
              let newInstruction = {
                number: instruction["number"],
                step: instruction["step"]
              };
              this.setState({
                recipeInstructions: [
                  ...this.state.recipeInstructions,
                  newInstruction
                ]
              });
            });
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: this.state.recipe.imageUrl }}
          style={styles.image}
        >
          {/* <View
            style={
              ({ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-start"})
            }
          >
            <Icon name="share" color={theme.colors.white} size={40} />
          </View> */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              bottom: -50,
              left: -150
            }}
          >
            <View style={{ right: 265 }}>
              <Icon name="share" color={theme.colors.white} size={30} />
            </View>
            <Icon name="bookmark-border" color={theme.colors.white} size={30} />
          </View>
        </ImageBackground>

        <ScrollView style={styles.scrollview}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{this.state.recipe.title}</Text>
          </View>

          {/* {this.state.uploading && (
            <ActivityIndicator size="large" color="#FFF" />
          )} */}
          <View style={styles.time}>
            <Icon name="access-time" />
            <Text>{this.state.cookingMinutes} mins</Text>
          </View>

          <View
            style={{
              borderBottomColor: "white",
              borderBottomWidth: 3,
              marginBottom: 20
            }}
          />

          <Text style={styles.titles}>Additional ingredients:</Text>
          <View style={styles.listContainer}>
            {this.state.extraIngredients.map(ingredient => (
              <ListItem
                key={ingredient.id}
                title={ingredient.string}
                containerStyle={styles.listitem}
              />
            ))}
          </View>

          <Text style={styles.titles}>Instructions:</Text>
          <View style={styles.listContainer}>
            {this.state.recipeInstructions.map(instruction => (
              <ListItem
                key={instruction.number}
                title={instruction.step}
                containerStyle={styles.listitem}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // marginTop: 50,
    flex: 1,
    // flexDirection: 'column'
    // justifyContent: 'center',
    // alignItems: 'stretch',
    // paddingVertical: 20
    backgroundColor: theme.colors.main
  },
  scrollview: {
    // flex: 1,
    top: -10,
    position: "relative",
    borderRadius: theme.sizes.border,
    paddingHorizontal: 30,
    paddingVertical: 10,
    // paddingTop: 10,
    // marginVertical: 30,
    backgroundColor: theme.colors.main //'rgb(249,211,188)'
  },
  image: {
    width: 500,
    height: height / 3
  },
  header: {
    //backgroundColor: 'rgb(249,211,188)'
  },
  headerText: {
    fontSize: 30,
    // marginTop: 40,
    textAlign: "center",
    color: "white" //'#404040',
    // fontFamily: 'sans-serif-medium'//'sans-serif-condensed',
  },
  time: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10
  },
  titles: {
    // fontFamily: 'normal',
    fontSize: 20,
    color: theme.colors.white
  },
  listContainer: {
    // marginTop: 10,
    borderRadius: theme.sizes.border,

    marginBottom: 20
  },
  listitem: {
    marginBottom: 5,
    backgroundColor: "rgb(249,211,188)",
    borderRadius: theme.sizes.border
    // color: 'rgb(21,16,31)'
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.05,
    shadowRadius: 10
  }
});

export default RecipeScreen;
