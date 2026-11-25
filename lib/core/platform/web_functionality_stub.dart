import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';

/// No setup needed outside the web.
void configureApp() {}

/// Opens the resume with the system's viewer (Android, iOS, desktop).
Future<void> downloadResume(String url, String filename) => _open(url);

/// Opens the resume with the system's viewer (Android, iOS, desktop).
Future<void> viewResume(String url) => _open(url);

Future<void> _open(String url) async {
  final uri = Uri.parse(url);
  if (await canLaunchUrl(uri)) {
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  } else {
    debugPrint('Could not launch $url');
  }
}
