import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { ListItem, Button, Icon, SearchBar } from "react-native-elements";

import CustomText from "../components/CustomText";

import fridge_items from "../data/fridge_items";

const { width, height } = Dimensions.get("window");

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    search: ""
  };

  render() {
    const { search } = this.state;

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
          {fridge_items.map((l, i) => (
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
          ))}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Icon
            name="add-a-photo"
            reverse={true}
            color="#FCAE6B"
            onPress={() => console.log("hello")}
          />
          {/* <Button
            icon={<Icon name="add-a-photo" size={17} color="white" />}
            title="  Add item"
            buttonStyle={styles.button}
          /> */}
          {/* <Button
            icon={<Icon name="add-a-photo" size={17} color="white" />}
            // title="  Add item"
            buttonStyle={styles.button}
          /> */}
          <Button
            icon={<Icon name="shuffle" color="white" />}
            title="   Generate Recipe"
            buttonStyle={styles.button}
          />
        </View>
      </View>
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

export default HomeScreen;
