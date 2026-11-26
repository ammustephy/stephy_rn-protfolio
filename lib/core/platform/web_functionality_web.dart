import 'package:flutter_web_plugins/flutter_web_plugins.dart';
import 'package:web/web.dart' as web;

/// Web-only setup: clean URLs without the "#".
void configureApp() {
  usePathUrlStrategy();
}

/// Starts a browser download of the file at [url].
void downloadResume(String url, String filename) {
  final anchor = web.document.createElement('a') as web.HTMLAnchorElement
    ..href = url
    ..download = filename
    ..target = '_blank';
  web.document.body!.append(anchor);
  anchor.click();
  anchor.remove();
}

/// Opens the file at [url] in a new tab.
void viewResume(String url) {
  web.window.open(url, '_blank');
}
