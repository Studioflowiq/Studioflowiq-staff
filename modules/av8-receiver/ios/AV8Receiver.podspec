Pod::Spec.new do |s|
  s.name = 'AV8Receiver'
  s.version = '1.0.0'
  s.summary = 'AV8 foreground Wi-Fi GDL90 receiver beta'
  s.description = 'Local UDP receiver transport for AV8 Flight Instrument.'
  s.license = { :type => 'MIT' }
  s.author = 'AV8 FLY'
  s.homepage = 'https://av8fly.com'
  s.platforms = { :ios => '16.0' }
  s.source = { :git => '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.frameworks = 'Network'
  s.swift_version = '5.9'
  s.source_files = '**/*.{h,m,mm,swift}'
end
