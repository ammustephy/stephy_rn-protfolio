import 'dart:js_interop';
import 'dart:ui_web' as ui_web;

import 'package:flutter/widgets.dart';
import 'package:web/web.dart' as web;

// Defined in web/webgl/globe.js, which index.html loads before Flutter starts.
@JS('startWebGLGlobe')
external JSFunction? _startWebGLGlobe(web.HTMLCanvasElement canvas);

const _viewType = 'webgl-globe';
bool _registered = false;

void _register() {
  if (_registered) return;
  _registered = true;
  ui_web.platformViewRegistry.registerViewFactory(_viewType, (int viewId) {
    final canvas = web.document.createElement('canvas') as web.HTMLCanvasElement
      ..style.width = '100%'
      ..style.height = '100%'
      ..style.display = 'block'
      // Let clicks and scrolling pass through to the Flutter content.
      ..style.pointerEvents = 'none';
    _startWebGLGlobe(canvas);
    return canvas;
  });
}

/// Animated 3D wireframe globe, drawn with WebGL behind the hero section.
class WebGLGlobe extends StatelessWidget {
  const WebGLGlobe({super.key});

  @override
  Widget build(BuildContext context) {
    _register();
    return const IgnorePointer(
      child: HtmlElementView(viewType: _viewType),
    );
  }
}
