import React, { Component } from "react";
import { Text } from "react-native";

import * as Font from "expo-font";

class CustomText extends Component {
  state = {
    fontLoaded: false
  };

  async componentDidMount() {
    await Font.loadAsync({
      RobotoRegular: require("../resources/fonts/Roboto-Regular.ttf"),
      RobotoLight: require("../resources/fonts/Roboto-Light.ttf"),
      RobotoBold: require("../resources/fonts/Roboto-Bold.ttf")
    });

    this.setState({
      fontLoaded: true
    });
  }

  render() {
    const { children, styles } = this.props;
    if (this.state.fontLoaded) {
      return <Text style={[font.text, styles]}>{children}</Text>;
    }

    return <Text style={styles}>{children}</Text>;
  }
}

const font = {
  text: {
    fontFamily: "RobotoRegular",
    fontSize: 30
  }
};

export default CustomText;
