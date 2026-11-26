import 'package:flutter/widgets.dart';

import '../../../core/constants/app_constants.dart';
import '../../../core/platform/browser_actions.dart' as browser;
import '../../../core/services/link_service.dart';
import '../../../data/repositories/portfolio_repository.dart';

/// The page sections, in the order they appear.
enum PortfolioSection {
  home('Home'),
  portfolio('Portfolio'),
  works('Works'),
  about('About'),
  contact('Contact');

  final String label;
  const PortfolioSection(this.label);
}

/// State and actions for the home page: section navigation, hero text and
/// the resume download.
class HomeViewModel {
  final PortfolioRepository _repository;
  final LinkService _links;
  final Map<PortfolioSection, GlobalKey> _sectionKeys = {
    for (final section in PortfolioSection.values) section: GlobalKey(),
  };

  HomeViewModel({
    PortfolioRepository repository = const PortfolioRepository(),
    LinkService links = const LinkService(),
  })  : _repository = repository,
        _links = links;

  String get heroGreeting => _repository.heroGreeting;
  String get heroPitch => _repository.heroPitch;

  /// Sections shown as links in the desktop app bar (Contact is a button).
  List<PortfolioSection> get navLinks => const [
        PortfolioSection.home,
        PortfolioSection.portfolio,
        PortfolioSection.works,
        PortfolioSection.about,
      ];

  GlobalKey keyFor(PortfolioSection section) => _sectionKeys[section]!;

  /// Smoothly scrolls the page to [section].
  void scrollTo(PortfolioSection section) {
    final ctx = keyFor(section).currentContext;
    if (ctx == null) return;
    Scrollable.ensureVisible(
      ctx,
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
    );
  }

  /// Goes back to the 3D developer room (the site's main page).
  void openThreeDRoom() => _links.openInSameTab(AppConstants.threeDRoomUrl);

  void downloadResume() => browser.downloadResume(
      AppConstants.resumePath, AppConstants.resumeFileName);
}
