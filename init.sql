CREATE DATABASE wishlist;
USE wishlist;

DROP TABLE IF EXISTS lists;
CREATE TABLE lists(id int AUTO_INCREMENT, name VARCHAR(255), title VARCHAR(255), url VARCHAR(2083), PRIMARY KEY(id, name));

INSERT INTO lists (name, title, url) VALUES
('ryan', 'book', 'https://www.amazon.com/dp/1984894862/ref=cm_sw_em_r_mt_dp_U_4Xw7DbARZJHYV'),
('ryan', 'a thing', 'https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/'),
('ryan', 'another game', 'https://store.steampowered.com/app/703080/Planet_Zoo/'),
('monica', 'slippers', 'cute pink ones'),
('monica', 'Disney+', 'https://www.disneyplus.com/'),
('monica', 'gas money', 'nothing like cold hard $$$');