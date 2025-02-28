CREATE TABLE statuses(
	status_id INT PRIMARY KEY  NOT NULL,
	name TEXT
);

INSERT INTO statuses(
	status_id,
	name
)
VALUES
	(0,'Not Started'),
	(1,'In Progress'),
	(2,'Completed')