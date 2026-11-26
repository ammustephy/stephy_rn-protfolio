import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';

/// Opens external links: websites, social apps and the email app.
class LinkService {
  const LinkService();

  /// Opens [url] in a new tab or the matching app.
  Future<bool> openUrl(String url) =>
      launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);

  /// Opens [url] in the current tab (used for links within this website).
  Future<bool> openInSameTab(String url) =>
      launchUrl(Uri.parse(url), webOnlyWindowName: '_self');

  /// Tries the native app link first (e.g. `instagram://`) and falls back to
  /// the website.
  Future<void> openApp({required String appUrl, required String webUrl}) async {
    final appUri = Uri.parse(appUrl);
    final webUri = Uri.parse(webUrl);
    if (await canLaunchUrl(appUri)) {
      await launchUrl(appUri, mode: LaunchMode.externalApplication);
    } else if (await canLaunchUrl(webUri)) {
      await launchUrl(webUri, mode: LaunchMode.externalApplication);
    } else {
      debugPrint('Could not open $webUrl');
    }
  }

  /// Opens the visitor's email app with a pre-filled message.
  Future<bool> openEmail({
    required String to,
    required String subject,
    required String body,
  }) {
    final uri = Uri(
      scheme: 'mailto',
      path: to,
      query: _encodeQuery({'subject': subject, 'body': body}),
    );
    return launchUrl(uri);
  }

  // mailto links need %20 for spaces, not "+".
  String _encodeQuery(Map<String, String> params) => params.entries
      .map((e) =>
          '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
      .join('&');
}
