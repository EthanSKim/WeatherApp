import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto, Ionicons, Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";

const { width:SCREEN_WIDTH } = Dimensions.get('window');
import api_key from './api_key';
const API_KEY = api_key;

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Snow: "snowflake",
  Rain: "rains",
  Drizzle: "rain",
  Thunerstorm: "lightning",
  Atmosphere: "cloudy-gusts"
}

export default function App() {
  const [city, setCity] = useState("Finding Location");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const ask = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    setOk(granted);
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily);
  }
  useEffect(() => {
    ask();
  },[]);
  return (
    <View style={styles.container}>
      <StatusBar style={{color:"black"}}/>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled indicatorStyle="white" showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
        <View style={{...styles.day, alignItems:"center"}}>
          <ActivityIndicator color="black" style={{marginTop:10}}/>
        </View>) : (
        days.map((day, index) => (
          <View key={index} style={styles.day}>
            <Text style={{fontSize:30, fontWeight:"600"}}>{(new Date(day.dt*1000)).toLocaleString("en-US", {weekday:"long"})}</Text>
            <View style={{flexDirection:"row"}}>
              <Text style={{fontSize:20, fontWeight:"400"}}>{(new Date(day.dt*1000)).toLocaleString("en-US", {day:"2-digit"})} </Text>
              <Text style={{fontSize:20, fontWeight:"400"}}>{(new Date(day.dt*1000)).toLocaleString("en-US", {month:"long"})}</Text>
            </View>
            <View style={{flexDirection:"row", alignItems:"center", width:"100%", justifyContent: "space-between"}}>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}°</Text>
              <Fontisto name={icons[day.weather[0].main]} size={68} color="black" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <View style={{height:5, backgroundColor:"black", marginTop:38}}/>
            <View style={styles.specificContainer}>
              <View style={{...styles.specificRow, marginBottom:40}}>
                <View>
                  <Ionicons name={"water-outline"} size={28} style={{textAlign:"center"}}/>
                  <Text adjustsFontSizeToFit style={styles.specific}>Humidity</Text>
                  <View style={{height:2, backgroundColor:"black"}} />
                  <Text adjustsFontSizeToFit style={styles.specific}>{day.humidity}%</Text>
                </View>
                <View>
                  <Feather name="sunrise" size={28} style={{textAlign:"center"}}/>
                  <Text adjustsFontSizeToFit style={styles.specific}>Sunrise: {(new Date(day.sunrise*1000)).toLocaleString("en-US", {hour12: false, hour: "numeric"})}</Text>
                  <View style={{height:2, backgroundColor:"black"}} />
                  <Text adjustsFontSizeToFit style={styles.specific}>Sunset: {(new Date(day.sunset*1000)).toLocaleString("en-US", {hour12: false, hour: "numeric"})}</Text>
                </View>
              </View>
              <View style={{...styles.specificRow, marginTop:40}}>
                <View>
                  <MaterialCommunityIcons name="sun-wireless-outline" size={28} style={{textAlign:"center"}}/>
                  <Text adjustsFontSizeToFit style={styles.specific}>UV INDEX</Text>
                  <View style={{height:2, backgroundColor:"black"}} />
                  <Text adjustsFontSizeToFit style={styles.specific}>{day.uvi}</Text>
                </View>
                <View>
                  <FontAwesome5 name="wind" size={28} style={{textAlign:"center"}}/>
                  <Text adjustsFontSizeToFit style={styles.specific}>Wind Speed</Text>
                  <View style={{height:2, backgroundColor:"black"}} />
                  <Text adjustsFontSizeToFit style={styles.specific}>{day.wind_speed} mph</Text>
                </View>
              </View>
            </View>
          </View>
        )))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7CAC9"
  },
  city: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    fontSize: 38,
    fontWeight: "500"
  },
  weather: {},
  day: {
    paddingHorizontal: 20,
    width: SCREEN_WIDTH,
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 100,
  },
  description: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: "500",
  },
  tinyText: {
    fontSize: 25,
    marginTop: -5,
    fontWeight: "500",
  },
  specificContainer: {
    marginTop:30,
    marginBottom: -90
  },
  specificRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  specific: {
    textAlign:"center", 
    fontSize:30,
    fontWeight: "700"
  }
})
