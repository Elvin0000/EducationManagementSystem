import React, {Component} from 'react'; 
import {Text, View} from 'react-native'; 
export default class SettingScreen extends Component{ 
    render() { 
        return ( 
            <View style={{flex: 1, justifyContent: 'center', alignitems: 'center'}}> 
                <Text style={{fontSize: 50}}>Settings</Text> 
            </View> 
        );
    }
};