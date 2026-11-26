import '../../../data/models/education.dart';
import '../../../data/models/job.dart';
import '../../../data/repositories/portfolio_repository.dart';

/// Data for the About Me section: summary, work history and education.
class AboutViewModel {
  final PortfolioRepository _repository;

  AboutViewModel({PortfolioRepository repository = const PortfolioRepository()})
      : _repository = repository;

  String get summary => _repository.summary;
  List<Job> get jobs => _repository.jobs;
  List<Education> get education => _repository.education;
}
