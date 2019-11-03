import React from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  Easing
} from "react-native";
import { ListItem, Button, Icon, Text } from "react-native-elements";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";

import fridge_items from "../data/fridge_items";
import URLs from "../resources/img/imageURL";

import * as theme from "../theme";

const { width, height } = Dimensions.get("window");

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    search: "",
    uploading: false,
    image: null,
    foodItems: fridge_items,
    // updatedState: [],
    // previousState: [],
    // isOverlayVisible: false,
    // isOverlayLoading: true,
    freshnessRating: 0,
    paths: [
      {
        name: "Orange",
        image_path:
          "https://cdn2.iconfinder.com/data/icons/food-98/64/Food_orange-512.png"
      },
      {
        name: "Bell pepper",
        image_path:
          "https://cdn3.iconfinder.com/data/icons/healthy-food-9/64/pepper-bell-healthy-vegetable-512.png"
      },
      {
        name: "unknown",
        image_path:
          "https://cdn4.iconfinder.com/data/icons/food-100/32/unknown_vegetable_32x32-512.png"
      },
      {
        name: "Apple",
        image_path:
          "https://cdn0.iconfinder.com/data/icons/essentials-volume-6/128/apple-512.png"
      },
      {
        name: "Potato",
        image_path:
          "https://cdn2.iconfinder.com/data/icons/food-drink-60/50/1F954-potato-512.png"
      }
    ]
  };

  async componentDidMount() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    this.setState({
      freshnessRating: this.calculateRating()
    });
  }

  calculateRating() {
    var sum = 0;
    this.state.foodItems.forEach(item => {
      sum += item.freshness_rating;
    });
    return Number(Math.round(sum / this.state.foodItems.length + "e1") + "e-1");
  }

  onRemoveItem = item => {
    console.log("remove is triggered");
    const items = this.state.foodItems;
    const index = items.indexOf(item);
    items.splice(index, 1);
    this.setState({ foodItems: items });
    this.circularProgress.animate(
      this.calculateRating() * 10,
      1000,
      Easing.quad
    );
  };

  takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      base64: true
      //aspect: [4, 3]
    });
    // this.setState({ isOverlayVisible: true });
    //console.log(pickerResult)
    this.handleImagePicked(pickerResult);
  };

  handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        //this.setState({ image: pickerResult.uri }); // "data:image/jpeg;base64" +

        this.submitToGoogle(pickerResult);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    }
  };

  submitToGoogle = async pickerResult => {
    try {
      let body = JSON.stringify({
        requests: [
          {
            image: {
              content: pickerResult.base64
            },
            features: [
              {
                maxResults: 10,
                type: "OBJECT_LOCALIZATION"
              }
            ]
          }
        ]
      });
      let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=INSERT_API_KEY_HERE",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: body
        }
      );
      let responseJson = await response.json();

      let scannedFoods =
        responseJson["responses"][0]["localizedObjectAnnotations"];

      // Iterate through all scanned items and add it to foodItems array
      scannedFoods.forEach(food => {
        // console.log(food["name"])

        // create a copy of the foodItem array
        let foodListToUpdate = this.state.foodItems.slice();

        // check if food list already contains the scanned item
        let foodToUpdate = foodListToUpdate.find(oldFood => {
          return oldFood.name === food["name"];
        });

        // if foodList already contains the item, we increment its quantity
        if (foodToUpdate) {
          // Update its quantity
          foodToUpdate["quantity"] += 1;

          // keep track of updated state to show in overlay
          let newFoodItem = {
            id: Math.floor(Math.random() * Math.floor(100)), // return random no from 0 to 100
            name: food["name"],
            quantity: 1
          };

          // commit changes to the state
          this.setState({
            foodItems: foodListToUpdate
          });
        } else {
          let index = this.state.paths.findIndex(item => {
            return item.name === food["name"];
          });
          let newFoodItem = {};
          if (index !== -1) {
            newFoodItem = {
              id: Math.floor(Math.random() * Math.floor(100)), // return random no from 0 to 100
              name: food["name"],
              quantity: 1,
              freshness_rating: 10,
              image_path: this.state.paths[index].image_path
            };
          } else {
            newFoodItem = {
              id: Math.floor(Math.random() * Math.floor(100)), // return random no from 0 to 100
              name: food["name"],
              quantity: 1,
              freshness_rating: 10,
              image_path:
                "https://cdn4.iconfinder.com/data/icons/food-100/32/unknown_vegetable_32x32-512.png"
            };
          }

          this.setState({
            foodItems: [...this.state.foodItems, newFoodItem]
          });
        }
      });
      this.setState({ uploading: false });
    } catch (error) {
      console.log(error);
    }
  };

  renderItem = item => {
    console.log("in render");
    return (
      <View>
        {/* <Image source={{ uri: item.image_uri }} style={styles.foodImage} /> */}
        <Text>Something</Text>
      </View>
    );
  };

  render() {
    const avgRating = this.calculateRating();
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, styles.shadow]}>
          <View style={{ flexDirection: "column", justifyContent: "flex" }}>
            <Text style={{ fontSize: 18, color: "#4A585D" }}>Welcome</Text>
            <Text h3 style={styles.headerText}>
              John's Fridge
            </Text>
          </View>

          <View style={styles.circularProgressContainer}>
            <AnimatedCircularProgress
              ref={ref => (this.circularProgress = ref)}
              size={120}
              width={15}
              backgroundWidth={5}
              rotation={220}
              arcSweepAngle={280}
              fill={this.state.freshnessRating * 10}
              tintColor="#ff0000"
              tintColorSecondary="#00ff00"
              lineCap="round"
              backgroundColor={theme.colors.gray}
              duration={1000}
            >
              {() => (
                <View style={styles.circularProgressContent}>
                  <Text style={{ fontWeight: "900" }}>{avgRating}</Text>
                  {avgRating <= 3.3 && <Text>Poor</Text>}
                  {avgRating <= 7.3 && avgRating > 3.3 && <Text>Good</Text>}
                  {avgRating <= 10.0 && avgRating > 7.3 && (
                    <Text>Excellent!</Text>
                  )}
                </View>
              )}
            </AnimatedCircularProgress>
            <Text>Freshness Score</Text>
          </View>
        </View>

        <View style={{ flex: 1, marginTop: 10 }}>
          {this.state.uploading && (
            <ActivityIndicator size="large" color={theme.colors.gray} />
          )}
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={this.state.foodItems}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ flexDirection: "row", width: width / 3 }}
                onLongPress={() => this.onRemoveItem(item)}
              >
                <View style={styles.itemContainer}>
                  <View style={[styles.itemCard, styles.shadow]}>
                    <Text style={{ fontSize: 17, fontWeight: "500" }}>
                      {item.name}
                    </Text>
                    <Text style={{}}>Qty: {item.quantity}</Text>
                    <Text
                      style={{ fontSize: 10, color: theme.colors.secondary }}
                    >
                      F.Score: {item.freshness_rating}
                    </Text>
                  </View>
                  <ImageBackground
                    style={styles.itemImage}
                    source={{ uri: item.image_path }}
                  />
                </View>
              </TouchableOpacity>
            )}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Icon
            name="add-a-photo"
            reverse={true}
            color={theme.colors.lighter}
            onPress={this.takePhoto}
          />
          <Button
            icon={<Icon name="shuffle" color="white" />}
            title="   Generate Recipe"
            buttonStyle={styles.button}
            onPress={() =>
              this.props.navigation.navigate("RecipeList", {
                foodItems: this.state.foodItems
              })
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: theme.colors.main
  },
  button: {
    backgroundColor: theme.colors.lighter,
    padding: 12,
    paddingHorizontal: 50,
    borderRadius: 15
  },
  buttonContainer: {
    marginVertical: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  circularProgressContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  circularProgressContent: {
    alignItems: "center"
  },
  font: {
    fontSize: 20
  },
  foodImage: {
    position: "absolute",
    top: -20,
    left: -20,
    width: 90,
    height: 90,
    backgroundColor: theme.colors.white
  },
  listContainer: {
    flex: 1,
    alignSelf: "auto"
  },
  header: {
    marginTop: 10,
    padding: theme.sizes.padding / 1.25,
    marginHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: theme.sizes.radius,
    backgroundColor: theme.colors.white
  },
  headerText: {
    fontSize: 35,
    top: -12,
    marginTop: 10
  },
  itemCard: {
    alignItems: "flex-end",
    borderRadius: theme.sizes.radius,
    backgroundColor: theme.colors.white,
    height: 100,
    padding: 16
  },
  itemContainer: {
    padding: 17,
    flex: 1,
    flexDirection: "column",
    margin: 0.5
  },
  itemImage: {
    position: "absolute",
    width: 45,
    height: 45
  },
  listStyle: {
    borderRadius: theme.sizes.radius,
    marginBottom: 5
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

export default HomeScreen;
