CREATE TABLE chapters
(
  chapter_id SERIAL PRIMARY KEY NOT NULL,
  resource_id INT,
  status_id INT,
  name TEXT NOT NULL,
  url VARCHAR(800),
  original_date_completed timestamp,
  last_date_completed timestamp,
  
  CONSTRAINT fk_resource_id 
  	FOREIGN KEY (resource_id) 
	  REFERENCES resources(resource_id),


  CONSTRAINT fk_statuses_id 
  	FOREIGN KEY (status_id) 
	  REFERENCES statuses(status_id)
);