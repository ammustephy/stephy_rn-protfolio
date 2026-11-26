import 'package:flutter/material.dart';

import '../../../core/constants/app_constants.dart';
import '../../../core/utils/responsive.dart';
import '../../about/view_models/about_view_model.dart';
import '../../about/views/about_section.dart';
import '../../contact/view_models/contact_view_model.dart';
import '../../contact/views/contact_section.dart';
import '../../projects/view_models/projects_view_model.dart';
import '../../projects/views/projects_section.dart';
import '../../skills/view_models/skills_view_model.dart';
import '../../skills/views/skills_section.dart';
import '../view_models/home_view_model.dart';
import '../widgets/hero_section.dart';
import '../widgets/nav_link.dart';

/// The one-page portfolio: app bar (or drawer on phones) and every section.
///
/// Creates each module's ViewModel and hands it to that module's view.
class HomeView extends StatefulWidget {
  const HomeView({super.key});

  @override
  State<HomeView> createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  final _home = HomeViewModel();
  final _skills = SkillsViewModel();
  final _projects = ProjectsViewModel();
  final _about = AboutViewModel();
  final _contact = ContactViewModel();

  @override
  void dispose() {
    _contact.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: Text(
          AppConstants.displayName,
          style: TextStyle(color: Colors.white, fontSize: isMobile ? 18 : 20),
        ),
        actions: isMobile ? null : _desktopActions(),
      ),
      drawer: isMobile ? _MobileDrawer(viewModel: _home) : null,
      body: SingleChildScrollView(
        child: Column(
          children: [
            _section(PortfolioSection.home, HeroSection(viewModel: _home)),
            _section(
                PortfolioSection.portfolio, SkillsSection(viewModel: _skills)),
            _section(
                PortfolioSection.works, ProjectsSection(viewModel: _projects)),
            _section(PortfolioSection.about, AboutSection(viewModel: _about)),
            _section(
                PortfolioSection.contact, ContactSection(viewModel: _contact)),
          ],
        ),
      ),
    );
  }

  /// Tags a section with its key so the nav links can scroll to it.
  Widget _section(PortfolioSection section, Widget child) =>
      KeyedSubtree(key: _home.keyFor(section), child: child);

  List<Widget> _desktopActions() => [
        for (final section in _home.navLinks) ...[
          NavLink(label: section.label, onTap: () => _home.scrollTo(section)),
          const SizedBox(width: 12),
        ],
        OutlinedButton.icon(
          onPressed: _home.openThreeDRoom,
          icon: const Icon(Icons.view_in_ar, color: Colors.white, size: 18),
          label: const Text('3D Room', style: TextStyle(color: Colors.white)),
          style: OutlinedButton.styleFrom(
            side: BorderSide(color: Colors.indigo.shade300),
          ),
        ),
        const SizedBox(width: 12),
        ElevatedButton(
          onPressed: () => _home.scrollTo(PortfolioSection.contact),
          style:
              ElevatedButton.styleFrom(backgroundColor: Colors.indigo.shade900),
          child:
              const Text('Contact Me', style: TextStyle(color: Colors.white)),
        ),
        const SizedBox(width: 12),
      ];
}

class _MobileDrawer extends StatelessWidget {
  final HomeViewModel viewModel;

  const _MobileDrawer({required this.viewModel});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.grey[900],
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: Colors.indigo.shade900),
            child: const Text(
              'Navigation',
              style: TextStyle(color: Colors.white, fontSize: 24),
            ),
          ),
          for (final section in PortfolioSection.values)
            ListTile(
              title: Text(section.label,
                  style: const TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(context);
                viewModel.scrollTo(section);
              },
            ),
          ListTile(
            leading: const Icon(Icons.view_in_ar, color: Colors.white),
            title: const Text('3D Room', style: TextStyle(color: Colors.white)),
            onTap: viewModel.openThreeDRoom,
          ),
        ],
      ),
    );
  }
}
