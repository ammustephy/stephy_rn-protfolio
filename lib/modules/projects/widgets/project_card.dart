import 'package:flutter/material.dart';

import '../../../core/utils/responsive.dart';
import '../../../data/models/project.dart';

/// Card in the projects grid: image (or icon), title and short description.
class ProjectCard extends StatelessWidget {
  final Project project;
  final VoidCallback onTap;

  const ProjectCard({super.key, required this.project, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    return Card(
      color: Colors.grey[900],
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: isMobile ? 100 : 120,
              width: double.infinity,
              child: _CardImage(project: project),
            ),
            Padding(
              padding: EdgeInsets.all(isMobile ? 12 : 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    project.title,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: isMobile ? 14 : 15,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    project.description,
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: isMobile ? 12 : 13,
                    ),
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CardImage extends StatelessWidget {
  final Project project;

  const _CardImage({required this.project});

  @override
  Widget build(BuildContext context) {
    final image = project.image;
    if (image != null) return Image.asset(image, fit: BoxFit.cover);

    // Projects without screenshots (client work) show their icon instead.
    return DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.indigo.shade900, Colors.black],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Center(
        child: Icon(project.icon ?? Icons.apps, color: Colors.white, size: 48),
      ),
    );
  }
}
