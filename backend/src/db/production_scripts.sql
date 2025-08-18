/*TRUNCATE TABLE users cascade;*/

INSERT INTO users (id, username, email, password_hash) VALUES
       ('ec91a4ff-dfa9-4e5b-8b7c-45753c267995', 'psychology.inna', 'psychology.inna@votum.com', 'Qwerty123'),
       ('8a3ddccb-be98-4998-a541-54a475148b91', 'davis.baumanis', 'davis.baumanis@votum.com', 'Qwerty123'),
       ('fe3af10d-53cd-4d78-9b2f-870a79d02e28', 'dan2003', 'dan2003@votum.com', 'Qwerty123'),
       ('5d86e160-3f41-4a67-913b-f08c3d513b92', 'noahthinks', 'noahthinks@votum.com', 'Qwerty123'),
       ('aa36b066-c33d-4f4b-bb49-67db93a9188a', 'justin.brody', 'justin.brody@votum.com', 'Qwerty123'),
       ('c5eb8024-b7dd-4b25-a420-bf86a71cc1aa', 'teo.aguilar', 'teo.aguilar@votum.com', 'Qwerty123'),
       ('afcb53da-f8ae-4f74-bc33-f627de6d9675', 'stevepearson', 'stevepearson@votum.com', 'Qwerty123'),
       ('6b90bc0d-0f5b-40f5-9622-cc1058e2c664', 'zoe.miller', 'zoe.miller@votum.com', 'Qwerty123');

INSERT INTO user_profiles (user_id, bio, image) VALUES
       ('ec91a4ff-dfa9-4e5b-8b7c-45753c267995', 'Find me on other social media', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG'),
       ('8a3ddccb-be98-4998-a541-54a475148b91', 'Find me on other social media', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG'),
       ('fe3af10d-53cd-4d78-9b2f-870a79d02e28', 'Find me on other social media', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG'),
       ('5d86e160-3f41-4a67-913b-f08c3d513b92', 'Find me on other social media', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG'),
       ('aa36b066-c33d-4f4b-bb49-67db93a9188a', 'Find me on other social media', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG'),
       ('c5eb8024-b7dd-4b25-a420-bf86a71cc1aa', 'Find me on other social media', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG'),
       ('afcb53da-f8ae-4f74-bc33-f627de6d9675', 'Find me on other social media', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG'),
       ('6b90bc0d-0f5b-40f5-9622-cc1058e2c664', 'Find me on other social media', 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG');

-- 2) Could Jack survive on the same door?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('a6b4c3de-41a2-4d9b-9b1c-6f7e5d3c2b44', 'c5eb8024-b7dd-4b25-a420-bf86a71cc1aa', 3, 'poll102', 'Could Jack survive on the same door?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '12060 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '9 days' - INTERVAL '2 hours' - INTERVAL '7 minutes'), 91, 0.612);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('f91e5c7b-1a2b-4c3d-8e9f-0a1b2c3d4e55', 'a6b4c3de-41a2-4d9b-9b1c-6f7e5d3c2b44', 'No', 0, 73);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('c4b3a2d1-9e8f-4d3c-8b7a-6f5e4d3c2b66', 'a6b4c3de-41a2-4d9b-9b1c-6f7e5d3c2b44', 'Yes', 1, 118);

-- 3) Tired of constant ads in content?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('e3c2b1a0-7f6e-4d5c-8b9a-1c2d3e4f5a77', '8a3ddccb-be98-4998-a541-54a475148b91', 9, 'poll103', 'Tired of constant ads in content?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '24480 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '6 days' - INTERVAL '10 hours' - INTERVAL '12 minutes'), 110, 0.841);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('0a1b2c3d-4e5f-6789-abcd-ef0123456789', 'e3c2b1a0-7f6e-4d5c-8b9a-1c2d3e4f5a77', 'No', 0, 14);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('11223344-5566-7788-99aa-bbccddeeff00', 'e3c2b1a0-7f6e-4d5c-8b9a-1c2d3e4f5a77', 'Yes', 1, 96);

-- 7) Who should pay on the first date?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('0a1b2c3d-4e5f-6071-82a9-bcdef1234507', '6b90bc0d-0f5b-40f5-9622-cc1058e2c664', 1, 'poll207', 'Who should pay on the first date?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '19980 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '10 days' - INTERVAL '7 hours' - INTERVAL '5 minutes'), 131, 0.734);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('1a2b3c4d-5e6f-7081-92ab-cd0ef1a2b319', '0a1b2c3d-4e5f-6071-82a9-bcdef1234507', 'Split', 0, 67);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('2b3c4d5e-6f70-8192-a3bc-d0ef1a2b3c20', '0a1b2c3d-4e5f-6071-82a9-bcdef1234507', 'Whoever asked', 1, 48);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('3c4d5e6f-7081-92a3-bcd0-ef1a2b3c4d21', '0a1b2c3d-4e5f-6071-82a9-bcdef1234507', 'Man', 2, 16);

-- 6. Should billionaires exist?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('e1a9c5d7-2b4e-47a0-8f2c-7d6a1c3e4b06', 'fe3af10d-53cd-4d78-9b2f-870a79d02e28', 8, 'poll306', 'Should billionaires exist?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '5 days' - INTERVAL '2 hours'), 111, 0.65);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('66666666-6666-4666-8666-666666666601', 'e1a9c5d7-2b4e-47a0-8f2c-7d6a1c3e4b06', 'No', 0, 132);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('66666666-6666-4666-8666-666666666602', 'e1a9c5d7-2b4e-47a0-8f2c-7d6a1c3e4b06', 'Yes', 1, 79);

-- 7. Is cancel culture a good thing?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('f2b7d9e1-3c5a-4f2e-9a8b-1d7c3e5f6a07', 'ec91a4ff-dfa9-4e5b-8b7c-45753c267995', 8, 'poll307', 'Is cancel culture a good thing?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '6 days' - INTERVAL '9 hours'), 134, 0.81);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('77777777-7777-4777-8777-777777777701', 'f2b7d9e1-3c5a-4f2e-9a8b-1d7c3e5f6a07', 'Yes', 0, 29);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('77777777-7777-4777-8777-777777777702', 'f2b7d9e1-3c5a-4f2e-9a8b-1d7c3e5f6a07', 'Sometimes', 1, 38);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('77777777-7777-4777-8777-777777777703', 'f2b7d9e1-3c5a-4f2e-9a8b-1d7c3e5f6a07', 'No', 2, 77);

-- 9. Should you tip at restaurants?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('b5d7e9f1-2e3c-4b5a-86c1-3d8e0f2a4c09', 'afcb53da-f8ae-4f74-bc33-f627de6d9675', 5, 'poll309', 'Should you tip at restaurants?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '4 days' - INTERVAL '1 hours'), 117, 0.69);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('99999999-9999-4999-8999-999999999901', 'b5d7e9f1-2e3c-4b5a-86c1-3d8e0f2a4c09', 'No', 0, 84);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('99999999-9999-4999-8999-999999999902', 'b5d7e9f1-2e3c-4b5a-86c1-3d8e0f2a4c09', 'Yes', 1, 33);

-- 1. Is astrology real or nonsense?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('c101a1b2-1c2d-4e3f-a456-1b2c3d4e5f10', 'c5eb8024-b7dd-4b25-a420-bf86a71cc1aa', 8, 'poll310', 'Is astrology real or nonsense?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '3 days' - INTERVAL '4 hours'), 99, 0.77);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('aaa11111-1111-4111-8111-aaaaaaaaaaa1', 'c101a1b2-1c2d-4e3f-a456-1b2c3d4e5f10', 'Real', 0, 114);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('aaa11111-1111-4111-8111-aaaaaaaaaaa2', 'c101a1b2-1c2d-4e3f-a456-1b2c3d4e5f10', 'Nonsense', 1, 158);

-- 6. What’s the best way to eat a pizza?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('b606f607-6172-839e-f90b-6a7b8c9d0e15', 'aa36b066-c33d-4f4b-bb49-67db93a9188a', 4, 'poll315', 'What’s the best way to eat a pizza?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '5 days' - INTERVAL '5 hours'), 123, 0.81);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('fff66666-6666-4666-8666-fffffffffff1', 'b606f607-6172-839e-f90b-6a7b8c9d0e15', 'Rolled', 0, 38);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('fff66666-6666-4666-8666-fffffffffff2', 'b606f607-6172-839e-f90b-6a7b8c9d0e15', 'Fork & knife', 1, 66);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('fff66666-6666-4666-8666-fffffffffff3', 'b606f607-6172-839e-f90b-6a7b8c9d0e15', 'Hands', 2, 19);

-- 8. Should couples share phone passwords?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('675463e2-e348-40b3-99c9-54e8acdf0c65', '5d86e160-3f41-4a67-913b-f08c3d513b92', 1, 'poll317', 'Should couples share phone passwords?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '4 days' - INTERVAL '7 hours'), 160, 0.83);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('22288888-8888-4888-8888-222222222281', '675463e2-e348-40b3-99c9-54e8acdf0c65', 'Yes', 0, 21);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('22288888-8888-4888-8888-222222222282', '675463e2-e348-40b3-99c9-54e8acdf0c65', 'Only if asked', 1, 92);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('22288888-8888-4888-8888-222222222283', '675463e2-e348-40b3-99c9-54e8acdf0c65', 'No', 2, 47);

/*
INSERT INTO users (id, username, email, password_hash) VALUES
       ('99d5cbae-6473-41ec-a9ca-2852b246029d', 'richard1987', 'richard1987@votum.com', 'Qwerty123'),
       ('b1a9f024-c463-4a77-bcc5-6e53df303ea1', 'mysalsa', 'mysalsa@votum.com', 'Qwerty123'),
       ('43f8c07b-3d76-49f1-b387-7aaefb1ac58d', 'laura.berns', 'laura.berns@votum.com', 'Qwerty123'),
       ('f87a60c0-a8e0-4a41-8841-bb20a4d5a238', 'fernandaherera', 'fernandaherera@votum.com', 'Qwerty123'),
       ('a2c403db-e2da-49ee-8578-f6318a5ffb47', 'helen94', 'helen94@votum.com', 'Qwerty123'),
       ('76d78b76-78f1-420a-8b02-9d2d7791b8cd', 'dontCallMeSteve', 'dontCallMeSteve@votum.com', 'Qwerty123'),
       ('6edec0a5-c12d-4a06-a1dd-c3a18169266c', 'reginaFran', 'reginaFran@votum.com', 'Qwerty123'),
       ('f2709aa1-9bc1-4f4f-8e85-f21f21e84b9a', 'amanda.marks', 'amanda.marks@votum.com', 'Qwerty123'),
       ('f9f43547-e2dc-4c41-9509-fcc5a0b91968', 'samir.hassan', 'samir.hassan@votum.com', 'Qwerty123'),
       ('c7b3d445-15b4-471f-8c37-62c9d4cf53e6', 'lily.wong', 'lily.wong@votum.com', 'Qwerty123'),
       ('c9244f94-35a8-4a4a-96fd-50c5ccf86f10', 'rodrigo.mejia', 'rodrigo.mejia@votum.com', 'Qwerty123'),
       ('a931f699-fb8f-4a4e-92cb-6b9cf65e6df7', 'kristen_92', 'kristen_92@votum.com', 'Qwerty123'),
       ('41877a68-3c11-40f3-8ec4-10d1e8da57c0', 'dasha.sokolova', 'dasha.sokolova@votum.com', 'Qwerty123'),
       ('d5a3e616-9ae0-4ff5-9c9f-f46962684f07', 'tyler.jenkins', 'tyler.jenkins@votum.com', 'Qwerty123'),
       ('27cd07c5-bf53-499a-b60d-48edc6c8c351', 'kaylee_jo', 'kaylee_jo@votum.com', 'Qwerty123'),
       ('ca615f35-07b8-4aa7-a8f2-c4b1b0a3d4d2', 'carlos.torres', 'carlos.torres@votum.com', 'Qwerty123'),
       ('13b291f2-72ae-4c8e-9a6d-09c4f4e78f78', 'jamal.booker', 'jamal.booker@votum.com', 'Qwerty123'),
       ('2178d71a-7687-4b49-bf2e-d06a3efc63c2', 'emilyxross', 'emilyxross@votum.com', 'Qwerty123'),
       ('fe409ec0-38fd-46cb-98b1-c9cfc0f06299', 'santiago_dreams', 'santiago_dreams@votum.com', 'Qwerty123'),
       ('f7207e6d-dcf2-4d84-b355-c45a46fdfd66', 'jenny.cho', 'jenny.cho@votum.com', 'Qwerty123'),
       ('68d0729a-d29f-4dbf-81f3-c7ffacb7c3df', 'elijah_thewise', 'elijah_thewise@votum.com', 'Qwerty123'),
       ('f2dd1f39-3028-4903-a96b-658fa7719d64', 'sophia.malhotra', 'sophia.malhotra@votum.com', 'Qwerty123'),
       ('f64d4d44-cbab-4f7d-9a2d-df73988d4d89', 'nick_pavlov', 'nick_pavlov@votum.com', 'Qwerty123'),
       ('26fdb3f5-cdb2-4d02-84fd-f2878703c67f', 'hunter.garcia', 'hunter.garcia@votum.com', 'Qwerty123'),
       ('fdb28989-d621-4c65-805e-a9b8c009eb9d', 'mila.zoric', 'mila.zoric@votum.com', 'Qwerty123'),
       ('e61b788b-f80d-4a38-8b42-4cfe899b0cc2', 'mark.zimmer', 'mark.zimmer@votum.com', 'Qwerty123'),
       ('988d4f7a-cc38-4da7-8736-1c33c4934a29', 'thao.nguyen', 'thao.nguyen@votum.com', 'Qwerty123'),
       ('178a8162-19b7-485f-9075-b69f09ed9b9e', 'avery.connor', 'avery.connor@votum.com', 'Qwerty123'),
       ('fcf4632f-3a9d-4e4b-bd13-2876acb6157d', 'bradley_west', 'bradley_west@votum.com', 'Qwerty123'),
       ('6507cb94-065b-48c8-8ff7-f92c260165d7', 'imani.jackson', 'imani.jackson@votum.com', 'Qwerty123'),
       ('004f8e3c-d364-4715-b47a-0dfed5b7b7c7', 'chris.dobrov', 'chris.dobrov@votum.com', 'Qwerty123'),
       ('a32f7a10-8e0f-44a5-8d3d-ef2e622b3d66', 'lucia.castillo', 'lucia.castillo@votum.com', 'Qwerty123'),   (gen_random_uuid(), 'zach_rhodes', 'zach_rhodes@votum.com', 'Qwerty123'),
       ('1f924f2c-3515-4e27-a531-4d998315e5a7', 'amina_fay', 'amina_fay@votum.com', 'Qwerty123'),
       ('d8e10b8f-daa7-49cd-b5aa-b663a3769d5f', 'rashid.malik', 'rashid.malik@votum.com', 'Qwerty123'),
       ('a07c3642-b635-4c6b-b4f8-88052f28f9d5', 'melvin.chan', 'melvin.chan@votum.com', 'Qwerty123'),
       ('c7a9cb17-d679-4f06-a43d-bd256e52c4e1', 'jules.klein', 'jules.klein@votum.com', 'Qwerty123'),
       ('c57b1fa4-29d0-4ed7-8ee7-10cfeef0e16c', 'anika_singh', 'anika_singh@votum.com', 'Qwerty123'),
       ('9a4873a6-cd1b-4c7d-a6de-8a6a6f2b7a19', 'peter.holmes', 'peter.holmes@votum.com', 'Qwerty123'),
       ('8f9234bb-962a-4db8-b77b-1ce2d4a5b780', 'yasmin.green', 'yasmin.green@votum.com', 'Qwerty123'),
       ('548c27b7-bd67-4b5d-a7ff-27583e2e2b11', 'cole.ramos', 'cole.ramos@votum.com', 'Qwerty123'),
       ('07b33148-9f5f-42c0-8040-78fd6f7f42b3', 'adrian_law', 'adrian_law@votum.com', 'Qwerty123'),
       ('be2fddf3-23a0-4cb8-9a53-b9bc9c91a1af', 'tessa_mccoy', 'tessa_mccoy@votum.com', 'Qwerty123'),
       ('cfb82680-fb4c-41bb-a12d-083ee0efc59a', 'angelo.bianchi', 'angelo.bianchi@votum.com', 'Qwerty123'),
       ('a0a9304d-cf9c-404a-8b55-74830b43b2f0', 'helen_tran', 'helen_tran@votum.com', 'Qwerty123'),
       ('291e928c-3e7d-4f51-92cf-6cb6d7a94852', 'bobby.howell', 'bobby.howell@votum.com', 'Qwerty123'),
       ('bcb58b50-9813-493b-a9cf-f1cc8b659527', 'safiya.rami', 'safiya.rami@votum.com', 'Qwerty123'),
       ('79d55e4c-96de-49f8-93a0-df2024d993a8', 'mario.delgado', 'mario.delgado@votum.com', 'Qwerty123'),
       ('f6d48b0a-9fd1-4412-a5af-8de4a748d99d', 'diego.luna', 'diego.luna@votum.com', 'Qwerty123'),
       ('4253b73e-f960-4a78-b259-a4cbfae73b7b', 'emre.kaya', 'emre.kaya@votum.com', 'Qwerty123'),
       ('f1c92c4d-90cf-4703-bc84-63ee2745401b', 'chloe.patel', 'chloe.patel@votum.com', 'Qwerty123'),
       ('bd1f14a8-6e43-4db5-8262-91e8c35c8d17', 'levi.schwartz', 'levi.schwartz@votum.com', 'Qwerty123'),
       ('d0405018-bb55-4cfc-83f0-a64f2c69de13', 'nina_g', 'nina_g@votum.com', 'Qwerty123'),
       ('cb604eb3-8f06-48e4-9036-04a9f2850fc1', 'tyrese.hill', 'tyrese.hill@votum.com', 'Qwerty123'),
       ('26ac4f7d-98e1-4933-bce3-973178ec4d58', 'alina.bryant', 'alina.bryant@votum.com', 'Qwerty123'),
       ('a481d781-03c3-4e8b-a307-3f5cd6a4200c', 'tony.dang', 'tony.dang@votum.com', 'Qwerty123'),
       ('97ec9a86-d804-4b8d-9126-663d0a5b4ec0', 'malcolm_x23', 'malcolm_x23@votum.com', 'Qwerty123'),   (gen_random_uuid(), 'sergioVargas', 'sergioVargas@votum.com', 'Qwerty123'),
       ('3a00a6e9-97cb-4b3a-a124-0c4cf7cf057f', 'brenda_kim', 'brenda_kim@votum.com', 'Qwerty123'),
       ('6a8fb113-3b77-43d2-86e5-7d7ad3f20e1a', 'carter.diaz', 'carter.diaz@votum.com', 'Qwerty123'),
       ('c2ff1a64-1cd1-4c80-967d-2a45b58d787b', 'hana_lee', 'hana_lee@votum.com', 'Qwerty123'),
       ('8df05284-6a4b-4f7a-bb4b-b12be7344cb0', 'valerie_snow', 'valerie_snow@votum.com', 'Qwerty123'),
       ('e65b9aeb-0f4f-4e7d-b354-6e8bfc2a516b', 'amir.haddad', 'amir.haddad@votum.com', 'Qwerty123'),
       ('3cb8a84d-a38b-4eac-87ec-4e8d4cf435cb', 'jackson.woods', 'jackson.woods@votum.com', 'Qwerty123'),
       ('8f2a5e4c-b18a-4f9e-bc19-dcbd27a22a2c', 'kimberly_mars', 'kimberly_mars@votum.com', 'Qwerty123'),
       ('8a13c2cc-270c-4d9b-8f2a-bd6975e0c5f0', 'tatiana.ivanova', 'tatiana.ivanova@votum.com', 'Qwerty123'),
       ('a0b06d85-c9f4-45ab-9c76-d1bfe10d903f', 'colin.murphy', 'colin.murphy@votum.com', 'Qwerty123'),
       ('d793a64a-0e4a-4d55-bc6f-59a94704bfb5', 'andrea_rivas', 'andrea_rivas@votum.com', 'Qwerty123'),
       ('c27aaf47-4250-4e1f-b53c-06646dcbd0dd', 'ryan.miles', 'ryan.miles@votum.com', 'Qwerty123'),
       ('bd72c1c6-1da7-4df0-96e1-911efaa17f50', 'solange.green', 'solange.green@votum.com', 'Qwerty123'),
       ('df0159db-8ef6-4db8-85c4-51a76a01d7e4', 'omar.bakir', 'omar.bakir@votum.com', 'Qwerty123'),
       ('f78a90a3-46b1-4cf4-a648-15f85b8f6f78', 'michelle_lam', 'michelle_lam@votum.com', 'Qwerty123'),
       ('12e5116b-d42f-459f-90e1-07c8a8d8c5e4', 'jake.foster', 'jake.foster@votum.com', 'Qwerty123'),
       ('0c07c842-510a-42c3-bb7d-71f1c35c0c2c', 'sofia_haze', 'sofia_haze@votum.com', 'Qwerty123'),
       ('7f7608b5-1b9b-4690-b3fd-d68e35c7a9d3', 'ethan_quinn', 'ethan_quinn@votum.com', 'Qwerty123'),
       ('aba8f3c1-38b5-4e7b-9b7f-3cf7a0da84b2', 'sasha.stone', 'sasha.stone@votum.com', 'Qwerty123'),
       ('48d15b36-f7c3-4a52-8b65-0e7f2ebdf6bc', 'leila.abdi', 'leila.abdi@votum.com', 'Qwerty123'),
       ('665cc6d4-b5bb-4c8d-b7bc-9df6d585cdb2', 'logan.turner', 'logan.turner@votum.com', 'Qwerty123'),
       ('afc57ffb-7f0e-4bb2-bd39-95c6f1ab4a9e', 'sherine.rahim', 'sherine.rahim@votum.com', 'Qwerty123'),
       ('e48ff63c-7d91-4a4b-8135-0afc5eb5798c', 'jeremygold', 'jeremygold@votum.com', 'Qwerty123'),   (gen_random_uuid(), 'mariyam.j', 'mariyam.j@votum.com', 'Qwerty123'),
       ('5c0e2f07-7189-45c7-b7a0-bb66f8d0911e', 'lucasklein', 'lucasklein@votum.com', 'Qwerty123'),
       ('f429bf9e-ff85-4e4d-8351-53a5a94e8f69', 'denzel_32', 'denzel_32@votum.com', 'Qwerty123'),
       ('af88f24d-b04d-44d2-b063-b62cc381345b', 'maya_fern', 'maya_fern@votum.com', 'Qwerty123'),
       ('4a04a1fd-4c83-4f60-bd9f-a527ba96fd2d', 'gregory.sun', 'gregory.sun@votum.com', 'Qwerty123'),
       ('6473dc52-0438-4f90-92a4-2a22c06a0f59', 'david.kimura', 'david.kimura@votum.com', 'Qwerty123'),
       ('b2d24da5-77c6-4b6c-9754-ef35cf71a204', 'janet.walsh', 'janet.walsh@votum.com', 'Qwerty123'),
       ('d0ccbc8b-c93c-40ad-89a6-d287c38d1e0c', 'mohammed.hassan', 'mohammed.hassan@votum.com', 'Qwerty123'),
       ('8b83dc52-bfd7-417f-bfa0-1bfe8d24cc14', 'carla.mendez', 'carla.mendez@votum.com', 'Qwerty123'),
       ('9e8a6c04-c5f5-4c3c-b8b5-f1e3e37b5d13', 'liam_d', 'liam_d@votum.com', 'Qwerty123'),
       ('c64e4282-4a67-4a55-bc8b-0b9d9d8b6a1c', 'olga.stepanova', 'olga.stepanova@votum.com', 'Qwerty123'),
       ('bfb2aef9-5a76-4dcb-a771-1c3cdbb3c3bb', 'ray.dixon', 'ray.dixon@votum.com', 'Qwerty123'),
       ('9bfb459d-d8d2-4f40-8465-5f7985022c76', 'jasmine.ali', 'jasmine.ali@votum.com', 'Qwerty123'),
       ('5f7b3db0-c66b-4a3b-a563-3f7de936a24a', 'tomas.rodriguez', 'tomas.rodriguez@votum.com', 'Qwerty123'),
       ('021e2f93-c885-4b29-a26c-3f0624a9a896', 'brianna.jade', 'brianna.jade@votum.com', 'Qwerty123'),
       ('1d7efc78-87b4-4c16-bf0c-86f56d4a6e4b', 'kevin_hu', 'kevin_hu@votum.com', 'Qwerty123'),
       ('d5fcdacd-b1e2-48b0-a3d0-3e51ee5b23f4', 'darnell.hayes', 'darnell.hayes@votum.com', 'Qwerty123'),
       ('36ab3f82-d0ab-4b4d-9b4f-9c3dd0f0a8d0', 'zoya_r', 'zoya_r@votum.com', 'Qwerty123'),
       ('3f27fc46-b82c-4ecb-a38e-46a5d0e3b15e', 'angel_miranda', 'angel_miranda@votum.com', 'Qwerty123'),
       ('2a8a12ef-ffb1-4698-9dd5-54662e449236', 'marta.alvarez', 'marta.alvarez@votum.com', 'Qwerty123'),
       ('f03dbcb1-1b52-4d16-bb50-bc9b71e25f2b', 'joel_nyc', 'joel_nyc@votum.com', 'Qwerty123'),
       ('e59411a5-c6ab-4a3e-b19b-98541fc96f54', 'fatima.rahman', 'fatima.rahman@votum.com', 'Qwerty123'),
       ('147ac6c2-b815-4bcb-b836-72fc38ecb53a', 'pavel.voronin', 'pavel.voronin@votum.com', 'Qwerty123'),
       ('8e5d3a14-4e41-4b28-8805-8b6b0f0a5bdb', 'quincy.johnson', 'quincy.johnson@votum.com', 'Qwerty123'),
       ('ab0a8e6a-5976-4898-bc16-6a04c7b739a4', 'alyssa.snow', 'alyssa.snow@votum.com', 'Qwerty123'),
       ('9ad01763-4d5f-44d1-bb46-0ec7f4f6b6dc', 'hugo.martinez', 'hugo.martinez@votum.com', 'Qwerty123'),
       ('1b72fc15-c276-4d7b-b26f-d1b3c7e0ad61', 'grace_liu', 'grace_liu@votum.com', 'Qwerty123'),
       ('b1d4a47d-bba4-4717-8d5b-381db173ae26', 'benjamin.owens', 'benjamin.owens@votum.com', 'Qwerty123'),
       ('fc7c55d5-73bb-4e2a-a5e3-9f6f2cb4f95a', 'kyla.serrano', 'kyla.serrano@votum.com', 'Qwerty123'),
       ('d47e5d1f-5a52-4f73-b2a3-c7f7db91498e', 'max_z', 'max_z@votum.com', 'Qwerty123'),
       ('22d6f53e-02ac-4c7e-bb71-68038a1e42ec', 'chioma.okafor', 'chioma.okafor@votum.com', 'Qwerty123'),
       ('c893167f-92d4-4fd6-a616-e7e4efc83343', 'daniela.torres', 'daniela.torres@votum.com', 'Qwerty123'),
       ('49377b06-78d3-4b0e-9dcb-69b45f4b24e4', 'isaiah.king', 'isaiah.king@votum.com', 'Qwerty123'),
       ('bdb6cf2f-bff5-4d02-8e57-f5d6a6c236b6', 'tina_yoo', 'tina_yoo@votum.com', 'Qwerty123'),
       ('a5f36dd4-6014-40c3-b8e4-cd1563d15dfd', 'bruno.carvalho', 'bruno.carvalho@votum.com', 'Qwerty123'),
       ('0cb56b85-8d67-4f3b-b1b6-7b15e364ac0f', 'zain.abdullah', 'zain.abdullah@votum.com', 'Qwerty123'),
       ('9d24b208-a00f-4b4d-b915-18b6a3d6892d', 'leonard.scott', 'leonard.scott@votum.com', 'Qwerty123'),
       ('9d7e3e2c-0832-42f3-bfde-ec230cc11052', 'natalie_cole', 'natalie_cole@votum.com', 'Qwerty123'),   (gen_random_uuid(), 'pedro_ventura', 'pedro_ventura@votum.com', 'Qwerty123'),
       ('6b87eaa3-2a0b-4db6-b39e-6b7d55e5584e', 'josh.watkins', 'josh.watkins@votum.com', 'Qwerty123'),
       ('2f84b6de-bf56-49dc-b33b-7da1dd3c0b15', 'sari.mahmoud', 'sari.mahmoud@votum.com', 'Qwerty123'),
       ('a879f505-6f2d-4763-a5cc-bb759ef5b472', 'emily_walker', 'emily_walker@votum.com', 'Qwerty123'),
       ('b0f93df1-4146-4b97-893f-9bdb12c62116', 'abdul.saleh', 'abdul.saleh@votum.com', 'Qwerty123'),
       ('6debd3b8-31cf-4a45-8b9b-8a33cf7f95cf', 'rebecca.stern', 'rebecca.stern@votum.com', 'Qwerty123'),
       ('50ab2350-fbe6-49f4-9483-7d3c44191a9e', 'tarek.mansour', 'tarek.mansour@votum.com', 'Qwerty123'),
       ('18b3db71-93d4-4e58-b1aa-85e7463d356e', 'linda.harding', 'linda.harding@votum.com', 'Qwerty123'),
       ('c424c81d-5ac0-4016-a71f-f542b58e55c6', 'nikki_fox', 'nikki_fox@votum.com', 'Qwerty123'),
       ('2ac9a536-2b4d-4b58-98e6-7d0b3e9c0dd8', 'simon.schwartz', 'simon.schwartz@votum.com', 'Qwerty123'),
       ('42bbf67a-051e-40b5-82a3-ea8f7b1c0e8c', 'amina.bashir', 'amina.bashir@votum.com', 'Qwerty123'),
       ('be8e690a-c55b-46a4-b74c-8b2ffb11f365', 'miguel.santos', 'miguel.santos@votum.com', 'Qwerty123'),
       ('5e8dd727-b65e-4a56-bca5-093ab5d8e9c2', 'zara_liu', 'zara_liu@votum.com', 'Qwerty123'),
       ('8d055b71-c2c4-408f-8a7c-d5a8945b0e4b', 'keith.benson', 'keith.benson@votum.com', 'Qwerty123'),
       ('7c77d937-f011-4633-8d79-2f17b98de61e', 'hannah_r', 'hannah_r@votum.com', 'Qwerty123'),
       ('0e9246d5-03cb-49a8-81e3-1461dc886c87', 'juanita.lopez', 'juanita.lopez@votum.com', 'Qwerty123'),
       ('d14535af-1d8d-4d03-a9bc-c89f9993a637', 'rashawn.cole', 'rashawn.cole@votum.com', 'Qwerty123'),
       ('2261d1f2-bfdd-4cf6-86c7-38b9938b46a3', 'claire.meyer', 'claire.meyer@votum.com', 'Qwerty123'),
       ('ca74a6e6-3853-4ed2-81d7-bc8ce7ab51c0', 'deja.taylor', 'deja.taylor@votum.com', 'Qwerty123'),
       ('77b6d70f-b4c3-4c8a-8f53-cc6f5b36404e', 'khalil.ahmed', 'khalil.ahmed@votum.com', 'Qwerty123'),
       ('a0c9f5ff-047a-41f7-8d38-7c0c2df4aaba', 'sasha_gold', 'sasha_gold@votum.com', 'Qwerty123'),
       ('e7451724-fd48-4e67-a5a8-64f51234882a', 'marco.ramos', 'marco.ramos@votum.com', 'Qwerty123'),
       ('ee11c96e-19b6-4df3-b602-4b2873b9286e', 'karen_lin', 'karen_lin@votum.com', 'Qwerty123'),
       ('6d5f2c2d-ff73-4e0d-b4fc-7d4f1edac0ff', 'nasir.hussein', 'nasir.hussein@votum.com', 'Qwerty123'),
       ('f58a874b-0a24-4e84-8258-4a8d7dd5684f', 'isabella.vargas', 'isabella.vargas@votum.com', 'Qwerty123'),   (gen_random_uuid(), 'tommy_fitz', 'tommy_fitz@votum.com', 'Qwerty123'),
       ('7aee6e9f-84c0-4c15-85a6-713cd63a84e5', 'juliana_fernandez', 'juliana_fernandez@votum.com', 'Qwerty123'),
       ('d01842d6-a92a-4c41-9269-b0c5aefc0a56', 'markus.bradley', 'markus.bradley@votum.com', 'Qwerty123'),
       ('6a140f72-a4d3-4b6e-904d-ff9fc1c88ae5', 'ariel_kay', 'ariel_kay@votum.com', 'Qwerty123'),
       ('eeeb8b89-b2b6-4d88-a6aa-df19130ab173', 'enzo.marino', 'enzo.marino@votum.com', 'Qwerty123'),
       ('ea9c6ac7-16fc-4d90-8a4f-750663a2b83e', 'esther.chang', 'esther.chang@votum.com', 'Qwerty123'),
       ('848a9b44-11c7-4c7e-b086-f4e45389d7a5', 'danny_d', 'danny_d@votum.com', 'Qwerty123'),
       ('ab52c748-b9b7-4dbd-91a1-d66b839e5413', 'valentina.romero', 'valentina.romero@votum.com', 'Qwerty123'),
       ('143f3dfb-8248-43c3-9e92-b6f5a00c27a1', 'luis.cruz', 'luis.cruz@votum.com', 'Qwerty123'),
       ('5e4deec5-0b9c-4b6a-a4d4-f3a54f4961d2', 'denise.west', 'denise.west@votum.com', 'Qwerty123'),
       ('dfcf0d26-3779-4ab4-9338-20e5c4a21d50', 'terrell.dawson', 'terrell.dawson@votum.com', 'Qwerty123'),
       ('d3f9a95d-39cd-4c73-80cf-622cfd2ff09d', 'aisha_aziz', 'aisha_aziz@votum.com', 'Qwerty123'),
       ('c2e8a9e2-84e8-42e2-a4b1-53e8dca13418', 'benny.park', 'benny.park@votum.com', 'Qwerty123'),
       ('5b2a5ed0-46d6-4f59-8358-9e391ce8a5d1', 'sophie_kaplan', 'sophie_kaplan@votum.com', 'Qwerty123'),
       ('debb8f2f-153e-4a26-9f3d-51ae24dc9c6d', 'brandon.ray', 'brandon.ray@votum.com', 'Qwerty123'),
       ('de1469d6-58f1-4662-97de-5c57b9eebd4c', 'noor.habib', 'noor.habib@votum.com', 'Qwerty123'),
       ('b8e99239-bb5a-4064-9458-f0f07f60515f', 'eduardo_m', 'eduardo_m@votum.com', 'Qwerty123'),
       ('88d8a4b4-9f6a-48dd-b0ea-0bdf0f134bc2', 'ivy.lam', 'ivy.lam@votum.com', 'Qwerty123'),
       ('49e45773-539f-4fdb-9be7-d6ce8a1e9e2a', 'omar.reyes', 'omar.reyes@votum.com', 'Qwerty123'),
       ('fb5a46f4-6334-4d3c-bd37-1f3b24c8f5d2', 'clarissa_b', 'clarissa_b@votum.com', 'Qwerty123'),
       ('6f8eb9b5-3433-4718-99df-050ca7f270b0', 'rashida.johns', 'rashida.johns@votum.com', 'Qwerty123'),
       ('c64731f7-95b0-48f8-ae42-0f47d04bdf9e', 'ethan.bell', 'ethan.bell@votum.com', 'Qwerty123'),
       ('c01f14f3-0977-4bb7-b876-946c03e4560f', 'chi.nguyen', 'chi.nguyen@votum.com', 'Qwerty123'),
       ('5fdd9c1f-2ef8-480a-bb07-b6c2384a1a2a', 'gabriella.m', 'gabriella.m@votum.com', 'Qwerty123'),
       ('0cbd26d3-3fbe-4723-9e67-2a6a06d88240', 'matthew.joseph', 'matthew.joseph@votum.com', 'Qwerty123'),
       ('cc99adf0-18e7-4dd2-86c2-2c88de8bfc48', 'cynthia_g', 'cynthia_g@votum.com', 'Qwerty123'),
       ('9346492e-d6d3-40cc-a5f7-37a9300f09c7', 'leandro.castro', 'leandro.castro@votum.com', 'Qwerty123'),
       ('ce41c2b3-037d-45e1-9b2e-cfd4a8595023', 'abbie_perez', 'abbie_perez@votum.com', 'Qwerty123'),
       ('d192b922-c0f8-4ff3-9f86-d5bb88e8f830', 'yusuf.nader', 'yusuf.nader@votum.com', 'Qwerty123'),
       ('5de1f761-15df-46c5-a26c-bbf20f97dce5', 'jordan.ellis', 'jordan.ellis@votum.com', 'Qwerty123'),
       ('16f05cf4-c5ad-43d5-9c6a-7c758f0ec437', 'noura.salem', 'noura.salem@votum.com', 'Qwerty123'),
       ('e6b73172-6e93-4745-a12f-52801538f67d', 'victor_lo', 'victor_lo@votum.com', 'Qwerty123'),
       ('85957a79-28ed-4c3c-b31e-f39099fdf17b', 'giselle.green', 'giselle.green@votum.com', 'Qwerty123'),
       ('a11f5b1e-2d9e-4672-b76f-6a1c00f1a567', 'chad.mitchell', 'chad.mitchell@votum.com', 'Qwerty123'),
       ('dffb1f9e-60b2-4a55-bc2f-01bc0b678450', 'melina.v', 'melina.v@votum.com', 'Qwerty123'),
       ('35612fef-0137-46b8-8a4f-09751cc03b7d', 'seraphina.cho', 'seraphina.cho@votum.com', 'Qwerty123'),
       ('df0382df-b13f-4a57-91c8-b20a96c4d9f7', 'elton.mcgee', 'elton.mcgee@votum.com', 'Qwerty123'),
       ('06bc4ef8-3942-44cd-87c2-2420e94c5f47', 'imani.richards', 'imani.richards@votum.com', 'Qwerty123'),
       ('df0dd0e3-3096-4cb0-a046-cf582f38f0f3', 'yasir.jamal', 'yasir.jamal@votum.com', 'Qwerty123'),
       ('c38b7c6d-dae6-42c3-83ac-1db6d0c3f94d', 'harper.june', 'harper.june@votum.com', 'Qwerty123'),
       ('9b87d5df-7f6a-47f2-9137-616150d0457d', 'rylan_s', 'rylan_s@votum.com', 'Qwerty123'),
       ('c15c473b-f34d-4b90-8998-c63d810d3930', 'luciana.davila', 'luciana.davila@votum.com', 'Qwerty123'),
       ('89408bc2-8148-4d59-beb6-86d9155b0bfb', 'mike_turner', 'mike_turner@votum.com', 'Qwerty123'),
       ('78c3d31c-12cd-4038-bfcb-64e1c792b9a0', 'jessica93', 'jessica93@votum.com', 'Qwerty123'),
       ('3e66f2bc-98dc-4c1a-b2b2-907f41cb7cb7', 'volodymyr', 'volodymyr@votum.com', 'Qwerty123');

INSERT INTO users (id, username, email, password_hash) VALUES
       ('0c3d0d27-bab3-4cd8-b51d-7f1d42aa32fd', 'javier.ortiz', 'javier.ortiz@votum.com', 'Qwerty123'),
       ('5c4e17c0-6fbe-4e15-a61b-3421e74d4c42', 'ellie_rivera', 'ellie_rivera@votum.com', 'Qwerty123'),
       ('4fdbce37-7f58-4b17-9bb8-17de3f37b632', 'antoine.miles', 'antoine.miles@votum.com', 'Qwerty123'),
       ('c6b46f83-39d2-4de2-9a1a-d75a2f1f6e53', 'nina.chavez', 'nina.chavez@votum.com', 'Qwerty123'),
       ('2dd7d655-8f57-44cb-93a5-1deebfbdbe8e', 'aidan_woods', 'aidan_woods@votum.com', 'Qwerty123'),
       ('3fa0620c-bfe4-4e5c-8d17-54f22f3e1b37', 'sanjay.verma', 'sanjay.verma@votum.com', 'Qwerty123'),
       ('8b8a4d7c-9c25-48d8-b5f4-74d6a6949a02', 'caroline.moon', 'caroline.moon@votum.com', 'Qwerty123'),
       ('e842f6de-cf37-4d8c-a107-f7d7c93868b8', 'omar.khan', 'omar.khan@votum.com', 'Qwerty123'),
       ('15f165e5-91f0-4dd9-8b3b-4c8fba6a9833', 'nataly.torres', 'nataly.torres@votum.com', 'Qwerty123'),
       ('b77b8c84-6532-46f0-8b6d-b5a8f7289df1', 'tyler.reed', 'tyler.reed@votum.com', 'Qwerty123'),
       ('7ecdf1d6-58b6-4cf3-9a44-2e7a6b5a9c56', 'zahara_f', 'zahara_f@votum.com', 'Qwerty123'),
       ('d733d799-22b6-4a6e-9db5-15c227cd3f14', 'kevin.tran', 'kevin.tran@votum.com', 'Qwerty123'),
       ('c821b6cd-b2bc-4b1f-aee5-3b48b7272f9d', 'dominique.lamar', 'dominique.lamar@votum.com', 'Qwerty123'),
       ('0414cb63-6f27-4c39-b6ad-771af12d774e', 'alyona.kovalenko', 'alyona.kovalenko@votum.com', 'Qwerty123'),
       ('23b7485e-6ff0-4664-8e5f-a0b81fdd9a24', 'bryce.baker', 'bryce.baker@votum.com', 'Qwerty123'),
       ('937a2cda-56ab-4f4c-b60f-3fc7ac1ecf07', 'thomas.choi', 'thomas.choi@votum.com', 'Qwerty123'),
       ('b32b13a1-2a9f-45f4-b51b-dcb2a2f63ec2', 'luisa.campos', 'luisa.campos@votum.com', 'Qwerty123'),
       ('a994a579-9e43-48b3-97f7-f6b1f4b52d63', 'malik.owen', 'malik.owen@votum.com', 'Qwerty123'),
       ('5e3b4d41-89c2-44ee-9376-3d578e0bba62', 'ruby.yao', 'ruby.yao@votum.com', 'Qwerty123'),
       ('ac7cf0e0-95f4-4cf6-9ee2-c8cbaea2b181', 'leo.cohen', 'leo.cohen@votum.com', 'Qwerty123'),
       ('7f7f52e3-71cc-4bda-9332-f8a96b7a5343', 'monica_bray', 'monica_bray@votum.com', 'Qwerty123'),
       ('4f5f7cc9-0cd3-4a7f-8f9a-7c9059e6c62e', 'youssef.adel', 'youssef.adel@votum.com', 'Qwerty123'),
       ('6c6fdb29-5c63-45fd-81fb-bdecdba329fa', 'julie_andrews', 'julie_andrews@votum.com', 'Qwerty123'),
       ('c8fb81a7-2b3f-4d6d-a2ff-6b513c77f57b', 'rashid.gul', 'rashid.gul@votum.com', 'Qwerty123'),
       ('b18816cb-4d07-4c40-97f4-0a1adfb601f4', 'tiffany_may', 'tiffany_may@votum.com', 'Qwerty123'),
       ('e8b0e87e-5f9a-4a8d-bf57-ef7c640c9275', 'benny.hung', 'benny.hung@votum.com', 'Qwerty123'),
       ('9295c96a-2d4b-4f4e-a1dd-1fcd8428c8d8', 'sofia.palmer', 'sofia.palmer@votum.com', 'Qwerty123'),
       ('8a7f4f2d-27cb-4dc3-8dbe-2031cf8246d4', 'daquan.james', 'daquan.james@votum.com', 'Qwerty123'),
       ('8d4ef86b-5080-48a0-b0e2-33c8cf81bcd5', 'serena.kay', 'serena.kay@votum.com', 'Qwerty123'),
       ('f8acb2a6-8a63-4d85-b8f8-6f66aeb36e6e', 'raul.cristobal', 'raul.cristobal@votum.com', 'Qwerty123'),
       ('0e4f70f1-f9bc-48e0-817d-f0373ccefe0b', 'jocelyn.luna', 'jocelyn.luna@votum.com', 'Qwerty123'),
       ('64ff55c3-b6de-408b-b33a-b4b6e6a7b0da', 'jason.zhao', 'jason.zhao@votum.com', 'Qwerty123'),
       ('91d7e2b4-2a60-4b9b-9370-cf4e249243d3', 'emilia.nash', 'emilia.nash@votum.com', 'Qwerty123'),
       ('2ffb24d4-a75e-49a0-9448-00aaf38a188d', 'jamie.todd', 'jamie.todd@votum.com', 'Qwerty123'),
       ('fe9b91d4-2f0d-4ac2-b0a4-999c9a7c99a3', 'mehdi.nasr', 'mehdi.nasr@votum.com', 'Qwerty123'),
       ('e2b7db28-44b1-4036-b299-bdfb93dfb2a1', 'evan.gonzalez', 'evan.gonzalez@votum.com', 'Qwerty123'),       (gen_random_uuid(), 'janelle_f', 'janelle_f@votum.com', 'Qwerty123'),
       ('2fba9e45-11b4-45d8-9a72-85c7753085c4', 'steven.kaminski', 'steven.kaminski@votum.com', 'Qwerty123'),
       ('7d9b5d33-84b7-4d9e-9288-4d8d1797baf1', 'tariq.hasan', 'tariq.hasan@votum.com', 'Qwerty123'),
       ('b6a4f712-43a4-4f39-9441-c5bb2ab3e1e6', 'clara.valdez', 'clara.valdez@votum.com', 'Qwerty123'),
       ('8d9d6725-2ec7-4bfc-b6d5-64c71de2a905', 'freddy.silva', 'freddy.silva@votum.com', 'Qwerty123'),
       ('6fcb79da-2434-40ec-bd24-ea13e56a6cbf', 'angelica_m', 'angelica_m@votum.com', 'Qwerty123'),
       ('96c8cb54-09a0-4b29-a642-1d93a4630a8a', 'deepak.singh', 'deepak.singh@votum.com', 'Qwerty123'),
       ('f2d1aa5c-b5ff-42b6-9e77-0dbf7a8ab0df', 'aubrey.ryan', 'aubrey.ryan@votum.com', 'Qwerty123'),
       ('65c7a2e6-5908-46d5-8e43-1c95a85b74d5', 'gregory.palmer', 'gregory.palmer@votum.com', 'Qwerty123'),
       ('5a1ebc77-79f4-4d9d-a8ee-f04cc8fcd046', 'maya.nur', 'maya.nur@votum.com', 'Qwerty123'),
       ('54a2e168-60d6-4c1d-ae77-0c6ed56d20d7', 'dante_g', 'dante_g@votum.com', 'Qwerty123'),
       ('a0c0f27c-bd79-45c2-a8c5-9d4e88f8c4f2', 'carmen.rojas', 'carmen.rojas@votum.com', 'Qwerty123'),
       ('5fb0ff2f-c29e-4785-a5f7-b54a3b27ecb0', 'amir.alomari', 'amir.alomari@votum.com', 'Qwerty123'),
       ('0d1b6a65-9adf-4a8d-b0d2-1bb8203b5f21', 'blake.dawson', 'blake.dawson@votum.com', 'Qwerty123'),
       ('a2b9e253-eada-466f-812d-6f6614a57fa0', 'helena_chang', 'helena_chang@votum.com', 'Qwerty123'),
       ('e0da8ff9-a94b-4c85-89e4-15691b7a5a47', 'fernando.lara', 'fernando.lara@votum.com', 'Qwerty123'),
       ('5148e4a4-febe-474d-a27d-15f9294b43e7', 'brynn.ellis', 'brynn.ellis@votum.com', 'Qwerty123'),
       ('fdcbe1f6-9f76-4e6f-84e7-1bff6f8d2b8f', 'sahil.patel', 'sahil.patel@votum.com', 'Qwerty123'),
       ('8755d5dc-22df-4c12-9b9a-bd5f848a19b8', 'elisa.carvalho', 'elisa.carvalho@votum.com', 'Qwerty123'),
       ('f43c54db-4a3d-44a8-930b-23b9d2897997', 'devon.prince', 'devon.prince@votum.com', 'Qwerty123'),
       ('72b3a87f-4b6b-4cb0-bf4f-9c13e59315f4', 'shanice.morgan', 'shanice.morgan@votum.com', 'Qwerty123'),
       ('0d5b81a2-7756-4aa4-9184-501b0f43ebc2', 'nour.hamdi', 'nour.hamdi@votum.com', 'Qwerty123'),
       ('772937b1-fb45-4729-b97f-9dfc896bc69e', 'calvin.miller', 'calvin.miller@votum.com', 'Qwerty123'),       (gen_random_uuid(), 'reina.fuentes', 'reina.fuentes@votum.com', 'Qwerty123'),
       ('cb3518c3-3f73-4e17-8b44-d67a814ba3a5', 'keisha_brown', 'keisha_brown@votum.com', 'Qwerty123'),
       ('a3a0a1ab-2ff4-4f43-8bdf-2fd8c5fbc6f3', 'tarek.fayez', 'tarek.fayez@votum.com', 'Qwerty123'),
       ('4c639f59-8a06-4b7d-9f8b-d28e4cc592f0', 'denise.torres', 'denise.torres@votum.com', 'Qwerty123'),
       ('cb5de0c2-3d1e-4bb7-9554-5da7efba7438', 'parker.jin', 'parker.jin@votum.com', 'Qwerty123'),
       ('d21f4727-1428-4ad8-b37b-6153b373d0b6', 'gabriel_chen', 'gabriel_chen@votum.com', 'Qwerty123'),
       ('8f6b7df2-1c91-48f2-8e0b-5e4aef64dc7a', 'tara.mccarthy', 'tara.mccarthy@votum.com', 'Qwerty123'),
       ('69bcf8f1-1b79-4717-9fd7-8a3083266639', 'mohsin.akhtar', 'mohsin.akhtar@votum.com', 'Qwerty123'),
       ('57e3e6b1-dfa4-44dd-a3cc-c48a1c8cb37e', 'katya.dimitrova', 'katya.dimitrova@votum.com', 'Qwerty123'),
       ('76f48a63-b2d3-47b4-bd26-7ff9c38cd345', 'adrian_vega', 'adrian_vega@votum.com', 'Qwerty123'),
       ('f301d7f4-d78a-4b35-a346-3c20deef399a', 'zoya.aliyev', 'zoya.aliyev@votum.com', 'Qwerty123'),
       ('ff5f72c8-22c2-45e6-94a0-c235d04295b6', 'cory_anderson', 'cory_anderson@votum.com', 'Qwerty123'),
       ('3cd2e5f4-90fc-4ee4-81f1-35c90e3a19a3', 'arwa.abdullah', 'arwa.abdullah@votum.com', 'Qwerty123'),
       ('70d165d6-b74d-4b42-8932-d1a24b6b15a0', 'james.angulo', 'james.angulo@votum.com', 'Qwerty123'),
       ('1bfbfdb1-8a17-4a65-9e2f-f17b1b9c2977', 'miriam.katz', 'miriam.katz@votum.com', 'Qwerty123'),
       ('f4b3e70b-83d4-4d6e-8a2b-6b98a815fd69', 'isaiah.ford', 'isaiah.ford@votum.com', 'Qwerty123'),
       ('b50f81d5-cf66-4c1a-8f93-5e874f8a9b3e', 'fatma.bakr', 'fatma.bakr@votum.com', 'Qwerty123'),
       ('a7d52bcd-43db-4f8a-8968-9863f38bb30f', 'julian.bourne', 'julian.bourne@votum.com', 'Qwerty123'),
       ('ae2d5d8f-74a5-40a7-bf65-1bfc0e84f86e', 'selena_diaz', 'selena_diaz@votum.com', 'Qwerty123'),
       ('5c42029f-99b5-4f27-a9b5-97369cf7e2fc', 'omer.yilmaz', 'omer.yilmaz@votum.com', 'Qwerty123'),
       ('d648b99c-8b76-46fc-ae3f-6d3b544f890d', 'clint.peters', 'clint.peters@votum.com', 'Qwerty123'),
       ('0ad51fdb-4019-42d6-bf5d-0b59ff7e3510', 'sandra_yu', 'sandra_yu@votum.com', 'Qwerty123'),
       ('165152f1-d789-4aa8-a839-43ac69a857b1', 'mateo_santos', 'mateo_santos@votum.com', 'Qwerty123'),
       ('2600fa9a-f5d2-4a4a-8d45-d8c1c8d8d49b', 'rowan.clark', 'rowan.clark@votum.com', 'Qwerty123'),
       ('5eeea68e-470b-44d2-975f-678ca193b80d', 'marta.saad', 'marta.saad@votum.com', 'Qwerty123'),
       ('6dd8b4e7-f04a-4dd3-a065-82c13de41a92', 'brooke_g', 'brooke_g@votum.com', 'Qwerty123'),
       ('981e5b1c-b4b4-48a7-84c6-d325cf87d0df', 'simon.arora', 'simon.arora@votum.com', 'Qwerty123'),
       ('d1698c9c-57df-43e1-8ed9-d94c51b865f7', 'kevin.okeke', 'kevin.okeke@votum.com', 'Qwerty123'),
       ('a70b103f-b1e2-4b5a-bc62-7aa6f460fdd9', 'sylvia_luna', 'sylvia_luna@votum.com', 'Qwerty123'),
       ('adf88de4-88dd-42ec-a1f7-6a3b892b91d1', 'amir.zadeh', 'amir.zadeh@votum.com', 'Qwerty123'),
       ('f40a3e06-1222-4b2a-8f4d-74a9b1e715f7', 'rebecca.cho', 'rebecca.cho@votum.com', 'Qwerty123'),
       ('b6ff8ae2-8f25-4c55-ae02-b74e6a0cbe59', 'roberto_f', 'roberto_f@votum.com', 'Qwerty123'),
       ('673cdb78-80d3-4f63-9bdf-ccbc579c6644', 'rajiv.ram', 'rajiv.ram@votum.com', 'Qwerty123'),
       ('e672c0f8-195f-4a9e-88ad-7a75668cd7b4', 'angel.lozano', 'angel.lozano@votum.com', 'Qwerty123'),
       ('753a5405-7f77-43c0-b772-171f454a3b3d', 'casey_d', 'casey_d@votum.com', 'Qwerty123'),
       ('399a7336-c665-4db5-8c27-20934a92e220', 'noor.mahmoud', 'noor.mahmoud@votum.com', 'Qwerty123'),
       ('16a8cb43-1684-4c92-bb1a-e13da882f0f4', 'aaron.schwartz', 'aaron.schwartz@votum.com', 'Qwerty123'),
       ('4db0a4b6-6109-4fc5-9145-4f203d0c2f36', 'sohail.butt', 'sohail.butt@votum.com', 'Qwerty123'),
       ('6899f1fc-943b-45c0-8c89-7f7980cf3a0d', 'renee.dupont', 'renee.dupont@votum.com', 'Qwerty123'),
       ('c4dc57a0-5b97-4d94-911b-20452dc648b3', 'carlos.rosales', 'carlos.rosales@votum.com', 'Qwerty123'),
       ('bbf3c3d0-b3a4-47a4-a54d-8b07b21425d1', 'nadine.ghali', 'nadine.ghali@votum.com', 'Qwerty123'),
       ('4e607acf-78f1-4f78-a938-7b197e8d6ccf', 'ivan.makarov', 'ivan.makarov@votum.com', 'Qwerty123'),
       ('9b8257ff-9b7f-45a6-a945-9b0b29ff6650', 'diana.quinn', 'diana.quinn@votum.com', 'Qwerty123'),
       ('5f4b0f7b-9464-4a5f-8739-4bcdbffb5b9a', 'ahmed.saleem', 'ahmed.saleem@votum.com', 'Qwerty123'),
       ('e99a50e5-4443-4852-b09c-f3f324d2b503', 'jacob_wood', 'jacob_wood@votum.com', 'Qwerty123'),
       ('a39f49b7-82f2-48b6-a2fd-e81956a51f18', 'natasha.levin', 'natasha.levin@votum.com', 'Qwerty123'),
       ('b2b6168d-2b69-4c5a-8757-33a4e69cd94b', 'colin_z', 'colin_z@votum.com', 'Qwerty123'),
       ('3547f166-f560-4bc1-bf93-55845aa3900e', 'lamia.hossain', 'lamia.hossain@votum.com', 'Qwerty123'),
       ('02a1535a-1e94-4cf4-b15b-9dd2c3f90c0f', 'veronica.rios', 'veronica.rios@votum.com', 'Qwerty123'),
       ('d94a0423-75ec-48b6-a409-91a4c7dfe03a', 'daniel.hwang', 'daniel.hwang@votum.com', 'Qwerty123'),
       ('94c019c3-ae73-49a4-a0d7-82ec3f7bda39', 'leslie.mcneal', 'leslie.mcneal@votum.com', 'Qwerty123'),
       ('84af7ed8-798b-4b6f-90f3-44a15a689ff8', 'hadi.amin', 'hadi.amin@votum.com', 'Qwerty123'),
       ('9dbaf7a0-bfe5-4b74-a417-9acaaefabf33', 'karla.flores', 'karla.flores@votum.com', 'Qwerty123'),
       ('f8da2b02-f28f-4ebd-913a-f3eb416b927e', 'elijah.noble', 'elijah.noble@votum.com', 'Qwerty123'),
       ('7f748379-f418-4fd2-b90a-25810082ac34', 'asma.hassan', 'asma.hassan@votum.com', 'Qwerty123'),       (gen_random_uuid(), 'travis_hall', 'travis_hall@votum.com', 'Qwerty123'),
       ('f1d6c080-7a02-45a1-8fd6-3c98a934b823', 'marina.popova', 'marina.popova@votum.com', 'Qwerty123'),
       ('a3fb7871-4d2c-4cf8-9269-177d77d00f58', 'jesse_davis', 'jesse_davis@votum.com', 'Qwerty123'),
       ('63bfa7de-4025-4d6c-91cc-a7a93cd9f1e3', 'tasneem.ahmad', 'tasneem.ahmad@votum.com', 'Qwerty123'),
       ('cfd61bb2-62e2-4a8a-b4a3-579c24348a42', 'mohammed.yasin', 'mohammed.yasin@votum.com', 'Qwerty123'),
       ('ddf13ad8-b7c0-4cb0-b693-45355e6500de', 'deborah.ward', 'deborah.ward@votum.com', 'Qwerty123'),
       ('067f50c6-5e5e-44df-bd39-176dbd19eeb1', 'tala.khoury', 'tala.khoury@votum.com', 'Qwerty123'),
       ('79d32b4c-607f-49c0-a8e8-80de9e74aef6', 'owen.fitz', 'owen.fitz@votum.com', 'Qwerty123'),
       ('168f8829-1d5a-43d0-b87b-4d48d34af1a1', 'iliana.ramos', 'iliana.ramos@votum.com', 'Qwerty123'),
       ('c785d1dc-02d4-46f6-8c50-cde07d248f13', 'yusuf.habib', 'yusuf.habib@votum.com', 'Qwerty123'),
       ('e302b9b2-b9cd-49a1-b56d-6c243bf3b705', 'ari.greenberg', 'ari.greenberg@votum.com', 'Qwerty123'),
       ('8cb8542f-00f3-48e5-934b-a3f16c82a963', 'shannon_d', 'shannon_d@votum.com', 'Qwerty123'),
       ('33fc8a3b-3e45-4ff8-a41b-78f987343b73', 'zain.jabari', 'zain.jabari@votum.com', 'Qwerty123'),
       ('5b7b1566-1703-4f9b-843b-4eac90d8e907', 'andrea.stevens', 'andrea.stevens@votum.com', 'Qwerty123'),
       ('f373a52c-8a4f-4977-a915-97a6463f09cf', 'mohammad.rashid', 'mohammad.rashid@votum.com', 'Qwerty123'),
       ('c0d6e3e0-25d7-48f1-8fbc-5f634c8fd062', 'felix_h', 'felix_h@votum.com', 'Qwerty123'),
       ('059e3e53-bd55-4b94-92a5-0abf7873269d', 'sana.rida', 'sana.rida@votum.com', 'Qwerty123'),
       ('3c33b30f-cdb1-4f44-a320-949db9b6a8b6', 'darryl.jordan', 'darryl.jordan@votum.com', 'Qwerty123'),
       ('0c819af9-e13b-4a3e-9c38-38d5871b7880', 'laura.vidal', 'laura.vidal@votum.com', 'Qwerty123'),
       ('d51a4db1-2d57-4f7f-b40c-1e2b205208b3', 'hussein.karim', 'hussein.karim@votum.com', 'Qwerty123'),
       ('f873be8f-f237-47b1-a93e-289192d8db43', 'brian.wong', 'brian.wong@votum.com', 'Qwerty123'),
       ('62ab6d38-9ee0-4a96-bb42-d45d2cc5ed60', 'huda.aziz', 'huda.aziz@votum.com', 'Qwerty123'),
       ('b2b2cc16-6976-40cd-9fc0-0caa7772a28a', 'david_b', 'david_b@votum.com', 'Qwerty123'),
       ('f9397030-7c62-41da-bac5-8ed30a0380dc', 'laila.issa', 'laila.issa@votum.com', 'Qwerty123'),       (gen_random_uuid(), 'austin.gray', 'austin.gray@votum.com', 'Qwerty123'),
       ('3d68d98a-6a9f-47b1-94cb-b92e71a57943', 'khadija.hassan', 'khadija.hassan@votum.com', 'Qwerty123'),
       ('4a5db7f3-f68c-4f78-b3ac-9c7fffe9f79e', 'ricardo.nunez', 'ricardo.nunez@votum.com', 'Qwerty123'),
       ('b9e5f2b5-bd77-4f1f-8b97-263b78c932a3', 'joseph.lam', 'joseph.lam@votum.com', 'Qwerty123'),
       ('89fc7803-a210-4372-8333-85a94d77fb8f', 'nadia.ahmed', 'nadia.ahmed@votum.com', 'Qwerty123'),
       ('1d3c7712-6a0d-4df1-9265-14fc148d201d', 'ryan.sanders', 'ryan.sanders@votum.com', 'Qwerty123'),
       ('d9fc7311-42f6-4d49-bf4a-0527894d84c3', 'fayez.nassar', 'fayez.nassar@votum.com', 'Qwerty123'),
       ('7d6d8f24-9e83-47c6-935f-cb637798734a', 'megan_r', 'megan_r@votum.com', 'Qwerty123'),
       ('22c178d3-3ffb-4a88-a52a-f08d4408cd0d', 'manny.mejia', 'manny.mejia@votum.com', 'Qwerty123'),
       ('6f59b02f-82b5-4984-b53b-9a2b0ad6b171', 'lavinia.kim', 'lavinia.kim@votum.com', 'Qwerty123'),
       ('8c7c1d89-9e5f-440f-84ad-9431c90e5846', 'amirah.saleh', 'amirah.saleh@votum.com', 'Qwerty123'),
       ('91bb37f0-8510-4a9a-bc63-b7a5f5a7d3af', 'elena_m', 'elena_m@votum.com', 'Qwerty123'),
       ('bbbd0b07-81cb-4db3-a246-f3f5bda3a889', 'saeed.kazemi', 'saeed.kazemi@votum.com', 'Qwerty123'),
       ('bd5c43f3-f232-4dd1-8203-77eae0c073cd', 'richard.nguyen', 'richard.nguyen@votum.com', 'Qwerty123'),
       ('ea0ec4cf-bb84-4dbe-a557-0ebc4e021144', 'sabrina.kim', 'sabrina.kim@votum.com', 'Qwerty123'),
       ('ec93cb09-338a-4e54-b08a-33a8bb15244a', 'aziz.selim', 'aziz.selim@votum.com', 'Qwerty123'),
       ('c65ae52f-cfe2-4d89-b047-0c97853c018d', 'paula_hernandez', 'paula_hernandez@votum.com', 'Qwerty123'),
       ('650b493a-d2e8-4748-893a-f080aab10e09', 'ian.bennett', 'ian.bennett@votum.com', 'Qwerty123'),
       ('0cc83b4d-8274-4a7a-bf39-17adf7aeb98d', 'imane.kamal', 'imane.kamal@votum.com', 'Qwerty123'),
       ('b96c8c4b-2d26-4cbf-a604-41693468fd9e', 'xavier.lee', 'xavier.lee@votum.com', 'Qwerty123'),
       ('0ec54bb1-bf55-49c8-9cda-4e1828972fb0', 'leila.zidan', 'leila.zidan@votum.com', 'Qwerty123'),
       ('c4df515d-61b4-4c3f-86b4-49e26b3f0830', 'benjamin.diaz', 'benjamin.diaz@votum.com', 'Qwerty123'),
       ('c05e17e4-b163-49c0-94d8-7dbb28cc38c4', 'yasmin.rahim', 'yasmin.rahim@votum.com', 'Qwerty123'),
       ('f6d0f29f-1ee4-47aa-b62f-0e8b067414a5', 'diana_r', 'diana_r@votum.com', 'Qwerty123'),
       ('688a71e0-3b60-46b1-a708-7c493b222345', 'micah.gabriel', 'micah.gabriel@votum.com', 'Qwerty123'),
       ('bc72e769-dc87-4c63-b0c0-452de94ee50d', 'amina.fadel', 'amina.fadel@votum.com', 'Qwerty123'),
       ('da621e0e-bf9a-4f8a-8546-024def6b97cf', 'anthony_t', 'anthony_t@votum.com', 'Qwerty123'),       (gen_random_uuid(), 'reem.abdul', 'reem.abdul@votum.com', 'Qwerty123'),
       ('0f32dcb7-7ff5-45f1-8d02-b14f346e74b5', 'mario_gomez', 'mario_gomez@votum.com', 'Qwerty123'),
       ('ebcbf2d7-f319-44ae-9e3c-3d48168b4cd1', 'hana.jawad', 'hana.jawad@votum.com', 'Qwerty123'),
       ('9a924c4c-9ef4-4b53-879d-a21b7ac0e3f3', 'nelson.parker', 'nelson.parker@votum.com', 'Qwerty123'),
       ('5b49866d-8f0e-4a0b-a292-b7a46b68c41a', 'sahar.nasr', 'sahar.nasr@votum.com', 'Qwerty123'),
       ('6a3795f3-0b5d-4f97-88c3-3c4b48b6467a', 'cody_v', 'cody_v@votum.com', 'Qwerty123'),
       ('ce98d260-7d83-4b08-9252-63fc1a4a94dd', 'rabia.chaudhry', 'rabia.chaudhry@votum.com', 'Qwerty123'),
       ('218d8f6b-c65f-4c38-9c36-1d08c36e3279', 'ronnie.clarke', 'ronnie.clarke@votum.com', 'Qwerty123'),
       ('79bc9620-5d99-4d5d-b6a4-94af02f7a1d6', 'linh.pham', 'linh.pham@votum.com', 'Qwerty123'),
       ('33dfc4b4-29c8-45e2-8053-4dc67f753b2a', 'eman.hakeem', 'eman.hakeem@votum.com', 'Qwerty123'),
       ('d4cfbeaf-d859-4aa5-8dd9-85c2f623f8e5', 'elias.salazar', 'elias.salazar@votum.com', 'Qwerty123'),
       ('46bdb94c-dff3-4e9d-a84a-275ffac1d72b', 'nina.choi', 'nina.choi@votum.com', 'Qwerty123'),
       ('0a3a83d6-5040-4ec2-8e4b-383a9f34c3d0', 'joey.alvarez', 'joey.alvarez@votum.com', 'Qwerty123'),
       ('a573ff7e-cba1-4a15-97d2-0959247a7e6a', 'saliha.jawhar', 'saliha.jawhar@votum.com', 'Qwerty123'),
       ('a3055c21-6206-4d5a-b52e-3aa790d1f3a7', 'maxwell_h', 'maxwell_h@votum.com', 'Qwerty123'),
       ('1e08cf79-c81b-4710-b7a7-f334056b309a', 'hailey.kim', 'hailey.kim@votum.com', 'Qwerty123'),
       ('5c8995e8-b789-4ee5-9fd2-bd73dc9e31ef', 'murtaza.haider', 'murtaza.haider@votum.com', 'Qwerty123'),
       ('8c62050d-0546-4b47-8a4f-dce0976cdb76', 'judith.green', 'judith.green@votum.com', 'Qwerty123'),
       ('38e12b9d-d8dc-44e1-9aa3-432c0117a23c', 'samuel.marks', 'samuel.marks@votum.com', 'Qwerty123'),
       ('b5f7e4fd-85c8-46dd-9309-1d0e805fb924', 'sofia.ghanem', 'sofia.ghanem@votum.com', 'Qwerty123'),
       ('60f988b1-53cb-4f40-809a-18df60f07b38', 'chris_cho', 'chris_cho@votum.com', 'Qwerty123'),
       ('fa0f4f45-2cd5-4a50-8139-b982c1b6e56b', 'noelle.holt', 'noelle.holt@votum.com', 'Qwerty123'),
       ('c32c8356-2ee1-4c48-bdd3-6a6e8a5b5e27', 'abdullah.k', 'abdullah.k@votum.com', 'Qwerty123'),                                                           ('550e8400-e29b-41d4-a716-446655440000', 'danielle.ray', 'danielle.ray@votum.com', 'Qwerty123'),
       ('550e8400-e29b-41d4-a716-446655440001', 'azra.mustafa', 'azra.mustafa@votum.com', 'Qwerty123'),
       ('550e8400-e29b-41d4-a716-446655440002', 'malik.kamara', 'malik.kamara@votum.com', 'Qwerty123'),
       ('65f61a8f-2f82-4e7d-9f26-f31cce4039fc', 'kimberly_f', 'kimberly_f@votum.com', 'Qwerty123'),
       ('f3726c2a-5ef2-4d5b-8f83-25b7867a8d8e', 'ahmad.khoury', 'ahmad.khoury@votum.com', 'Qwerty123'),
       ('d5d68b73-32cf-4e5c-8b6b-a99b05e85f64', 'tess.owens', 'tess.owens@votum.com', 'Qwerty123'),
       ('b10bcffd-f9c3-418a-9dd3-d9b5f58caa26', 'mateen.rahimi', 'mateen.rahimi@votum.com', 'Qwerty123'),
       ('9c6d9468-4513-496f-9231-c8d305a04f7f', 'dalia.amir', 'dalia.amir@votum.com', 'Qwerty123'),
       ('ac76cd5a-e4a2-4b1d-9af7-4a6b0b6b10b1', 'trevor.gaines', 'trevor.gaines@votum.com', 'Qwerty123'),
       ('c88e56ec-76db-4217-81f0-c01a84f21564', 'hanan.saad', 'hanan.saad@votum.com', 'Qwerty123'),
       ('0d31a948-3ec7-4b93-a062-309dc18c6114', 'lauren.tariq', 'lauren.tariq@votum.com', 'Qwerty123'),
       ('69f3ecdd-bd8f-4cb6-98d8-32d6e189cbbc', 'mehreen.zafar', 'mehreen.zafar@votum.com', 'Qwerty123');


-- 4) What is better?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('5d4c3b2a-1908-4716-8f2a-3b4c5d6e7f88', 'f9f43547-e2dc-4c41-9509-fcc5a0b91968', 5, 'poll104', 'What is better?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '10320 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '15 days' - INTERVAL '1 hours' - INTERVAL '31 minutes'), 129, 0.702);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('22334455-6677-8899-aabb-ccddeeff0011', '5d4c3b2a-1908-4716-8f2a-3b4c5d6e7f88', 'Autumn', 0, 42);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('33445566-7788-99aa-bbcc-ddeeff001122', '5d4c3b2a-1908-4716-8f2a-3b4c5d6e7f88', 'Spring', 1, 87);

-- 5) What’s your favorite?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('6e5d4c3b-2a19-4c7e-9f0a-1b2c3d4e5f99', '13b291f2-72ae-4c8e-9a6d-09c4f4e78f78', 1, 'poll105', 'What’s your favorite?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '17880 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '11 days' - INTERVAL '3 hours' - INTERVAL '44 minutes'), 132, 0.766);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('44556677-8899-aabb-ccdd-eeff00112233', '6e5d4c3b-2a19-4c7e-9f0a-1b2c3d4e5f99', 'Christmas', 0, 77);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('55667788-99aa-bbcc-ddee-ff0011223344', '6e5d4c3b-2a19-4c7e-9f0a-1b2c3d4e5f99', 'Your birthday', 1, 55);

-- 6) Do you believe in aliens?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('7f6e5d4c-3b2a-4919-8e7f-0a1b2c3d4eaa', '0c07c842-510a-42c3-bb7d-71f1c35c0c2c', 8, 'poll106', 'Do you believe in aliens?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '13560 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '7 days' - INTERVAL '8 hours' - INTERVAL '2 minutes'), 103, 0.589);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('66778899-aabb-ccdd-eeff-001122334455', '7f6e5d4c-3b2a-4919-8e7f-0a1b2c3d4eaa', 'No', 0, 64);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('778899aa-bbcc-ddee-ff00-112233445566', '7f6e5d4c-3b2a-4919-8e7f-0a1b2c3d4eaa', 'Yes', 1, 39);

-- 7) Best superpower?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('8a7b6c5d-4e3f-4021-9a8b-7c6d5e4f3bbb', 'd8e10b8f-daa7-49cd-b5aa-b663a3769d5f', 3, 'poll107', 'Best superpower?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '22920 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '10 days' - INTERVAL '5 hours' - INTERVAL '29 minutes'), 159, 0.821);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('8899aabb-ccdd-eeff-0011-223344556677', '8a7b6c5d-4e3f-4021-9a8b-7c6d5e4f3bbb', 'Flying', 0, 53);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('99aabbcc-ddee-ff00-1122-334455667788', '8a7b6c5d-4e3f-4021-9a8b-7c6d5e4f3bbb', 'Super speed', 1, 34);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('aabbccdd-eeff-0011-2233-445566778899', '8a7b6c5d-4e3f-4021-9a8b-7c6d5e4f3bbb', 'Be invisible', 2, 28);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('bbccddee-ff00-1122-3344-5566778899aa', '8a7b6c5d-4e3f-4021-9a8b-7c6d5e4f3bbb', 'Telekinesis', 3, 44);

-- 8) What would you choose?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('9b8c7d6e-5f4a-4132-8b7a-6c5d4e3f2ccc', '548c27b7-bd67-4b5d-a7ff-27583e2e2b11', 5, 'poll108', 'What would you choose?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '16200 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '4 days' - INTERVAL '12 hours' - INTERVAL '55 minutes'), 122, 0.744);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('ccddeeff-0011-2233-4455-66778899aabb', '9b8c7d6e-5f4a-4132-8b7a-6c5d4e3f2ccc', 'City', 0, 85);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('ddeeff00-1122-3344-5566-778899aabbcc', '9b8c7d6e-5f4a-4132-8b7a-6c5d4e3f2ccc', 'Countryside', 1, 37);

-- 9) Best vacation?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('0c1d2e3f-4a5b-4678-9c0d-1e2f3a4b5cdd', '79d55e4c-96de-49f8-93a0-df2024d993a8', 5, 'poll109', 'Best vacation?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '31860 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '16 days' - INTERVAL '7 hours' - INTERVAL '13 minutes'), 153, 0.905);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('eeff0011-2233-4455-6677-8899aabbccdd', '0c1d2e3f-4a5b-4678-9c0d-1e2f3a4b5cdd', 'Beach', 0, 21);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('ff001122-3344-5566-7788-99aabbccdde0', '0c1d2e3f-4a5b-4678-9c0d-1e2f3a4b5cdd', 'Mountains', 1, 79);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('00112233-4455-6677-8899-aabbccddeeff', '0c1d2e3f-4a5b-4678-9c0d-1e2f3a4b5cdd', 'City', 2, 53);

-- 10) Is hot dog a sandwich?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('1d2e3f40-5a6b-47c8-8d9e-0f1a2b3c4dee', '021e2f93-c885-4b29-a26c-3f0624a9a896', 4, 'poll110', 'Is hot dog a sandwich?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '20400 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '5 days' - INTERVAL '4 hours' - INTERVAL '40 minutes'), 103, 0.677);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('1122aabb-3344-ccdd-5566-eeff77889900', '1d2e3f40-5a6b-47c8-8d9e-0f1a2b3c4dee', 'No', 0, 62);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('2233bbcc-4455-ddee-6677-ff0011223344', '1d2e3f40-5a6b-47c8-8d9e-0f1a2b3c4dee', 'Yes', 1, 41);

-- 1) Does pineapple taste good on pizza?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('d2a6c9c4-8a9f-4c0c-9f6a-8e3f1b37b401', '8f2a5e4c-b18a-4f9e-bc19-dcbd27a22a2c', 4, 'poll201', 'Does pineapple taste good on pizza?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '21420 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '8 days' - INTERVAL '3 hours' - INTERVAL '19 minutes'), 110, 0.812);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('b3c1d4f2-2a6c-45c6-9a5f-1a8e03c7f101', 'd2a6c9c4-8a9f-4c0c-9f6a-8e3f1b37b401', 'Yes', 0, 33);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('a9f2e6b7-4d3a-4a77-9cfc-6b12f0c3a202', 'd2a6c9c4-8a9f-4c0c-9f6a-8e3f1b37b401', 'Only if hungry', 1, 50);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('f1a3c2b4-7d9e-4a0b-b8b5-9d2e1c4a8303', 'd2a6c9c4-8a9f-4c0c-9f6a-8e3f1b37b401', 'No', 2, 27);

-- 2) How do you like your steak?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('5f4c7d0a-2b3e-4a7f-8c1d-9e2b7a6c5d02', '548c27b7-bd67-4b5d-a7ff-27583e2e2b11', 4, 'poll202', 'How do you like your steak?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '18600 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '6 days' - INTERVAL '11 hours' - INTERVAL '7 minutes'), 141, 0.741);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('c0f1a2b3-4c5d-6e7f-8a90-b1c2d3e4f205', '5f4c7d0a-2b3e-4a7f-8c1d-9e2b7a6c5d02', 'Medium-rare', 0, 19);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('ab12cd34-ef56-4789-a0b1-c2d3e4f5a206', '5f4c7d0a-2b3e-4a7f-8c1d-9e2b7a6c5d02', 'Well-done', 1, 18);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('de78f901-2345-4a67-89ab-cdef0123b207', '5f4c7d0a-2b3e-4a7f-8c1d-9e2b7a6c5d02', 'Rare', 2, 63);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('0a1b2c3d-4e5f-6071-82a9-bcdef123c208', '5f4c7d0a-2b3e-4a7f-8c1d-9e2b7a6c5d02', 'Medium', 3, 41);

-- 3) Is cereal a soup?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('a3b2c1d0-9e8f-4a7b-8c6d-5e4f3a2b1c03', '13b291f2-72ae-4c8e-9a6d-09c4f4e78f78', 4, 'poll203', 'Is cereal a soup?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '24060 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '12 days' - INTERVAL '2 hours' - INTERVAL '33 minutes'), 121, 0.688);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('1f2e3d4c-5b6a-7980-9a1b-2c3d4e5f9209', 'a3b2c1d0-9e8f-4a7b-8c6d-5e4f3a2b1c03', 'No', 0, 58);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('21098f76-54e3-4d21-9cba-0fedcba32110', 'a3b2c1d0-9e8f-4a7b-8c6d-5e4f3a2b1c03', 'Yes', 1, 17);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('3a4b5c6d-7e8f-9012-a3b4-c5d6e7f8d211', 'a3b2c1d0-9e8f-4a7b-8c6d-5e4f3a2b1c03', 'Only if microwaved', 2, 46);

  -- 1) What’s your favorite sushi?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
('8f2a0f03-9c3e-4f2a-9d2a-7a3d2b7bfa11', '8f2a5e4c-b18a-4f9e-bc19-dcbd27a22a2c', 4, 'poll101', 'What’s your favorite sushi?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '19840 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '13 days' - INTERVAL '6 hours' - INTERVAL '21 minutes'), 179, 0.793);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
('b1f1d3d5-0f7e-4a86-8c1c-8b6e4f1f0c21', '8f2a0f03-9c3e-4f2a-9d2a-7a3d2b7bfa11', 'With tuna', 0, 91);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
('d2a5c8b4-bf3c-4df9-9c1b-4a2b9c6d8e32', '8f2a0f03-9c3e-4f2a-9d2a-7a3d2b7bfa11', 'With salmon', 1, 88);

  -- 5) Is it okay to lie sometimes?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('e5f6a7b8-9c01-42d3-a4e5-f6a7b8c90105', '021e2f93-c885-4b29-a26c-3f0624a9a896', 8, 'poll205', 'Is it okay to lie sometimes?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '17340 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '5 days' - INTERVAL '6 hours' - INTERVAL '17 minutes'), 137, 0.652);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('6b7c8d9e-0f12-43a4-b5c6-d7e8f9a0c514', 'e5f6a7b8-9c01-42d3-a4e5-f6a7b8c90105', 'Yes', 0, 43);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('7c8d9e0f-1234-44b5-c6d7-e8f9a0b1d615', 'e5f6a7b8-9c01-42d3-a4e5-f6a7b8c90105', 'No', 1, 38);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('8d9e0f12-3456-45c6-d7e8-f9a0b1c2e716', 'e5f6a7b8-9c01-42d3-a4e5-f6a7b8c90105', 'Only if I don’t get caught', 2, 56);

  -- 8) Can you stay friends with an ex?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('1b2c3d4e-5f60-7182-93ab-cd0e1f2a3b08', 'c5eb8024-b7dd-4b25-a420-bf86a71cc1aa', 1, 'poll208', 'Can you stay friends with an ex?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '22140 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '9 days' - INTERVAL '14 hours' - INTERVAL '28 minutes'), 136, 0.701);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('4d5e6f70-8192-0a3b-bcde-f1a2b3c4d522', '1b2c3d4e-5f60-7182-93ab-cd0e1f2a3b08', 'Yes', 0, 39);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('5e6f7081-920a-3b4c-cdef-1a2b3c4d5e23', '1b2c3d4e-5f60-7182-93ab-cd0e1f2a3b08', 'No', 1, 72);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('6f708192-0a3b-4c5d-def1-a2b3c4d5e624', '1b2c3d4e-5f60-7182-93ab-cd0e1f2a3b08', 'Only if I broke up', 2, 25);

-- 9) Flirting while in a relationship?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('2c3d4e5f-6071-8293-a4bd-ce0f1a2b3c09', 'fe409ec0-38fd-46cb-98b1-c9cfc0f06299', 1, 'poll209', 'Flirting while in a relationship?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '4 days' - INTERVAL '9 hours' - INTERVAL '51 minutes'), 143, 0.769);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('7081920a-3b4c-5d6e-ef1a-2b3c4d5e7f25', '2c3d4e5f-6071-8293-a4bd-ce0f1a2b3c09', 'Harmless', 0, 41);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('81920a3b-4c5d-6e7f-f1a2-b3c4d5e6f726', '2c3d4e5f-6071-8293-a4bd-ce0f1a2b3c09', 'Only if caught', 1, 10);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('920a3b4c-5d6e-7f80-1a2b-3c4d5e6f87327', '2c3d4e5f-6071-8293-a4bd-ce0f1a2b3c09', 'Betrayal', 2, 92);

  -- 2. How often do you think about getting old?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('6a3b2c1d-8e4f-4c5a-b2a9-1f0e2d3c4b02', '99d5cbae-6473-41ec-a9ca-2852b246029d', 5, 'poll302', 'How often do you think about getting old?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '4 days' - INTERVAL '7 hours'), 131, 0.77);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('22222222-2222-4222-8222-222222222201', '6a3b2c1d-8e4f-4c5a-b2a9-1f0e2d3c4b02', 'Monthly', 0, 31);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('22222222-2222-4222-8222-222222222202', '6a3b2c1d-8e4f-4c5a-b2a9-1f0e2d3c4b02', 'Weekly', 1, 65);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('22222222-2222-4222-8222-222222222203', '6a3b2c1d-8e4f-4c5a-b2a9-1f0e2d3c4b02', 'Never', 2, 22);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('22222222-2222-4222-8222-222222222204', '6a3b2c1d-8e4f-4c5a-b2a9-1f0e2d3c4b02', 'Daily', 3, 13);

-- 3. Are influencers real celebrities?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('b3c1e8f2-9d40-4a76-9a4b-7f2a0a9d7c03', 'b1a9f024-c463-4a77-bcc5-6e53df303ea1', 9, 'poll303', 'Are influencers real celebrities?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '2 days' - INTERVAL '8 hours'), 130, 0.74);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('33333333-3333-4333-8333-333333333301', 'b3c1e8f2-9d40-4a76-9a4b-7f2a0a9d7c03', 'No', 0, 77);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('33333333-3333-4333-8333-333333333302', 'b3c1e8f2-9d40-4a76-9a4b-7f2a0a9d7c03', 'Yes', 1, 53);

-- 4. Does social media make people dumber?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('c7f4d0a9-1b2e-4c6a-934b-10f63e2a7d04', '43f8c07b-3d76-49f1-b387-7aaefb1ac58d', 9, 'poll304', 'Does social media make people dumber?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 days' - INTERVAL '6 hours'), 122, 0.79);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('44444444-4444-4444-8444-444444444401', 'c7f4d0a9-1b2e-4c6a-934b-10f63e2a7d04', 'Yes', 0, 94);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('44444444-4444-4444-8444-444444444402', 'c7f4d0a9-1b2e-4c6a-934b-10f63e2a7d04', 'No', 1, 28);

-- 5. Should voting be mandatory?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('d8e2b3c4-5f61-4a8d-b9a3-2c4d7e8f9a05', 'f87a60c0-a8e0-4a41-8841-bb20a4d5a238', 8, 'poll305', 'Should voting be mandatory?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '2 days' - INTERVAL '4 hours'), 112, 0.73);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('55555555-5555-4555-8555-555555555501', 'd8e2b3c4-5f61-4a8d-b9a3-2c4d7e8f9a05', 'No', 0, 63);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('55555555-5555-4555-8555-555555555502', 'd8e2b3c4-5f61-4a8d-b9a3-2c4d7e8f9a05', 'Yes', 1, 49);

  -- 8. Is it okay to recline your airplane seat?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('a4c6e8f0-1d2b-4a3c-95af-2b7c9d1e3f08', 'a2c403db-e2da-49ee-8578-f6318a5ffb47', 5, 'poll308', 'Is it okay to recline your airplane seat?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 days' - INTERVAL '3 hours'), 136, 0.84);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('88888888-8888-4888-8888-888888888801', 'a4c6e8f0-1d2b-4a3c-95af-2b7c9d1e3f08', 'Yes', 0, 45);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('88888888-8888-4888-8888-888888888802', 'a4c6e8f0-1d2b-4a3c-95af-2b7c9d1e3f08', 'No', 1, 91);

  -- 2. Who’s the best superhero?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('d202b2c3-2d3e-4f5a-b567-2c3d4e5f6a11', '76d78b76-78f1-420a-8b02-9d2d7791b8cd', 3, 'poll311', 'Who’s the best superhero?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '5 days' - INTERVAL '2 hours'), 146, 0.82);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('bbb22222-2222-4222-8222-bbbbbbbbbbb1', 'd202b2c3-2d3e-4f5a-b567-2c3d4e5f6a11', 'Spider-Man', 0, 29);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('bbb22222-2222-4222-8222-bbbbbbbbbbb2', 'd202b2c3-2d3e-4f5a-b567-2c3d4e5f6a11', 'Batman', 1, 17);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('bbb22222-2222-4222-8222-bbbbbbbbbbb3', 'd202b2c3-2d3e-4f5a-b567-2c3d4e5f6a11', 'Hulk', 2, 54);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('bbb22222-2222-4222-8222-bbbbbbbbbbb4', 'd202b2c3-2d3e-4f5a-b567-2c3d4e5f6a11', 'Iron Man', 3, 46);

-- 3. Is rap real music?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('e303c3d4-3e4f-506b-c678-3d4e5f6a7b12', '6edec0a5-c12d-4a06-a1dd-c3a18169266c', 3, 'poll312', 'Is rap real music?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '6 days' - INTERVAL '8 hours'), 103, 0.74);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('ccc33333-3333-4333-8333-ccccccccccc1', 'e303c3d4-3e4f-506b-c678-3d4e5f6a7b12', 'No', 0, 27);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('ccc33333-3333-4333-8333-ccccccccccc2', 'e303c3d4-3e4f-506b-c678-3d4e5f6a7b12', 'Yes', 1, 76);

-- 4. Is water wet?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('f404d4e5-4f50-617c-d789-4e5f6a7b8c13', 'f2709aa1-9bc1-4f4f-8e85-f21f21e84b9a', 8, 'poll313', 'Is water wet?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '2 days' - INTERVAL '6 hours'), 127, 0.79);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('ddd44444-4444-4444-8444-ddddddddddd1', 'f404d4e5-4f50-617c-d789-4e5f6a7b8c13', 'What?', 0, 12);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('ddd44444-4444-4444-8444-ddddddddddd2', 'f404d4e5-4f50-617c-d789-4e5f6a7b8c13', 'No', 1, 45);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('ddd44444-4444-4444-8444-ddddddddddd3', 'f404d4e5-4f50-617c-d789-4e5f6a7b8c13', 'Yes', 2, 70);

-- 5. Would you rather be rich or famous?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('a505e5f6-5061-728d-e89a-5f6a7b8c9d14', 'f9f43547-e2dc-4c41-9509-fcc5a0b91968', 5, 'poll314', 'Would you rather be rich or famous?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '3 days' - INTERVAL '9 hours'), 127, 0.73);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('eee55555-5555-4555-8555-eeeeeeeeeee1', 'a505e5f6-5061-728d-e89a-5f6a7b8c9d14', 'Famous', 0, 35);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('eee55555-5555-4555-8555-eeeeeeeeeee2', 'a505e5f6-5061-728d-e89a-5f6a7b8c9d14', 'Rich', 1, 92);

  -- 7. Which came first?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('c707g718-7283-94af-0a1b-7b8c9d0e1f16', 'c7b3d445-15b4-471f-8c37-62c9d4cf53e6', 8, 'poll316', 'Which came first?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 days' - INTERVAL '8 hours'), 92, 0.69);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('11177777-7777-4777-8777-111111111171', 'c707g718-7283-94af-0a1b-7b8c9d0e1f16', 'Egg', 0, 53);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('11177777-7777-4777-8777-111111111172', 'c707g718-7283-94af-0a1b-7b8c9d0e1f16', 'Chicken', 1, 39);

-- 6) Should parents track their kids’ phones?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('f6a7b8c9-0123-43d5-a6e7-b8c90123d606', 'f9f43547-e2dc-4c41-9509-fcc5a0b91968', 5, 'poll206', 'Should parents track their kids’ phones?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '25800 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '14 days' - INTERVAL '1 hours' - INTERVAL '52 minutes'), 137, 0.776);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('9e0f1234-5678-46e7-f8a9-0b1c2d3e4717', 'f6a7b8c9-0123-43d5-a6e7-b8c90123d606', 'Yes', 0, 93);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('0f123456-789a-47f8-a90b-1c2d3e4f5818', 'f6a7b8c9-0123-43d5-a6e7-b8c90123d606', 'No', 1, 44);


  -- 9. How often do you think about getting old? (2nd instance)
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('e909i930-9405-b6cg-2c3d-9d0e1f2g3h18', 'c9244f94-35a8-4a4a-96fd-50c5ccf86f10', 5, 'poll318', 'How often do you think about getting old?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '14700 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '2 days' - INTERVAL '3 hours'), 136, 0.78);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('33399999-9999-4999-8999-333333333391', 'e909i930-9405-b6cg-2c3d-9d0e1f2g3h18', 'Monthly', 0, 36);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('33399999-9999-4999-8999-333333333392', 'e909i930-9405-b6cg-2c3d-9d0e1f2g3h18', 'Weekly', 1, 71);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('33399999-9999-4999-8999-333333333393', 'e909i930-9405-b6cg-2c3d-9d0e1f2g3h18', 'Never', 2, 18);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('33399999-9999-4999-8999-333333333394', 'e909i930-9405-b6cg-2c3d-9d0e1f2g3h18', 'Daily', 3, 11);

-- 4) Should rich people pay more taxes?
INSERT INTO polls (id, created_by, category_id, readable_id, question, ends_in, is_deleted, created_at, votes_count, likes_per_vote) VALUES
    ('c4d5e6f7-0819-4a2b-b3c4-d5e6f7081904', '0c07c842-510a-42c3-bb7d-71f1c35c0c2c', 8, 'poll204', 'Should rich people pay more taxes?', (NOW() AT TIME ZONE 'UTC' + INTERVAL '20580 minutes'), FALSE, (NOW() AT TIME ZONE 'UTC' - INTERVAL '9 days' - INTERVAL '9 hours' - INTERVAL '48 minutes'), 113, 0.803);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('4e5f6a7b-8c90-41d2-a3b4-c5d6e7f8a312', 'c4d5e6f7-0819-4a2b-b3c4-d5e6f7081904', 'Yes', 0, 127);
INSERT INTO poll_answer_options (id, poll_id, text, option_order, votes_count) VALUES
    ('5a6b7c8d-9e01-42f3-a4b5-c6d7e8f9b413', 'c4d5e6f7-0819-4a2b-b3c4-d5e6f7081904', 'No', 1, 49);

*/


/*
 simulate poll activity demo


 update poll_answer_options
    set votes_count = votes_count + 1
where
    id in (
        select id from poll_answer_options
        where poll_id = 'b7b121a4-d3ab-45bd-a551-6a088b5b935e'
        order by random()
        limit 1
        );

update polls
set votes_count = (
    select sum(votes_count) from poll_answer_options
    where poll_id = 'b7b121a4-d3ab-45bd-a551-6a088b5b935e')
where id = 'b7b121a4-d3ab-45bd-a551-6a088b5b935e';



update polls
set votes_count = 0
where id = 'b7b121a4-d3ab-45bd-a551-6a088b5b935e';

update poll_answer_options
set votes_count = 0
where poll_id = 'b7b121a4-d3ab-45bd-a551-6a088b5b935e';




 */