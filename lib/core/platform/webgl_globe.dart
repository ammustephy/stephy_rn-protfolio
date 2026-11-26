// WebGL globe on the web, an empty widget on other platforms.
// Import this file, never the two implementations directly.
export 'webgl_globe_stub.dart'
    if (dart.library.js_interop) 'webgl_globe_web.dart';
