import 'dart:html' as html;
import 'package:flutter_web_plugins/flutter_web_plugins.dart';

void configureApp() {
  usePathUrlStrategy();
}

void downloadResume(String url, String filename) {
  final anchor = html.AnchorElement(href: url)
    ..download = filename
    ..target = 'blank';
  html.document.body!.append(anchor);
  anchor.click();
  anchor.remove();
}

void viewResume(String url) {
  html.window.open(url, '_blank');
}
