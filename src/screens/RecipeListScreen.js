import React from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Animated,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { ListItem, Icon, Card, Text } from "react-native-elements";

import CustomText from "../components/CustomText";

import mock_recipes from "../data/mock_recipes";

import * as theme from "../theme";
const { width, height } = Dimensions.get("window");

class RecipeListScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      uploading: true,
      recipes: [],
      foodItems: []
    };
  }

  componentDidMount() {
    const foodItems = this.props.navigation.getParam("foodItems");

    this.setState({ foodItems: foodItems });

    let query = "";
    foodItems.forEach(food => {
      query += food.name + ",+";
    });

    const url =
      "https://api.spoonacular.com/recipes/findByIngredients?ignorePantry=true&number=5&instructionsRequired=true&apiKey=INSERT_API_KEY_HERE&ranking=2&ingredients=" +
      query;

    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ uploading: false });
        // parse the response
        responseJson.forEach(recipe => {
          // get the id, title, and image URL
          let parsedRecipe = {
            id: recipe["id"],
            title: recipe["title"],
            imageUrl: recipe["image"]
          };

          // Comment out here

          // let url2 =
          //   "https://api.spoonacular.com/recipes/" +
          //   parsedRecipe.id +
          //   "/information?includeNutrition=false&apiKey=INSERT_API_KEY_HERE";

          // fetch(url2)
          //   .then(response => response.json())
          //   .then(responseJson => {
          //     let isVegetarian = responseJson["vegetarian"];
          //     let isVegan = responseJson["vegan"];
          //     let isGlutenFree = responseJson["glutenFree"];
          //     let isDairyFree = responseJson["dairyFree"];
          //     let cookingMinutes = responseJson["cookingMinutes"];

          //     parsedRecipe["isVegetarian"] = isVegetarian;
          //     parsedRecipe["isVegan"] = isVegan;
          //     parsedRecipe["isGlutenFree"] = isGlutenFree;
          //     parsedRecipe["isDairyFree"] = isDairyFree;
          //     parsedRecipe["cookingMinutes"] = cookingMinutes;
          //   })
          //   .catch(error => {
          //     console.error(error);
          //   });

          // add to recipes array
          this.setState({
            recipes: [...this.state.recipes, parsedRecipe]
          });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  renderRecipeList = () => {
    return (
      <ScrollView style={{ padding: 14, backgroundColor: "#EA8953" }}>
        <View
          style={{
            marginTop: 35,
            padding: 10,
            marginVertical: 10,
            // zIndex: 1,
            // backgroundColor: 'white',
            borderRadius: 15
          }}
        >
          <Text h4 style={{ color: "black" }}>
            We found {this.state.recipes.length} recipes for you..
          </Text>
        </View>
        <View
          style={{
            borderBottomColor: "white",
            borderBottomWidth: 3,
            marginBottom: 20
          }}
        />
        <View style={[styles.column]}>
          {this.state.uploading && (
            <ActivityIndicator size="large" color="#FFF" />
          )}

          <FlatList
            pagingEnabled
            scrollEnabled
            // showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            scrollEventThrottle={16}
            snapToAlignment="center"
            style={{ overflow: "visible" }}
            data={this.state.recipes}
            keyExtractor={(item, index) => `${item.id}`}
            onScroll={Animated.event([
              { nativeEvent: { contentOffset: { x: this.scrollX } } }
            ])}
            renderItem={({ item }) => this.renderRecipe(item)}
          />
          {/* {this.renderDots()} */}
        </View>
      </ScrollView>
    );
  };

  renderRecipe = item => {
    // const navigation = this.props;

    return (
      // <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Article', { article: item })}>
      <TouchableOpacity
        activeOpacity={0.8}
        // onPress={() => console.log(item.title)}
        onPress={() =>
          this.props.navigation.navigate("Recipe", { recipe: item })
        }
      >
        <ImageBackground
          style={[
            styles.flex,
            styles.recipe,
            styles.shadow,
            { marginBottom: 50 }
          ]}
          imageStyle={{ borderRadius: theme.sizes.radius }}
          source={{ uri: item.imageUrl }}
        >
          <View
            style={
              ([styles.row],
              styles.flex,
              { justifyContent: "flex-end", alignItems: "flex-end" })
            }
          >
            <Icon name="bookmark-border" color={theme.colors.white} />
          </View>
          <View style={[styles.column, styles.recipeInfo, styles.shadow]}>
            <Text style={{ fontSize: 15, fontWeight: "500", paddingBottom: 8 }}>
              {item.title}
            </Text>
            <View
              style={[
                styles.row,
                { justifyContent: "space-between", alignItems: "center" }
              ]}
            >
              <Icon name="access-time" />
              {/* {item.cookingMinutes && (
                <Text
                  style={{ color: theme.colors.caption, marginHorizontal: 5 }}
                >
                  {item.cookingMinutes} min
                </Text>
              )}

              {!item.cookingMinutes && (
                <Text
                  style={{ color: theme.colors.caption, marginHorizontal: 5 }}
                >
                  {Math.floor(Math.random() * Math.floor(30))} min
                </Text>
              )}

              {item.isVegetarian && (
                <Text
                  style={{ color: "rgb(103, 174, 20)", marginHorizontal: 5 }}
                >
                  VG
                </Text>
              )}

              {item.isVegan && (
                <Text style={{ color: "#62CA30", marginHorizontal: 5 }}>
                  VE
                </Text>
              )}

              {item.isGlutenFree && (
                <Text
                  style={{ color: "rgb(255, 209, 0)", marginHorizontal: 5 }}
                >
                  GF
                </Text>
              )}

              {item.isDairyFree && (
                <Text
                  style={{ color: "rgb(38, 188, 245)", marginHorizontal: 5 }}
                >
                  DF
                </Text>
              )} */}

              <Text
                style={{ color: theme.colors.caption, marginHorizontal: 5 }}
              >
                {Math.floor(Math.random() * (30 - 5) + 5)} min
              </Text>

              {Math.random() >= 0.5 && (
                <Text
                  style={{ color: "rgb(103, 174, 20)", marginHorizontal: 5 }}
                >
                  VG
                </Text>
              )}

              {Math.random() >= 0.5 && (
                <Text style={{ color: "#62CA30", marginHorizontal: 5 }}>
                  VE
                </Text>
              )}

              {Math.random() >= 0.5 && (
                <Text
                  style={{ color: "rgb(255, 209, 0)", marginHorizontal: 5 }}
                >
                  GF
                </Text>
              )}

              {Math.random() >= 0.5 && (
                <Text
                  style={{ color: "rgb(38, 188, 245)", marginHorizontal: 5 }}
                >
                  DF
                </Text>
              )}
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View>
        {/* <Text>Something</Text> */}
        {this.renderRecipeList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  column: {
    flexDirection: "column"
  },
  row: {
    flexDirection: "row"
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.sizes.padding,
    paddingTop: theme.sizes.padding * 1.33,
    paddingBottom: theme.sizes.padding * 0.66,
    justifyContent: "space-between",
    alignItems: "center"
  },
  recipes: {
    flex: 1,
    justifyContent: "space-between"
  },
  recipe: {
    width: width - theme.sizes.padding * 2,
    height: width * 0.4,
    marginHorizontal: theme.sizes.margin,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding * 0.66,
    borderRadius: theme.sizes.radius
  },
  recipeInfo: {
    position: "absolute",
    borderRadius: theme.sizes.radius,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding / 2,
    bottom: -theme.sizes.padding,
    right: theme.sizes.padding,
    left: theme.sizes.padding,
    backgroundColor: theme.colors.white
  },
  recommended: {},
  recommendedHeader: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: theme.sizes.padding,
    marginVertical: theme.sizes.margin * 0.66
  },
  recommendedList: {},
  recommendation: {
    width: (width - theme.sizes.padding * 2) / 2,
    marginHorizontal: 8,
    backgroundColor: theme.colors.white,
    overflow: "hidden",
    borderTopRightRadius: theme.sizes.border,
    borderTopLeftRadius: theme.sizes.border
  },
  recommendationHeader: {
    overflow: "hidden",
    borderTopRightRadius: theme.sizes.border,
    borderTopLeftRadius: theme.sizes.border
  },
  recommendationOptions: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.sizes.padding / 2,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
  recommendationTemp: {
    fontSize: theme.sizes.font * 1.25,
    color: theme.colors.white
  },
  recommendationImage: {
    // width: (width - theme.sizes.padding * 2) / 2,
    // height: (width - theme.sizes.padding * 2) / 2
    width: 250,
    height: 150
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

export default RecipeListScreen;
