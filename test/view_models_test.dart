import 'package:flutter_test/flutter_test.dart';
import 'package:my_portfolio/data/repositories/portfolio_repository.dart';
import 'package:my_portfolio/modules/about/view_models/about_view_model.dart';
import 'package:my_portfolio/modules/contact/view_models/contact_view_model.dart';
import 'package:my_portfolio/modules/home/view_models/home_view_model.dart';
import 'package:my_portfolio/modules/projects/view_models/projects_view_model.dart';

void main() {
  group('ContactViewModel validation', () {
    final vm = ContactViewModel();

    test('name is required', () {
      expect(vm.validateName(''), 'Enter your name');
      expect(vm.validateName('   '), 'Enter your name');
      expect(vm.validateName('Stephy'), isNull);
    });

    test('email must be present and valid', () {
      expect(vm.validateEmail(null), 'Enter your email');
      expect(vm.validateEmail('not-an-email'), 'Enter a valid email');
      expect(vm.validateEmail('someone@example.com'), isNull);
      expect(vm.validateEmail('  someone@example.com  '), isNull);
    });

    test('message is required', () {
      expect(vm.validateMessage(''), 'Enter a message');
      expect(vm.validateMessage('Hello'), isNull);
    });

    test('is not sending until asked to', () {
      expect(vm.sending, isFalse);
    });
  });

  group('ProjectsViewModel', () {
    final vm = ProjectsViewModel();

    test('column count follows the screen size', () {
      expect(
          vm.columnsFor(isMobile: true, isTablet: false, availableWidth: 400),
          1);
      expect(
          vm.columnsFor(isMobile: false, isTablet: true, availableWidth: 700),
          2);
      expect(
          vm.columnsFor(isMobile: false, isTablet: false, availableWidth: 500),
          2);
      expect(
          vm.columnsFor(isMobile: false, isTablet: false, availableWidth: 2000),
          4);
    });

    test('client project comes first and has an icon instead of screenshots',
        () {
      final first = vm.projects.first;
      expect(first.title, 'Multi-Vendor Delivery Partner App');
      expect(first.image, isNull);
      expect(first.icon, isNotNull);
      expect(first.screenshots, isEmpty);
    });
  });

  group('Content matches the resume', () {
    const repo = PortfolioRepository();

    test('jobs are newest first with the agreed details', () {
      final about = AboutViewModel();
      expect(about.jobs.map((j) => j.company).toList(), [
        'Sigosoft Private Ltd., Kerala, India',
        'Kefi Tech Solutions Pvt. Ltd., Kerala, India',
        'Aptara Learnings Pvt. Ltd., Kerala, India',
      ]);
      expect(about.jobs.last.dates, 'March 2021 – June 2025');
    });

    test('skills include the AI tools and no unrelated items', () {
      expect(repo.skills,
          containsAll(['Claude Code', 'Cursor', 'Google Antigravity']));
      expect(repo.skills, isNot(contains('Coding Conversion (CC)')));
    });
  });

  test('every section has its own scroll key', () {
    final vm = HomeViewModel();
    final keys = PortfolioSection.values.map(vm.keyFor).toSet();
    expect(keys.length, PortfolioSection.values.length);
  });
}
