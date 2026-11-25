import 'package:flutter/material.dart';

import '../../../core/utils/responsive.dart';
import '../../../shared/widgets/hover_lift.dart';
import '../../../shared/widgets/section_title.dart';
import '../view_models/projects_view_model.dart';
import '../widgets/project_card.dart';
import 'project_detail_view.dart';

/// "Works & Projects": a responsive grid of project cards.
class ProjectsSection extends StatelessWidget {
  final ProjectsViewModel viewModel;

  const ProjectsSection({super.key, required this.viewModel});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);
    final isTablet = Responsive.isTablet(context);
    final projects = viewModel.projects;

    return Container(
      color: Colors.black,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 12 : 16,
        vertical: isMobile ? 60 : 150,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SectionTitle('Works & Projects'),
          SizedBox(height: isMobile ? 20 : 40),
          LayoutBuilder(
            builder: (context, constraints) => GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: viewModel.columnsFor(
                  isMobile: isMobile,
                  isTablet: isTablet,
                  availableWidth: constraints.maxWidth,
                ),
                mainAxisSpacing: isMobile ? 12 : 20,
                crossAxisSpacing: isMobile ? 12 : 20,
                mainAxisExtent: isMobile ? 220 : 250,
              ),
              itemCount: projects.length,
              itemBuilder: (context, index) {
                final project = projects[index];
                return Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 300),
                    child: HoverLift.child(
                      child: ProjectCard(
                        project: project,
                        onTap: () => Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => ProjectDetailView(project: project),
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
