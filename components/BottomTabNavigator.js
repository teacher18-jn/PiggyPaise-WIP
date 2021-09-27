import React,{Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SaveITScreen from "../screens/SaveITScreen";
import BankITScreen from "../screens/BankITScreen";

const Tab = createBottomTabNavigator();

export default class BottomTabNavigator extends Component{
  constructor(props){
    super(props);
    this.state = {
      isUpdated: false
    }
  }

  renderFeed = props => {
    return <SaveITScreen setUpdateToFalse={this.removeUpdated} {...props} />;
  };

  renderStory = props => {
    return <BankITScreen setUpdateToTrue={this.changeUpdated} {...props} />;
  };

  changeUpdated = () => {
    this.setState({ isUpdated: true });
  };

  removeUpdated = () => {
    this.setState({ isUpdated: false });
  };

  render(){
    return(
      <NavigationContainer>
          <Tab.Navigator>
              <Tab.Screen name="Save IT" component={this.renderFeed} options ={{unmountOnBlur: true}}/>
              <Tab.Screen name="Bank IT" component={this.renderStory} options ={{unmountOnBlur: true}}/>
          </Tab.Navigator>
      </NavigationContainer>
    )
  }
}