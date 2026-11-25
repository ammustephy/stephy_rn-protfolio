import 'package:flutter/material.dart';

import '../../../core/utils/responsive.dart';
import '../../../data/models/project.dart';
import 'full_image_view.dart';

/// Full write-up of one project, with a grid of screenshots.
class ProjectDetailView extends StatelessWidget {
  final Project project;

  const ProjectDetailView({super.key, required this.project});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: Text(
          project.title,
          style: TextStyle(color: Colors.white, fontSize: isMobile ? 16 : 18),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(isMobile ? 12 : 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              project.fullDescription,
              style:
                  TextStyle(color: Colors.white, fontSize: isMobile ? 14 : 16),
            ),
            SizedBox(height: isMobile ? 15 : 20),
            Text(
              'Conclusion:',
              style: TextStyle(
                color: Colors.white,
                fontSize: isMobile ? 16 : 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              project.conclusion,
              style: TextStyle(
                  color: Colors.white70, fontSize: isMobile ? 13 : 14),
            ),
            if (project.screenshots.isNotEmpty) ...[
              SizedBox(height: isMobile ? 20 : 30),
              Text(
                'Screenshots:',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: isMobile ? 18 : 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              _ScreenshotGrid(screenshots: project.screenshots),
            ],
          ],
        ),
      ),
    );
  }
}

class _ScreenshotGrid extends StatelessWidget {
  final List<String> screenshots;

  const _ScreenshotGrid({required this.screenshots});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    return LayoutBuilder(
      builder: (context, constraints) => GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount:
              isMobile ? 2 : (constraints.maxWidth / 120).floor().clamp(3, 6),
          childAspectRatio: 1.0,
          mainAxisSpacing: 4,
          crossAxisSpacing: 1,
        ),
        itemCount: screenshots.length,
        itemBuilder: (context, index) {
          final imagePath = screenshots[index];
          return GestureDetector(
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => FullImageView(imagePath: imagePath),
              ),
            ),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey[700]!, width: 1),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.asset(
                  imagePath,
                  fit: BoxFit.cover,
                  width: double.infinity,
                  height: double.infinity,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
