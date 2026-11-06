-- Seed Data for SJDSF Student Management System
-- Provides full test datasets: 10 Supervisors, 10 Employers, 10 Students, 10 OTPs, 10 Devices, 10 Contacts,
-- plus at least 5 records per student for Attendance (50), Mood/Wellbeing (50), Feedback (50), and Location Trails (50).

TRUNCATE TABLE student_locations, student_feedback, attendance, mood, otps, authorized_devices, student, employer, supervisor, emergency_contact RESTART IDENTITY CASCADE;

-- 1. Insert 10 Supervisors
INSERT INTO supervisor (supervisor_id, first_name, last_name, email_address, contact_number) VALUES
(1, 'Nimal', 'Perera', 'nimal.perera@sjdsf.lk', '+94 77 123 4567'),
(2, 'Kamal', 'Silva', 'kamal.silva@sjdsf.lk', '+94 71 234 5678'),
(3, 'Sunil', 'Fernando', 'sunil.fernando@sjdsf.lk', '+94 76 345 6789'),
(4, 'Anura', 'Jayawardena', 'anura.j@sjdsf.lk', '+94 75 456 7890'),
(5, 'Dilani', 'Gunasekara', 'dilani.g@sjdsf.lk', '+94 78 567 8901'),
(6, 'Mahesh', 'Bandara', 'mahesh.b@sjdsf.lk', '+94 72 678 9012'),
(7, 'Chathuri', 'Ranasinghe', 'chathuri.r@sjdsf.lk', '+94 70 789 0123'),
(8, 'Kasun', 'Dissanayake', 'kasun.d@sjdsf.lk', '+94 77 890 1234'),
(9, 'Priyanka', 'Wijesinghe', 'priyanka.w@sjdsf.lk', '+94 71 901 2345'),
(10, 'Nuwan', 'Kulasekara', 'nuwan.k@sjdsf.lk', '+94 76 012 3456');

SELECT setval('supervisor_supervisor_id_seq', (SELECT MAX(supervisor_id) FROM supervisor));

-- 2. Insert 10 Employers
INSERT INTO employer (id, name, contact_number, address_line1, address_line2, address_line3, addr_long, addr_lat) VALUES
(1, 'Dialog Axiata PLC', '+94 11 710 0100', '475 Union Place', 'Slave Island', 'Colombo 02', 79.8596, 6.9184),
(2, 'WSO2 Lanka', '+94 11 214 5345', 'No. 20, Palm Grove', 'Colpetty', 'Colombo 03', 79.8529, 6.9015),
(3, 'MAS Holdings', '+94 11 472 7222', '10th Floor, Aitken Spence Tower II', '315 Vauxhall St', 'Colombo 02', 79.8560, 6.9210),
(4, 'Brandix Apparel', '+94 11 472 7000', '25 Rheinland Place', 'Kollupitiya', 'Colombo 03', 79.8517, 6.9056),
(5, 'Virtusa Pvt Ltd', '+94 11 460 5500', '752 Dr Danister De Silva Mawatha', 'Dematagoda', 'Colombo 09', 79.8821, 6.9385),
(6, 'IFS R&D International', '+94 11 236 4400', '501 Galle Road', 'Wellawatte', 'Colombo 06', 79.8601, 6.8772),
(7, 'John Keells Holdings', '+94 11 230 6000', '117 Sir Chittampalam A Gardiner Mawatha', 'Fort', 'Colombo 02', 79.8504, 6.9319),
(8, 'Commercial Bank of Ceylon', '+94 11 248 6000', 'Commercial House', '21 Sir Razik Fareed Mawatha', 'Colombo 01', 79.8450, 6.9360),
(9, 'PickMe (Digital Mobility)', '+94 11 450 7500', 'No. 309, High Level Road', 'Nugegoda', 'Colombo', 79.8978, 6.8654),
(10, 'Hayleys PLC', '+94 11 262 7000', 'No. 400, Deans Road', 'Maradana', 'Colombo 10', 79.8690, 6.9247);

SELECT setval('employer_id_seq', (SELECT MAX(id) FROM employer));

-- 3. Insert 10 Students
INSERT INTO student (id, first_name, last_name, dob, gender, address_line1, address_line2, city, contact_number, contact_number_guardian, supervisor_id, remarks, home_long, home_lat, employer_id, check_in_time, check_out_time, parent_pin) VALUES
(1, 'Avantha', 'Fernando', '2001-04-12', 'Male', '14/2 Temple Road', 'Maharagama', 'Colombo', '+94 77 111 2233', '+94 77 999 1122', 1, 'Punctual and keen to learn backend development', 79.9245, 6.8480, 1, '08:30', '17:00', '1234'),
(2, 'Oshadi', 'Perera', '2002-08-25', 'Female', '45 Station Road', 'Dehiwala', 'Colombo', '+94 71 222 3344', '+94 71 888 2233', 2, 'Excels in UI/UX tasks; highly active in team discussions', 79.8672, 6.8510, 2, '09:00', '17:30', '2234'),
(3, 'Sahan', 'Wickramasinghe', '2000-11-03', 'Male', '89 Kandy Road', 'Kelaniya', 'Gampaha', '+94 76 333 4455', '+94 76 777 3344', 3, 'Solid grasp of data structures and cloud platforms', 79.9180, 6.9740, 3, '08:30', '17:00', '1234'),
(4, 'Tharushi', 'Jayakody', '2003-01-19', 'Female', '12 Lake Drive', 'Rajagiriya', 'Colombo', '+94 75 444 5566', '+94 75 666 4455', 4, 'Great communication; completed onboarding project ahead of schedule', 79.8940, 6.9110, 4, '08:45', '17:15', '4321'),
(5, 'Dinuka', 'Mendis', '2001-06-30', 'Male', '67 Galle Road', 'Moratuwa', 'Colombo', '+94 78 555 6677', '+94 78 555 5566', 5, 'Consistently shows high initiative in customer support engineering', 79.8820, 6.7730, 5, '09:00', '17:30', '5678'),
(6, 'Nadeesha', 'Alwis', '2002-03-14', 'Female', '23 School Lane', 'Nugegoda', 'Colombo', '+94 72 666 7788', '+94 72 444 6677', 6, 'Diligent worker with strong analytical capabilities', 79.8970, 6.8650, 6, '08:30', '17:00', '1111'),
(7, 'Isuru', 'Rathnayake', '2000-09-08', 'Male', '101 Negombo Road', 'Ja-Ela', 'Gampaha', '+94 70 777 8899', '+94 70 333 7788', 7, 'Adapting well to modern mobile application stack', 79.8920, 7.0760, 7, '08:30', '17:00', '2222'),
(8, 'Kavindi', 'Gamage', '2002-12-05', 'Female', '56 Beach Road', 'Mount Lavinia', 'Colombo', '+94 77 888 9900', '+94 77 222 8899', 8, 'Shows great interest in quality assurance and automated testing', 79.8630, 6.8380, 8, '09:00', '17:30', '3333'),
(9, 'Bhanuka', 'Senanayake', '2001-07-22', 'Male', '34 Flower Road', 'Cinnamon Gardens', 'Colombo 07', '+94 71 999 0011', '+94 71 111 9900', 9, 'Demonstrates quick problem-solving skills in network administration', 79.8610, 6.9060, 9, '08:30', '17:00', '4444'),
(10, 'Sachini', 'Herath', '2003-05-18', 'Female', '78 Hospital Road', 'Battaramulla', 'Colombo', '+94 76 000 1122', '+94 76 000 0011', 10, 'Dependable and dedicated; eager to improve software engineering skills', 79.9190, 6.8990, 10, '08:45', '17:15', '5555');

SELECT setval('student_id_seq', (SELECT MAX(id) FROM student));

-- 4. Insert 50 Attendance records (5 per student across past 5 days)
INSERT INTO attendance (id, student_id, check_in_lat, check_in_long, check_in_date_time, check_out_lat, check_out_long, check_out_date_time, arrived_home_lat, arrived_home_long, arrived_home_date_time) VALUES
(1, 1, 6.9184, 79.8596, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '8 hours 15 minutes', 6.9184, 79.8596, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours', 6.8480, 79.9245, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 45 minutes'),
(2, 1, 6.9184, 79.8596, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '8 hours 30 minutes', 6.9184, 79.8596, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes', 6.8480, 79.9245, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '18 hours'),
(3, 1, 6.9184, 79.8596, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '8 hours 20 minutes', 6.9184, 79.8596, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours', 6.8480, 79.9245, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 40 minutes'),
(4, 1, 6.9184, 79.8596, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '8 hours 35 minutes', 6.9184, 79.8596, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 10 minutes', 6.8480, 79.9245, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 55 minutes'),
(5, 1, 6.9184, 79.8596, CURRENT_DATE + INTERVAL '8 hours', 6.9184, 79.8596, CURRENT_DATE + INTERVAL '17 hours', 6.8480, 79.9245, CURRENT_DATE + INTERVAL '17 hours 35 minutes'),
(6, 2, 6.9015, 79.8529, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '8 hours 15 minutes', 6.9015, 79.8529, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours', 6.8510, 79.8672, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 45 minutes'),
(7, 2, 6.9015, 79.8529, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '8 hours 30 minutes', 6.9015, 79.8529, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes', 6.8510, 79.8672, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '18 hours'),
(8, 2, 6.9015, 79.8529, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '8 hours 20 minutes', 6.9015, 79.8529, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours', 6.8510, 79.8672, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 40 minutes'),
(9, 2, 6.9015, 79.8529, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '8 hours 35 minutes', 6.9015, 79.8529, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 10 minutes', 6.8510, 79.8672, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 55 minutes'),
(10, 2, 6.9015, 79.8529, CURRENT_DATE + INTERVAL '8 hours', 6.9015, 79.8529, CURRENT_DATE + INTERVAL '17 hours', 6.8510, 79.8672, CURRENT_DATE + INTERVAL '17 hours 35 minutes'),
(11, 3, 6.9210, 79.8560, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '8 hours 15 minutes', 6.9210, 79.8560, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours', 6.9740, 79.9180, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 45 minutes'),
(12, 3, 6.9210, 79.8560, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '8 hours 30 minutes', 6.9210, 79.8560, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes', 6.9740, 79.9180, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '18 hours'),
(13, 3, 6.9210, 79.8560, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '8 hours 20 minutes', 6.9210, 79.8560, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours', 6.9740, 79.9180, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 40 minutes'),
(14, 3, 6.9210, 79.8560, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '8 hours 35 minutes', 6.9210, 79.8560, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 10 minutes', 6.9740, 79.9180, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 55 minutes'),
(15, 3, 6.9210, 79.8560, CURRENT_DATE + INTERVAL '8 hours', 6.9210, 79.8560, CURRENT_DATE + INTERVAL '17 hours', 6.9740, 79.9180, CURRENT_DATE + INTERVAL '17 hours 35 minutes'),
(16, 4, 6.9056, 79.8517, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '8 hours 15 minutes', 6.9056, 79.8517, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours', 6.9110, 79.8940, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 45 minutes'),
(17, 4, 6.9056, 79.8517, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '8 hours 30 minutes', 6.9056, 79.8517, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes', 6.9110, 79.8940, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '18 hours'),
(18, 4, 6.9056, 79.8517, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '8 hours 20 minutes', 6.9056, 79.8517, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours', 6.9110, 79.8940, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 40 minutes'),
(19, 4, 6.9056, 79.8517, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '8 hours 35 minutes', 6.9056, 79.8517, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 10 minutes', 6.9110, 79.8940, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 55 minutes'),
(20, 4, 6.9056, 79.8517, CURRENT_DATE + INTERVAL '8 hours', NULL, NULL, NULL, NULL, NULL, NULL),
(21, 5, 6.9385, 79.8821, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '8 hours 15 minutes', 6.9385, 79.8821, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours', 6.7730, 79.8820, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 45 minutes'),
(22, 5, 6.9385, 79.8821, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '8 hours 30 minutes', 6.9385, 79.8821, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes', 6.7730, 79.8820, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '18 hours'),
(23, 5, 6.9385, 79.8821, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '8 hours 20 minutes', 6.9385, 79.8821, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours', 6.7730, 79.8820, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 40 minutes'),
(24, 5, 6.9385, 79.8821, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '8 hours 35 minutes', 6.9385, 79.8821, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 10 minutes', 6.7730, 79.8820, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 55 minutes'),
(25, 5, 6.9385, 79.8821, CURRENT_DATE + INTERVAL '8 hours', 6.9385, 79.8821, CURRENT_DATE + INTERVAL '17 hours', 6.7730, 79.8820, CURRENT_DATE + INTERVAL '17 hours 35 minutes'),
(26, 6, 6.8772, 79.8601, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '8 hours 15 minutes', 6.8772, 79.8601, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours', 6.8650, 79.8970, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 45 minutes'),
(27, 6, 6.8772, 79.8601, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '8 hours 30 minutes', 6.8772, 79.8601, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes', 6.8650, 79.8970, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '18 hours'),
(28, 6, 6.8772, 79.8601, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '8 hours 20 minutes', 6.8772, 79.8601, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours', 6.8650, 79.8970, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 40 minutes'),
(29, 6, 6.8772, 79.8601, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '8 hours 35 minutes', 6.8772, 79.8601, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 10 minutes', 6.8650, 79.8970, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 55 minutes'),
(30, 6, 6.8772, 79.8601, CURRENT_DATE + INTERVAL '8 hours', 6.8772, 79.8601, CURRENT_DATE + INTERVAL '17 hours', 6.8650, 79.8970, CURRENT_DATE + INTERVAL '17 hours 35 minutes'),
(31, 7, 6.9319, 79.8504, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '8 hours 15 minutes', 6.9319, 79.8504, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours', 7.0760, 79.8920, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 45 minutes'),
(32, 7, 6.9319, 79.8504, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '8 hours 30 minutes', 6.9319, 79.8504, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes', 7.0760, 79.8920, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '18 hours'),
(33, 7, 6.9319, 79.8504, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '8 hours 20 minutes', 6.9319, 79.8504, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours', 7.0760, 79.8920, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 40 minutes'),
(34, 7, 6.9319, 79.8504, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '8 hours 35 minutes', 6.9319, 79.8504, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 10 minutes', 7.0760, 79.8920, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 55 minutes'),
(35, 7, 6.9319, 79.8504, CURRENT_DATE + INTERVAL '8 hours', NULL, NULL, NULL, NULL, NULL, NULL),
(36, 8, 6.9360, 79.8450, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '8 hours 15 minutes', 6.9360, 79.8450, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours', 6.8380, 79.8630, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 45 minutes'),
(37, 8, 6.9360, 79.8450, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '8 hours 30 minutes', 6.9360, 79.8450, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes', 6.8380, 79.8630, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '18 hours'),
(38, 8, 6.9360, 79.8450, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '8 hours 20 minutes', 6.9360, 79.8450, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours', 6.8380, 79.8630, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 40 minutes'),
(39, 8, 6.9360, 79.8450, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '8 hours 35 minutes', 6.9360, 79.8450, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 10 minutes', 6.8380, 79.8630, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 55 minutes'),
(40, 8, 6.9360, 79.8450, CURRENT_DATE + INTERVAL '8 hours', 6.9360, 79.8450, CURRENT_DATE + INTERVAL '17 hours', 6.8380, 79.8630, CURRENT_DATE + INTERVAL '17 hours 35 minutes'),
(41, 9, 6.8654, 79.8978, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '8 hours 15 minutes', 6.8654, 79.8978, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours', 6.9060, 79.8610, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 45 minutes'),
(42, 9, 6.8654, 79.8978, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '8 hours 30 minutes', 6.8654, 79.8978, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes', 6.9060, 79.8610, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '18 hours'),
(43, 9, 6.8654, 79.8978, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '8 hours 20 minutes', 6.8654, 79.8978, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours', 6.9060, 79.8610, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 40 minutes'),
(44, 9, 6.8654, 79.8978, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '8 hours 35 minutes', 6.8654, 79.8978, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 10 minutes', 6.9060, 79.8610, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 55 minutes'),
(45, 9, 6.8654, 79.8978, CURRENT_DATE + INTERVAL '8 hours', 6.8654, 79.8978, CURRENT_DATE + INTERVAL '17 hours', 6.9060, 79.8610, CURRENT_DATE + INTERVAL '17 hours 35 minutes'),
(46, 10, 6.9247, 79.8690, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '8 hours 15 minutes', 6.9247, 79.8690, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours', 6.8990, 79.9190, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 45 minutes'),
(47, 10, 6.9247, 79.8690, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '8 hours 30 minutes', 6.9247, 79.8690, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes', 6.8990, 79.9190, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '18 hours'),
(48, 10, 6.9247, 79.8690, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '8 hours 20 minutes', 6.9247, 79.8690, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours', 6.8990, 79.9190, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 40 minutes'),
(49, 10, 6.9247, 79.8690, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '8 hours 35 minutes', 6.9247, 79.8690, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 10 minutes', 6.8990, 79.9190, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 55 minutes'),
(50, 10, 6.9247, 79.8690, CURRENT_DATE + INTERVAL '8 hours', NULL, NULL, NULL, NULL, NULL, NULL);

SELECT setval('attendance_id_seq', (SELECT MAX(id) FROM attendance));

-- 5. Insert 50 Mood / Wellbeing records (5 per student)
INSERT INTO mood (id, student_id, recorded_at, emotion, is_daily) VALUES
(1, 1, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '9 hours 15 minutes', 'Happy', true),
(2, 1, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '9 hours 15 minutes', 'Focused', true),
(3, 1, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '9 hours 15 minutes', 'Happy', true),
(4, 1, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '9 hours 15 minutes', 'Energetic', true),
(5, 1, CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Happy', true),
(6, 2, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '9 hours 15 minutes', 'Excited', true),
(7, 2, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '9 hours 15 minutes', 'Happy', true),
(8, 2, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '9 hours 15 minutes', 'Focused', true),
(9, 2, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '9 hours 15 minutes', 'Happy', true),
(10, 2, CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Motivated', true),
(11, 3, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '9 hours 15 minutes', 'Calm', true),
(12, 3, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '9 hours 15 minutes', 'Focused', true),
(13, 3, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '9 hours 15 minutes', 'Neutral', true),
(14, 3, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '9 hours 15 minutes', 'Happy', true),
(15, 3, CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Proud', true),
(16, 4, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '9 hours 15 minutes', 'Energetic', true),
(17, 4, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '9 hours 15 minutes', 'Happy', true),
(18, 4, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '9 hours 15 minutes', 'Excited', true),
(19, 4, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '9 hours 15 minutes', 'Focused', true),
(20, 4, CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Happy', true),
(21, 5, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '9 hours 15 minutes', 'Motivated', true),
(22, 5, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '9 hours 15 minutes', 'Focused', true),
(23, 5, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '9 hours 15 minutes', 'Happy', true),
(24, 5, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '9 hours 15 minutes', 'Neutral', true),
(25, 5, CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Accomplished', true),
(26, 6, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '9 hours 15 minutes', 'Neutral', true),
(27, 6, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '9 hours 15 minutes', 'Calm', true),
(28, 6, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '9 hours 15 minutes', 'Focused', true),
(29, 6, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '9 hours 15 minutes', 'Happy', true),
(30, 6, CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Proud', true),
(31, 7, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '9 hours 15 minutes', 'Focused', true),
(32, 7, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '9 hours 15 minutes', 'Motivated', true),
(33, 7, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '9 hours 15 minutes', 'Happy', true),
(34, 7, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '9 hours 15 minutes', 'Excited', true),
(35, 7, CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Happy', true),
(36, 8, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '9 hours 15 minutes', 'Calm', true),
(37, 8, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '9 hours 15 minutes', 'Happy', true),
(38, 8, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '9 hours 15 minutes', 'Focused', true),
(39, 8, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '9 hours 15 minutes', 'Motivated', true),
(40, 8, CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Happy', true),
(41, 9, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '9 hours 15 minutes', 'Energetic', true),
(42, 9, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '9 hours 15 minutes', 'Happy', true),
(43, 9, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '9 hours 15 minutes', 'Focused', true),
(44, 9, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '9 hours 15 minutes', 'Accomplished', true),
(45, 9, CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Happy', true),
(46, 10, (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '9 hours 15 minutes', 'Motivated', true),
(47, 10, (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '9 hours 15 minutes', 'Calm', true),
(48, 10, (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '9 hours 15 minutes', 'Focused', true),
(49, 10, (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '9 hours 15 minutes', 'Happy', true),
(50, 10, CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Proud', true);

SELECT setval('mood_id_seq', (SELECT MAX(id) FROM mood));

-- 6. Insert 10 Active OTPs
INSERT INTO otps (id, student_id, otp_code, expires_at, is_used, created_at) VALUES
(1, 1, '1001', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
(2, 2, '1002', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
(3, 3, '1003', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
(4, 4, '1004', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
(5, 5, '1005', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
(6, 6, '1006', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
(7, 7, '1007', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
(8, 8, '1008', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
(9, 9, '1009', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
(10, 10, '1010', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP);

SELECT setval('otps_id_seq', (SELECT MAX(id) FROM otps));

-- 7. Insert 10 Authorized Devices
INSERT INTO authorized_devices (id, student_id, secret_code) VALUES
(1, 1, 'a1b2c3d4e5f60123456789abcdef0123456789abcdef0123456789abcdef0123'),
(2, 2, 'b2c3d4e5f60123456789abcdef0123456789abcdef0123456789abcdef0123a1'),
(3, 3, 'c3d4e5f60123456789abcdef0123456789abcdef0123456789abcdef0123a1b2'),
(4, 4, 'd4e5f60123456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3'),
(5, 5, 'e5f60123456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3d4'),
(6, 6, 'f60123456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3d4e5'),
(7, 7, '0123456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3d4e5f6'),
(8, 8, '123456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3d4e5f60'),
(9, 9, '23456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3d4e5f601'),
(10, 10, '3456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3d4e5f6012');

SELECT setval('authorized_devices_id_seq', (SELECT MAX(id) FROM authorized_devices));

-- 8. Insert 10 Emergency Contacts
INSERT INTO emergency_contact (id, phone_number, updated_at) VALUES
(1, '+94 11 234 5678', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(2, '+94 11 345 6789', CURRENT_TIMESTAMP - INTERVAL '9 days'),
(3, '+94 11 456 7890', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(4, '+94 11 567 8901', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(5, '+94 11 678 9012', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(6, '+94 11 789 0123', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(7, '+94 11 890 1234', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(8, '+94 11 901 2345', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(9, '+94 11 012 3456', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(10, '+94 11 119 0000', CURRENT_TIMESTAMP);

SELECT setval('emergency_contact_id_seq', (SELECT MAX(id) FROM emergency_contact));

-- 9. Insert 50 Student Feedbacks (5 observations per student)
INSERT INTO student_feedback (id, student_id, feedback_text, submitted_at) VALUES
(1, 1, 'Avantha showed great initiative troubleshooting our internal network issue today.', (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 15 minutes'),
(2, 1, 'Smooth execution during morning standup; documented API payloads diligently.', (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes'),
(3, 1, 'Helped a peer integrate database migrations with zero downtime.', (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 15 minutes'),
(4, 1, 'Demonstrated excellent punctuality and contributed insightful unit test cases.', (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 15 minutes'),
(5, 1, 'Completed daily backend sprint targets ahead of schedule. Outstanding teamwork!', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes'),
(6, 2, 'Oshadi delivered clean, accessible Figma wireframes for the mobile dashboard.', (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 15 minutes'),
(7, 2, 'Exemplary attention to detail during our design audit session this morning.', (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes'),
(8, 2, 'Collaborated seamlessly with frontend developers on responsive design tokens.', (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 15 minutes'),
(9, 2, 'Demonstrated great patience and creativity refining our color palette contrast.', (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 15 minutes'),
(10, 2, 'Consistently communicates blockers early and maintains high output quality.', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes'),
(11, 3, 'Sahan implemented database indexes effectively, noticeably speeding up queries.', (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 15 minutes'),
(12, 3, 'Quickly grasped Docker container networking concepts during pair programming.', (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes'),
(13, 3, 'Showed steady focus while refactoring legacy stored procedures today.', (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 15 minutes'),
(14, 3, 'Great attitude during team code review; incorporated feedback proactively.', (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 15 minutes'),
(15, 3, 'Delivered well-structured Go controllers with thorough error handling.', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes'),
(16, 4, 'Tharushi facilitated the team sync gracefully and kept meeting action items clear.', (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 15 minutes'),
(17, 4, 'Delivered a detailed summary of client onboarding steps with zero omissions.', (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes'),
(18, 4, 'Strong interpersonal skills; handled client support tickets with high empathy.', (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 15 minutes'),
(19, 4, 'Maintained high productivity throughout a demanding inventory sprint.', (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 15 minutes'),
(20, 4, 'Very reliable and energetic; consistently lifts team spirits during peak hours.', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes'),
(21, 5, 'Dinuka organized the hardware workstation inventory accurately today.', (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 15 minutes'),
(22, 5, 'Diagnosed an intermittent workstation connectivity glitch quickly and calmly.', (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes'),
(23, 5, 'Very helpful to junior colleagues needing guidance on Linux shell commands.', (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 15 minutes'),
(24, 5, 'Showed exceptional discipline adhering to workplace electrical safety standards.', (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 15 minutes'),
(25, 5, 'Proactively updated device firmware across all test bench tablets.', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes'),
(26, 6, 'Nadeesha validated daily QA test scripts with meticulous precision.', (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 15 minutes'),
(27, 6, 'Identified two edge-case navigation bugs before staging deployment.', (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes'),
(28, 6, 'Strong analytical ability demonstrated during automated test log analysis.', (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 15 minutes'),
(29, 6, 'Collaborated well with the QA lead on regression test suite expansion.', (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 15 minutes'),
(30, 6, 'Dependable, detail-oriented, and thorough in every defect report submitted.', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes'),
(31, 7, 'Isuru showed noticeable acceleration in completing frontend pull requests.', (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 15 minutes'),
(32, 7, 'Adapted smoothly to the updated TypeScript linter rules and clean code practices.', (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes'),
(33, 7, 'Contributed solid ideas to streamline mobile app bottom tab transitions.', (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 15 minutes'),
(34, 7, 'Demonstrated high resilience and focus during morning deployment testing.', (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 15 minutes'),
(35, 7, 'Shows tremendous growth and enthusiasm for modern software craftsmanship.', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes'),
(36, 8, 'Kavindi organized the end-to-end integration test checklists methodically.', (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 15 minutes'),
(37, 8, 'Verified all emergency contact and checkout flows under mock conditions.', (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes'),
(38, 8, 'Great diligence in keeping test run documentation up-to-date and organized.', (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 15 minutes'),
(39, 8, 'Maintained a calm, focused presence throughout a busy release preparation.', (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 15 minutes'),
(40, 8, 'Superb work ethic and very thoughtful approach to automated testing tasks.', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes'),
(41, 9, 'Bhanuka effectively handled server monitoring alerts during lunch peak hours.', (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 15 minutes'),
(42, 9, 'Demonstrated solid understanding of TLS cert verification and network routing.', (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes'),
(43, 9, 'Resolved staging latency complaints promptly by inspecting connection pools.', (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 15 minutes'),
(44, 9, 'Communicates technical observations clearly and acts decisively under pressure.', (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 15 minutes'),
(45, 9, 'A reliable, disciplined team player with an exceptional learning curve.', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes'),
(46, 10, 'Sachini completed trainee project deliverables on time with high visual polish.', (CURRENT_DATE - INTERVAL '4 days') + INTERVAL '17 hours 15 minutes'),
(47, 10, 'Showed genuine enthusiasm while learning cloud infrastructure fundamentals.', (CURRENT_DATE - INTERVAL '3 days') + INTERVAL '17 hours 15 minutes'),
(48, 10, 'Prepared clear, easy-to-follow user guides for internal portal onboarding.', (CURRENT_DATE - INTERVAL '2 days') + INTERVAL '17 hours 15 minutes'),
(49, 10, 'Punctual, attentive, and followed supervisor instructions with great care.', (CURRENT_DATE - INTERVAL '1 day') + INTERVAL '17 hours 15 minutes'),
(50, 10, 'Consistently delivers quality work and demonstrates wonderful team spirit.', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes');

SELECT setval('student_feedback_id_seq', (SELECT MAX(id) FROM student_feedback));

-- 10. Insert 50 Student Location Trails (5 sequential GPS waypoints per student)
INSERT INTO student_locations (id, student_id, latitude, longitude, accuracy, recorded_at) VALUES
(1, 1, 6.848, 79.9245, 5.0, CURRENT_DATE + INTERVAL '8 hours'),
(2, 1, 6.8762, 79.8985, 12.5, CURRENT_DATE + INTERVAL '8 hours 15 minutes'),
(3, 1, 6.9184, 79.8596, 4.5, CURRENT_DATE + INTERVAL '8 hours 30 minutes'),
(4, 1, 6.9196, 79.8611, 6.0, CURRENT_DATE + INTERVAL '12 hours 30 minutes'),
(5, 1, 6.8973, 79.8791, 10.0, CURRENT_DATE + INTERVAL '17 hours 15 minutes'),
(6, 2, 6.851, 79.8672, 5.0, CURRENT_DATE + INTERVAL '8 hours'),
(7, 2, 6.8712, 79.8615, 12.5, CURRENT_DATE + INTERVAL '8 hours 15 minutes'),
(8, 2, 6.9015, 79.8529, 4.5, CURRENT_DATE + INTERVAL '8 hours 30 minutes'),
(9, 2, 6.9027, 79.8544, 6.0, CURRENT_DATE + INTERVAL '12 hours 30 minutes'),
(10, 2, 6.8864, 79.8572, 10.0, CURRENT_DATE + INTERVAL '17 hours 15 minutes'),
(11, 3, 6.974, 79.918, 5.0, CURRENT_DATE + INTERVAL '8 hours'),
(12, 3, 6.9528, 79.8932, 12.5, CURRENT_DATE + INTERVAL '8 hours 15 minutes'),
(13, 3, 6.921, 79.856, 4.5, CURRENT_DATE + INTERVAL '8 hours 30 minutes'),
(14, 3, 6.9222, 79.8575, 6.0, CURRENT_DATE + INTERVAL '12 hours 30 minutes'),
(15, 3, 6.9369, 79.8746, 10.0, CURRENT_DATE + INTERVAL '17 hours 15 minutes'),
(16, 4, 6.911, 79.894, 5.0, CURRENT_DATE + INTERVAL '8 hours'),
(17, 4, 6.9088, 79.8771, 12.5, CURRENT_DATE + INTERVAL '8 hours 15 minutes'),
(18, 4, 6.9056, 79.8517, 4.5, CURRENT_DATE + INTERVAL '8 hours 30 minutes'),
(19, 4, 6.9068, 79.8532, 6.0, CURRENT_DATE + INTERVAL '12 hours 30 minutes'),
(20, 4, 6.9072, 79.8644, 10.0, CURRENT_DATE + INTERVAL '17 hours 15 minutes'),
(21, 5, 6.773, 79.882, 5.0, CURRENT_DATE + INTERVAL '8 hours'),
(22, 5, 6.8392, 79.882, 12.5, CURRENT_DATE + INTERVAL '8 hours 15 minutes'),
(23, 5, 6.9385, 79.8821, 4.5, CURRENT_DATE + INTERVAL '8 hours 30 minutes'),
(24, 5, 6.9397, 79.8836, 6.0, CURRENT_DATE + INTERVAL '12 hours 30 minutes'),
(25, 5, 6.8888, 79.8821, 10.0, CURRENT_DATE + INTERVAL '17 hours 15 minutes'),
(26, 6, 6.865, 79.897, 5.0, CURRENT_DATE + INTERVAL '8 hours'),
(27, 6, 6.8699, 79.8822, 12.5, CURRENT_DATE + INTERVAL '8 hours 15 minutes'),
(28, 6, 6.8772, 79.8601, 4.5, CURRENT_DATE + INTERVAL '8 hours 30 minutes'),
(29, 6, 6.8784, 79.8616, 6.0, CURRENT_DATE + INTERVAL '12 hours 30 minutes'),
(30, 6, 6.8735, 79.8712, 10.0, CURRENT_DATE + INTERVAL '17 hours 15 minutes'),
(31, 7, 7.076, 79.892, 5.0, CURRENT_DATE + INTERVAL '8 hours'),
(32, 7, 7.0184, 79.8754, 12.5, CURRENT_DATE + INTERVAL '8 hours 15 minutes'),
(33, 7, 6.9319, 79.8504, 4.5, CURRENT_DATE + INTERVAL '8 hours 30 minutes'),
(34, 7, 6.9331, 79.8519, 6.0, CURRENT_DATE + INTERVAL '12 hours 30 minutes'),
(35, 7, 6.9751, 79.8629, 10.0, CURRENT_DATE + INTERVAL '17 hours 15 minutes'),
(36, 8, 6.838, 79.863, 5.0, CURRENT_DATE + INTERVAL '8 hours'),
(37, 8, 6.8772, 79.8558, 12.5, CURRENT_DATE + INTERVAL '8 hours 15 minutes'),
(38, 8, 6.936, 79.845, 4.5, CURRENT_DATE + INTERVAL '8 hours 30 minutes'),
(39, 8, 6.9372, 79.8465, 6.0, CURRENT_DATE + INTERVAL '12 hours 30 minutes'),
(40, 8, 6.9066, 79.8504, 10.0, CURRENT_DATE + INTERVAL '17 hours 15 minutes'),
(41, 9, 6.906, 79.861, 5.0, CURRENT_DATE + INTERVAL '8 hours'),
(42, 9, 6.8898, 79.8757, 12.5, CURRENT_DATE + INTERVAL '8 hours 15 minutes'),
(43, 9, 6.8654, 79.8978, 4.5, CURRENT_DATE + INTERVAL '8 hours 30 minutes'),
(44, 9, 6.8666, 79.8993, 6.0, CURRENT_DATE + INTERVAL '12 hours 30 minutes'),
(45, 9, 6.8776, 79.8868, 10.0, CURRENT_DATE + INTERVAL '17 hours 15 minutes'),
(46, 10, 6.899, 79.919, 5.0, CURRENT_DATE + INTERVAL '8 hours'),
(47, 10, 6.9093, 79.899, 12.5, CURRENT_DATE + INTERVAL '8 hours 15 minutes'),
(48, 10, 6.9247, 79.869, 4.5, CURRENT_DATE + INTERVAL '8 hours 30 minutes'),
(49, 10, 6.9259, 79.8705, 6.0, CURRENT_DATE + INTERVAL '12 hours 30 minutes'),
(50, 10, 6.917, 79.884, 10.0, CURRENT_DATE + INTERVAL '17 hours 15 minutes');

SELECT setval('student_locations_id_seq', (SELECT MAX(id) FROM student_locations));
