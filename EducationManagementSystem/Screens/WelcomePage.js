import React, {Component} from 'react'; 
import {Text, View} from 'react-native'; 
export default class WelcomeScreen extends Component{ 
    render() { 
        return (
            <View style={{flex: 1, justifyContent: 'center', alignitems: 'center'}}> 
                <Text style={{fontSize: 50}}>Home</Text> 
            </View>
        );
    }
}