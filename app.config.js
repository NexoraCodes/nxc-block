export default {
  expo: {
    name: "Block Blast X",
    slug: "block-blast-x",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      baseUrl: "/block-blast-x"
    },
    // Platform-specific configurations
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.nexoracodes.block-blast-x"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS"
      ],
      package: "com.nexoracodes.block-blast-x"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    extra: {
      // Any extra configuration can go here
      eas: {
        projectId: "98bae1e3-fa9e-42e3-84d5-6a4b9d7916dc"
      }
    }

  }
};
