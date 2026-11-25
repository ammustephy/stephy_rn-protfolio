// Picks the web implementation in the browser and the url_launcher one
// elsewhere. Import this file, never the two implementations directly.
export 'web_functionality_stub.dart'
    if (dart.library.js_interop) 'web_functionality_web.dart';
