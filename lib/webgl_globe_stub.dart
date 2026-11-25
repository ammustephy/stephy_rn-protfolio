import 'package:flutter/widgets.dart';

/// WebGL is only available on the web build; other platforms show nothing.
class WebGLGlobe extends StatelessWidget {
  const WebGLGlobe({super.key});

  @override
  Widget build(BuildContext context) => const SizedBox.shrink();
}
