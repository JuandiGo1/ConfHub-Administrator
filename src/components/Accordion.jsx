import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

export default function Accordion({ title, description, children, extraInfo }) {
  const [open, setOpen] = useState(false);
  const rotation = useState(new Animated.Value(0))[0];

  const toggleOpen = () => {
    Animated.timing(rotation, {
      toValue: open ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={accordionStyles.wrapper}>
      <TouchableOpacity
        onPress={toggleOpen}
        style={[accordionStyles.header, open && accordionStyles.headerOpen]}
        activeOpacity={0.7}
      >
        <View style={accordionStyles.textWrapper}>
          <Text style={accordionStyles.title}>{title}</Text>
          <Text style={accordionStyles.desc}>{description}</Text>
        </View>

        {extraInfo && <View style={accordionStyles.extraInfoWrapper}>{extraInfo}</View>}

        <Animated.Text
          style={[accordionStyles.arrow, { transform: [{ rotate: rotateInterpolate }] }]}
        >
          ▼
        </Animated.Text>
      </TouchableOpacity>

      {open && <View style={accordionStyles.body}>{children}</View>}
    </View>
  );
}

const accordionStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
  },
  headerOpen: {
    backgroundColor: "#f3f4f6", // light gray when open
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  desc: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  extraInfoWrapper: {
    marginRight: 12,
    alignItems: "flex-end",
  },
  arrow: {
    fontSize: 20,
    color: "#6b7280",
  },
  body: {
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
});
