import 'package:flutter/foundation.dart';

import '../../../core/constants/app_constants.dart';
import '../../../core/services/link_service.dart';
import '../../../data/repositories/portfolio_repository.dart';

/// Result of sending the contact form.
enum ContactResult { emailAppOpened, emailAppUnavailable }

/// Contact details, form validation and sending, and social links.
class ContactViewModel extends ChangeNotifier {
  final PortfolioRepository _repository;
  final LinkService _links;

  ContactViewModel({
    PortfolioRepository repository = const PortfolioRepository(),
    LinkService links = const LinkService(),
  })  : _repository = repository,
        _links = links;

  String get email => AppConstants.email;
  String get phone => AppConstants.phone;
  String get location => AppConstants.location;
  String get note => _repository.contactNote;

  bool _sending = false;

  /// True while the email app is being opened; the send button is disabled.
  bool get sending => _sending;

  // ---- Validation --------------------------------------------------------

  static final RegExp _emailPattern = RegExp(r'^[\w-.]+@([\w-]+\.)+\w{2,4}$');

  String? validateName(String? value) =>
      value == null || value.trim().isEmpty ? 'Enter your name' : null;

  String? validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) return 'Enter your email';
    if (!_emailPattern.hasMatch(value.trim())) return 'Enter a valid email';
    return null;
  }

  String? validateMessage(String? value) =>
      value == null || value.trim().isEmpty ? 'Enter a message' : null;

  // ---- Actions -----------------------------------------------------------

  /// Opens the visitor's email app with the message filled in, addressed to
  /// me. Nothing is sent until they press send in their email app.
  Future<ContactResult> send({
    required String name,
    required String email,
    required String message,
  }) async {
    _sending = true;
    notifyListeners();
    try {
      final opened = await _links.openEmail(
        to: AppConstants.email,
        subject: 'Portfolio enquiry from ${name.trim()}',
        body: '${message.trim()}\n\nFrom: ${name.trim()} (${email.trim()})',
      );
      return opened
          ? ContactResult.emailAppOpened
          : ContactResult.emailAppUnavailable;
    } finally {
      _sending = false;
      notifyListeners();
    }
  }

  Future<void> openInstagram() => _links.openApp(
        appUrl: 'instagram://user?username=stephy_rn',
        webUrl: AppConstants.instagramUrl,
      );

  Future<void> openLinkedIn() => _links.openApp(
        appUrl: 'linkedin://in/stephy-rn',
        webUrl: AppConstants.linkedInUrl,
      );

  Future<void> openGitHub() => _links.openUrl(AppConstants.gitHubUrl);
}
