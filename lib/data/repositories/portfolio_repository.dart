import '../models/education.dart';
import '../models/job.dart';
import '../models/project.dart';
import '../sources/profile_data.dart';
import '../sources/projects_data.dart';

/// The single place ViewModels read portfolio content from.
///
/// Content is static today; if it ever comes from an API or CMS, only this
/// class changes and the ViewModels and views stay the same.
class PortfolioRepository {
  const PortfolioRepository();

  String get heroGreeting => ProfileData.heroGreeting;
  String get heroPitch => ProfileData.heroPitch;
  String get summary => ProfileData.summary;
  String get contactNote => ProfileData.contactNote;

  List<String> get platforms => ProfileData.platforms;
  List<String> get skills => ProfileData.skills;
  List<Job> get jobs => ProfileData.jobs;
  List<Education> get education => ProfileData.education;
  List<Project> get projects => ProjectsData.projects;
}
