import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";

const numberRange = Array(10)
  .fill()
  .map((x, i) => i);

const getPosition = (value, height) => parseInt(value, 10) * height * -1;

const getTranslateStyle = (position) => ({
  transform: [
    {
      translateY: position,
    },
  ],
});

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function Tick({ value, height }) {
  const animation = useRef(
    new Animated.Value(getPosition(value, height))
  ).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: getPosition(value, height),
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [value, height]);

  const transformStyle = getTranslateStyle(animation);

  return (
    <Animated.View style={[styles.tick, transformStyle]}>
      {numberRange.map((number) => (
        <Text key={number} style={styles.tickText}>
          {number}
        </Text>
      ))}
    </Animated.View>
  );
}

export default function App() {
  const [measured, setMeasured] = useState(false);
  const [height, setHeight] = useState(0);
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(1);
  const [value3, setValue3] = useState(9);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue1(getRandom(0, 9));
      setValue2(getRandom(0, 9));
      setValue3(getRandom(0, 9));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setMeasured(true);
    setHeight(height);
  };

  const wrapStyle = measured ? { height } : styles.measure;

  return (
    <View style={styles.container}>
      <View style={[styles.row, wrapStyle]} onLayout={handleLayout}>
        <Tick height={height} value={value1} />
        <Tick height={height} value={value2} />
        <Tick height={height} value={value3} />
      </View>
      <Text style={[styles.tickText, styles.measure]} onLayout={handleLayout}>
        0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
    backgroundColor: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    overflow: "hidden",
    flexDirection: "row",
  },
  measure: {
    opacity: 0,
  },
  tickText: {
    color: "white",
  },
  // tick: {
  // },
});
