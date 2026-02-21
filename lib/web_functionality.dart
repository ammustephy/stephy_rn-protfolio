import 'package:url_launcher/url_launcher.dart';

void configureApp() {
  // No-op for mobile/desktop
}

Future<void> downloadResume(String url, String filename) async {
  final Uri uri = Uri.parse(url);
  if (await canLaunchUrl(uri)) {
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  } else {
    print('Could not launch $url');
  }
}

Future<void> viewResume(String url) async {
  final Uri uri = Uri.parse(url);
  if (await canLaunchUrl(uri)) {
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  } else {
    print('Could not launch $url');
  }
}
