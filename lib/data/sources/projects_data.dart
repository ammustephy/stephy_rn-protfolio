import 'package:flutter/material.dart';

import '../models/project.dart';

/// Projects shown in the Works & Projects section, in display order.
class ProjectsData {
  ProjectsData._();

  static const List<Project> projects = [
    Project(
      title: 'Multi-Vendor Delivery Partner App',
      icon: Icons.delivery_dining,
      description:
          'Production Flutter app for vendors across 9 business types, in English, French and Arabic.',
      fullDescription:
          'A production Flutter app (Android and iOS) that vendors use to run their business on a multi-vendor delivery platform. One codebase serves 9 business types: restaurant, grocery, pharmacy, local store, water, gas, laundry, car wash and home cleaning. Each vendor type gets its own section, chosen by the server, while sharing the same design system and API layer. Built at Sigosoft Private Ltd.'
          '\n\nKey Features:'
          '\n• Vendor sections for 9 business types from a single codebase'
          '\n• Full localization in English, French and Arabic, with right-to-left (RTL) layouts'
          '\n• RESTful API integration using Dio with token-based authentication and centralized error handling'
          '\n• Order management with Google Maps, geolocation and live order tracking'
          '\n• Figma designs converted into responsive, reusable Flutter widgets'
          '\n• 10+ releases shipped to the Google Play Store through Google Play Console'
          '\n• Git feature-branch and pull-request workflow, with API issues documented for the backend team'
          '\n• Tech Stack: Flutter, Dart, GetX, Clean Architecture, Dio, REST APIs, Google Maps, Firebase, Git',
      conclusion:
          'This client app is the largest project I have worked on: one Flutter codebase serving many business types and three languages, including a right-to-left language. Screenshots are not shown because the app belongs to a client.',
    ),
    Project(
      image: 'Assets/Images/wallflow/Login.jpg',
      title: 'WallFlow',
      description:
          'This project is a full-stack wallpaper application built using Flutter...',
      fullDescription:
          'This project is a full-stack wallpaper application built using Flutter for the frontend and Node.js with Express.js for the backend. It allows users to securely register and log in, explore different wallpaper categories, search for wallpapers, add them to favorites, and download or set them easily on their devices. The app uses RESTful APIs to connect the frontend and backend, ensuring smooth communication and efficient data management. With a responsive design and user-friendly interface, the application provides a simple and enjoyable wallpaper browsing experience.'
          '\n\nKey Features:'
          '\n• Secure user authentication system with login and registration functionality'
          '\n• Add wallpapers to favourites for quick access and personalized collections'
          '\n• Download and directly set wallpapers to the device with one-tap convenience'
          '\n• Advanced search functionality to browse, download, and set wallpapers across all categories (e.g., nature, abstract, landscapes, and more)'
          '\n• RESTful API Integration with Node.js backend for scalable data management'
          '\n• HTTP package integration for seamless communication between Flutter frontend and backend services'
          '\n• Responsive UI design with thorough testing for optimal performance across devices'
          '\n• Tech Stack: Flutter, Dart, Node.js, Express.js, REST APIs, HTTP Package',
      screenshots: [
        'Assets/Images/wallflow/Login.jpg',
        'Assets/Images/wallflow/Register.jpg',
        'Assets/Images/wallflow/Home.jpg',
        'Assets/Images/wallflow/Drawer without pic.jpg',
        'Assets/Images/wallflow/Wishlist.jpg',
        'Assets/Images/wallflow/Wallpaper.jpg',
        'Assets/Images/wallflow/Set Wallpaper.jpg',
        'Assets/Images/wallflow/Download wallpaper.jpg',
        'Assets/Images/wallflow/Downloaded image.jpg',
        'Assets/Images/wallflow/Downloaded list.jpg',
        'Assets/Images/wallflow/Profile.jpg',
        'Assets/Images/wallflow/Set pic.jpg',
        'Assets/Images/wallflow/Edit name.jpg',
        'Assets/Images/wallflow/Edit image.jpg',
        'Assets/Images/wallflow/Drawer with pic.jpg',
        'Assets/Images/wallflow/Remove Image.jpg',
        'Assets/Images/wallflow/Removed pic.jpg',
      ],
      conclusion:
          'This wallpaper application successfully combines a Flutter frontend with a Node.js backend to create a smooth and secure user experience. Users can register, log in, search for wallpapers, add them to favorites, download, and set them easily. The RESTful API allows seamless communication between the app and the server, ensuring fast and reliable data handling. With a responsive design and proper testing, the app performs well across different devices. Overall, the project demonstrates strong full-stack development skills and provides a scalable foundation for future improvements.',
    ),
    Project(
      image: 'Assets/Images/StudLogin.png',
      title: 'Educk',
      description:
          'Educk is a Flutter-based attendance and academic management system designed...',
      fullDescription:
          'Educk is a Flutter-based attendance and academic management system designed to simplify communication and data management between students and teachers. The application uses Firebase services to handle authentication, real-time database updates, and messaging. It allows users to track attendance, manage marks and academic records, and communicate instantly through a built-in chat system. With a clean and responsive design, Educk provides a smooth and user-friendly academic management experience.'
          '\n\nKey Features:'
          '\n• Role-based authentication with admin approval workflow for student and teacher registration'
          '\n• Real-time Chat facility enabling live communication between students and teachers, powered by WebSocket connections for instant messaging and notifications'
          '\n• Complete CRUD operations for managing academic data including marks, notes, timetables, and syllabuses'
          '\n• Swipe-based attendance marking system for intuitive user interaction'
          '\n• Profile management with customizable Dark theme support'
          '\n• BLoC state management for efficient handling of complex data states and real-time Firestore updates'
          '\n• JSON serialization for seamless data exchange and Firebase integration, ensuring efficient API payloads and offline syncing capabilities'
          '\n• Responsive UI design with thorough testing for optimal performance across devices'
          '\n• Tech Stack: Flutter, Dart, Firebase (Authentication, Firestore, Cloud Messaging), BLoC, WebSocket (via Firebase Realtime Database), JSON ',
      screenshots: [
        'Assets/Images/stud/Login.jpg',
        'Assets/Images/stud/Home1.jpg',
        'Assets/Images/stud/Home2.jpg',
        'Assets/Images/stud/Forgot password.jpg',
        'Assets/Images/stud/Attendance.jpg',
        'Assets/Images/stud/Exam result.jpg',
        'Assets/Images/stud/Mark list.jpg',
        'Assets/Images/stud/Marklist details.jpg',
        'Assets/Images/stud/Syllabus.jpg',
        'Assets/Images/stud/Notes.jpg',
        'Assets/Images/stud/Online class.jpg',
        'Assets/Images/stud/Payment-paid.jpg',
        'Assets/Images/stud/Payment-pending.jpg',
        'Assets/Images/stud/Notifications.jpg',
        'Assets/Images/stud/Settings.jpg',
        'Assets/Images/stud/Profile.jpg',
      ],
      conclusion:
          'Educk successfully combines Flutter and Firebase to create an efficient and reliable academic management system. With features like role-based authentication, real-time chat, attendance tracking, and complete academic data management, the app ensures smooth interaction between students and teachers. Its structured state management and responsive design make it scalable, maintainable, and suitable for real-world educational environments.',
    ),
    Project(
      image: 'Assets/Images/portfolio/Home.png',
      title: 'Portfolio',
      description:
          'My portfolio website is a sleek, professionally designed digital showcase...',
      fullDescription:
          'My portfolio website is a sleek, professionally designed digital showcase that presents the work and capabilities of a talented Flutter developer based in Thiruvananthapuram, Kerala, India. This modern portfolio serves as a comprehensive platform for potential clients, collaborators, and employers to explore Stephy\'s technical expertise, professional journey, and project accomplishments. With its minimalist black-themed interface and intuitive navigation, the website effectively communicates Stephy\'s identity as a versatile cross-platform developer specializing in Flutter, while also highlighting a unique background that bridges both software development and quality assurance. The portfolio demonstrates not only technical proficiency across multiple platforms—Android, iOS, Web, and Desktop—but also showcases a diverse skill set that includes programming languages like Dart and Kotlin, API integration, quality assurance methodologies, and front-end development technologies.'
          '\n\nKey Features'
          '\n• Modern & Minimalist Design – Sleek black-themed interface with a clean and professional layout.'
          '\n• Responsive Cross-Platform UI – Optimized for desktop, tablet, and mobile devices to ensure a smooth browsing experience.'
          '\n• About & Professional Summary Section – Highlights technical expertise, career journey, and specialization in Flutter development.'
          '\n• Projects Showcase – Displays detailed project descriptions with technologies used and key contributions.'
          '\n• Skills & Technology Stack Display – Clearly presents programming languages, frameworks, tools, and QA expertise.'
          '\n• Cross-Platform Development Focus – Emphasizes experience in building Android, iOS, Web, and Desktop applications using Flutter.'
          '\n• Tech Stack: Flutter, Dart, GitHub',
      screenshots: [
        'Assets/Images/portfolio/splash.png',
        'Assets/Images/portfolio/Home.png',
        'Assets/Images/portfolio/portfolio.png',
        'Assets/Images/portfolio/work.png',
        'Assets/Images/portfolio/wallflow.png',
        'Assets/Images/portfolio/educk.png',
        'Assets/Images/portfolio/portfolioscreen.png',
        'Assets/Images/portfolio/kdch.png',
        'Assets/Images/portfolio/About.png',
        'Assets/Images/portfolio/contact.png',
      ],
      conclusion:
          'This portfolio website stands as a testament to modern web design principles and professional self-presentation in the tech industry. By seamlessly integrating essential components—personal introduction, professional experience timeline, educational credentials, project showcase, technical skills overview, and accessible contact information—the portfolio provides visitors with a complete picture of Stephy\'s capabilities as a Associate Flutter Developer. The clean, professional aesthetic combined with strategic content organization makes it easy for potential collaborators to understand Stephy\'s value proposition and reach out for opportunities. With an impressive transition from Electronic Quality Controller at Aptara Learnings to Flutter Developer at Kefi Tech Solutions, along with specialized training from Luminar Technolab, the portfolio effectively communicates both technical competence and professional growth. This digital presence serves as an excellent foundation for career advancement, networking, and securing freelance opportunities in the competitive field of mobile and cross-platform application development.',
    ),
    Project(
      image: 'Assets/Images/HospitalManagement.jpg',
      title: 'KDC Hospital Management',
      description:
          'KDCH is a comprehensive mobile hospital management application designed...',
      fullDescription:
          'KDCH is a comprehensive mobile hospital management application designed to bridge the gap between patients and healthcare services. This all-in-one platform empowers patients with seamless access to medical records, appointment scheduling, prescription management, and hospital services directly from their smartphones. By digitizing traditional hospital interactions, KDCH eliminates the need for physical visits for routine tasks, reduces waiting times, and provides patients with greater control over their healthcare journey. The application features an intuitive interface with secure login, personalized profiles, and easy navigation, making quality healthcare access.'
          '\n\nKey Features'
          '\n• Secure User Authentication – Safe login and registration system to protect patient information.'
          '\n• Personalized Patient Profiles – Manage personal details, medical history, and preferences in one place.'
          '\n• Online Appointment Scheduling – Book, reschedule, or cancel appointments directly through the app.'
          '\n• Digital Medical Records Access – View lab reports, diagnoses, and treatment history anytime.'
          '\n• Prescription Management – Access and track prescribed medications and dosage details digitally.'
          '\n• Notifications & Reminders – Get real-time alerts for appointments, prescriptions, and hospital updates.'
          '\n• Hospital Services Directory – Explore departments, doctors, and available medical services.'
          '\n• User-Friendly Interface – Simple, intuitive, and responsive design for smooth navigation.'
          '\n• Data Security & Privacy – Secure backend integration to ensure confidentiality of medical data.'
          '\n• Tech Stack: Flutter, Dart, Node.js, Express.js, Firebase Firestore, BLoC, GitHub',
      screenshots: [
        'Assets/Images/kdch/splash.jpg',
        'Assets/Images/kdch/Login.jpg',
        'Assets/Images/kdch/Home1.jpg',
        'Assets/Images/kdch/Home2.jpg',
        'Assets/Images/kdch/appointments.jpg',
        'Assets/Images/kdch/Reschedule appointment.jpg',
        'Assets/Images/kdch/Active appointment.jpg',
        'Assets/Images/kdch/online medicine order.jpg',
        'Assets/Images/kdch/offline appointment.jpg',
        'Assets/Images/kdch/Active medicine.jpg',
        'Assets/Images/kdch/Emergency contact.jpg',
        'Assets/Images/kdch/medical report.jpg',
        'Assets/Images/kdch/Lab reports.jpg',
        'Assets/Images/kdch/Radiology.jpg',
        'Assets/Images/kdch/prescription.jpg',
        'Assets/Images/kdch/bills.jpg',
        'Assets/Images/kdch/Discharge.jpg',
        'Assets/Images/kdch/medicine delivery.jpg',
        'Assets/Images/kdch/checkups.jpg',
        'Assets/Images/kdch/forgot password.jpg',
        'Assets/Images/kdch/Notifications.jpg',
        'Assets/Images/kdch/settings.jpg',
        'Assets/Images/kdch/Radiology.jpg',
        'Assets/Images/kdch/Departments.jpg',
        'Assets/Images/kdch/profile.jpg',
      ],
      conclusion:
          'The KDCH Hospital Management Application represents a significant step forward in digital healthcare delivery, offering a patient-centric approach that prioritizes convenience, accessibility, and comprehensive care management. By integrating essential features such as appointment booking, medical records access, medication tracking, online pharmacy services, and emergency contacts into a single platform, the app streamlines the entire healthcare experience. With its user-friendly design, secure data management, and extensive functionality covering everything from health check-up packages to bill payments, KDCH serves as a complete healthcare companion. This digital solution not only enhances patient engagement and satisfaction but also contributes to more efficient hospital operations, ultimately fostering better health outcomes and a stronger patient-provider relationship in the modern healthcare landscape.',
    ),
  ];
}
