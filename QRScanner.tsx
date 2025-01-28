import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import Ionicons from "react-native-vector-icons/Ionicons";

const QRScanner = ({ onRead, onClose }: any) => {
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice("back");
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      console.log(`onCodeScanned `, codes);
      console.log(`onCodeScanned value`, codes[0].value);
      onRead(codes[0].value);
    },
  });

  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      console.log("Camera.requestCameraPermission ", permission);
      setHasPermission(permission === "granted");
    };

    requestCameraPermission();
  }, []);

  if (device == null || !hasPermission) {
    return (
      <View style={styles.page2}>
        <Text style={{ backgroundColor: "white" }}>
          Camera not available or not permitted
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.page2}>
      <Camera
        codeScanner={codeScanner}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
       {/* Header with Back Button */}
       <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="arrow-back-outline" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QRScanner;

const styles = StyleSheet.create({
  page2: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
  },
});