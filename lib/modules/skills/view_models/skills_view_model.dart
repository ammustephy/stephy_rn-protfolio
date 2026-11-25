import '../../../core/constants/app_constants.dart';
import '../../../core/platform/browser_actions.dart' as browser;
import '../../../data/repositories/portfolio_repository.dart';

/// Data and actions for the "What I can do" section.
class SkillsViewModel {
  final PortfolioRepository _repository;

  SkillsViewModel(
      {PortfolioRepository repository = const PortfolioRepository()})
      : _repository = repository;

  List<String> get platforms => _repository.platforms;
  List<String> get skills => _repository.skills;

  void downloadResume() => browser.downloadResume(
      AppConstants.resumePath, AppConstants.resumeFileName);

  void viewResume() => browser.viewResume(AppConstants.resumePath);
}
