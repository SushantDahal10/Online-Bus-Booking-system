use busproject;
		create table busdetail(
		bus_id int not null auto_increment,
		bus_number varchar(255) not null,
		bus_name varchar(255) not null,
		contactno varchar(255) not null,
		capacity varchar(255) not null,
		primary key(bus_id)	
		)auto_increment=0;
ALTER TABLE busdetail 
ADD CONSTRAINT unique_bus_number UNIQUE (bus_number);

drop table busdetail;
select * from busdetail;
truncate table busdetail;
-- Inserting data into busdetail table
INSERT INTO busdetail (bus_number, bus_name, contactno, capacity) VALUES
('1313', 'First Bus', '1234567890', '50'),
('231', 'Second Bus', '9876543210', '40'),
('421', 'Third Bus', '4561237890', '30'),
('124', 'Fourth Bus', '7894561230', '35');

truncate table busdetail;
CREATE TABLE user(
user_id int not null auto_increment,	
user_email varchar(255),
user_password varchar(255),
primary key(user_id)
)auto_increment=0;
select * from user;
drop table user;
truncate table user;
delete from user where user_email='sushantdahal50@gmail.com';
select * from busdetail;
CREATE TABLE travel (					
    travel_id INT NOT NULL AUTO_INCREMENT,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    fare FLOAT NOT NULL,
    duration VARCHAR(255) NOT NULL,
    departure TIME NOT NULL,
    arrival TIME NOT NULL,
    bus_id INT NOT NULL,
    date_of_travel DATE NOT NULL,
    seats_available INT,
    PRIMARY KEY (travel_id),
    FOREIGN KEY (bus_id) REFERENCES busdetail(bus_id) ON DELETE CASCADE
) AUTO_INCREMENT = 0;



drop table travel;
select * from travel;	
drop table travel;
truncate table travel;


CREATE TABLE booking (
    booking_id INT NOT NULL AUTO_INCREMENT,
    travel_id INT NOT NULL,
    seat_no VARCHAR(255) NOT NULL,
    booking_email VARCHAR(255),
    send_email VARCHAR(255),
    name VARCHAR(255),
    age INT NOT NULL,
    gender VARCHAR(255),
    phone_no VARCHAR(255), 
    price INT NOT NULL,
    PRIMARY KEY (booking_id),
    UNIQUE(travel_id, seat_no),
    FOREIGN KEY (travel_id) REFERENCES travel(travel_id) ON DELETE CASCADE
) AUTO_INCREMENT = 0;
ALTER TABLE booking
ADD COLUMN date_of_booking DATE;

select * from booking;			
drop table booking;
truncate table booking;

create table cities(
city_id int not null primary key auto_increment,
city_name varchar(255) not null
)auto_increment=0;
ALTER TABLE cities ADD constraint city_unique UNIQUE(city_name);
select count(*) from cities;

