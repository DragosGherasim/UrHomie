INSERT INTO user_profile (id, email, first_name, last_name, phone_number, country, city, address)
VALUES (
  1,
  'testc@gmail.com',
  'ClientFirst',
  'ClientLast',
  '0752892767',
  'Romania',
  'Bucuresti',
  'Strada Clientului nr. 1'
);

INSERT INTO client (id, user_profile_id)
VALUES (1, 1);

INSERT INTO user_profile (id, email, first_name, last_name, phone_number, country, city, address)
VALUES (
  2,
  'tests1@gmail.com',
  'Provider1First',
  'Provider1Last',
  '0742832777',
  'Romania',
  'Cluj-Napoca',
  'Strada Furnizorului nr. 5'
);

INSERT INTO service_provider (
  id, user_profile_id, education, certifications, experience_descriptions, work_schedule, coverage_area
)
VALUES (
  2,
  2,
  'Technical University',
  'Licensed Plumber, Certified Electrician, General Maintenance Certificate',
  'Over 10 years of experience in residential and commercial repairs. Skilled in bathroom fixture installation, pipe leak repairs, lighting systems, and general home maintenance. Also handles custom renovation requests.',
  '09:00 – 17:00',
  25
);

INSERT INTO user_profile (id, email, first_name, last_name, phone_number, country, city, address)
VALUES (
  3,
  'tests2@gmail.com',
  'Provider2First',
  'Provider2Last',
  '0742832890',
  'Romania',
  'Iasi',
  'Strada Lalelor nr. 10'
);

INSERT INTO service_provider (
  id, user_profile_id, education, certifications, experience_descriptions, work_schedule, coverage_area
)
VALUES (
  3,
  3,
  'Technical Academy of Practical Work',
  'Professional Cleaning Certificate, Electrical License, HVAC Diploma, Gardening Certificate',
  'Over 7 years of hands-on experience in residential maintenance. Specialized in post-renovation cleaning, electrical panel installation, garden care, HVAC filter services, and interior painting.',
  '08:00 – 18:00',
  50
);
