import '../models/education.dart';
import '../models/job.dart';

/// Profile content, kept the same as the resume.
class ProfileData {
  ProfileData._();

  static const String heroGreeting =
      'Hi,\nI\'m Stephy RN\nA Flutter Mobile Application Developer';

  static const String heroPitch =
      '1.5+ years building production Android and iOS apps with Flutter, '
      'GetX, BLoC, REST APIs, Firebase, Google Maps and payment gateways.';

  static const String summary =
      'Flutter Developer with 1.5+ years of experience building cross-platform '
      'mobile applications for Android and iOS using Flutter and Dart. Skilled in '
      'REST API integration (Dio, HTTP), Firebase, state management (GetX, BLoC, '
      'Provider), Clean Architecture and MVVM. Experienced in Google Maps and live '
      'tracking, payment gateway integration, localization in English, French and '
      'Arabic (RTL), Figma-to-Flutter UI development, Google Play Store releases '
      'and AI-assisted development using Claude Code, Cursor and Antigravity.';

  static const String contactNote =
      'Feel free to reach out for collaborations, freelance work, or just a friendly hello!';

  static const List<String> platforms = ['Android', 'iOS', 'Web', 'Desktop'];

  static const List<String> skills = [
    'Flutter',
    'Dart',
    'JavaScript',
    'GetX',
    'BLoC',
    'Provider',
    'Clean Architecture',
    'MVVM',
    'RESTful APIs',
    'Dio',
    'HTTP',
    'JSON',
    'WebSocket',
    'Firebase',
    'Cloud Firestore',
    'Hive',
    'SQLite',
    'MySQL',
    'MongoDB',
    'Google Maps',
    'Geolocation & Live Tracking',
    'Payment Gateway Integration',
    'Localization (i18n) & RTL',
    'Responsive UI',
    'Node.js',
    'Express.js',
    'Git & GitHub',
    'Figma',
    'Postman',
    'Android Studio',
    'VS Code',
    'Google Play Console',
    'Claude Code',
    'Cursor',
    'Google Antigravity',
  ];

  static const List<Job> jobs = [
    Job(
      role: 'Flutter Developer',
      company: 'Sigosoft Private Ltd., Kerala, India',
      dates: 'January 2026 – Present',
      points: [
        'Develop and maintain multiple production Flutter applications for Android and iOS using Dart, GetX and Clean Architecture.',
        'Built a multi-vendor delivery partner app supporting 9 business types (restaurant, grocery, pharmacy, local store, water, gas, laundry, car wash and home cleaning) from a single codebase.',
        'Implemented localization (i18n) in English, French and Arabic, including full right-to-left (RTL) layout support.',
        'Integrated RESTful APIs using Dio with token-based authentication and centralized error handling.',
        'Implemented Google Maps, geolocation and real-time live order tracking.',
        'Integrated payment gateways and secure payment processing workflows.',
        'Converted Figma designs into responsive, pixel-accurate Flutter UI with reusable widgets.',
        'Used AI coding tools (Claude Code, Cursor and Google Antigravity) in daily development for feature implementation, debugging, refactoring, code review and technical documentation, while reviewing and testing all AI-generated code before release.',
        'Shipped 10+ releases to the Google Play Store, managing app versioning and release tracks in Google Play Console.',
        'Followed a Git feature-branch and pull-request workflow on GitHub, and documented API issues for the backend team to speed up fixes.',
      ],
    ),
    Job(
      role: 'Associate Software Engineer – Flutter Application Development',
      company: 'Kefi Tech Solutions Pvt. Ltd., Kerala, India',
      dates: 'June 2025 – December 2025',
      points: [
        'Developed hospital management and attendance management applications using Flutter and Dart.',
        'Integrated RESTful APIs using the HTTP package and parsed JSON responses into model classes.',
        'Implemented state management using Provider and BLoC for maintainable, testable code.',
        'Designed responsive UI with reusable custom widgets for multiple screen sizes.',
        'Tested and debugged APIs using Postman before integration.',
      ],
    ),
    Job(
      role: 'Electronic Quality Controller',
      company: 'Aptara Learnings Pvt. Ltd., Kerala, India',
      dates: 'March 2021 – June 2025',
      points: [
        'Converted DOCX documents to structured XML and validated output against quality assurance standards.',
        'Maintained high accuracy and consistency across deliverables and contributed to process improvements.',
      ],
    ),
  ];

  static const List<Education> education = [
    Education(
      title: 'Bachelor of Technology (B.Tech) in Computer Science',
      details: 'University of Kerala • 2021 • CGPA: 7.0 / 10',
    ),
    Education(
      title: 'Flutter / Mobile Application Development',
      details: 'Luminar Technolab, 2024',
    ),
  ];
}
