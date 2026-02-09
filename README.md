# 📦 expo-milibris

A state-of-the-art Expo plugin for integrating the miLibris Reader SDK into iOS and Android applications. This plugin enables developers to easily add digital publication reading capabilities to their Expo apps.

## Features

- 📱 **Cross-platform**: Works on both iOS and Android
- 📖 **Full Reader Experience**: Complete digital publication reading with native performance
- 🎨 **Customizable**: Extensive configuration options for branding and features
- 🔍 **Search**: Built-in article search functionality
- 🔊 **Text-to-Speech**: Accessibility support with TTS
- 📄 **Print Support**: Allow users to print pages
- 📤 **Sharing**: Social sharing capabilities
- 🔖 **Bookmarks**: Article bookmarking system
- 🌐 **Multi-language**: Support for multiple languages

## Installation

```bash
bun add expo-milibris
```

### iOS Setup

Add the miLibris repository to your iOS project's Podfile:

```ruby
source 'https://github.com/miLibris/ios-milibris-reader-sdk.git'
```

### Android Setup

Add the miLibris Maven repository to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "extraMavenRepos": ["https://maven-android-sdk.milibris.net/"]
          }
        }
      ]
    ]
  }
}
```

## Configuration

### License Key

You need to configure your miLibris license key. Add it to your app's manifest:

**iOS (Info.plist):**
```xml
<key>MiLibrisLicenseKey</key>
<string>YOUR_LICENSE_KEY</string>
```

**Android (AndroidManifest.xml):**
```xml
<application>
    <meta-data 
        android:name="com.milibris.pdfreader.licencekey" 
        android:value="YOUR_LICENCE_KEY" />
</application>
```

## Usage

### Basic Example

```typescript
import ExpoMilibris, { ReaderLanguage, type OpenReaderOptions } from 'expo-milibris';

const openReader = async () => {
  try {
    const options: OpenReaderOptions = {
      releasePath: '/path/to/your/publication',
      articlesLanguageCode: ReaderLanguage.EN_US,
      config: {
        features: {
          printEnabled: true,
          textToSpeechEnabled: true,
          shareEnabled: true,
          summaryEnabled: true
        }
      }
    };

    const result = await ExpoMilibris.openReader(options);
    
    if (result.status === 'success') {
      console.log('Reader opened successfully');
    } else {
      console.error('Error:', result.data?.error);
    }
  } catch (error) {
    console.error('Failed to open reader:', error);
  }
};
```

### Download and Unpack Archive

```typescript
const downloadPublication = async () => {
  try {
    const ticketUrl = 'https://content.milibris.com/access/your-ticket/download.complete';
    const destinationPath = '/path/to/destination/publication.complete';
    
    await ExpoMilibris.downloadAndUnpackArchive(ticketUrl, destinationPath);
    console.log('Publication downloaded and unpacked successfully');
  } catch (error) {
    console.error('Download failed:', error);
  }
};
```

### Configure Logging

```typescript
// Set log level for debugging
ExpoMilibris.setLogLevel('debug'); // 'debug' | 'info' | 'warning' | 'error'
```

## API Reference

### `openReader(options: OpenReaderOptions): Promise<ReaderResult>`

Opens the miLibris reader with the specified configuration.

#### OpenReaderOptions

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `releasePath` | `string` | ✅ | Path to the unpacked publication |
| `articlesLanguageCode` | `ReaderLanguage` | ✅ | Language for articles |
| `config` | `ReaderConfig` | ❌ | Reader configuration options |
| `licenseKey` | `string` | ❌ | miLibris license key |
| `baseUrl` | `string` | ❌ | Custom API base URL |
| `issueId` | `string` | ❌ | Issue identifier |
| `coverImageUrl` | `string` | ❌ | Cover image URL for transitions |
| `coverRatio` | `number` | ❌ | Cover image aspect ratio |

#### ReaderConfig

```typescript
type ReaderConfig = {
  features?: {
    printEnabled?: boolean;
    textToSpeechEnabled?: boolean;
    shareEnabled?: boolean;
    summaryEnabled?: boolean;
    summaryImagesEnabled?: boolean;
    faceCropEnabled?: boolean;
    imageCropEnabled?: boolean;
  };
  articleReader?: {
    features?: {
      forceLayout?: 'default' | 'custom';
      isImageCropEnabled?: boolean;
    };
  };
  logo?: string;
  targetPageNumber?: number;
  debugBoxes?: boolean;
};
```

### `downloadAndUnpackArchive(ticketUrl: string, destinationPath: string): Promise<string>`

Downloads and unpacks a miLibris publication archive.

### `setLogLevel(level: string): void`

Sets the logging level for the SDK.

## Supported Languages

- `ReaderLanguage.EN_US` - English (US)
- `ReaderLanguage.FR_FR` - French (France)
- `ReaderLanguage.ES_ES` - Spanish (Spain)
- `ReaderLanguage.DE_DE` - German (Germany)
- `ReaderLanguage.IT_IT` - Italian (Italy)
- `ReaderLanguage.PT_PT` - Portuguese (Portugal)
- `ReaderLanguage.NL_NL` - Dutch (Netherlands)

## Example App

The repository includes a complete example app demonstrating all features. To run it:

```bash
cd example
bun install
bun start
```

## Requirements

- **iOS**: iOS 11.0 or later
- **Android**: Android 5.0 (API level 21) or later
- **Expo**: SDK 52 or later
- **miLibris License**: Contact miLibris for licensing

## Support

For technical support and licensing information, contact [miLibris support](mailto:support@milibris.com).

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

---

**Note**: This plugin requires a valid miLibris license key and content files. Contact miLibris support for integration assistance and licensing information.

---

<sub>Swiss made by [Appik Studio](https://www.appik-studio.ch) 🖤</sub>
