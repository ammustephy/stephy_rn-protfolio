import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';

import 'app.dart';
import 'core/platform/browser_actions.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  configureApp();
  // Puts the page text into the HTML so search engines, screen readers and
  // recruiters' tools can read it (Flutter web otherwise only draws pixels).
  if (kIsWeb) SemanticsBinding.instance.ensureSemantics();
  runApp(const PortfolioApp());
}
