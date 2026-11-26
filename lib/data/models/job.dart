/// One role in the work history.
class Job {
  final String role;
  final String company;
  final String dates;
  final List<String> points;

  const Job({
    required this.role,
    required this.company,
    required this.dates,
    required this.points,
  });

  /// Company and dates on one line, e.g. "Acme Ltd. • 2024 – Present".
  String get subtitle => '$company • $dates';
}
