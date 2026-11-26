/**
 * All text content of the site, in one place.
 * Text is taken from the Flutter app (lib/data/sources/profile_data.dart and
 * projects_data.dart) so both versions say the same thing.
 *
 * If you edit text here, the 3D boards, the modals and the plain-text version
 * (#fulltext, rebuilt at runtime) all update. index.html also carries a static
 * copy of the plain text for search engines; update it too (see README).
 */
import { Project } from '../models/Project.js';
import { Job } from '../models/Job.js';
import { Education } from '../models/Education.js';
import { Stop } from '../models/Stop.js';

export const profile = {
  name: 'Stephy R N',
  role: 'Flutter Developer',
  tagline: '1.5+ years building production Android & iOS apps with Flutter',
  greeting: 'Hi, I\'m',
  location: 'Thiruvananthapuram, Kerala, India',
  email: 'mail2stephyrn@gmail.com',
  phone: '+91 7907761417',
  phoneHref: 'tel:+917907761417',
  github: 'https://github.com/ammustephy?tab=repositories',
  linkedin: 'https://www.linkedin.com/in/stephy-rn/',
  resume: 'assets/resume/stephy-rn-flutter-developer-resume.pdf',
  summary:
    'Flutter Developer with 1.5+ years of experience building cross-platform '
    + 'mobile applications for Android and iOS using Flutter and Dart. Skilled in '
    + 'REST API integration (Dio, HTTP), Firebase, state management (GetX, BLoC, '
    + 'Provider), Clean Architecture and MVVM. Experienced in Google Maps and live '
    + 'tracking, payment gateway integration, localization in English, French and '
    + 'Arabic (RTL), Figma-to-Flutter UI development, Google Play Store releases '
    + 'and AI-assisted development using Claude Code, Cursor and Antigravity.',
  contactNote: 'Feel free to reach out for collaborations, freelance work, or just a friendly hello!',
};

/** Every skill from the resume, grouped. 35 skills in total. */
export const skillGroups = [
  { title: 'Mobile & languages', color: '#2f7fd8', skills: ['Flutter', 'Dart', 'JavaScript', 'Responsive UI'] },
  { title: 'State & architecture', color: '#8a5cd6', skills: ['GetX', 'BLoC', 'Provider', 'Clean Architecture', 'MVVM'] },
  { title: 'APIs & networking', color: '#d9622b', skills: ['RESTful APIs', 'Dio', 'HTTP', 'JSON', 'WebSocket'] },
  { title: 'Data & backend', color: '#2e9a6a', skills: ['Firebase', 'Cloud Firestore', 'Hive', 'SQLite', 'MySQL', 'MongoDB', 'Node.js', 'Express.js'] },
  { title: 'Maps, payments & i18n', color: '#c23b6b', skills: ['Google Maps', 'Geolocation & Live Tracking', 'Payment Gateway Integration', 'Localization (i18n) & RTL'] },
  { title: 'Tools', color: '#b8860b', skills: ['Git & GitHub', 'Figma', 'Postman', 'Android Studio', 'VS Code', 'Google Play Console'] },
  { title: 'AI-assisted development', color: '#1f8f9a', skills: ['Claude Code', 'Cursor', 'Google Antigravity'] },
];

export const jobs = [
  new Job({
    id: 'sigosoft',
    role: 'Flutter Developer',
    company: 'Sigosoft Private Ltd.',
    shortName: 'Sigosoft',
    location: 'Kerala, India',
    dates: 'January 2026 – Present',
    color: '#2f7fd8',
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
  }),
  new Job({
    id: 'kefi',
    role: 'Associate Software Engineer – Flutter Application Development',
    company: 'Kefi Tech Solutions Pvt. Ltd.',
    shortName: 'Kefi Tech',
    location: 'Kerala, India',
    dates: 'June 2025 – December 2025',
    color: '#d9622b',
    points: [
      'Developed hospital management and attendance management applications using Flutter and Dart.',
      'Integrated RESTful APIs using the HTTP package and parsed JSON responses into model classes.',
      'Implemented state management using Provider and BLoC for maintainable, testable code.',
      'Designed responsive UI with reusable custom widgets for multiple screen sizes.',
      'Tested and debugged APIs using Postman before integration.',
    ],
  }),
  new Job({
    id: 'aptara',
    role: 'Electronic Quality Controller',
    company: 'Aptara Learnings Pvt. Ltd.',
    shortName: 'Aptara',
    location: 'Kerala, India',
    dates: 'March 2021 – June 2025',
    color: '#2e9a6a',
    points: [
      'Converted DOCX documents to structured XML and validated output against quality assurance standards.',
      'Maintained high accuracy and consistency across deliverables and contributed to process improvements.',
    ],
  }),
];

export const education = [
  new Education({
    id: 'btech',
    title: 'Bachelor of Technology (B.Tech) in Computer Science',
    shortTitle: 'B.Tech in Computer Science',
    institution: 'University of Kerala',
    year: '2021',
    detail: 'CGPA: 7.0 / 10',
  }),
  new Education({
    id: 'luminar',
    title: 'Flutter / Mobile Application Development',
    shortTitle: 'Flutter / Mobile Application Development',
    institution: 'Luminar Technolab',
    year: '2024',
    detail: '',
  }),
];

const shots = (folder, names) => names.map((n) => ({
  src: `assets/projects/${folder}/${n}`,
  thumb: `assets/projects/${folder}/thumbs/${n.replace(/\.(png|jpg)$/, '.jpg')}`,
  alt: n.replace(/\.(png|jpg)$/, '').replace(/-/g, ' '),
}));

export const projects = [
  new Project({
    id: 'wallflow',
    title: 'WallFlow',
    tagline: 'Wallpaper app · Flutter + Node.js',
    color: '#7b4fd6',
    cover: 'assets/projects/wallflow/thumbs/cover.jpg',
    coverKind: 'phone',
    description:
      'This project is a full-stack wallpaper application built using Flutter for the frontend and Node.js with Express.js for the backend. It allows users to securely register and log in, explore different wallpaper categories, search for wallpapers, add them to favorites, and download or set them easily on their devices. The app uses RESTful APIs to connect the frontend and backend, ensuring smooth communication and efficient data management. With a responsive design and user-friendly interface, the application provides a simple and enjoyable wallpaper browsing experience.',
    features: [
      'Secure user authentication system with login and registration functionality',
      'Add wallpapers to favourites for quick access and personalized collections',
      'Download and directly set wallpapers to the device with one-tap convenience',
      'Advanced search functionality to browse, download, and set wallpapers across all categories (e.g., nature, abstract, landscapes, and more)',
      'RESTful API Integration with Node.js backend for scalable data management',
      'HTTP package integration for seamless communication between Flutter frontend and backend services',
      'Responsive UI design with thorough testing for optimal performance across devices',
    ],
    techStack: ['Flutter', 'Dart', 'Node.js', 'Express.js', 'REST APIs', 'HTTP Package'],
    conclusion:
      'This wallpaper application successfully combines a Flutter frontend with a Node.js backend to create a smooth and secure user experience. Users can register, log in, search for wallpapers, add them to favorites, download, and set them easily. The RESTful API allows seamless communication between the app and the server, ensuring fast and reliable data handling. With a responsive design and proper testing, the app performs well across different devices. Overall, the project demonstrates strong full-stack development skills and provides a scalable foundation for future improvements.',
    screenshots: shots('wallflow', [
      'login.jpg', 'register.jpg', 'home.jpg', 'drawer-without-pic.jpg', 'wishlist.jpg', 'wallpaper.jpg',
      'set-wallpaper.jpg', 'download-wallpaper.jpg', 'downloaded-image.jpg', 'downloaded-list.jpg', 'profile.jpg',
      'set-pic.jpg', 'edit-name.jpg', 'edit-image.jpg', 'drawer-with-pic.jpg', 'remove-image.jpg', 'removed-pic.jpg',
    ]),
  }),
  new Project({
    id: 'educk',
    title: 'Educk',
    tagline: 'Attendance & academics · Firebase',
    color: '#2f7fd8',
    cover: 'assets/projects/educk/thumbs/cover.jpg',
    coverKind: 'phone',
    description:
      'Educk is a Flutter-based attendance and academic management system designed to simplify communication and data management between students and teachers. The application uses Firebase services to handle authentication, real-time database updates, and messaging. It allows users to track attendance, manage marks and academic records, and communicate instantly through a built-in chat system. With a clean and responsive design, Educk provides a smooth and user-friendly academic management experience.',
    features: [
      'Role-based authentication with admin approval workflow for student and teacher registration',
      'Real-time Chat facility enabling live communication between students and teachers, powered by WebSocket connections for instant messaging and notifications',
      'Complete CRUD operations for managing academic data including marks, notes, timetables, and syllabuses',
      'Swipe-based attendance marking system for intuitive user interaction',
      'Profile management with customizable Dark theme support',
      'BLoC state management for efficient handling of complex data states and real-time Firestore updates',
      'JSON serialization for seamless data exchange and Firebase integration, ensuring efficient API payloads and offline syncing capabilities',
      'Responsive UI design with thorough testing for optimal performance across devices',
    ],
    techStack: ['Flutter', 'Dart', 'Firebase (Authentication, Firestore, Cloud Messaging)', 'BLoC', 'WebSocket (via Firebase Realtime Database)', 'JSON'],
    conclusion:
      'Educk successfully combines Flutter and Firebase to create an efficient and reliable academic management system. With features like role-based authentication, real-time chat, attendance tracking, and complete academic data management, the app ensures smooth interaction between students and teachers. Its structured state management and responsive design make it scalable, maintainable, and suitable for real-world educational environments.',
    screenshots: shots('educk', [
      'login.jpg', 'home1.jpg', 'home2.jpg', 'forgot-password.jpg', 'attendance.jpg', 'exam-result.jpg', 'mark-list.jpg',
      'marklist-details.jpg', 'syllabus.jpg', 'notes.jpg', 'online-class.jpg', 'payment-paid.jpg', 'payment-pending.jpg',
      'notifications.jpg', 'settings.jpg', 'profile.jpg',
    ]),
  }),
  new Project({
    id: 'kdch',
    title: 'KDC Hospital Management',
    tagline: 'Patient app · appointments & records',
    color: '#1f9a8a',
    cover: 'assets/projects/kdch/thumbs/cover.jpg',
    coverKind: 'phone',
    description:
      'KDCH is a comprehensive mobile hospital management application designed to bridge the gap between patients and healthcare services. This all-in-one platform empowers patients with seamless access to medical records, appointment scheduling, prescription management, and hospital services directly from their smartphones. By digitizing traditional hospital interactions, KDCH eliminates the need for physical visits for routine tasks, reduces waiting times, and provides patients with greater control over their healthcare journey. The application features an intuitive interface with secure login, personalized profiles, and easy navigation, making quality healthcare access.',
    features: [
      'Secure User Authentication – Safe login and registration system to protect patient information.',
      'Personalized Patient Profiles – Manage personal details, medical history, and preferences in one place.',
      'Online Appointment Scheduling – Book, reschedule, or cancel appointments directly through the app.',
      'Digital Medical Records Access – View lab reports, diagnoses, and treatment history anytime.',
      'Prescription Management – Access and track prescribed medications and dosage details digitally.',
      'Notifications & Reminders – Get real-time alerts for appointments, prescriptions, and hospital updates.',
      'Hospital Services Directory – Explore departments, doctors, and available medical services.',
      'User-Friendly Interface – Simple, intuitive, and responsive design for smooth navigation.',
      'Data Security & Privacy – Secure backend integration to ensure confidentiality of medical data.',
    ],
    techStack: ['Flutter', 'Dart', 'Node.js', 'Express.js', 'Firebase Firestore', 'BLoC', 'GitHub'],
    conclusion:
      'The KDCH Hospital Management Application represents a significant step forward in digital healthcare delivery, offering a patient-centric approach that prioritizes convenience, accessibility, and comprehensive care management. By integrating essential features such as appointment booking, medical records access, medication tracking, online pharmacy services, and emergency contacts into a single platform, the app streamlines the entire healthcare experience. With its user-friendly design, secure data management, and extensive functionality covering everything from health check-up packages to bill payments, KDCH serves as a complete healthcare companion. This digital solution not only enhances patient engagement and satisfaction but also contributes to more efficient hospital operations, ultimately fostering better health outcomes and a stronger patient-provider relationship in the modern healthcare landscape.',
    screenshots: [
      { src: 'assets/projects/kdch/hospital-management.jpg', thumb: 'assets/projects/kdch/thumbs/hospital-management.jpg', alt: 'KDC Hospital Management banner' },
      ...shots('kdch', [
        'splash.jpg', 'login.jpg', 'home1.jpg', 'home2.jpg', 'appointments.jpg', 'reschedule-appointment.jpg',
        'active-appointment.jpg', 'online-medicine-order.jpg', 'offline-appointment.jpg', 'active-medicine.jpg',
        'emergency-contact.jpg', 'medical-report.jpg', 'lab-reports.jpg', 'radiology.jpg', 'prescription.jpg', 'bills.jpg',
        'discharge.jpg', 'medicine-delivery.jpg', 'checkups.jpg', 'forgot-password.jpg', 'notifications.jpg',
        'settings.jpg', 'departments.jpg', 'profile.jpg',
      ]),
    ],
  }),
  new Project({
    id: 'portfolio',
    title: 'Portfolio website',
    tagline: 'Flutter web · responsive',
    color: '#d9622b',
    cover: 'assets/projects/portfolio/thumbs/cover.jpg',
    coverKind: 'wide',
    description:
      'My portfolio website is a sleek, professionally designed digital showcase that presents the work and capabilities of a talented Flutter developer based in Thiruvananthapuram, Kerala, India. This modern portfolio serves as a comprehensive platform for potential clients, collaborators, and employers to explore Stephy\'s technical expertise, professional journey, and project accomplishments. With its minimalist black-themed interface and intuitive navigation, the website effectively communicates Stephy\'s identity as a versatile cross-platform developer specializing in Flutter, while also highlighting a unique background that bridges both software development and quality assurance. The portfolio demonstrates not only technical proficiency across multiple platforms—Android, iOS, Web, and Desktop—but also showcases a diverse skill set that includes programming languages like Dart and Kotlin, API integration, quality assurance methodologies, and front-end development technologies.',
    features: [
      'Modern & Minimalist Design – Sleek black-themed interface with a clean and professional layout.',
      'Responsive Cross-Platform UI – Optimized for desktop, tablet, and mobile devices to ensure a smooth browsing experience.',
      'About & Professional Summary Section – Highlights technical expertise, career journey, and specialization in Flutter development.',
      'Projects Showcase – Displays detailed project descriptions with technologies used and key contributions.',
      'Skills & Technology Stack Display – Clearly presents programming languages, frameworks, tools, and QA expertise.',
      'Cross-Platform Development Focus – Emphasizes experience in building Android, iOS, Web, and Desktop applications using Flutter.',
    ],
    techStack: ['Flutter', 'Dart', 'GitHub'],
    // The original text said she is a Flutter Developer at Kefi Tech; she is now at Sigosoft.
    conclusion:
      'This portfolio website stands as a testament to modern web design principles and professional self-presentation in the tech industry. By seamlessly integrating essential components—personal introduction, professional experience timeline, educational credentials, project showcase, technical skills overview, and accessible contact information—the portfolio provides visitors with a complete picture of Stephy\'s capabilities as a Flutter Developer. The clean, professional aesthetic combined with strategic content organization makes it easy for potential collaborators to understand Stephy\'s value proposition and reach out for opportunities. With a transition from Electronic Quality Controller at Aptara Learnings to Flutter development at Kefi Tech Solutions and now Flutter Developer at Sigosoft Private Ltd., along with specialized training from Luminar Technolab, the portfolio effectively communicates both technical competence and professional growth. This digital presence serves as an excellent foundation for career advancement, networking, and securing freelance opportunities in the competitive field of mobile and cross-platform application development.',
    screenshots: shots('portfolio', [
      'splash.png', 'home.png', 'portfolio.png', 'work.png', 'wallflow.png', 'educk.png', 'portfolioscreen.png',
      'kdch.png', 'about.png', 'contact.png',
    ]),
  }),
];

/** The guided tour, in order. */
export const stops = [
  new Stop({ id: 'home', label: 'Home', title: 'Stephy R N — Flutter Developer' }),
  new Stop({ id: 'about', label: 'About', title: 'About me' }),
  new Stop({ id: 'skills', label: 'Skills', title: 'Skills' }),
  new Stop({ id: 'experience', label: 'Experience', title: 'Experience' }),
  new Stop({ id: 'projects', label: 'Projects', title: 'Projects' }),
  new Stop({ id: 'education', label: 'Education', title: 'Education' }),
  new Stop({ id: 'contact', label: 'Contact', title: 'Contact' }),
];
