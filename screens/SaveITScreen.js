import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Switch,
} from 'react-native';

import db from '../config';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnCleanToggleSwitch: false,
      isOnWashToggleSwitch: false,
      isOnBabyToggleSwitch: false,
      isOnOthersToggleSwitch: false,
      isClean: false,
      isWash: false,
      isBabysitting: false,
      isOthers: false,
      enabled: true,
      final: [],
      others: 'others',
      activityData: [],
      activityUpdated: false,
      counter: 0,
    };
  }

  componentDidMount = async () => {
    await db.ref('Users/User1').on('value', (data) => {
      this.setState({ activityUpdated: data.val().activityUpdated });
    });
    this.reset();
  };

  reset() {
    this.setState(
      {
        enabled: true,
        isOnCleanToggleSwitch: false,
        isOnWashToggleSwitch: false,
        isOnBabyToggleSwitch: false,
        isOnOthersToggleSwitch: false,
        isClean: false,
        isWash: false,
        isBabysitting: false,
        isOthers: false,
      },
      function () {
        console.log(this.state.isOnBabyToggleSwitch);
      }
    );
  }

  toggleSwitch(label) {
    if (label === 'clean') {
      this.setState({ isClean: !this.state.isClean });
    } else if (label === 'wash') {
      this.setState({ isWash: !this.state.isWash });
    } else if (label === 'baby') {
      this.setState({ isBabysitting: !this.state.isBabysitting });
    } else {
      this.setState({ isOthers: !this.state.isOthers });
    }
  }

  finalChoice = () => {
    if (
      !this.state.isClean &&
      !this.state.isWash &&
      !this.state.isBabysitting &&
      !this.state.isOthers
    ) {
      alert('Please select activity');
    } else {
      this.setState({ enabled: false });
      this.setState({ counter: 0 });
      var choice = [];
      var activity = [];
      choice.push({ act: 'clean', value: this.state.isClean });
      choice.push({ act: 'wash', value: this.state.isWash });
      choice.push({ act: 'baby', value: this.state.isBabysitting });
      if (this.state.others === '') {
        choice.push({ act: 'others', value: this.state.isOthers });
      } else {
        choice.push({ act: this.state.others, value: this.state.isOthers });
      }

      console.log(choice);

      choice.map((item) => {
        if (item.value === true) {
          activity.push(item.act);
        }
      });

      db.ref('Users/User1').update({ activity });
      db.ref('Users/User1').update({
        activityUpdated: true,
        noOfActivities: activity.length,
      });
    }
  };

  render() {
    if (this.state.activityUpdated === false) {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Activities</Text>

          <View style={{ flex: 0.2, flexDirection: 'row', alignItems:"center", justifyContent:"center" }}>
            <Text
              style={{ color: 'coral', fontWeight: 'bold', marginLeft: 40,marginRight: 20 }}>
              Cleaning
            </Text>
            <Switch
              style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
              trackColor={{
                false: 'grey',
                true: this.state.isClean ? 'blue' : 'grey',
              }}
              thumbColor={this.state.isClean ? '#ee8249' : 'black'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => this.toggleSwitch('clean')}
              value={this.state.isClean}
            />
          </View>

          <View style={{ lex: 0.2, flexDirection: 'row', alignItems:"center", justifyContent:"center"}}>
            <Text
              style={{ color: 'coral', fontWeight: 'bold', marginRight: 20 }}>
              Washing
            </Text>
            <Switch
              style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
              trackColor={{
                false: 'grey',
                true: this.state.isWash ? 'blue' : 'grey',
              }}
              thumbColor={this.state.isWash ? '#ee8249' : 'black'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => this.toggleSwitch('wash')}
              value={this.state.isWash}
            />
          </View>

          <View style={{ lex: 0.2, flexDirection: 'row', alignItems:"center", justifyContent:"center" }}>
            <Text
              style={{ color: 'coral', fontWeight: 'bold', marginRight: 8 }}>
              Baby Sitting
            </Text>
            <Switch
              style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
              trackColor={{
                false: 'grey',
                true: this.state.isBabysitting ? 'blue' : 'grey',
              }}
              thumbColor={this.state.isBabysitting ? '#ee8249' : 'black'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => this.toggleSwitch('baby')}
              value={this.state.isBabysitting}
            />
          </View>

          <View style={{ lex: 0.2, flexDirection: 'row', alignItems:"center", justifyContent:"center" }}>
            <Text
              style={{ color: 'coral', fontWeight: 'bold', marginRight: 20 }}>
              Others
            </Text>
            <Switch
              style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
              trackColor={{
                false: 'grey',
                true: this.state.isOthers ? 'blue' : 'grey',
              }}
              thumbColor={this.state.isOthers ? '#ee8249' : 'black'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => this.toggleSwitch('others')}
              value={this.state.isOthers}
            />
            
          </View>
          <View style={{ marginTop: 20}}>
            <TextInput
              style={{ backgroundColor: 'coral', height: 30, width:100 }}
              onChangeText={(text) => {
                this.setState({ others: text });
              }}
              //value={}
              placeholder="others"
            />
          </View>

          <Button
            title="Submit"
            disabled={this.state.activityUpdated}
            onPress={() => {
              if (this.state.others === '') {
                alert('Enter Others');
              } else {
                this.finalChoice();
              }
            }}
          />
        </View>
      );
    } else {
      return (
        <View>
          <Text>No Activities</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
