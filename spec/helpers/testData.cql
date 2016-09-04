CREATE KEYSPACE IF NOT EXISTS tourney WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 3};

CREATE TABLE IF NOT EXISTS users (
    name text PRIMARY KEY,
    password text,
    house text
);

INSERT INTO users (name,password,house) VALUES ('jon','I know nothing', 'stark');
INSERT INTO users (name,password,house) VALUES ('tyrion','I know things', 'lannister');
INSERT INTO users (name,password,house) VALUES ('dany','Mother of dragons', 'targaryen');