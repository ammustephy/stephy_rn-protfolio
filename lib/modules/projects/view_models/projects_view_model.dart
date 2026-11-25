import '../../../data/models/project.dart';
import '../../../data/repositories/portfolio_repository.dart';

/// Data for the Works & Projects grid and the grid's column count.
class ProjectsViewModel {
  final PortfolioRepository _repository;

  ProjectsViewModel(
      {PortfolioRepository repository = const PortfolioRepository()})
      : _repository = repository;

  List<Project> get projects => _repository.projects;

  /// 1 column on phones, 2 on tablets, and 2-4 on desktop depending on width.
  int columnsFor({
    required bool isMobile,
    required bool isTablet,
    required double availableWidth,
  }) {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return (availableWidth ~/ 200).clamp(2, 4);
  }
}
