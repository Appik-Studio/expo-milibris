import ExpoMilibris, {
    ReaderLanguage,
    type OpenReaderOptions,
} from "expo-milibris";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const openSampleReader = async () => {
    setIsLoading(true);
    try {
      const options: OpenReaderOptions = {
        releasePath: "/path/to/sample/release",
        articlesLanguageCode: ReaderLanguage.EN_US,
        config: {
          features: {
            printEnabled: true,
            textToSpeechEnabled: true,
            shareEnabled: true,
            summaryEnabled: true,
            summaryImagesEnabled: true,
          },
          debugBoxes: false,
        },
        issueId: "sample-issue-123",
      };

      const result = await ExpoMilibris.openReader(options);

      if (result.status === "success") {
        Alert.alert("Success", "Reader opened successfully");
      } else {
        Alert.alert("Error", result.data?.error || "Unknown error occurred");
      }
    } catch (error) {
      Alert.alert("Error", `Failed to open reader: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSample = async () => {
    setIsLoading(true);
    try {
      const ticketUrl =
        "https://content.milibris.com/access/sample-ticket/download.complete";
      const destinationPath = "/path/to/destination/sample.complete";

      await ExpoMilibris.downloadAndUnpackArchive(ticketUrl, destinationPath);
      Alert.alert("Success", "Archive downloaded and unpacked successfully");
    } catch (error) {
      Alert.alert("Error", `Failed to download: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const setDebugLogging = () => {
    ExpoMilibris.setLogLevel("debug");
    Alert.alert("Debug", "Log level set to debug");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>miLibris Reader SDK</Text>
        <Text style={styles.subtitle}>Example App</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reader Features</Text>
          <Text style={styles.description}>
            This example demonstrates the miLibris Reader SDK integration with
            Expo. The reader provides a complete digital publication experience
            with features like:
          </Text>

          <View style={styles.featureList}>
            <Text style={styles.feature}>• Interactive article reading</Text>
            <Text style={styles.feature}>• Text-to-speech functionality</Text>
            <Text style={styles.feature}>• Print capabilities</Text>
            <Text style={styles.feature}>• Social sharing</Text>
            <Text style={styles.feature}>• Article bookmarking</Text>
            <Text style={styles.feature}>• Search functionality</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={openSampleReader}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Loading..." : "Open Sample Reader"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={downloadSample}
            disabled={isLoading}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Download Sample Archive
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton]}
            onPress={setDebugLogging}
          >
            <Text style={[styles.buttonText, styles.tertiaryButtonText]}>
              Enable Debug Logging
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Note: This example requires a valid miLibris license key and content
            files. Contact miLibris support for integration assistance.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    marginBottom: 16,
  },
  featureList: {
    marginLeft: 10,
  },
  feature: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    marginBottom: 4,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  tertiaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  secondaryButtonText: {
    color: "#007AFF",
  },
  tertiaryButtonText: {
    color: "#666",
  },
  footer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFA500",
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    fontStyle: "italic",
  },
});

export default HomePage;
