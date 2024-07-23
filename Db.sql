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
select * from busdetail;
CREATE TABLE travel (
    travel_id INT NOT NULL AUTO_INCREMENT,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    fare FLOAT NOT NULL,
    duration VARCHAR(255) NOT NULL,
    departure TIME NOT NULL,	
    arrival TIME NOT NULL,
    bus_id int not null,
    date_of_travel VARCHAR(255) NOT NULL,
    PRIMARY KEY (travel_id),
   FOREIGN KEY (bus_id) REFERENCES busdetail(bus_id)
) AUTO_INCREMENT = 0;
drop table travel;
select * from travel;
drop table travel;
truncate table travel;


create table booking(
booking_id int  not null  auto_increment,
travel_id int  not null,
seat_no varchar(255) not null,
booking_email varchar(255),
send_email varchar(255),
name varchar(255),
age int not null,
gender  varchar(255),

phone_no varchar(255),
price int not null,
primary key (booking_id),
unique(travel_id,seat_no),
foreign key (travel_id) references travel(travel_id)
)auto_increment=0;	
select * from booking;
drop table booking;