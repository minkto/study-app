CREATE TABLE resources
(
	resource_id SERIAL NOT NULL PRIMARY KEY,
	name TEXT ,
	description TEXT,
	category_id INTEGER REFERENCES categories (category_id),
	date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);