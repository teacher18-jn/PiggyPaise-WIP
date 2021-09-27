import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import db from "../config"

export default class BankITScreen1 extends Component {
  constructor() {
    super();
    this.state = {
      activitiesList: [],
      approveFlag: false,
      code: '',
      cleanflag: false,
      washFlag: false,
      babySittingFlag: false,
      otherFlag: false,
      otherActivity: '',
      isOnCleanToggleSwitch: false,
      isOnWashToggleSwitch: false,
      isOnBabyToggleSwitch: false,
      isOnOthersToggleSwitch: false,
      isClean: false,
      isWash: false,
      isBabysitting: false,
      isOthers: false,
      noOfActivities: 0,
      others: '',
      amountFromDB: 0,
      approveEnabled: true,
      activitiesListDB: [],
      activityUpdated: false,
    };
  }

  componentDidMount() {
    this.createList();
  }

  createList = async() => {
    var activitiesListDB;
    var noOfActivities = 0;
    var info = null;
    await db.ref('Users/User1').on('value', (data) => {
        info = data.val();
    });

   this.setState({activityUpdated: info.activityUpdated}, function(){
     console.log(this.state.activityUpdated)
    })

    this.setState({ noOfActivities: info.noOfActivities }, function () {
      console.log(this.state.noOfActivities);
    });

    this.setState({ activitiesListDB: info.activity }, function () {
      console.log(this.state.activitiesListDB);
    });  

    activitiesListDB = this.state.activitiesListDB;

    var activitiesList = [];
    for (var i in activitiesListDB) {
      activitiesList.push(activitiesListDB[i]);
      if (activitiesListDB[i] === 'clean') {
        this.setState({ cleanFlag: true });
      } else if (activitiesListDB[i] === 'wash') {
        this.setState({ washFlag: true });
      } else if (activitiesListDB[i] === 'baby') {
        this.setState({ babySittingFlag: true });
      } else {
        this.setState({ otherFlag: true });
        this.setState({ otherActivity: activitiesListDB[i] });
      }
    }
    this.setState({ activitiesList: activitiesList });

    this.setState({ amountFromDB: info.Total, approveEnabled: true }, function(){
      console.log(this.state.amountFromDB)
    });
  };


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

tempCheckActivities = () => {
    var tempChoice = [];
    tempChoice.push({ chore: 'Clean', value: this.state.isClean });
    tempChoice.push({ chore: 'Wash', value: this.state.isWash });
    tempChoice.push({ chore: 'Baby Sitting', value: this.state.isBabysitting });
    tempChoice.push({ chore: this.state.others, value: this.state.isOthers });
    console.log('tempchoice:' + tempChoice);
    
    var activitySelected = [];
    var count = 0;
    tempChoice.map((item, index) => {
      if (item.value === true) {
        count += 1;
      }
    })

    this.setState({
      noOfActivities: count,
      approveFlag: true
    }, function(){
      console.log(this.state.noOfActivities)
    })
  };

  tempSubmit = async() => {
    if (!this.state.code.trim()) {
      alert('Please Enter Code');
      return;
    }
    if (this.state.code === '1234') {
      var temp = 0;
      var amount = this.state.noOfActivities * 10 + this.state.amountFromDB;
      var ref = await db.ref('Users/User1');
      await ref.update({
        Total: amount,
      });

      this.reset();

    } else {
      alert('Code Incorrect');
    }
  }

  reset = () =>{
    this.setState({ approveFlag: false });
    this.setState({ noOfActivities: 0 });
    this.setState({ activitiesList: [] });
      this.setState({ cleanFlag: false });
      this.setState({ washFlag: false });
      this.setState({ babySittingFlag: false });
      this.setState({ otherFlag: false });
      this.setState({ activityUpdated: false });
      var activityRef = db.ref('Users/User1');
      activityRef.update({
        activity: '',
      });
      db.ref('Users/User1').update({
        activityUpdated: false,
        noOfActivities: 0,
      });
      this.setState({ noOfActivities: 0 });
  }

  render() {

    const cleanFlag = this.state.cleanFlag;
    const washFlag = this.state.washFlag;
    const babySittingFlag = this.state.babySittingFlag;
    const otherFlag = this.state.otherFlag;
    const otherActivity = this.state.otherActivity;
    const approveFlag = this.state.approveFlag;
    var flag = true;

    if (this.state.activityUpdated) {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />

          {cleanFlag ? (
            <View style={{ flex: 0.2, flexDirection: 'row' }}>
            <Text
              style={{ color: 'coral', fontWeight: 'bold', marginRight: 8 }}>
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
          ) : undefined}

          {washFlag ? (
            <View style={{ flex: 0.2, flexDirection: 'row' }}>
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
          ) : undefined}

          {babySittingFlag ? (
            <View style={{ flex: 0.2, flexDirection: 'row' }}>
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
          ) : undefined}

          {otherFlag ? (
            <View style={{ flex: 0.2, flexDirection: 'row' }}>
            <Text
              style={{ color: 'coral', fontWeight: 'bold', marginRight: 20 }}>{this.state.otherActivity}
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
          ) : undefined}

          <TouchableOpacity
            style={styles.buttonApprove}
            disabled={!this.state.approveEnabled}
            onPress={() => {
              this.tempCheckActivities();
              //this.approve();
            }}>
            <Text style={{ color: 'black' }}> Approve </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonApprove}
            disabled={!this.state.approveEnabled}
            onPress={() => {
              this.reset();
            }}>
            <Text style={{ color: 'black' }}> Don't Approve </Text>
          </TouchableOpacity>

          {approveFlag ? (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ marginTop: 20 }}> Enter secret code </Text>
              <TextInput
                style={styles.inputBox}
                secureTextEntry={true}
                placeholder="Secret Code"
                value={this.state.code}
                onChangeText={(text) => {
                  this.setState({ code: text });
                }}
              />

              <TouchableOpacity
                style={styles.buttonApprove}
                onPress={() => this.tempSubmit()}>
                <Text> Submit </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text> </Text>
          )}
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <SafeAreaView style={styles.droidSafeArea} />
          <Text> No Activities to approve </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
    textAlign: 'center',
  },
  list: {
    alignItems: 'center',
    marginTop: 10,
  },
  buttonApprove: {
    borderRadius: 20,
    borderWidth: 4,
    width: 150,
    alignItems: 'center',
    marginTop: 5,
  },
  inputBox: {
    marginTop: 5,
    width: '60%',
    alignSelf: 'center',
    height: 40,
    textAlign: 'center',
    borderWidth: 2,
    backgroundColor: 'white',
  },
  toggleView: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 100,
  },
  
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
});
