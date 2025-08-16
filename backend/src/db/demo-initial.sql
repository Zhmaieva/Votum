/*
TRUNCATE TABLE polls CASCADE;
DELETE FROM users WHERE "email" LIKE '%@demo.com';
*/

-- USERS
INSERT INTO users (id, username, email, password_hash) VALUES
   ('8a3ddccb-be98-4998-a541-54a475148b91', 'user1', 'user1@demo.com', 'Qwerty123'),
   ('99d5cbae-6473-41ec-a9ca-2852b246029d', 'user2', 'user2@demo.com', 'Qwerty123'),
   ('401220fc-d55c-44eb-8b11-d164f73baf3e', 'user3', 'user3@demo.com', 'Qwerty123'),
   ('8ae538d3-b3d2-46f4-adac-d54262f8cd4b', 'user4', 'user4@demo.com', 'Qwerty123'),
   ('ef784bea-010d-4491-8394-01d368531948', 'user5', 'user5@demo.com', 'Qwerty123'),
   ('cb507ccb-2b07-4166-ad08-79072e2a115a', 'user6', 'user6@demo.com', 'Qwerty123'),
   ('dceb8c5e-b929-4d68-a1ac-4987e9b7b6f2', 'user7', 'user7@demo.com', 'Qwerty123'),
   ('b988678a-1393-4f92-a263-0eba6c2cebbb', 'user8', 'user8@demo.com', 'Qwerty123'),
   ('31ac6d3d-d304-4b77-8e2b-4aa621a98515', 'user9', 'user9@demo.com', 'Qwerty123'),
   ('609c6602-6305-4b44-b13b-a5daee3bd84b', 'user10', 'user10@demo.com', 'Qwerty123'),
   ('281d5a04-f29e-4f9c-b0cc-323bb9f02308', 'demo', 'demo@demo.com', 'Qwerty123');



-- POLLS AND OPTIONS
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('1c3c596e-0266-48c7-b94f-0cfc5d79d5a2', '8a3ddccb-be98-4998-a541-54a475148b91', 1, 'poll1', 'How often do you take shower?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '10679 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '14 days' - INTERVAL '7 hours' - INTERVAL '55 minutes'), 287, 0.984);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('cc8d3188-dddd-4a93-a26f-a1f3c35f9310', '1c3c596e-0266-48c7-b94f-0cfc5d79d5a2', 'twice per day', 0, 3);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('d359f854-e7dc-450d-8e73-3611680290a8', '1c3c596e-0266-48c7-b94f-0cfc5d79d5a2', 'once per day', 1, 10);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('f57a514f-7e8a-41d7-9274-18d1ba62e06b', '1c3c596e-0266-48c7-b94f-0cfc5d79d5a2', 'once per 2 days or less', 2, 1);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('9a734d04-f283-4758-8a4f-86b3ce348af2', '99d5cbae-6473-41ec-a9ca-2852b246029d', 1, 'poll2', 'Should military service be mandatory?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '27050 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '12 days' - INTERVAL '5 hours' - INTERVAL '56 minutes'), 458, 0.611);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('d1d09c4c-df53-4882-92a8-f312ca2c8b4e', '9a734d04-f283-4758-8a4f-86b3ce348af2', 'yes, for everyone', 0, 22);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('2af376fd-1471-481d-8829-9ad6f691c96e', '9a734d04-f283-4758-8a4f-86b3ce348af2', 'no', 1, 11);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('5cd08b66-9894-43a3-81c8-38c05ca9f72a', '9a734d04-f283-4758-8a4f-86b3ce348af2', 'only for men', 2, 3);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('36634435-1eb7-497b-b35a-5f236272f31c', '9a734d04-f283-4758-8a4f-86b3ce348af2', 'only for women', 3, 5);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('7bb7d046-ef68-4aed-99b6-b02d63d45b7d', '401220fc-d55c-44eb-8b11-d164f73baf3e', 1, 'poll3', 'Should parents be licensed?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '21800 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '0 days' - INTERVAL '5 hours' - INTERVAL '47 minutes'), 343, 0.768);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('2e5ea79e-cbf7-48a3-a908-4c2c5ab4835a', '7bb7d046-ef68-4aed-99b6-b02d63d45b7d', 'yes', 0, 44);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('db4802d1-c610-49e8-8ee6-8e8238f8fc0c', '7bb7d046-ef68-4aed-99b6-b02d63d45b7d', 'no', 1, 19);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('04975e08-0def-4670-a11d-192a4912062c', '8ae538d3-b3d2-46f4-adac-d54262f8cd4b', 1, 'poll4', 'Should we have censorship?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '16293 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '12 days' - INTERVAL '13 hours' - INTERVAL '51 minutes'), 306, 0.455);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('c68a1a3c-47ec-4ad3-9ecf-16edff846bad', '04975e08-0def-4670-a11d-192a4912062c', 'yes', 0, 18);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('416ec240-7182-41a3-a2b0-edae1df9740f', '04975e08-0def-4670-a11d-192a4912062c', 'no', 1, 65);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('8e8d4fd6-8770-46f4-93a3-5111a70428bc', 'ef784bea-010d-4491-8394-01d368531948', 1, 'poll5', 'Productive = toxic?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '7114 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '4 days' - INTERVAL '5 hours' - INTERVAL '50 minutes'), 101, 0.886);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('3a97c6ec-e72c-4594-a987-42a95e0c8010', '8e8d4fd6-8770-46f4-93a3-5111a70428bc', 'yes', 0, 117);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('751262ba-2920-403c-898a-bf35e906ab27', '8e8d4fd6-8770-46f4-93a3-5111a70428bc', 'no, they just jealous', 1, 3);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('65937321-2429-482e-ae98-2c9de05c5790', 'cb507ccb-2b07-4166-ad08-79072e2a115a', 1, 'poll6', 'What should be completely banned?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '30877 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '6 days' - INTERVAL '1 hours' - INTERVAL '54 minutes'), 154, 0.576);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('530a3a1f-a375-4d7c-bf03-7567b6fdf611', '65937321-2429-482e-ae98-2c9de05c5790', 'plastic', 0, 17);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('68d8dc6c-08d3-44fd-8869-8772f80c72c3', '65937321-2429-482e-ae98-2c9de05c5790', 'plastic surgeries', 1, 4);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('5ebe589e-dcc3-4844-b55d-b5435effcf97', 'dceb8c5e-b929-4d68-a1ac-4987e9b7b6f2', 1, 'poll7', 'Have you ever ghosted someone?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '30196 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '3 days' - INTERVAL '6 hours' - INTERVAL '52 minutes'), 180, 0.718);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('5043dde0-fea2-4d50-a4db-6dc2e7535041', '5ebe589e-dcc3-4844-b55d-b5435effcf97', 'yes', 0, 65);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('36eb9c75-5a4e-4067-9a68-30b3d582c2cb', '5ebe589e-dcc3-4844-b55d-b5435effcf97', 'no', 1, 11);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('678663f2-598e-4047-8752-e091f2420744', 'b988678a-1393-4f92-a263-0eba6c2cebbb', 1, 'poll8', 'Love at first sight?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14945 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '5 days' - INTERVAL '9 hours' - INTERVAL '52 minutes'), 138, 0.384);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('b8ee02ea-1400-4de5-849d-ff072ee671f7', '678663f2-598e-4047-8752-e091f2420744', 'true', 0, 55);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('58777227-2483-49b6-929a-3781ca9f7b7f', '678663f2-598e-4047-8752-e091f2420744', 'not possible', 1, 83);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('c8081d7b-7e9e-49cf-9563-661b247b8a87', '31ac6d3d-d304-4b77-8e2b-4aa621a98515', 1, 'poll9', 'Should you …', (NOW() AT TIME ZONE 'UTC' + INTERVAL '12686 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '3 days' - INTERVAL '0 hours' - INTERVAL '42 minutes'), 176, 0.4);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('3010a263-fc48-4c60-97ff-19d372e9c103', 'c8081d7b-7e9e-49cf-9563-661b247b8a87', 'block your ex', 0, 43);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('229e5900-a206-45a1-9d19-241489004dda', 'c8081d7b-7e9e-49cf-9563-661b247b8a87', 'stalk him/her online', 1, 10);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('01395ccf-d321-4f64-ad0f-7a82515db144', '609c6602-6305-4b44-b13b-a5daee3bd84b', 1, 'poll10', 'Is it ethical to post your kids online?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '4579 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '6 days' - INTERVAL '10 hours' - INTERVAL '17 minutes'), 299, 0.148);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('9ed09d65-ed53-4ec0-91bd-470b457edf5f', '01395ccf-d321-4f64-ad0f-7a82515db144', 'yes', 0, 4);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('14955fc9-6587-4a02-acc5-13231219a3c3', '01395ccf-d321-4f64-ad0f-7a82515db144', 'no', 1, 4);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('50229db7-c245-4095-b7ca-ec91899ec014', '8a3ddccb-be98-4998-a541-54a475148b91', 1, 'poll11', 'The Earth is', (NOW() AT TIME ZONE 'UTC' + INTERVAL '33414 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '12 days' - INTERVAL '8 hours' - INTERVAL '22 minutes'), 391, 0.688);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('966d89ef-70d7-4158-8d69-d3c1045249ca', '50229db7-c245-4095-b7ca-ec91899ec014', 'flat', 0, 6);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('3f48a6fe-0f69-4e7d-993b-af11892bbe61', '50229db7-c245-4095-b7ca-ec91899ec014', 'spherical', 1, 5);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('019fecf4-da28-4684-804d-db6815e46a93', '50229db7-c245-4095-b7ca-ec91899ec014', 'cubic', 2, 13);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('a4e338d6-e79a-49ee-ba2a-2462f4b27ae6', '99d5cbae-6473-41ec-a9ca-2852b246029d', 1, 'poll12', 'Who should pay on the first date?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '35171 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '6 days' - INTERVAL '21 hours' - INTERVAL '53 minutes'), 439, 0.893);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('e2347898-2069-45f8-95fe-f465b5db28ef', 'a4e338d6-e79a-49ee-ba2a-2462f4b27ae6', 'him', 0, 7);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('e4d039d2-4357-4df5-bdd2-afe63f9c33cd', 'a4e338d6-e79a-49ee-ba2a-2462f4b27ae6', 'her', 1, 19);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('fb9826c0-022b-4f8e-809e-920eb348f916', 'a4e338d6-e79a-49ee-ba2a-2462f4b27ae6', 'split the bill', 2, 12);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('40f0c696-e8e1-43e6-b514-ed528588a402', '401220fc-d55c-44eb-8b11-d164f73baf3e', 1, 'poll13', 'When do you brush your teeth?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '17148 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '5 days' - INTERVAL '0 hours' - INTERVAL '7 minutes'), 181, 0.86);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('e6399748-2ca5-4af7-9be6-f24822c73e96', '40f0c696-e8e1-43e6-b514-ed528588a402', 'before breakfast', 0, 65);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('3edae6b6-f87a-421b-b511-2a815c7c9bf8', '40f0c696-e8e1-43e6-b514-ed528588a402', 'after breakfast', 1, 48);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('bfaf35c9-1f99-4814-963a-99fc67299552', '8ae538d3-b3d2-46f4-adac-d54262f8cd4b', 1, 'poll14', 'Someone says your name wrong', (NOW() AT TIME ZONE 'UTC' + INTERVAL '2537 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '2 days' - INTERVAL '18 hours' - INTERVAL '16 minutes'), 377, 0.885);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('2f3e636d-15fd-4d81-8ddc-93d07e5aa653', 'bfaf35c9-1f99-4814-963a-99fc67299552', 'pretend it didn’t happen', 0, 5);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('750d0f8b-13a7-460f-b1fc-495ca9864a89', 'bfaf35c9-1f99-4814-963a-99fc67299552', 'correct them', 1, 5);
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('b2dd81c0-2049-415c-8f47-6f7e9ddc36c4', 'ef784bea-010d-4491-8394-01d368531948', 1, 'poll15', 'Have a psychologist ever helped you?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '22684 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 days' - INTERVAL '19 hours' - INTERVAL '27 minutes'), 275, 0.778);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('78d93f5d-47fa-4ffc-91b8-3658f560c09f', 'b2dd81c0-2049-415c-8f47-6f7e9ddc36c4', 'yes', 0, 14);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('5d081e01-845e-4aec-9cb3-d0558f240e05', 'b2dd81c0-2049-415c-8f47-6f7e9ddc36c4', 'no, just waste of money', 1, 53);

-- FOLLOW RELATIONS
INSERT INTO user_follows (user_follower_id, user_follow_id) VALUES ('8ae538d3-b3d2-46f4-adac-d54262f8cd4b', '281d5a04-f29e-4f9c-b0cc-323bb9f02308');
INSERT INTO user_follows (user_follower_id, user_follow_id) VALUES ('8a3ddccb-be98-4998-a541-54a475148b91', '281d5a04-f29e-4f9c-b0cc-323bb9f02308');
INSERT INTO user_follows (user_follower_id, user_follow_id) VALUES ('cb507ccb-2b07-4166-ad08-79072e2a115a', '281d5a04-f29e-4f9c-b0cc-323bb9f02308');
INSERT INTO user_follows (user_follower_id, user_follow_id) VALUES ('281d5a04-f29e-4f9c-b0cc-323bb9f02308', '8ae538d3-b3d2-46f4-adac-d54262f8cd4b');
INSERT INTO user_follows (user_follower_id, user_follow_id) VALUES ('281d5a04-f29e-4f9c-b0cc-323bb9f02308', 'cb507ccb-2b07-4166-ad08-79072e2a115a');
INSERT INTO user_follows (user_follower_id, user_follow_id) VALUES ('281d5a04-f29e-4f9c-b0cc-323bb9f02308', '8a3ddccb-be98-4998-a541-54a475148b91');

-- SPECIAL POLLS
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('8ac44ed3-fce5-44cc-baa2-ace46894ca11', '8ae538d3-b3d2-46f4-adac-d54262f8cd4b', 1, 'max-age-president', 'What should be the maximum age for a president?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '20373 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 days' - INTERVAL '7 hours' - INTERVAL '43 minutes'), 0, 0.861);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('e2c20f6b-c756-4bca-928b-717337d31497', '8ac44ed3-fce5-44cc-baa2-ace46894ca11', 'Under 30', 0, 34);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('00f4f96d-5346-4dc8-9a14-c7658bce68d1', '8ac44ed3-fce5-44cc-baa2-ace46894ca11', '30–45', 1, 3);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('b17379d0-4180-461e-8c4d-9bf0687a157e', '8ac44ed3-fce5-44cc-baa2-ace46894ca11', '45–60', 2, 66);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('7e1a5e5a-b28c-4aa4-9ca8-ee1d433c21b7', '8ac44ed3-fce5-44cc-baa2-ace46894ca11', 'Over 60', 3, 10);
INSERT INTO poll_views (user_id, poll_id) VALUES ('281d5a04-f29e-4f9c-b0cc-323bb9f02308', '8ac44ed3-fce5-44cc-baa2-ace46894ca11');
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('ddde2de1-3ebe-42c8-8bc8-78f5ac280499', '31ac6d3d-d304-4b77-8e2b-4aa621a98515', 1, 'regret-2024', 'Changed your mind since 2024 election?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '1630 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '3 days' - INTERVAL '6 hours' - INTERVAL '9 minutes'), 0, 0.45);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('5557e700-a815-4f95-b6f9-6668931de7c2', 'ddde2de1-3ebe-42c8-8bc8-78f5ac280499', 'Yes', 0, 25);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('1cdba704-066f-4325-a8c4-1179acc4a64d', 'ddde2de1-3ebe-42c8-8bc8-78f5ac280499', 'No', 1, 62);
INSERT INTO poll_views (user_id, poll_id) VALUES ('281d5a04-f29e-4f9c-b0cc-323bb9f02308', 'ddde2de1-3ebe-42c8-8bc8-78f5ac280499');

INSERT INTO user_profiles (user_id, image, bio, followers_number, following_number) VALUES
-- user1 (ID: 8a3ddccb...): follows demo (1), followed by demo (1)
('8a3ddccb-be98-4998-a541-54a475148b91', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG',  'Data over drama.', 1, 1),

-- user2 (no follows or followers)
('99d5cbae-6473-41ec-a9ca-2852b246029d', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG','Just here for the vibes.', 0, 0),

-- user3 (no follows or followers)
('401220fc-d55c-44eb-8b11-d164f73baf3e', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG','Opinions? I’ve got plenty.', 0, 0),

-- user4: follows demo (1), followed by demo (1)
('8ae538d3-b3d2-46f4-adac-d54262f8cd4b', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG','I vote, therefore I am.', 1, 1),

-- user5 (no follows or followers)
('ef784bea-010d-4491-8394-01d368531948', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG','Floating between hot takes.', 0, 0),

-- user6: follows demo (1), followed by demo (1)
('cb507ccb-2b07-4166-ad08-79072e2a115a', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG','Scared of silence? Try polls.', 1, 1),

-- user7 (no follows or followers)
('dceb8c5e-b929-4d68-a1ac-4987e9b7b6f2', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG','Swipe. Vote. Repeat.', 0, 0),

-- user8 (no follows or followers)
('b988678a-1393-4f92-a263-0eba6c2cebbb', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG','Rarely wrong. Always opinionated.', 0, 0),

-- user9 (no follows or followers)
('31ac6d3d-d304-4b77-8e2b-4aa621a98515', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG','Professional opinion-haver.', 0, 0),

-- user10 (no follows or followers)
('609c6602-6305-4b44-b13b-a5daee3bd84b',  'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG','Just here to judge.', 0, 0),

-- demo: follows user1, user4, user6 (3), followed by user1, user4, user6 (3)
('281d5a04-f29e-4f9c-b0cc-323bb9f02308', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG','Yes, I’m that demo user.', 3, 3);

UPDATE polls SET votes_count = 0;
UPDATE poll_answer_options SET votes_count = 0;