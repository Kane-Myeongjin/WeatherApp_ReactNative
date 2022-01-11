import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const WEATHER_API_KEY = "";

const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Snow: "snow",
    Atmosphere: "cloudy-gusts",
    Rain: "rains",
    Drizzle: "rain",
    Thunderstorm: "lightning",
};

export default function App() {
    // // 1th-Example
    // return (
    //     <View style={styles.container}>
    //         <Text style={styles.text}>I made RN App! 안녕</Text>
    //         <StatusBar style="auto" />
    //     </View>
    // );

    // 2th-example flex-container
    // return (
    //     <View style={{ flex: 2, flexDirection: "row" }}>
    //         <View style={{ flex: 1, backgroundColor: "tomato" }}></View>
    //         <View style={{ flex: 1, backgroundColor: "teal" }}></View>
    //         <View style={{ flex: 1, backgroundColor: "orange" }}></View>
    //     </View>
    // );

    // Weather app
    const [city, setCity] = useState("Loading...");
    const [days, setDays] = useState([]);
    const [ok, setOk] = useState(true);

    const getWeather = async () => {
        // 위치 권한요청
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOk(false);
            return;
        }

        // 위치 조회
        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({
            accuracy: 5,
        });
        const locale = await Location.reverseGeocodeAsync(
            { latitude, longitude },
            {
                useGoogleMaps: false,
            }
        );
        setCity(locale[0].city);

        // 일기예보 조회
        const reponse = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=${WEATHER_API_KEY}&units=metric`
        );
        const json = await reponse.json();
        setDays(json.daily);
    };

    useEffect(() => {
        getWeather();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.weather}
                horizontal
                pagingEnabled
                // indicatorStyle="white"
                showsHorizontalScrollIndicator={false}
            >
                {days.length === 0 ? (
                    <View style={styles.day}>
                        <ActivityIndicator
                            color="white"
                            style={{ marginTop: 10 }}
                            size="large"
                        />
                    </View>
                ) : (
                    days.map((day, index) => (
                        <View key={index} style={styles.day}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    width: "100%",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text style={styles.temp}>
                                    {parseFloat(day.temp.day).toFixed(1)}
                                </Text>
                                <Fontisto
                                    name={icons[day.weather[0].main]}
                                    size={68}
                                    color="black"
                                />
                            </View>
                            <Text style={styles.description}>
                                {day.weather[0].main}
                            </Text>
                            <Text style={styles.tinyText}>
                                {day.weather[0].description}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
            <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "tomato",
    },
    city: {
        flex: 1.2,
        justifyContent: "center",
        alignItems: "center",
    },
    cityName: {
        fontSize: 68,
        fontWeight: "500",
    },
    weather: {},
    day: {
        width: SCREEN_WIDTH,
        alignItems: "flex-start",
        paddingLeft: 20,
    },
    temp: {
        marginTop: 50,
        fontSize: 108,
    },
    description: {
        marginTop: -30,
        fontSize: 40,
    },
    tinyText: {
        fontSize: 20,
    },
});

// // 1th-Example
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     text: {
//         fontSize: 28,
//         color: "blue",
//     },
// });
