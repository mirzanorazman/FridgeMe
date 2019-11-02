import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from "react-native";
import {
  ListItem,
  Button,
  Icon,
  SearchBar,
  Overlay,
  Text
} from "react-native-elements";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";

import CustomText from "../components/CustomText";

import fridge_items from "../data/fridge_items";
import { ThemeColors } from "react-navigation";

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
    updatedState: [],
    previousState: [],
    isOverlayVisible: false,
    isOverlayLoading: true
  };

  async componentDidMount() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <CustomText style={styles.headerText}>Your Fridge</CustomText>
        {/* <SearchBar
          placeholder="Type Here..."
          lightTheme={true}
          onChangeText={this.updateSearch}
          value={search}
        /> */}
        <ScrollView style={styles.listContainer}>
          {/* {fridge_items.map((l, i) => (
            <ListItem
              key={i}
              title={l.icon + "   " + l.name}
              badge={{
                value: l.quantity,
                textStyle: { color: "white" },
                containerStyle: { marginTop: -10 }
              }}
              bottomDivider
            />
          ))} */}
          {this.state.foodItems.map((food, index) => (
            <ListItem
              key={food.id}
              title={food.name}
              badge={{
                value: food.quantity,
                textStyle: { color: "white" },
                containerStyle: { marginTop: -10 }
              }}
              bottomDivider
            />
          ))}
          {this.state.uploading && (
            <ActivityIndicator size="large" color="#00ff00" />
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Icon
            name="add-a-photo"
            reverse={true}
            color="#FCAE6B"
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

        <Overlay isVisible={this.state.isOverlayVisible}>
          <View>
            <Text h2>Confirm items?</Text>
            {this.state.isOverlayLoading && (
              <ActivityIndicator size="large" color="#FCAE6B" />
            )}
            {this.state.updatedState.map(food => (
              <ListItem key={food.id} title={food.name} bottomDivider />
            ))}
            <Button
              title="Yes"
              onPress={() => {
                this.setState({ updatedState: [] });
                this.setState({ isOverlayVisible: false });
                this.setState({ isOverlayLoading: true });
              }}
            />
            <Button
              title="No"
              onPress={() => {
                this.setState({ foodItems: this.state.previousState });
                this.setState({ isOverlayVisible: false });
                this.setState({ updatedState: [] });
                this.setState({ isOverlayLoading: true });
              }}
            />
          </View>
        </Overlay>
      </View>
    );
  }

  takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      base64: true
      //aspect: [4, 3]
    });
    this.setState({ isOverlayVisible: true });
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
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC870k5CTBVu-_bHAzTGILAMqiUg5V_p4A",
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

      // preserve the previous state so that we can undo changes in the Overlay
      this.setState({ previousState: this.state.foodItems });

      this.setState({ isOverlayLoading: true });

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

          this.setState({
            updatedState: [...this.state.updatedState, newFoodItem]
          });

          // commit changes to the state
          this.setState({
            foodItems: foodListToUpdate
          });
        } else {
          let newFoodItem = {
            id: Math.floor(Math.random() * Math.floor(100)), // return random no from 0 to 100
            name: food["name"],
            quantity: 1
          };

          // keep track of updated state to show in overlay
          this.setState({
            updatedState: [...this.state.updatedState, newFoodItem]
          });

          this.setState({
            foodItems: [...this.state.foodItems, newFoodItem]
          });
        }
      });
      this.setState({ uploading: false });
      this.setState({ isOverlayLoading: false });
      console.log(this.state.updatedState);
    } catch (error) {
      console.log(error);
    }
  };
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

export default HomeScreen;
