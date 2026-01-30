create database machine_test;
use machine_test;

create table categories(
category_id int auto_increment primary key,
category_name varchar(100) not null);
desc categories;
select * from categories;
delete from categories where category_id=1;

create table products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255),
  category_id INT,
  FOREIGN KEY (category_id)
  REFERENCES categories(category_id)
  ON DELETE CASCADE
);
select * from products;

