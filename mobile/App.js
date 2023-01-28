import {
  Text,
  View,
  Pressable,
  StatusBar,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import HTMLParser from "fast-html-parser";
import moment from "moment";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
} from "@expo-google-fonts/manrope";
import { FAB, Provider } from "react-native-paper";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

function Post({ item }) {
  return (
    <View
      style={{
        backgroundColor: "rgb(241,245,249)",
        marginBottom: 12,
        elevation: 2,
        borderRadius: 6,
        padding: 24,
        marginHorizontal: 30,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              color: "rgb(148,163,184)",
              fontFamily: "Manrope_400Regular",
            }}
          >
            {moment(item.time).format("MMM DD, yyyy")}
          </Text>
          <Text
            style={{
              fontFamily: "Manrope_500Medium",
              fontSize: 20,
            }}
          >
            {item.name}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            padding: 4,
            borderRadius: 6,
            overflow: "hidden",
          }}
          onPress={() => {
            console.log("SUCKS");
          }}
        >
          <MaterialIcons name="more-vert" size={20} color="rgb(148,163,184)" />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          color: "rgb(148,163,184)",
          marginTop: 8,
          fontFamily: "Manrope_400Regular",
        }}
        numberOfLines={3}
      >
        {HTMLParser.parse(item.content).text || "No text available"}
      </Text>
      <View
        style={{
          marginTop: 22,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Manrope_500Medium",
              fontSize: 16,
            }}
          >
            Read article
          </Text>
          <AntDesign
            style={{
              marginLeft: 4,
              marginTop: 2,
            }}
            name="arrowright"
            size={17}
            color="black"
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function App() {
  const [data, setData] = useState([]);
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
  });
  const [refreshing, setRefreshing] = useState(false);

  function fetchData() {
    fetch("http://192.168.1.7:3636/list")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setRefreshing(false);
      });
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    fontsLoaded && (
      <Provider>
        <View
          style={{
            backgroundColor: "rgb(226,232,240)",
            flex: 1,
          }}
        >
          <FlatList
            contentContainerStyle={{
              paddingBottom: 16,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={() => (
              <View
                style={{
                  padding: 26,
                  paddingHorizontal: 30,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Manrope_500Medium",
                    fontSize: 28,
                  }}
                >
                  My Personal Blog
                </Text>
                <Text
                  style={{
                    fontFamily: "Manrope_400Regular",
                    fontSize: 18,
                    marginTop: 4,
                    color: "rgb(148,163,184)",
                  }}
                >
                  Fuck my life forever
                </Text>
              </View>
            )}
            data={data}
            renderItem={Post}
            keyExtractor={(item) => item._id}
          />
          <StatusBar style="auto" />
        </View>
        <FAB
          icon="pencil"
          style={{
            position: "absolute",
            bottom: 22,
            right: 22,
            backgroundColor: "black",
            padding: 4,
            borderRadius: 12,
          }}
        />
      </Provider>
    )
  );
}
