Pod::Spec.new do |s|
  s.name           = 'ExpoMilibris'
  s.version        = '0.1.0'
  s.summary        = 'Using miLibris native SDK for iOS and Android'
  s.description    = 'Expo module for integrating miLibris Reader SDK'
  s.author         = 'Livio Gamassia'
  s.homepage       = 'https://github.com/LivioGama/expo-milibris'
  s.platforms      = { :ios => '11.0' }
  s.source         = { git: 'https://github.com/LivioGama/expo-milibris' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end 